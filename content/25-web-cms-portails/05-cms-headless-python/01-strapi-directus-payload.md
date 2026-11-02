---
title: Strapi, Directus et Payload
description: CMS headless auto-hébergés en Node.js — Strapi 5 (MIT : types de contenu, API REST et GraphQL, rôles ; npx create-strapi, port 1337, admin:create-user, export/import, Docker), Directus (BSL 1.1 gratuite sous un seuil de chiffre d'affaires : surcouche d'API et back-office sur une base SQL existante ; Docker directus/directus, SECRET, DB_*, ADMIN_EMAIL, PUBLIC_URL, port 8055) et Payload 3 (MIT : CMS en TypeScript intégré à Next.js, PostgreSQL ou MongoDB ; create-payload-app, PAYLOAD_SECRET, DATABASE_URL), choix, sécurité, sauvegarde et mise à jour.
tags: [strapi, directus, payload, headless, cms, api, nodejs, docker]
icon: server-cog
---

Un **CMS headless** gère le contenu et le publie par **API** (REST, GraphQL) ; l'affichage est confié à des applications distinctes (site Next.js, Nuxt, application mobile, affichage dynamique). Sites classiques : [[01-wordpress/01-presentation-installation|WordPress]], [[02-drupal-joomla/01-drupal|Drupal]].

| | **Strapi** | **Directus** | **Payload** |
| --- | --- | --- | --- |
| Licence | MIT (fonctions Enterprise payantes) | BSL 1.1 : gratuite pour les organisations sous un seuil de chiffre d'affaires, licence payante au-delà (vérifier les conditions) | MIT |
| Modèle | Types de contenu définis dans Strapi | **Base SQL existante** : Directus en génère l'API et le back-office | Collections définies en **code TypeScript** |
| Bases | PostgreSQL, MySQL/MariaDB, SQLite | PostgreSQL, MySQL, SQLite, SQL Server, Oracle… | PostgreSQL, MongoDB, SQLite |
| Point fort | Écosystème, back-office complet | Données existantes, automatisations (*Flows*) | Intégration à Next.js, typage |

## Strapi 5

```bash
npx create-strapi@latest site-api            # questions : base, TypeScript, exemple
cd site-api
npm run develop                              # mode développement (constructeur de types de contenu actif)
npm run build && NODE_ENV=production npm run start      # production, port 1337
npx strapi admin:create-user --firstname=JK --lastname=Admin --email=webmaster@corp.exemple.fr --password='MdpAdmin2026!'
```

Le **Content-Type Builder** ne fonctionne qu'en mode développement : modéliser en développement, versionner le dossier `src/api` dans Git, puis déployer. Variables de production (`.env`) : `HOST`, `PORT`, `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `DATABASE_CLIENT=postgres`, `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`. Administration : `https://api.corp.exemple.fr/admin` ; droits publics et authentifiés dans *Settings → Users & Permissions → Roles*, jetons d'API dans *Settings → API Tokens*. Windows, Linux et macOS (Node.js LTS) ; Docker : image à construire depuis le projet (Dockerfile Node).

```bash
npx strapi export --file /srv/sauvegardes/strapi-$(date +%F)        # contenu, fichiers, configuration (chiffrable)
npx strapi import --file /srv/sauvegardes/strapi-2026-11-02.tar.gz.enc
npx strapi admin:reset-user-password --email=webmaster@corp.exemple.fr --password='NouveauMdp2026!'
```

<!-- CAPTURE: Constructeur de types de contenu Strapi | _assets/strapi-content-type-builder.png -->

## Directus

```yaml
services:
  database:
    image: postgis/postgis:17-3.5
    environment: { POSTGRES_USER: directus, POSTGRES_PASSWORD: MdpDirectus2026, POSTGRES_DB: directus }
    volumes: ["./data/database:/var/lib/postgresql/data"]
  cache:
    image: redis:7
  directus:
    image: directus/directus:latest          # fixer une version précise en production
    ports: ["127.0.0.1:8055:8055"]
    volumes: ["./uploads:/directus/uploads", "./extensions:/directus/extensions"]
    depends_on: [database, cache]
    environment:
      SECRET: "chaine_aleatoire_longue"
      DB_CLIENT: "pg"
      DB_HOST: "database"
      DB_PORT: "5432"
      DB_DATABASE: "directus"
      DB_USER: "directus"
      DB_PASSWORD: "MdpDirectus2026"
      CACHE_ENABLED: "true"
      CACHE_STORE: "redis"
      REDIS: "redis://cache:6379"
      ADMIN_EMAIL: "webmaster@corp.exemple.fr"
      ADMIN_PASSWORD: "MdpAdmin2026!"
      PUBLIC_URL: "https://donnees.corp.exemple.fr"
```

`docker compose up -d`, puis `https://donnees.corp.exemple.fr` (Data Studio). Directus peut se brancher sur une base **existante** : les tables deviennent des collections, sans modification du schéma métier. Rôles et politiques d'accès fins, *Flows* (automatisations), stockage S3 (`STORAGE_LOCATIONS`), authentification OIDC/LDAP/SAML par variables `AUTH_*`. Sous Windows et macOS : Docker Desktop ou `npx directus init` (Node.js).

<!-- CAPTURE: Data Studio Directus, collection et éditeur d'élément | _assets/directus-data-studio.png -->

## Payload 3

```bash
npx create-payload-app@latest site-payload       # modèle (site web, blank), base PostgreSQL ou MongoDB
cd site-payload
cp .env.example .env                             # DATABASE_URL=postgresql://payload:MdpPayload2026@localhost:5432/payload, PAYLOAD_SECRET=…
npm run dev                                      # http://localhost:3000/admin : création du premier utilisateur
npm run build && npm run start
```

Payload s'exécute **dans l'application Next.js** : les collections, champs, contrôles d'accès et crochets (*hooks*) sont du code TypeScript (`src/collections/*.ts`, `payload.config.ts`) versionné dans Git. API REST et GraphQL générées, API locale côté serveur. Déploiement : serveur Node.js, conteneur ou plateforme Next.js.

## Exploitation commune

- Placer l'administration derrière HTTPS et, si possible, un accès restreint (VPN, liste d'adresses) ; publier uniquement l'API nécessaire au site.
- Jetons d'API à portée minimale (lecture seule pour le site public), rotation des secrets.
- Sauvegarde : base de données, dossier des médias (ou compartiment S3) et dépôt Git du projet ; tester la restauration.
- Mise à jour : lire les notes de version (migrations de schéma), mettre à jour en préproduction, puis en production.

Commandes : [[90-aide-memoire|aide-mémoire]].
