# Dossier à remettre à l'hébergeur (UltaHost)

Ce projet déploie **deux applications Node.js** depuis le même code source, sur
une seule machine :

- `africanrobotplatform.org` → site public, écoute sur `127.0.0.1:3000` ;
- `admin.africanrobotplatform.org` → administration (CMS), écoute sur `127.0.0.1:3001`.

L'administration est dans `cms/`. Elle utilise **PostgreSQL** (installé sur la
même machine) et **stocke les médias sur le disque local** (`cms/media/`).
Aucun service externe n'est requis. Une seule instance du processus
d'administration doit tourner à la fois.

> Dans tout ce document, remplacer `africanrobotplatform.org` par le domaine
> réel. Il apparaît dans : `deploy/Caddyfile` (ou `deploy/nginx/arcp.conf.example`),
> `.env.local` (`NEXT_PUBLIC_SITE_URL`, `FORM_ALLOWED_ORIGINS`) et
> `cms/.env` (`CMS_PUBLIC_URL`, `PUBLIC_SITE_URL`).

---

## 0. Commander le serveur chez UltaHost

Le projet a besoin de **deux processus Node permanents + PostgreSQL + un accès
root SSH**. Cela exige un **VPS** (ou un serveur dédié), pas un hébergement
mutualisé.

| À commander | Recommandé | Minimum |
|---|---|---|
| Type d'offre | **VPS Linux** UltaHost (KVM, accès root complet) | idem |
| Système | **Ubuntu 24.04 LTS** (ou 22.04) | idem |
| RAM | **4 Go** (compilation confortable des deux apps + PostgreSQL) | 2 Go |
| vCPU | 2 | 1 |
| Disque | 40 Go NVMe | 20 Go |
| Sauvegardes | option « Backups » activée | — |

Ne conviennent **pas** : l'hébergement mutualisé cPanel, les offres
« Node.js hosting » en cPanel/Passenger (un seul process applicatif, pas de
PostgreSQL managé, pas de systemd), tout hébergement PHP ou statique.

À préciser au support UltaHost lors de la commande / du ticket d'installation :

1. « VPS Ubuntu 24.04, accès **root SSH** (clé publique ci-jointe si possible). »
2. « Merci d'installer : `git`, **Node.js 22** (dépôt NodeSource) et
   **PostgreSQL 14+**. » (sinon je le fais moi-même à l'étape 1)
3. « Ports **80 et 443** ouverts vers l'extérieur ; **3000** et **3001**
   fermés (usage interne uniquement). »
4. « Je fournis le code sous forme d'archive `.zip` ; il sera déployé dans
   `/var/www/arcp`. »

À la livraison, l'hébergeur doit fournir : **IP publique du VPS**, **identifiants
root SSH**, et confirmer l'accès au panneau DNS du domaine (ou indiquer où
pointer les enregistrements A).

---

## Exigences techniques (résumé)

- Linux 64 bits, **Ubuntu 22.04 ou 24.04** ;
- **Node.js 22** (épinglé par `.node-version` et `cms/.node-version` = `22.12.0`) ; 20.19+ toléré ;
- **PostgreSQL 14+** ;
- **2 Go de RAM libre minimum** pour la compilation (1 Go échoue sur Payload) ;
- accès **SSH root** et deux processus Node permanents (modèles systemd fournis) ;
- **disque persistant et sauvegardé** pour `cms/media/` et la base PostgreSQL ;
- proxy HTTPS : **Caddy** (recommandé, HTTPS automatique) ou Nginx + certbot ;
- DNS modifiable : `@`, `www` et `admin` vers l'IP du serveur.

---

## 1. Base du serveur (Ubuntu, en root)

À sauter si l'hébergeur a déjà installé Node 22 et PostgreSQL — vérifier avec
`node -v` et `psql --version`.

```bash
apt update && apt -y upgrade
apt -y install git curl unzip ufw

# Pare-feu : n'ouvrir que SSH et le proxy HTTPS. 3000/3001 restent privés.
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable

# Node.js 22 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt -y install nodejs

# PostgreSQL + base et rôle dédiés à l'administration
apt -y install postgresql
sudo -u postgres psql -c "CREATE ROLE arcp LOGIN PASSWORD 'REMPLACER_PAR_UN_MOT_DE_PASSE_LONG';"
sudo -u postgres psql -c "CREATE DATABASE arcp OWNER arcp;"

# Caddy (proxy + certificats automatiques) — sauter si vous préférez Nginx
apt -y install debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt update && apt -y install caddy

# Utilisateur de service dédié (sans shell de connexion)
adduser --system --group --home /var/www/arcp arcp
```

---

## 2. Déposer le code

### Depuis l'archive `.zip` fournie (méthode remise à l'hébergeur)

```bash
unzip -q /chemin/vers/arcp.zip -d /tmp/arcp-src
# l'archive contient un unique dossier « arcp/ » (package.json, cms/, …)
mkdir -p /var/www/arcp
cp -a /tmp/arcp-src/arcp/. /var/www/arcp/
rm -rf /tmp/arcp-src
cd /var/www/arcp
chown -R arcp:arcp /var/www/arcp
```

L'archive ne contient **ni** `node_modules/`, **ni** `.next/`, **ni** fichier
`.env` : tout est reconstruit à l'étape 3.

### (Variante) depuis Git

```bash
git clone https://github.com/SABCORP2002/ARCP.git /var/www/arcp
cd /var/www/arcp && chown -R arcp:arcp /var/www/arcp
```

---

## 3. Secrets et fichiers d'environnement

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

`CMS_API_TOKEN` doit être **strictement identique** dans les deux fichiers.
Les variables `BLOB_READ_WRITE_TOKEN` et `S3_*` de `cms/.env.example` sont
**optionnelles** (stockage objet managé) et **inutiles ici** : PostgreSQL local
et médias sur disque dans `cms/media/` (ou `PAYLOAD_MEDIA_DIR` vers un autre
disque persistant).

Les fichiers de secrets ne doivent jamais être committés, archivés publiquement
ou servis par le proxy.

```bash
chown arcp:arcp /var/www/arcp/.env.local /var/www/arcp/cms/.env
chmod 600 /var/www/arcp/.env.local /var/www/arcp/cms/.env
mkdir -p /var/www/arcp/cms/media
chown -R arcp:arcp /var/www/arcp/cms/media
```

---

## 4. Installation et construction

En tant qu'utilisateur `arcp`, depuis `/var/www/arcp` :

```bash
sudo -u arcp bash -lc 'cd /var/www/arcp && node scripts/deployment-preflight.mjs && node scripts/deploy.mjs'
```

`scripts/deployment-preflight.mjs` refuse de continuer si un secret, une URL ou
un dossier obligatoire manque. `scripts/deploy.mjs` effectue ensuite, dans
l'ordre, en s'arrêtant à la première erreur :

1. `npm ci` reproductible pour les deux applications ;
2. migration transactionnelle du schéma PostgreSQL (`cms` : `npm run migrate`) ;
3. création initiale du propriétaire et des contenus, sans écraser l'existant
   (`cms` : `npm run seed`, idempotent) ;
4. compilation de l'administration puis du site public.

---

## 5. Services permanents (systemd)

Les modèles supposent le projet dans `/var/www/arcp` et l'utilisateur `arcp`.

```bash
sudo cp deploy/systemd/arcp-admin.service /etc/systemd/system/
sudo cp deploy/systemd/arcp-public.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now arcp-admin arcp-public
sudo systemctl status arcp-admin arcp-public --no-pager
```

Les ports 3000 et 3001 restent fermés au public (UFW). Seul le proxy y accède
par `127.0.0.1`.

---

## 6. Domaines et HTTPS

Enregistrements DNS attendus :

- `@` → adresse IP du serveur ;
- `www` → même IP (ou alias du domaine principal) ;
- `admin` → même IP.

Une fois les DNS propagés, avec **Caddy** (HTTPS automatique) :

```bash
# Remplacer africanrobotplatform.org par le domaine réel dans deploy/Caddyfile
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Avec **Nginx** : copier `deploy/nginx/arcp.conf.example` dans
`/etc/nginx/sites-available/`, l'activer, puis ajouter TLS via certbot
(`certbot --nginx -d africanrobotplatform.org -d www.africanrobotplatform.org -d admin.africanrobotplatform.org`).

---

## 7. Contrôles après mise en ligne

```text
https://africanrobotplatform.org/api/health          → 200, "cms":"ok"
https://admin.africanrobotplatform.org/health        → 200
https://admin.africanrobotplatform.org/admin         → écran de connexion
https://africanrobotplatform.org/sitemap.xml         → XML
```

Puis, connecté à l'administration : créer, publier puis supprimer un contenu de
test, et soumettre les trois formulaires publics (contact, adhésion, newsletter)
en vérifiant qu'ils apparaissent dans « Demandes reçues ». Un contenu publié
apparaît sur le site public en ~60 secondes.

---

## 8. Mise à jour

### Nouvelle archive `.zip`

```bash
sudo systemctl stop arcp-public arcp-admin
# sauvegarder d'abord (section 9)
cd /var/www/arcp
unzip -q /chemin/vers/arcp-nouvelle-version.zip -d /tmp/arcp-src
# remplacer le code SANS toucher aux secrets ni aux médias
rsync -a --delete \
  --exclude '.env.local' --exclude 'cms/.env' \
  --exclude 'node_modules' --exclude 'cms/node_modules' \
  --exclude '.next' --exclude 'cms/.next' \
  --exclude 'cms/media' \
  /tmp/arcp-src/arcp/ /var/www/arcp/
rm -rf /tmp/arcp-src
chown -R arcp:arcp /var/www/arcp
sudo -u arcp node scripts/deploy.mjs      # s'arrête à la moindre erreur
sudo systemctl start arcp-admin arcp-public
```

### Via Git (si déployé depuis le dépôt)

```bash
cd /var/www/arcp
sudo -u arcp git pull
sudo -u arcp node scripts/deploy.mjs
sudo systemctl restart arcp-admin arcp-public
```

Ne (re)démarrer les services que si `scripts/deploy.mjs` se termine sans erreur.

---

## 9. Sauvegardes (quotidiennes)

- base PostgreSQL : `sudo -u postgres pg_dump -Fc arcp > /var/backups/arcp-$(date +%F).dump` ;
- tout `cms/media/` (`tar czf /var/backups/arcp-media-$(date +%F).tgz -C /var/www/arcp/cms media`) ;
- `.env.local` et `cms/.env` dans un coffre à secrets, séparés du serveur.

`pg_dump` produit une copie cohérente sans arrêter le service. Restauration :
`pg_restore --clean --if-exists -d arcp /var/backups/arcp-AAAA-MM-JJ.dump`.
Tester une restauration avant la mise en production définitive. Si l'offre
UltaHost inclut des snapshots/backups automatiques, les activer **en plus**.

---

## Annexe — plateforme Node managée (sans systemd)

Si l'hébergeur impose son propre gestionnaire de process, créer deux services
depuis le même code :

| Service | Répertoire | Build | Démarrage | Stockage |
|---|---|---|---|---|
| Public | racine | `npm ci && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | — |
| Admin | `cms` | `npm ci && npm run migrate && npm run seed && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | PostgreSQL managé + `cms/media` persistant (ou Blob/S3) |

Passer `NODE_ENV=production` au service Admin, `DATABASE_URL=postgres://…`, et
l'URL privée/HTTPS de l'administration dans `CMS_URL` côté service Public.
