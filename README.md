# African Robot Cooperation Platform (ARCP)

Le projet contient deux applications Node.js indépendantes, sans WordPress et sans conteneur :

- le site public Next.js, destiné aux visiteurs ;
- le site d'administration Payload CMS, situé dans `cms/` et destiné au propriétaire.

L'administration utilise **PostgreSQL**. Les images sont conservées dans `cms/media/` en local, ou sur Vercel Blob / un bucket S3 en production. Le site public communique avec son API côté serveur ; le jeton privé n'est jamais transmis au navigateur.

## Contenus administrables

- textes et coordonnées du site ;
- articles, images, dates et sources ;
- pays membres et statut de vérification ;
- événements ;
- partenaires et logos ;
- messages de contact et demandes d'adhésion ;
- inscriptions à la newsletter.

Un contenu publié apparaît sur le site public sous environ 60 secondes. Si l'administration est temporairement indisponible, les contenus locaux de secours maintiennent le site public affichable.

## Installation

Node.js 20.19 ou plus récent et un PostgreSQL accessible sont requis. Pour une base locale :

```powershell
docker run -d --name arcp-pg -e POSTGRES_PASSWORD=arcp -p 5432:5432 postgres:16
```

```powershell
npm ci
npm run cms:install
Copy-Item .env.example .env.local
Copy-Item cms/.env.example cms/.env
npm --prefix cms run migrate
```

Remplacer ensuite tous les secrets d'exemple. La valeur `CMS_API_TOKEN` doit être strictement identique dans `.env.local` et `cms/.env`.

Initialiser la base et le compte du propriétaire :

```powershell
npm run cms:seed
```

Lancer les deux applications dans deux terminaux :

```powershell
npm run dev
npm run cms:dev
```

- site public : `http://localhost:3000` ;
- administration : `http://localhost:3001/admin`.

## Validation

```powershell
npm run check
npm run build
npm run cms:build
npm audit --audit-level=moderate
npm --prefix cms audit --audit-level=moderate
```

## Déploiement

- `www.africanrobotplatform.org` : application publique Next.js ;
- `admin.africanrobotplatform.org` : seconde application Next.js/Payload ;
- les deux applications utilisent des processus Node distincts ;
- la base PostgreSQL et les médias (`cms/media/`, Vercel Blob ou S3) doivent être persistants ;
- HTTPS est obligatoire sur les deux domaines ;
- l'administration peut tourner sur plusieurs instances (PostgreSQL et le stockage objet sont partagés).

Sauvegarder quotidiennement la base PostgreSQL (`pg_dump`) et le dossier des médias. Un déploiement 100 % Vercel est possible : Vercel Postgres + Vercel Blob, sans service externe (voir `cms/README.md`).

Consultez `cms/README.md` pour l'exploitation de l'administration.

Le document `DEPLOYMENT.md` contient le dossier complet à transmettre à l'hébergeur : variables, construction automatisée, services permanents, domaines, HTTPS, contrôles de santé et sauvegardes.

Copyright 2024–2026 African Robot Cooperation Platform. Tous droits réservés.
