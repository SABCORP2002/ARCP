# Administration ARCP (Payload CMS)

Cette application Payload CMS est indépendante du site public. Elle fournit l'authentification du propriétaire, l'interface de gestion, l'API REST, la base **PostgreSQL** et la gestion des médias.

> Pour le déploiement en production sur serveur, voir **`../DEPLOYMENT.en.md`** (anglais) ou **`../DEPLOYMENT.md`** (français). Ce document ne couvre que le développement local et l'exploitation de l'application.

## Organisation

- `src/payload.config.ts` : configuration générale, base de données et sécurité ;
- `src/collections/` : articles, membres, événements, partenaires, médias et demandes ;
- `src/globals/` : `SiteSettings` (textes et coordonnées) et `AnnualStatistics` (statistiques annuelles + PDF) ;
- `src/seed.ts` et `seed.json` : données initiales ;
- `src/migrations/` : schéma PostgreSQL versionné ;
- `media/` : fichiers téléversés (stockage disque).

## Développement local

Base PostgreSQL locale (Docker) :

```bash
docker run -d --name arcp-pg -e POSTGRES_PASSWORD=arcp -p 5432:5432 postgres:16
```

Depuis la racine du projet :

```bash
npm run cms:install
cp cms/.env.example cms/.env        # puis remplacer les secrets et DATABASE_URL
npm --prefix cms run migrate
npm run cms:seed
npm run cms:dev
```

Ouvrir `http://localhost:3001/admin` et se connecter avec le compte défini dans `cms/.env`.

Avant le seed, remplacer les secrets, l'e-mail et le mot de passe d'exemple dans `cms/.env`. Le compte est créé une seule fois ; les exécutions suivantes ne modifient ni son mot de passe ni les contenus existants.

## Publication

- `draft` : contenu en préparation, invisible sur le site public ;
- `published` : contenu visible sur le site public en environ 60 secondes ;
- `archived` : contenu retiré mais conservé dans l'administration ;
- le statut d'un pays (`verified` ou `onboarding`) est distinct de son statut de publication ;
- le champ de média remplace automatiquement l'image locale initiale.

Les formulaires sont classés dans « Demandes reçues ». Seul le propriétaire connecté peut les lire, les modifier ou les supprimer.

## Migrations

Après un changement de collection ou de global :

```bash
npm --prefix cms run migrate:create <nom>   # génère la migration contre la base
```

`npm run deploy` (ou `deploy.mjs`) applique les migrations en attente avant la compilation.

## Sauvegardes

- Base : `pg_dump -Fc` régulier de la base PostgreSQL ;
- Médias : sauvegarder le dossier `media/` ;
- Secrets : dans un coffre chiffré, séparé du dépôt.

Tester régulièrement une restauration.

Documentation Payload :

- https://payloadcms.com/docs/getting-started/installation
- https://payloadcms.com/docs/database/postgres
- https://payloadcms.com/docs/access-control/overview
