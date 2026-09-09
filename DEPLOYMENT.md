# Dossier à remettre à l'hébergeur

Ce dépôt déploie **deux applications Node.js** depuis le même code source, sur
une seule machine :

- `africanrobotplatform.org` → site public, écoute sur `127.0.0.1:3000` ;
- `admin.africanrobotplatform.org` → administration (CMS), écoute sur `127.0.0.1:3001`.

Le CMS est dans `cms/`. Il utilise **PostgreSQL** (installé sur la même machine)
et **stocke les médias sur le disque local**. Une seule instance du processus
d'administration doit tourner à la fois.

> Remplacer partout `africanrobotplatform.org` par le domaine réel :
> `deploy/Caddyfile`, `.env.local` (`NEXT_PUBLIC_SITE_URL`, `FORM_ALLOWED_ORIGINS`),
> `cms/.env` (`CMS_PUBLIC_URL`, `PUBLIC_SITE_URL`).

## Exigences du serveur

- Linux 64 bits, **Ubuntu 22.04 ou 24.04** recommandé ;
- **Node.js 22** (épinglé par `.node-version` et `cms/.node-version`) ; 20.19+ accepté ;
- **2 Go de RAM libre minimum** pour la compilation (1 Go échoue sur Payload) ;
- **PostgreSQL 14+** (paquet `postgresql`, sur la même machine ou géré) ;
- accès SSH root et deux processus Node permanents (systemd fourni) ;
- **disque persistant et sauvegardé** pour `cms/media/` et la base PostgreSQL ;
- proxy HTTPS : **Caddy** (recommandé, HTTPS automatique) ou Nginx + certbot ;
- DNS modifiable : `@`, `www` et `admin` vers l'IP du serveur.

Un hébergement limité à PHP ou à des fichiers statiques n'est pas compatible.

## 1. Base du serveur (Ubuntu, en root)

```bash
apt update && apt -y upgrade
apt -y install git curl ufw

# Pare-feu : n'ouvrir que SSH et le proxy HTTPS. 3000/3001 restent privés.
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable

# Node.js 22 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt -y install nodejs

# PostgreSQL + base et rôle dédiés au CMS
apt -y install postgresql
sudo -u postgres psql -c "CREATE ROLE arcp LOGIN PASSWORD 'REMPLACER_PAR_UN_MOT_DE_PASSE_LONG';"
sudo -u postgres psql -c "CREATE DATABASE arcp OWNER arcp;"

# Caddy (proxy + certificats automatiques)
apt -y install debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt update && apt -y install caddy

# Utilisateur de service dédié
adduser --system --group --home /var/www/arcp arcp
```

## 2. Code et secrets

```bash
git clone https://github.com/SABCORP2002/ARCP.git /var/www/arcp
cd /var/www/arcp
chown -R arcp:arcp /var/www/arcp
```

Générer deux secrets :

```bash
node -e "console.log('PAYLOAD_SECRET =', require('crypto').randomBytes(32).toString('hex')); console.log('CMS_API_TOKEN  =', require('crypto').randomBytes(32).toString('hex'))"
```

Créer `/var/www/arcp/.env.local` (site public) :

```dotenv
NEXT_PUBLIC_SITE_URL=https://africanrobotplatform.org
CMS_URL=http://127.0.0.1:3001
CMS_API_TOKEN=RECOPIER_LE_CMS_API_TOKEN_GENERE_CI_DESSUS
FORM_ALLOWED_ORIGINS=https://africanrobotplatform.org
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_MEMBERSHIP_FORM_ENDPOINT=/api/forms/join
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=/api/forms/contact
NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT=/api/forms/newsletter
```

Créer `/var/www/arcp/cms/.env` (administration) :

```dotenv
PAYLOAD_SECRET=LE_PAYLOAD_SECRET_GENERE_CI_DESSUS
CMS_API_TOKEN=LE_MEME_CMS_API_TOKEN_QUE_DANS_.env.local
DATABASE_URL=postgres://arcp:LE_MEME_MOT_DE_PASSE_QUE_CI_DESSUS@127.0.0.1:5432/arcp
CMS_PUBLIC_URL=https://admin.africanrobotplatform.org
PUBLIC_SITE_URL=https://africanrobotplatform.org
ADMIN_EMAIL=ADRESSE_EMAIL_DU_PROPRIETAIRE
ADMIN_PASSWORD=MOT_DE_PASSE_LONG_UNIQUE_DU_PROPRIETAIRE
NODE_ENV=production
```

Les variables `BLOB_READ_WRITE_TOKEN` et `S3_*` mentionnées dans
`cms/.env.example` sont **optionnelles** (stockage objet géré). Elles ne servent
**pas** pour ce déploiement VPS : PostgreSQL local et les médias sur disque dans
`cms/media/` (défaut, ou `PAYLOAD_MEDIA_DIR` vers un autre disque persistant).

Les fichiers de secrets ne doivent jamais être committés, archivés publiquement
ou servis par le proxy.

```bash
chown arcp:arcp /var/www/arcp/.env.local /var/www/arcp/cms/.env
chmod 600 /var/www/arcp/.env.local /var/www/arcp/cms/.env
mkdir -p /var/www/arcp/cms/media
chown -R arcp:arcp /var/www/arcp/cms/media
```

## 3. Installation et construction

En tant qu'utilisateur `arcp`, depuis `/var/www/arcp` :

```bash
sudo -u arcp bash -lc 'cd /var/www/arcp && node scripts/deployment-preflight.mjs && node scripts/deploy.mjs'
```

`scripts/deploy.mjs` effectue, dans l'ordre, en s'arrêtant à la première erreur :

1. validation des secrets, domaines et dossiers persistants ;
2. `npm ci` reproductible pour les deux applications ;
3. migration transactionnelle du schéma PostgreSQL (`cms` : `npm run migrate`) ;
4. création initiale du propriétaire et des contenus, sans écraser l'existant
   (`cms` : `npm run seed`, idempotent) ;
5. compilation de l'administration puis du site public.

## 4. Services permanents (systemd)

Les modèles supposent le projet dans `/var/www/arcp` et l'utilisateur `arcp`.
Adapter si besoin.

```bash
sudo cp deploy/systemd/arcp-admin.service /etc/systemd/system/
sudo cp deploy/systemd/arcp-public.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now arcp-admin arcp-public
sudo systemctl status arcp-admin arcp-public --no-pager
```

Les ports 3000 et 3001 restent fermés au public (UFW). Seul le proxy y accède
par `127.0.0.1`.

## 5. Domaines et HTTPS

DNS attendus :

- `@` → adresse IP du serveur ;
- `www` → même IP (ou alias du domaine principal) ;
- `admin` → même IP.

Une fois les DNS propagés :

```bash
# Remplacer africanrobotplatform.org par le domaine réel dans deploy/Caddyfile
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy obtient et renouvelle les certificats automatiquement. Pour Nginx :
`deploy/nginx/arcp.conf.example` puis certbot.

## 6. Contrôles après mise en ligne

```text
https://africanrobotplatform.org/api/health          → 200, "cms":"ok"
https://admin.africanrobotplatform.org/health        → 200
https://admin.africanrobotplatform.org/admin         → écran de connexion
https://africanrobotplatform.org/sitemap.xml         → XML
```

Puis, connecté à l'administration : créer, publier et supprimer un contenu, et
tester les trois formulaires publics (contact, adhésion, newsletter).

## 7. Mise à jour

```bash
# Sauvegarder d'abord la base PostgreSQL et cms/media/ (voir plus bas)
cd /var/www/arcp
sudo -u arcp git pull
sudo -u arcp node scripts/deploy.mjs   # s'arrête à la moindre erreur
sudo systemctl restart arcp-admin arcp-public
```

Ne redémarrer les services que si `scripts/deploy.mjs` se termine sans erreur.

## 8. Sauvegardes (quotidiennes)

- base PostgreSQL : `sudo -u postgres pg_dump -Fc arcp > /chemin/backup/arcp-$(date +%F).dump` ;
- tout `cms/media/` ;
- `.env.local` et `cms/.env` dans un coffre à secrets.

`pg_dump` produit une copie cohérente sans arrêter le service. Restauration :
`pg_restore --clean --if-exists -d arcp /chemin/backup/arcp-AAAA-MM-JJ.dump`.
Tester une restauration avant la mise en production définitive.

## Plateforme Node gérée (sans systemd)

Créer deux services depuis le même dépôt :

| Service | Répertoire | Build | Démarrage | Stockage |
|---|---|---|---|---|
| Public | racine | `npm ci && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | — |
| Admin | `cms` | `npm ci && npm run migrate && npm run seed && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | base PostgreSQL gérée + Blob/S3 (ou disque `cms/media`) |

Passer `NODE_ENV=production` au service Admin, `DATABASE_URL=postgres://…` (ou
laisser le fournisseur injecter `POSTGRES_URL`), et l'URL privée/HTTPS de
l'administration dans `CMS_URL` côté service Public.

Sur **Vercel** (100 % Vercel, sans service externe) : voir `cms/README.md` §
« Déploiement sur Vercel » — Storage → Create Database → Postgres, puis
Storage → Create → Blob, tous deux connectés au projet.
