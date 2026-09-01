# Dossier à remettre à l'hébergeur

Ce dépôt déploie deux applications Node.js depuis le même code source :

- `africanrobotplatform.org` → site public sur `127.0.0.1:3000` ;
- `admin.africanrobotplatform.org` → administration sur `127.0.0.1:3001`.

Le CMS est intégré dans `cms/`. Il utilise SQLite et ne demande aucun service de base de données séparé. Une seule instance du processus d'administration doit être lancée.

## Exigences du serveur

- Linux 64 bits avec Node.js 20.19 ou plus récent ;
- accès SSH et possibilité de lancer deux processus Node permanents ;
- environ 1 Go de mémoire libre pour la compilation ;
- DNS modifiable pour le domaine principal, `www` et `admin` ;
- disque persistant et sauvegardé pour `cms/data/` et `cms/media/` ;
- proxy HTTPS comme Caddy, Nginx ou le proxy proposé par l'hébergeur.

Un hébergement limité à PHP ou à des fichiers statiques n'est pas compatible.

## Variables de production

Créer `.env.local` à la racine :

```dotenv
NEXT_PUBLIC_SITE_URL=https://africanrobotplatform.org
CMS_URL=http://127.0.0.1:3001
CMS_API_TOKEN=GENERER_UN_SECRET_ALEATOIRE_DE_48_CARACTERES_MINIMUM
FORM_ALLOWED_ORIGINS=https://africanrobotplatform.org
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_MEMBERSHIP_FORM_ENDPOINT=/api/forms/join
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=/api/forms/contact
NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT=/api/forms/newsletter
```

Créer `cms/.env` :

```dotenv
PAYLOAD_SECRET=GENERER_UN_SECRET_ALEATOIRE_DE_32_CARACTERES_MINIMUM
CMS_API_TOKEN=RECOPIER_EXACTEMENT_LE_JETON_DU_SITE_PUBLIC
DATABASE_URL=file:./data/arcp.db
CMS_PUBLIC_URL=https://admin.africanrobotplatform.org
PUBLIC_SITE_URL=https://africanrobotplatform.org
ADMIN_EMAIL=ADRESSE_EMAIL_DU_PROPRIETAIRE
ADMIN_PASSWORD=MOT_DE_PASSE_LONG_UNIQUE_DU_PROPRIETAIRE
```

Les fichiers de secrets ne doivent jamais être placés dans un dépôt public, une archive publique ou un dossier servi par le proxy.

## Installation et construction

Depuis la racine du projet :

```bash
node scripts/deployment-preflight.mjs
node scripts/deploy.mjs
```

Le script de déploiement effectue, dans cet ordre :

1. validation des secrets, domaines et dossiers persistants ;
2. installation reproductible des deux jeux de dépendances ;
3. migration transactionnelle du schéma SQLite ;
4. création initiale du propriétaire et des contenus, sans écraser les données existantes ;
5. compilation de l'administration ;
6. compilation du site public.

Une erreur arrête immédiatement le déploiement avant le redémarrage des services.

## Démarrage permanent sur un VPS

Les modèles fournis supposent que le projet se trouve dans `/var/www/arcp` et qu'un utilisateur système `arcp` existe. Adapter ces deux valeurs si nécessaire.

```bash
sudo cp deploy/systemd/arcp-admin.service /etc/systemd/system/
sudo cp deploy/systemd/arcp-public.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now arcp-admin arcp-public
```

Les ports 3000 et 3001 doivent rester fermés au réseau public. Seul le proxy HTTPS doit y accéder par `127.0.0.1`.

## Domaines et HTTPS

Le fichier `deploy/Caddyfile` est prêt pour Caddy, qui obtient et renouvelle automatiquement les certificats lorsque les DNS pointent vers le serveur.

Pour Nginx, utiliser `deploy/nginx/arcp.conf.example`, puis faire ajouter les certificats TLS par le gestionnaire de l'hébergeur avant d'ouvrir le site au public.

Enregistrements DNS attendus :

- `@` → adresse IP du serveur ;
- `www` → adresse IP du serveur ou alias du domaine principal ;
- `admin` → même adresse IP.

## Contrôles après mise en ligne

```text
https://africanrobotplatform.org/api/health
https://admin.africanrobotplatform.org/health
https://admin.africanrobotplatform.org/admin
https://africanrobotplatform.org/sitemap.xml
```

Les deux contrôles de santé doivent retourner HTTP 200. Le premier doit indiquer `cms: "ok"`.

Tester ensuite une création, une publication et une suppression depuis l'administration, puis les trois formulaires publics.

## Mise à jour

Avant chaque mise à jour : sauvegarder `cms/data/` et `cms/media/`, puis arrêter brièvement les deux processus. Déployer la nouvelle version avec `node scripts/deploy.mjs` et redémarrer les services uniquement si le script termine sans erreur.

## Sauvegardes

Sauvegarder quotidiennement :

- `cms/data/arcp.db` ;
- les éventuels fichiers `arcp.db-wal` et `arcp.db-shm` ;
- tout le dossier `cms/media/` ;
- les deux fichiers d'environnement dans un coffre à secrets.

Pour garantir une copie cohérente, l'hébergeur doit arrêter `arcp-admin` pendant la copie ou utiliser l'outil de sauvegarde SQLite de sa plateforme. Une restauration doit être testée avant la mise en production définitive.

## Plateforme Node gérée

Si l'hébergeur n'utilise pas systemd, créer deux services depuis le même dépôt :

| Service | Répertoire | Build | Démarrage | Port |
|---|---|---|---|---|
| Public | racine | `npm ci && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | fourni par l'hébergeur |
| Admin | `cms` | `npm ci && npm run migrate && npm run seed && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | fourni par l'hébergeur |

Le service Admin doit recevoir deux volumes persistants montés sur `cms/data` et `cms/media`. Le service Public doit recevoir l'URL privée ou HTTPS de l'administration dans `CMS_URL`.
