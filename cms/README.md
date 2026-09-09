# Administration ARCP intégrée au code

Cette application Payload CMS est un site indépendant du site public. Elle fournit l'authentification du propriétaire, l'interface de gestion, l'API REST, la base SQLite et la gestion des médias.

## Organisation

- `src/payload.config.ts` : configuration générale et sécurité ;
- `src/collections/` : modèles des articles, membres, événements, partenaires, médias et demandes ;
- `src/globals/SiteSettings.ts` : textes et coordonnées globales ;
- `src/seed.ts` et `seed.json` : données initiales ;
- `data/arcp.db` : base SQLite créée au premier lancement ;
- `media/` : fichiers téléversés par le propriétaire.

## Première installation

Depuis la racine du projet :

```powershell
npm run cms:install
Copy-Item cms/.env.example cms/.env
npm run cms:seed
npm run cms:dev
```

Avant le seed, remplacer les secrets, l'adresse e-mail et le mot de passe d'exemple dans `cms/.env`. Le compte est créé une seule fois ; les exécutions suivantes ne changent ni son mot de passe ni les contenus existants.

Ouvrir `http://localhost:3001/admin` et se connecter avec le compte défini dans `cms/.env`.

## Publication

- `draft` : contenu en préparation, invisible sur le site public ;
- `published` : contenu visible sous environ 60 secondes ;
- `archived` : contenu retiré mais conservé dans l'administration ;
- le statut d'un pays (`verified` ou `onboarding`) est distinct de son statut de publication ;
- le champ de média remplace automatiquement l'image locale initiale.

Les formulaires sont classés dans « Demandes reçues ». Seul le propriétaire connecté peut les lire, les modifier ou les supprimer.

## Production

1. Construire avec `npm run cms:build`.
2. Lancer avec `npm run cms:start` derrière `admin.africanrobotplatform.org`.
3. Définir `CMS_PUBLIC_URL=https://admin.africanrobotplatform.org`.
4. Définir `PUBLIC_SITE_URL=https://africanrobotplatform.org`.
5. Conserver `data/` et `media/` sur un disque persistant accessible en écriture.
6. N'exécuter qu'une instance de l'administration avec SQLite.
7. Ne jamais exposer `PAYLOAD_SECRET`, `CMS_API_TOKEN` ou le fichier `.env`.

Le schéma SQLite est versionné dans `src/migrations/`. Exécuter `npm run migrate` avant chaque compilation de production. Les migrations sont également vérifiées automatiquement au démarrage afin qu'une base neuve puisse être initialisée correctement.

Le site public reçoit seulement `CMS_URL` et `CMS_API_TOKEN` dans ses variables serveur.

## Déploiement de test sur Vercel (base SQLite hébergée)

Ce dossier est aussi poussé seul dans le dépôt **ARCP-Backoffice** pour un
déploiement autonome. Sur Vercel, remplacer le fichier SQLite local par une
base **Turso / libSQL** :

- **Root Directory** : la racine du dépôt ARCP-Backoffice.
- **Build Command** : `npm run deploy` (migrate → seed → build).
- **Variables d'environnement** :

  | Clé | Valeur |
  |---|---|
  | `PAYLOAD_SECRET` | 32+ caractères aléatoires |
  | `CMS_API_TOKEN` | 48+ caractères (identique au site public) |
  | `DATABASE_URL` | `libsql://<votre-base>.turso.io` (ou `https://…` pour forcer le transport HTTP) |
  | `DATABASE_AUTH_TOKEN` | jeton Turso |
  | `CMS_PUBLIC_URL` | `https://<votre-projet>.vercel.app` |
  | `PUBLIC_SITE_URL` | URL du site public |
  | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | compte propriétaire (créé une seule fois) |
  | `NODE_ENV` | `production` |

- **Médias** : sans stockage objet, l'upload d'images/PDF échoue sur Vercel.
  Ajouter `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
  (Cloudflare R2, Backblaze B2…) pour l'activer. La gestion des contenus texte
  fonctionne sans.

Depuis le dépôt principal, synchroniser avec : `npm run push:backoffice`.

## Sauvegardes

Sauvegarder ensemble :

- `data/arcp.db` ;
- `data/arcp.db-wal` et `data/arcp.db-shm` lorsqu'ils existent ;
- le dossier `media/` ;
- les secrets dans un coffre sécurisé séparé.

Arrêter brièvement l'administration ou utiliser une sauvegarde SQLite cohérente avant de copier la base. Conserver plusieurs versions chiffrées hors du serveur et tester régulièrement une restauration.

Documentation officielle :

- https://payloadcms.com/docs/getting-started/installation
- https://payloadcms.com/docs/database/sqlite
- https://payloadcms.com/docs/access-control/overview
