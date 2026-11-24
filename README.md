# African Robot Cooperation Platform (ARCP)

Une seule application Next.js, sans WordPress et sans conteneur : le site public **et** l'administration (`/admin`) tournent dans le même projet, déployé sur Vercel.

L'administration utilise **PostgreSQL** (via `lib/db.ts`) et stocke les images/PDF sur **Vercel Blob**. Il n'y a ni service séparé, ni jeton d'API entre deux apps : le site public lit directement la base de données côté serveur.

## Contenus administrables (`/admin`)

- textes et coordonnées du site ;
- articles, images, dates et sources ;
- pays membres et statut de vérification ;
- événements ;
- partenaires et logos ;
- statistiques annuelles et rapport PDF ;
- messages de contact, demandes d'adhésion et inscriptions à la newsletter (lecture + statut).

Un contenu publié apparaît sur le site public sous environ 60 secondes (ISR). Si la base est temporairement indisponible, le site retombe automatiquement sur les contenus locaux de secours (`data/*.ts`).

## Installation

Node.js 20.19 ou plus récent et un PostgreSQL accessible sont requis. Pour une base locale :

```powershell
docker run -d --name arcp-pg -e POSTGRES_PASSWORD=arcp -p 5432:5432 postgres:16
```

```powershell
npm ci
Copy-Item .env.example .env.local
```

Remplacer les secrets d'exemple dans `.env.local` (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`). Puis initialiser le schéma et le compte propriétaire (idempotent — ne touche jamais à un compte ou un contenu déjà existant) :

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

- site public : `http://localhost:3000` ;
- administration : `http://localhost:3000/admin`.

## Validation

```powershell
npm run check
npm run build
npm audit --audit-level=moderate
```

## Déploiement

Un seul projet Vercel. Avant le premier déploiement :

1. **Storage → Create Database → Postgres**, connecté au projet — injecte `POSTGRES_URL` automatiquement.
2. **Storage → Create → Blob**, connecté au projet — injecte `BLOB_READ_WRITE_TOKEN` automatiquement.
3. Variables d'environnement : `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `FORM_ALLOWED_ORIGINS`.
4. **Build Command** : `npm run db:migrate && npm run db:seed && npm run build`.

Sauvegarder régulièrement la base (`pg_dump`) — Vercel Postgres/Neon proposent aussi des sauvegardes automatiques. Les médias sur Vercel Blob sont déjà redondés côté fournisseur.

Copyright 2024–2026 African Robot Cooperation Platform. Tous droits réservés.
