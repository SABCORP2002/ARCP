# ARCP — Full Deployment Guide (Public Website + Admin)

**Audience:** the engineer/agency deploying this project. This document is
self-contained — no other context should be needed to take the code from a
`.zip` archive to a live, working installation.

---

## 1. What you are receiving

One code archive that contains **two independent Node.js applications**:

| App | Folder | Purpose | Internal port |
|---|---|---|---|
| **Public website** | repo root | Next.js site visitors see | `3000` |
| **Admin (CMS)** | `cms/` | Payload CMS — content management, forms inbox | `3001` |

They run as **two separate, permanent processes on the same server**, both
behind one HTTPS reverse proxy:

```
Internet
   │
   ▼
HTTPS reverse proxy (Caddy or Nginx)
   ├── https://YOURDOMAIN.com          → 127.0.0.1:3000  (public site)
   └── https://admin.YOURDOMAIN.com    → 127.0.0.1:3001  (admin)
```

The admin uses **PostgreSQL** (installed on the same server) and stores
uploaded media on local disk (`cms/media/`). No third-party service is
required — everything runs on one box.

> Throughout this guide, replace `YOURDOMAIN.com` with the real domain. It
> needs to be edited in three places: `deploy/Caddyfile` (or
> `deploy/nginx/arcp.conf.example`), `.env.local` at the repo root
> (`NEXT_PUBLIC_SITE_URL`, `FORM_ALLOWED_ORIGINS`), and `cms/.env`
> (`CMS_PUBLIC_URL`, `PUBLIC_SITE_URL`).

---

## 2. Server requirements

| Requirement | Recommended | Minimum |
|---|---|---|
| OS | **Ubuntu 24.04 LTS** (22.04 also fine) | any 64-bit Linux |
| Access | **root SSH** | root SSH |
| RAM | **4 GB** (comfortable build headroom) | 2 GB (1 GB fails compiling Payload) |
| vCPU | 2 | 1 |
| Disk | 40 GB NVMe/SSD | 20 GB |
| Node.js | **22.x** (pinned by `.node-version` / `cms/.node-version`) | 20.19+ |
| Database | **PostgreSQL 14+**, on this server or a managed instance | — |
| Firewall | ports **80/443 public**, **3000/3001 private** (loopback only) | — |
| DNS control | ability to add A records for the apex, `www` and `admin` subdomains | — |

**Not sufficient for this project:** shared/cPanel hosting, cPanel "Node.js
App" (Passenger) hosting — no persistent background processes, no
self-managed PostgreSQL, no root access for a reverse proxy. This needs a
**VPS or dedicated server with root SSH**.

---

## 3. Server base setup (run as root)

Skip whatever is already installed (check with `node -v` and `psql --version`).

```bash
apt update && apt -y upgrade
apt -y install git curl unzip ufw

# Firewall: only SSH and the reverse proxy are public. 3000/3001 stay private.
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable

# Node.js 22 (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt -y install nodejs

# PostgreSQL, with a dedicated role and database for the admin app
apt -y install postgresql
sudo -u postgres psql -c "CREATE ROLE arcp LOGIN PASSWORD 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE arcp OWNER arcp;"

# Caddy — reverse proxy with automatic HTTPS (recommended; skip if you prefer Nginx)
apt -y install debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt update && apt -y install caddy

# Dedicated, unprivileged service account (no login shell)
adduser --system --group --home /var/www/arcp arcp
```

---

## 4. Deploy the code

```bash
unzip -q /path/to/arcp.zip -d /tmp/arcp-src
# the archive contains a single top-level "arcp/" folder
mkdir -p /var/www/arcp
cp -a /tmp/arcp-src/arcp/. /var/www/arcp/
rm -rf /tmp/arcp-src
cd /var/www/arcp
chown -R arcp:arcp /var/www/arcp
```

The archive intentionally does **not** contain `node_modules/`, `.next/`, or
any real `.env` file — those are generated in the next two steps.

---

## 5. Secrets and environment files

Generate two random secrets:

```bash
node -e "console.log('PAYLOAD_SECRET =', require('crypto').randomBytes(32).toString('hex')); console.log('CMS_API_TOKEN  =', require('crypto').randomBytes(32).toString('hex'))"
```

Create `/var/www/arcp/.env.local` (public site):

```dotenv
NEXT_PUBLIC_SITE_URL=https://YOURDOMAIN.com
CMS_URL=http://127.0.0.1:3001
CMS_API_TOKEN=PASTE_THE_CMS_API_TOKEN_GENERATED_ABOVE
FORM_ALLOWED_ORIGINS=https://YOURDOMAIN.com
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_MEMBERSHIP_FORM_ENDPOINT=/api/forms/join
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=/api/forms/contact
NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT=/api/forms/newsletter
```

Create `/var/www/arcp/cms/.env` (admin):

```dotenv
PAYLOAD_SECRET=PASTE_THE_PAYLOAD_SECRET_GENERATED_ABOVE
CMS_API_TOKEN=SAME_CMS_API_TOKEN_AS_IN_.env.local
DATABASE_URL=postgres://arcp:SAME_PASSWORD_AS_STEP_3@127.0.0.1:5432/arcp
CMS_PUBLIC_URL=https://admin.YOURDOMAIN.com
PUBLIC_SITE_URL=https://YOURDOMAIN.com
ADMIN_EMAIL=OWNER_EMAIL_ADDRESS
ADMIN_PASSWORD=A_LONG_UNIQUE_OWNER_PASSWORD
NODE_ENV=production
```

**`CMS_API_TOKEN` must be byte-for-byte identical in both files** — it is how
the public site authenticates its server-side reads from the admin API.

`ADMIN_EMAIL` / `ADMIN_PASSWORD` create the one owner account the very first
time the app runs; re-running the deploy later does not change an existing
account or its content (the seed step is idempotent).

`BLOB_READ_WRITE_TOKEN` and `S3_*`, mentioned in `cms/.env.example`, are
**optional** (managed object storage) and **not needed** for this setup —
media uploads are stored on local disk in `cms/media/` by default (or point
`PAYLOAD_MEDIA_DIR` at a different persistent disk).

Secrets must never be committed to version control, placed in a public
archive, or served by the reverse proxy.

```bash
chown arcp:arcp /var/www/arcp/.env.local /var/www/arcp/cms/.env
chmod 600 /var/www/arcp/.env.local /var/www/arcp/cms/.env
mkdir -p /var/www/arcp/cms/media
chown -R arcp:arcp /var/www/arcp/cms/media
```

---

## 6. Install and build

As the `arcp` user, from `/var/www/arcp`:

```bash
sudo -u arcp bash -lc 'cd /var/www/arcp && node scripts/deployment-preflight.mjs && node scripts/deploy.mjs'
```

`scripts/deployment-preflight.mjs` refuses to continue if a secret, a URL, or
a required directory is missing or looks like a placeholder. `scripts/deploy.mjs`
then runs, stopping at the first error:

1. `npm ci` (reproducible install) for both applications;
2. the PostgreSQL schema migration, inside a transaction (`cms`: `npm run migrate`);
3. one-time creation of the owner account and seed content, without
   overwriting anything that already exists (`cms`: `npm run seed`, idempotent);
4. build the admin app, then the public site.

If this command exits with a non-zero status, **do not start or restart the
services** — read the error, fix it, and re-run the same command.

---

## 7. Permanent services (systemd)

The provided unit files assume the project lives in `/var/www/arcp` and runs
as the `arcp` user — adjust both files if either differs.

```bash
sudo cp deploy/systemd/arcp-admin.service /etc/systemd/system/
sudo cp deploy/systemd/arcp-public.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now arcp-admin arcp-public
sudo systemctl status arcp-admin arcp-public --no-pager
```

Ports 3000 and 3001 stay closed to the outside world (UFW); only the reverse
proxy reaches them, over `127.0.0.1`.

---

## 8. Domain and HTTPS

Expected DNS records, pointing at the server's IP:

- `@` (apex domain)
- `www`
- `admin`

Once DNS has propagated, with **Caddy** (automatic HTTPS):

```bash
# Replace YOURDOMAIN.com with the real domain in deploy/Caddyfile first
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

With **Nginx** instead: copy `deploy/nginx/arcp.conf.example` into
`/etc/nginx/sites-available/`, symlink it into `sites-enabled/`, then issue
certificates with certbot:

```bash
certbot --nginx -d YOURDOMAIN.com -d www.YOURDOMAIN.com -d admin.YOURDOMAIN.com
```

---

## 9. Post-launch checks

```text
https://YOURDOMAIN.com/api/health          → 200, body contains "cms":"ok"
https://admin.YOURDOMAIN.com/health        → 200
https://admin.YOURDOMAIN.com/admin         → login screen
https://YOURDOMAIN.com/sitemap.xml         → valid XML
```

Then, logged into the admin: create, publish, and delete a test piece of
content, and submit all three public forms (contact, membership, newsletter),
confirming each shows up under "Requests received" in the admin. A published
change appears on the public site within roughly 60 seconds — no rebuild or
restart needed.

---

## 10. Updating to a new release

### From a new `.zip` archive

```bash
sudo systemctl stop arcp-public arcp-admin
# back up first — see section 11
cd /var/www/arcp
unzip -q /path/to/arcp-new-version.zip -d /tmp/arcp-src
rsync -a --delete \
  --exclude '.env.local' --exclude 'cms/.env' \
  --exclude 'node_modules' --exclude 'cms/node_modules' \
  --exclude '.next' --exclude 'cms/.next' \
  --exclude 'cms/media' \
  /tmp/arcp-src/arcp/ /var/www/arcp/
rm -rf /tmp/arcp-src
chown -R arcp:arcp /var/www/arcp
sudo -u arcp node scripts/deploy.mjs
sudo systemctl start arcp-admin arcp-public
```

### From Git (if this was deployed from a repository instead)

```bash
cd /var/www/arcp
sudo -u arcp git pull
sudo -u arcp node scripts/deploy.mjs
sudo systemctl restart arcp-admin arcp-public
```

Only (re)start the services if `scripts/deploy.mjs` completes without error.

---

## 11. Backups (daily)

- **Database**: `sudo -u postgres pg_dump -Fc arcp > /var/backups/arcp-$(date +%F).dump`
- **Media**: `tar czf /var/backups/arcp-media-$(date +%F).tgz -C /var/www/arcp/cms media`
- **Secrets**: copy `.env.local` and `cms/.env` into a separate secrets vault
  (never on the same backup target as public files).

`pg_dump` produces a consistent snapshot without stopping the service.
Restore with:

```bash
pg_restore --clean --if-exists -d arcp /var/backups/arcp-YYYY-MM-DD.dump
```

Test a full restore before relying on this in production. If the hosting
platform offers automatic server snapshots, enable those in addition.

---

## 12. Appendix — managed Node platform (no systemd)

If the host uses its own process manager instead of systemd, create two
services from the same codebase:

| Service | Directory | Build | Start | Storage |
|---|---|---|---|---|
| Public site | repo root | `npm ci && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | — |
| Admin | `cms` | `npm ci && npm run migrate && npm run seed && npm run build` | `npm run start -- --hostname 0.0.0.0 --port $PORT` | managed PostgreSQL + a persistent `cms/media` disk (or Blob/S3) |

Set `NODE_ENV=production` on the admin service, `DATABASE_URL=postgres://…`
(or let the platform inject `POSTGRES_URL`), and the admin's private/HTTPS URL
as `CMS_URL` on the public site's service.

---

## Support checklist — what we need from you before you start

- [ ] Server IP address and root SSH access (or a way to add our SSH key)
- [ ] Confirmation of OS (Ubuntu 22.04/24.04) and available RAM
- [ ] Access to DNS management for the domain, or instructions on what A
      records to add
- [ ] Confirmation once ports 80/443 are reachable and 3000/3001 are not

## Security notes

- Never commit, email in plain text, or paste `PAYLOAD_SECRET`,
  `CMS_API_TOKEN`, `ADMIN_PASSWORD`, or the database password anywhere public.
- `.env.local` and `cms/.env` must be `chmod 600`, owned by the `arcp` service
  user, and excluded from anything the reverse proxy serves.
- Rotate `PAYLOAD_SECRET` and `CMS_API_TOKEN` if they are ever exposed (chat,
  screenshot, ticket, etc.) — generate new values with the command in
  section 5 and update both `.env` files together.
