# Milieu Familial — RSG Québec

Application de gestion pour responsables de services de garde en milieu familial (RSG) du Québec.

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Architecture](#architecture)
3. [Configuration locale](#configuration-locale)
4. [Démarrage de l'application](#démarrage-de-lapplication)
5. [Commandes utiles](#commandes-utiles)
6. [Résolution de problèmes](#résolution-de-problèmes)

---

## Prérequis

Installer les outils suivants sur votre PC avant de commencer :

| Outil | Version minimale | Lien |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org |
| npm | 10+ | inclus avec Node.js |
| Docker Desktop | dernière version | https://www.docker.com/products/docker-desktop |
| Git | dernière version | https://git-scm.com |

> **Réseau corporatif (Zscaler)** : les téléchargements des moteurs Prisma depuis `binaries.prisma.sh` peuvent être bloqués. Le projet est configuré pour utiliser le client Prisma en mode **WASM** (`engineType = "wasm"`) afin d'éviter ce problème.

---

## Architecture

```
docker-compose.yml       ← PostgreSQL 16 + Redis 7 + MinIO (stockage fichiers)
backend/                 ← API NestJS (port 3000)
frontend/                ← Interface React + Vite (port 5173)
```

Le frontend proxifie automatiquement les requêtes `/api` vers le backend via Vite.

---

## Configuration locale

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd milieu-familial
```

### 2. Configurer les variables d'environnement du backend

```bash
cd backend
copy .env.example .env
```

Ouvrir `backend/.env` et ajuster les valeurs suivantes selon votre environnement :

```env
# ─── Base de données ──────────────────────────────────────
DATABASE_URL="postgresql://mf_user:mf_password@localhost:5432/milieu_familial"

# ─── Redis ────────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"

# ─── JWT ──────────────────────────────────────────────────
JWT_SECRET="changez-ce-secret-en-production-32-chars-min"
JWT_EXPIRES_IN="8h"
JWT_REFRESH_SECRET="changez-ce-refresh-secret-en-production"
JWT_REFRESH_EXPIRES_IN="7d"

# ─── Chiffrement NAS (AES-256-GCM) ───────────────────────
ENCRYPTION_KEY="changez-cette-cle-32-caracteres!!"

# ─── Email (SendGrid) — laisser vide pour désactiver ─────
SENDGRID_API_KEY=""
EMAIL_FROM="noreply@votre-domaine.com"
EMAIL_FROM_NAME="Milieu Familial"

# ─── Stockage fichiers (MinIO local) ─────────────────────
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="mf_minio_user"
S3_SECRET_KEY="mf_minio_password"
S3_BUCKET="milieu-familial"
S3_REGION="us-east-1"

# ─── Application ─────────────────────────────────────────
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
APP_URL="http://localhost:3000"
```

> Les valeurs de `DATABASE_URL`, `S3_*` et `REDIS_URL` correspondent exactement aux services définis dans `docker-compose.yml` et fonctionnent sans modification en développement local.

---

## Démarrage de l'application

### Étape 1 — Démarrer les services Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

Vérifie que les trois conteneurs sont bien démarrés :

```bash
docker compose ps
```

Vous devriez voir `mf_postgres`, `mf_redis` et `mf_minio` en état `running`.

### Étape 2 — Installer les dépendances et initialiser la base de données (avec compte de test)

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
```

| Commande | Description |
|---|---|
| `npm run prisma:migrate` | Applique toutes les migrations sur la base de données |
| `npm run prisma:seed` | Insère les données initiales (comptes de test, etc.) |

Après le seed, un compte RSGE de test est disponible pour se connecter sur le frontend :

| Champ | Valeur |
|---|---|
| **Email** | `rsge@exemple.com` |
| **Mot de passe** | `Admin1234!` |

### Étape 3 — Démarrer le backend

```bash
npm run start:dev
```

L'API est disponible sur **http://localhost:3000**.

### Étape 4 — Installer les dépendances et démarrer le frontend

Dans un **nouveau terminal** :

```bash
cd frontend
npm install
npm run dev
```

L'interface est disponible sur **http://localhost:5173**.

---

## Commandes utiles

### Backend

```bash
# Démarrer en mode watch (rechargement automatique)
npm run start:dev

# Ouvrir Prisma Studio (explorateur de base de données)
npm run prisma:studio

# Régénérer le client Prisma après modification du schéma
npm run prisma:generate

# Remettre la base de données à zéro (supprime toutes les données)
npm run prisma:reset
```

### Docker

```bash
# Démarrer tous les services en arrière-plan
docker compose up -d

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (réinitialise toutes les données)
docker compose down -v

# Voir les logs d'un service
docker compose logs -f postgres
```

### Connexion PostgreSQL (pgAdmin ou autre client)

Créer un nouveau serveur dans pgAdmin avec les paramètres suivants :

| Paramètre | Valeur |
|---|---|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Base de données** | `milieu_familial` |
| **Utilisateur** | `mf_user` |
| **Mot de passe** | `mf_password` |

### Accès MinIO (stockage fichiers)

- Console web : **http://localhost:9001**
- Utilisateur : `mf_minio_user`
- Mot de passe : `mf_minio_password`

Créer manuellement le bucket `milieu-familial` dans la console MinIO lors du premier démarrage.

---

## Résolution de problèmes

### Erreur de connexion à la base de données

Vérifier que le conteneur PostgreSQL est bien démarré :

```bash
docker compose ps
docker compose logs postgres
```

S'assurer que le port `5432` n'est pas déjà occupé par une instance PostgreSQL locale.

### Erreur Prisma — moteur introuvable (réseau Zscaler)

Le projet utilise Prisma en mode WASM (`engineType = "wasm"` dans `schema.prisma`), ce qui évite le téléchargement des binaires natifs bloqués par Zscaler. Si une erreur persiste lors de `npm install`, vérifier que `@prisma/client` est bien en version latest dans `package.json`.

### Port déjà utilisé

| Service | Port | Solution |
|---|---|---|
| Backend NestJS | 3000 | Modifier `PORT` dans `backend/.env` |
| Frontend Vite | 5173 | Modifier `server.port` dans `frontend/vite.config.ts` |
| PostgreSQL | 5432 | Modifier le port dans `docker-compose.yml` et `DATABASE_URL` |
| Redis | 6379 | Modifier le port dans `docker-compose.yml` et `REDIS_URL` |
| MinIO API | 9000 | Modifier le port dans `docker-compose.yml` et `S3_ENDPOINT` |
| MinIO Console | 9001 | Modifier le port dans `docker-compose.yml` |
