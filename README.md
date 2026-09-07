# Portfolio API

API backend du site portfolio personnel — construite avec **NestJS**, **Prisma 7** et **PostgreSQL**, selon les principes de l'**architecture hexagonale** (ports & adapters) et du **Domain-Driven Design**.

Ce projet sert à la fois de backend de production pour le portfolio, et de terrain d'apprentissage/démonstration de compétences en architecture logicielle backend.

## Stack technique

- **Framework** : NestJS 10+ (TypeScript, ESM natif)
- **ORM** : Prisma 7, avec driver adapter (`@prisma/adapter-pg`)
- **Base de données** : PostgreSQL
- **Authentification** : JWT (implémentation maison, sans Passport)
- **Validation** : class-validator / class-transformer
- **Tests** : Jest (unitaires) + Supertest (end-to-end)

## Architecture

Le projet suit une **architecture hexagonale** organisée **par feature/bounded context**, pas par couche technique globale :

```
src/
  modules/
    experience/
      domain/            → entités, value objects, interfaces de repository, erreurs métier
      application/       → use cases (orchestration, sans logique technique)
      infrastructure/    → implémentations Prisma, mappers, gestion d'erreurs DB
      presentation/      → controllers, DTOs
    blog/                → Article, Categorie (même structure)
    tag/                 → Tag + système de tagging polymorphe
    profil/              → Profil (singleton)
    auth/                → authentification JWT
  shared/
    domain/              → value objects et erreurs réutilisés (Slug, Periode, Lien, Telephone)
    infrastructure/      → PrismaService, gestion d'erreurs Prisma génériques
  app.module.ts
```

**Principe directeur** : le domaine ne dépend jamais de l'infrastructure. Chaque agrégat définit ses interfaces de repository (les *ports*) ; les implémentations Prisma (les *adapters*) vivent en périphérie et implémentent ces interfaces.

### Agrégats du domaine

| Agrégat | Description |
|---|---|
| **Experience** | Expériences professionnelles (freelance, CDI, consultant) |
| **Projet** | Projets techniques, rattachés à une expérience ou autonomes |
| **Article** | Articles de blog, avec cycle de vie (brouillon → publié → inactif) |
| **Categorie** | Catégories du blog |
| **Profil** | Profil public (singleton) |
| **Tag** | Étiquettes réutilisables (stack technique, soft skills), attachables à Experience/Projet/Article via une relation polymorphe |

## Prérequis

- Node.js 22+
- npm
- Prisma CLI (`npx prisma`)

## Installation

```bash
npm install
```

### Base de données locale

Ce projet utilise `prisma dev` (Postgres local géré par Prisma, sans Docker) :

```bash
npx prisma dev --name default
```

Récupère l'URL de connexion **directe** (pas l'URL proxy `prisma+postgres://`) affichée au démarrage, et renseigne-la dans `.env` :

```env
DATABASE_URL="postgres://postgres:postgres@localhost:PORT/DBNAME?sslmode=disable&..."
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:SHADOW_PORT/DBNAME?sslmode=disable&..."
JWT_SECRET="..."
ADMIN_USERNAME="..."
ADMIN_PASSWORD_HASH="..."
```

⚠️ Le driver adapter (`@prisma/adapter-pg`) utilisé par ce projet nécessite une URL Postgres **directe** — jamais le protocole proxy `prisma+postgres://`.

Génère le hash du mot de passe admin :
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TON_MOT_DE_PASSE', 10).then(console.log)"
```

### Migrations

```bash
npx prisma migrate dev
```

## Lancer le projet

```bash
npm run start:dev
```

L'API est accessible sur `http://localhost:3000`.

## Authentification

Un seul compte administrateur (pas de gestion multi-utilisateurs). Les routes de lecture (`GET`) sont publiques ; les routes d'écriture (`POST`/`PUT`/`DELETE`) nécessitent un token JWT.

```bash
POST /auth/login
{ "username": "...", "password": "..." }
```

Le token retourné s'utilise ensuite dans le header :
```
Authorization: Bearer <token>
```

## Aperçu des endpoints

| Ressource | Routes principales |
|---|---|
| Experiences | `GET /experiences`, `GET /experiences/:slug`, `POST/PUT/DELETE /experiences/:id` |
| Projets | `GET /projets`, `GET /projets/autonomes`, `GET /projets/experience/:id`, `GET /projets/:slug`, `POST/PUT/DELETE` |
| Articles | `GET /articles`, `GET /articles/:slug`, `GET /articles/categorie/:id`, `PUT /articles/statut/:id`, `POST/PUT/DELETE` |
| Catégories | `GET /categories`, `GET /categories/:slug`, `POST/PUT/DELETE` |
| Profil | `GET /profil`, `PUT /profil` (upsert) |
| Tags | `GET /tags`, `GET /tags/:id`, `POST/PUT/DELETE` |
| Tagging | `POST/DELETE /{experiences|projets|articles}/:id/tags`, `GET /{...}/:id/tags` |

## Tests

### Tests unitaires (domaine)

```bash
npm test
```

### Tests end-to-end

Nécessite une base de données de test dédiée, isolée de la base de développement :

```bash
npx prisma dev --name test
```

Renseigne `.env.test` avec l'URL de cette instance (`DATABASE_URL`, `SHADOW_DATABASE_URL`), ainsi que :
```env
ADMIN_USERNAME="..."
ADMIN_PASSWORD_HASH="..."
ADMIN_PASSWORD_PLAIN="..."   # mot de passe en clair, uniquement pour les tests
JWT_SECRET="..."
```

```bash
npx dotenv -e .env.test -- npx prisma migrate deploy
npm run test:e2e
```

## Choix architecturaux notables

- **IDs typés par Value Object** (`ExperienceId`, `ProjetId`...) plutôt que des `string` bruts — protège contre le mélange d'identifiants à la compilation.
- **Value Objects** pour tout concept avec règle de validation ou de transition (`Slug`, `Periode`, `StatutArticle`...) — évite la *primitive obsession*.
- **Agrégats indépendants référencés par id** : `Projet` peut exister sans `Experience` (side-projects) — deux agrégats séparés, jamais imbriqués, cohérent avec les principes DDD sur les invariants cross-agrégats.
- **Tagging polymorphe découplé** : le système de tags ne modifie ni ne dépend des entités `Experience`/`Projet`/`Article` — une table de jointure polymorphe (`Taggable`) gérée par un repository dédié, évitant toute duplication de logique.
- **Traduction systématique des erreurs Prisma** (contraintes uniques, clés étrangères) en erreurs de domaine explicites, elles-mêmes traduites en codes HTTP appropriés au niveau des controllers — le domaine ne connaît jamais Prisma.