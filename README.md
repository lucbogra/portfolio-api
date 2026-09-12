# Portfolio API

API backend du site portfolio personnel — construite avec **NestJS**, **Prisma 7** et **PostgreSQL**, selon les principes de l'**architecture hexagonale** (ports & adapters) et du **Domain-Driven Design**.

Ce projet sert à la fois de backend de production pour le portfolio, et de terrain d'apprentissage/démonstration de compétences en architecture logicielle backend.

## Stack technique

- **Framework** : NestJS 11 (TypeScript, ESM natif)
- **ORM** : Prisma 7, avec driver adapter (`@prisma/adapter-pg`)
- **Base de données** : PostgreSQL
- **Authentification** : JWT (implémentation maison, sans Passport)
- **Validation** : class-validator / class-transformer
- **Stockage média** : Cloudinary (upload d'images pour les projets/articles)
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
    media/               → upload d'images vers Cloudinary (module technique, sans couche domaine — volontairement simple)
  shared/
    domain/              → value objects et erreurs réutilisés (Slug, Periode, Lien, Telephone)
    infrastructure/      → PrismaService, gestion d'erreurs Prisma génériques, CloudinaryService
  app.module.ts
```

**Principe directeur** : le domaine ne dépend jamais de l'infrastructure. Chaque agrégat définit ses interfaces de repository (les *ports*) ; les implémentations Prisma (les *adapters*) vivent en périphérie et implémentent ces interfaces.

**Read models** : certaines routes de liste (`GET /projets`, `GET /experiences`, `GET /articles/publies`) ont besoin de données enrichies (relations, tags attachés) sans pour autant exposer l'entité domaine imbriquée. Ces routes s'appuient sur des `*ReadRepository` dédiés (`ProjetReadRepository`, `ExperienceReadRepository`, `ArticleReadRepository`), distincts des repositories du domaine, qui retournent un read model brut construit en au maximum deux requêtes SQL (une pour l'agrégat + ses relations directes via `include`, une seconde groupée pour les tags via `taggableId IN (...)`) — jamais une requête par élément de la liste.

### Agrégats du domaine

| Agrégat | Description |
|---|---|
| **Experience** | Expériences professionnelles (freelance, CDI, consultant) |
| **Projet** | Projets techniques, rattachés à une expérience ou autonomes. Peut être mis en avant (`enAvant`) avec un `ordreAffichage` et un `resume` — le `resume` est obligatoire dès que `enAvant` vaut `true` |
| **Article** | Articles de blog, avec cycle de vie (brouillon → publié → inactif) |
| **Categorie** | Catégories du blog |
| **Profil** | Profil public (singleton), avec un indicateur `disponible` (disponibilité pour une mission) |
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
CORS_ORIGIN="http://localhost:3001"   # liste séparée par des virgules, voir ci-dessous
PORT=3000                             # optionnel, défaut 3000
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

⚠️ Le driver adapter (`@prisma/adapter-pg`) utilisé par ce projet nécessite une URL Postgres **directe** — jamais le protocole proxy `prisma+postgres://`.

### CORS

`CORS_ORIGIN` accepte **plusieurs origines séparées par des virgules**. Les espaces
superflus, la casse et une barre oblique finale sont ignorés, donc
`https://lucbogra.com/` et `https://lucbogra.com` sont équivalents.

Le caractère `*` est accepté dans une origine et remplace **un seul segment de
domaine** (sans point). C'est ce qui permet de couvrir les URL de préversion
Vercel, dont le hachage change à chaque déploiement :

```env
CORS_ORIGIN="https://lucbogra.com,https://www.lucbogra.com,https://portfolio-next-*-lucbogra.vercel.app"
```

Si `CORS_ORIGIN` est absente ou vide :

- hors production, repli sur `http://localhost:3001` et `http://127.0.0.1:3001`, avec un avertissement au démarrage ;
- en production, **aucune** origine inter-domaine n'est autorisée, avec un avertissement au démarrage.

Au démarrage, l'API journalise la liste des origines effectivement autorisées
sous le contexte `Cors`.

Les jetons sont transmis par l'en-tête `Authorization: Bearer`, pas par cookie :
`credentials` est donc désactivé côté CORS.

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

Un seul compte administrateur (pas de gestion multi-utilisateurs). Les routes d'écriture (`POST`/`PUT`/`DELETE`) nécessitent systématiquement un token JWT. La plupart des routes de lecture (`GET`) sont publiques, à l'exception de `GET /articles/:slug` (lookup admin d'un article par slug quel que soit son statut, y compris brouillon) qui exige un token — voir le tableau des endpoints pour le détail exact par route.

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
| Experiences | `GET /experiences` (liste enrichie avec tags), `GET /experiences/:slug`, `POST/PUT/DELETE /experiences/:id` (protégées) |
| Projets | `GET /projets` (liste enrichie : expérience `{id,titre}` + tags), `GET /projets/selection` (projets mis en avant), `GET /projets/autonomes`, `GET /projets/experience/:id`, `GET /projets/:slug`, `POST/PUT/DELETE` (protégées) |
| Articles | `GET /articles` (tous statuts, **non protégée** — voir note ci-dessous), `GET /articles/publies`, `GET /articles/publies/:slug`, `GET /articles/:slug` (protégée), `GET /articles/categorie/:id`, `PUT /articles/statut/:id` (protégée), `POST/PUT/DELETE` (protégées) |
| Catégories | `GET /categories`, `GET /categories/:slug`, `POST/PUT/DELETE` (protégées) |
| Profil | `GET /profil`, `PUT /profil` (upsert, protégée) |
| Tags | `GET /tags`, `GET /tags/:id`, `POST/PUT/DELETE` (protégées) |
| Tagging | `POST/DELETE /{experiences\|projets\|articles}/:id/tags` (protégées), `GET /{...}/:id/tags` |
| Upload | `POST /uploads/image` (protégée, multipart, 5 Mo max) — upload vers Cloudinary, retourne `{ url }` |

> ⚠️ `GET /articles` (liste complète, tous statuts confondus, brouillon inclus) n'est protégée par aucun guard aujourd'hui — à traiter comme un point d'attention plutôt qu'un choix documenté.

## Tests

### Tests unitaires (domaine)

```bash
npm test
```

Variantes disponibles : `npm run test:watch` (mode watch), `npm run test:cov` (couverture), `npm run test:debug` (avec debugger Node).

### Tests end-to-end

Nécessite une base de données de test dédiée, isolée de la base de développement :

```bash
npx prisma dev --name test
```

Renseigne `.env.test` avec l'URL de cette instance (`DATABASE_URL`, `SHADOW_DATABASE_URL`), ainsi que :
```env
ADMIN_USERNAME="..."
ADMIN_PASSWORD_HASH="..."
ADMIN_PASSWORD_PLAIN="..."   # mot de passe en clair, lu uniquement par les tests e2e pour se logger — jamais par le code applicatif
JWT_SECRET="..."
CLOUDINARY_CLOUD_NAME="..."  # peut être une valeur factice : les tests n'appellent jamais réellement Cloudinary
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
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
- **Read models plafonnés à deux requêtes** : les routes de liste enrichies (`GET /projets`, `GET /experiences`, `GET /articles/publies`) passent par un `*ReadRepository` séparé du repository du domaine, jamais par l'entité — une requête pour l'agrégat + sa relation directe, une seconde groupée (`IN (...)`) pour les tags, jamais de N+1.