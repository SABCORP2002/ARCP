# Administration ARCP intégrée au code

Cette application Payload CMS est un site indépendant du site public. Elle fournit l'authentification du propriétaire, l'interface de gestion, l'API REST, la base **PostgreSQL** et la gestion des médias.

## Organisation

- `src/payload.config.ts` : configuration générale et sécurité ;
- `src/collections/` : modèles des articles, membres, événements, partenaires, médias et demandes ;
- `src/globals/` : `SiteSettings` (textes et coordonnées) et `AnnualStatistics` (statistiques annuelles + PDF) ;
- `src/seed.ts` et `seed.json` : données initiales ;
- `src/migrations/` : schéma versionné (généré par `npm run migrate:create`) ;
- `media/` : uploads en développement local (en production : Vercel Blob ou S3).

## Première installation

Base Postgres locale (Docker) :

```powershell
docker run -d --name arcp-pg -e POSTGRES_PASSWORD=arcp -p 5432:5432 postgres:16
```

Depuis la racine du projet :

```powershell
npm run cms:install
Copy-Item cms/.env.example cms/.env   # DATABASE_URL pointe vers le Postgres local
npm --prefix cms run migrate
npm run cms:seed
npm run cms:dev
```

Avant le seed, remplacer les secrets, l'e-mail et le mot de passe d'exemple dans `cms/.env`. Le compte est créé une seule fois ; les exécutions suivantes ne changent ni son mot de passe ni les contenus existants.

Ouvrir `http://localhost:3001/admin` et se connecter avec le compte défini dans `cms/.env`.

## Publication

- `draft` : contenu en préparation, invisible sur le site public ;
- `published` : contenu visible sous environ 60 secondes ;
- `archived` : contenu retiré mais conservé dans l'administration ;
- le statut d'un pays (`verified` ou `onboarding`) est distinct de son statut de publication ;
- le champ de média remplace automatiquement l'image locale initiale.

Les formulaires sont classés dans « Demandes reçues ». Seul le propriétaire connecté peut les lire, les modifier ou les supprimer.

## Déploiement sur Vercel (100 % Vercel, aucun service externe)

Ce dossier est aussi poussé seul dans le dépôt **ARCP-Backoffice** pour un déploiement autonome (`npm run push:backoffice` depuis le dépôt principal).

1. Projet Vercel depuis `ARCP-Backoffice`, **Root Directory** = racine du dépôt.
2. **Storage → Create Database → Postgres**, connecté au projet → injecte `POSTGRES_URL` automatiquement.
3. **Storage → Create → Blob**, connecté au projet → injecte `BLOB_READ_WRITE_TOKEN` automatiquement.
4. **Build Command** : `npm run deploy` (migrate → seed → build). **Start Command** : `npm run start`.
5. Variables d'environnement :

   | Clé | Valeur |
   |---|---|
   | `PAYLOAD_SECRET` | 32+ caractères aléatoires |
   | `CMS_API_TOKEN` | 48+ caractères (identique au site public) |
   | `CMS_PUBLIC_URL` | `https://<votre-projet>.vercel.app` |
   | `PUBLIC_SITE_URL` | URL du site public |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | compte propriétaire (créé une seule fois) |

   `NODE_ENV=production` est déjà défini par Vercel. `POSTGRES_URL` et `BLOB_READ_WRITE_TOKEN` sont injectés par les stores — ne pas les recopier à la main.

Sur un autre hébergeur (Railway, VPS…) : fournir `DATABASE_URL=postgres://…` et, pour les médias, soit `BLOB_READ_WRITE_TOKEN`, soit `S3_BUCKET`/`S3_ENDPOINT`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`, soit `PAYLOAD_MEDIA_DIR` vers un disque persistant.

Le site public ne reçoit que `CMS_URL` et `CMS_API_TOKEN` dans ses variables serveur. Ne jamais exposer `PAYLOAD_SECRET`, `CMS_API_TOKEN` ou le fichier `.env`.

## Migrations

Le schéma est versionné dans `src/migrations/`. Après un changement de collection/global :

```powershell
npm --prefix cms run migrate:create <nom>   # génère la migration contre la base
```

`npm run deploy` applique les migrations en attente avant la compilation, et `getPayload()` les vérifie aussi au démarrage.

## Sauvegardes

- Base : `pg_dump` régulier de la base Postgres (Vercel Postgres, Neon et les hébergeurs gérés proposent aussi des sauvegardes automatiques).
- Médias : Vercel Blob / le bucket S3 sont déjà redondés côté fournisseur ; sur disque, sauvegarder `media/`.
- Secrets : dans un coffre chiffré, séparé du dépôt.

Tester régulièrement une restauration.

Documentation officielle :

- https://payloadcms.com/docs/getting-started/installation
- https://payloadcms.com/docs/database/postgres
- https://payloadcms.com/docs/access-control/overview
