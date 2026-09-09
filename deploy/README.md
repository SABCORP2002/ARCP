# deploy/ — modèles pour la mise en production

Cible : **un VPS Linux** (Ubuntu 22.04/24.04) faisant tourner les deux
applications Node du dépôt derrière un proxy HTTPS.

| Fichier | Rôle |
|---|---|
| `systemd/arcp-public.service` | Service du site public — `127.0.0.1:3000`, `NODE_ENV=production`, redémarrage auto |
| `systemd/arcp-admin.service` | Service de l'administration (CMS) — `127.0.0.1:3001`, PostgreSQL local + `cms/media` |
| `Caddyfile` | Proxy inverse + HTTPS **automatique** (recommandé). Remplacer le domaine. |
| `nginx/arcp.conf.example` | Alternative Nginx (TLS à ajouter via certbot). Remplacer le domaine. |

La procédure complète, pas à pas, est dans **[`../DEPLOYMENT.md`](../DEPLOYMENT.md)** :
base serveur (Node + PostgreSQL) → secrets → `node scripts/deploy.mjs` → services
systemd → DNS/HTTPS → contrôles de santé → sauvegardes.

Résumé des hypothèses des modèles (à adapter si besoin) :

- projet cloné dans `/var/www/arcp` ;
- utilisateur système `arcp` ;
- ports `3000` / `3001` fermés au public, joignables uniquement par le proxy en `127.0.0.1`.
