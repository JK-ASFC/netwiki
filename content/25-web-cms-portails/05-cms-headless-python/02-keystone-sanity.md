---
title: KeystoneJS et Sanity Studio
description: KeystoneJS 6 (MIT : CMS et API GraphQL en TypeScript sur Prisma, PostgreSQL, MySQL ou SQLite ; npm create keystone-app, schéma keystone.ts, Admin UI, déploiement Node.js) et Sanity Studio (MIT pour le Studio, contenu stocké dans le Content Lake hébergé de Sanity : npm create sanity, schémas, sanity dev, build, deploy, auto-hébergement du Studio seulement), cas d'usage, limites et sécurité.
tags: [keystonejs, sanity, headless, cms, graphql, typescript]
icon: key-square
---

## KeystoneJS 6

**KeystoneJS** (MIT) génère une **API GraphQL** et une interface d'administration (*Admin UI*) à partir d'un schéma écrit en TypeScript ; la base est gérée par **Prisma** (PostgreSQL, MySQL, SQLite). Il convient aux applications qui ont besoin d'un back-office sur mesure plus que d'un CMS éditorial clé en main.

```bash
npm create keystone-app@latest app-contenu
cd app-contenu
npm run dev                         # Admin UI sur http://localhost:3000, API GraphQL sur /api/graphql
npm run build && npm run start      # production
```

Le schéma (`keystone.ts`, `schema.ts`) déclare listes, champs, relations et règles d'accès (`access`) ; la base se configure par `db: { provider: 'postgresql', url: process.env.DATABASE_URL }`. Le premier lancement propose de créer l'utilisateur initial si l'authentification (`@keystone-6/auth`) est activée. Déploiement : serveur Node.js LTS (Linux, Windows, macOS) ou conteneur, migrations Prisma appliquées au démarrage ou par `keystone prisma migrate deploy`.

## Sanity Studio

**Sanity** sépare l'interface d'édition (**Sanity Studio**, application React libre sous MIT) et le **stockage du contenu** (*Content Lake*), un **service hébergé par Sanity** (offre gratuite limitée, puis payante). Le Studio peut être hébergé chez soi, mais **les données restent chez Sanity** : à prendre en compte pour la confidentialité et le RGPD. Pour un contenu entièrement auto-hébergé, choisir [[01-strapi-directus-payload|Strapi, Directus ou Payload]].

```bash
npm create sanity@latest -- --project-id <id> --dataset production     # ou sans option : création interactive du projet
cd studio
npx sanity dev                        # Studio local, http://localhost:3333
npx sanity build                      # Studio statique dans dist/ (à servir par NGINX)
npx sanity deploy                     # ou hébergement sur <nom>.sanity.studio
npx sanity dataset export production /srv/sauvegardes/sanity-$(date +%F).tar.gz
```

`<id>` est l'identifiant du projet affiché dans la console Sanity. Les schémas (`schemaTypes/`) sont du code versionné ; le contenu est interrogé par GROQ ou GraphQL. Sauvegarde : exports réguliers du jeu de données (commande ci-dessus).

Commandes : [[90-aide-memoire|aide-mémoire]].
