---
title: Commerce headless et frameworks de boutique
description: Plateformes e-commerce pour développeurs — Saleor (BSD, Python/GraphQL : saleor-platform Docker Compose, populatedb, tableau de bord), Medusa 2 (MIT, Node.js : create-medusa-app, administration /app, port 9000), Vendure 3 (GPL v3 ou commerciale, TypeScript/GraphQL : npx @vendure/create), Sylius 2 (MIT, Symfony : sylius-standard, sylius:install), Shopware 6 Community (MIT, Symfony : composer create-project shopware/production, system:install), Bagisto (MIT, Laravel : webkul/bagisto, bagisto:install), Spree et Solidus (BSD, Ruby on Rails : create-spree-app, solidus:install) et Reaction Commerce (archivé), choix et exploitation.
tags: [saleor, medusa, vendure, sylius, shopware, bagisto, spree, solidus, headless, e-commerce]
icon: store
---

Ces plateformes s'adressent aux équipes de **développement** : la boutique (vitrine) est une application séparée qui consomme l'**API** (GraphQL ou REST), ou un thème du cadriciel est personnalisé. Pour une boutique prête à l'emploi : [[01-prestashop-woocommerce-opencart-magento|PrestaShop, WooCommerce]].

| Plateforme | Licence | Socle | API | Cible |
| --- | --- | --- | --- | --- |
| **Saleor** | BSD-3 | Python/Django | GraphQL | Grands catalogues, multi-canal |
| **Medusa 2** | MIT | Node.js/TypeScript | REST | Commerce composable, modules |
| **Vendure 3** | GPL v3 ou licence commerciale | TypeScript/NestJS | GraphQL | B2B, extensions TypeScript |
| **Sylius 2** | MIT | PHP/Symfony | REST (API Platform) | Projets sur mesure, B2B |
| **Shopware 6** (Community) | MIT | PHP/Symfony | REST (Store et Admin API) | Boutiques européennes, très présent en Allemagne |
| **Bagisto** | MIT | PHP/Laravel | REST, GraphQL | Marketplaces, PME |
| **Spree 5** / **Solidus** | BSD-3 | Ruby on Rails | REST | Équipes Rails |
| Reaction Commerce | GPL | Node.js | GraphQL | **Archivé** : ne plus déployer |

Toutes demandent une base (PostgreSQL ou MySQL), souvent Redis, un moteur de recherche selon la taille, un stockage d'objets pour les médias et un prestataire de paiement.

## Saleor

```bash
git clone https://github.com/saleor/saleor-platform.git && cd saleor-platform
docker compose run --rm api python3 manage.py migrate
docker compose run --rm api python3 manage.py populatedb --createsuperuser    # données d'exemple ; compte admin@example.com / admin (à changer)
docker compose up -d
```

API GraphQL : `http://localhost:8000/graphql/` ; **tableau de bord** : `http://localhost:9000/`. `saleor-platform` sert au développement local ; en production, déployer les images `saleor` et `saleor-dashboard` avec PostgreSQL, Redis, Celery et un stockage S3, derrière un reverse proxy TLS.

## Medusa 2

```bash
npx create-medusa-app@latest boutique-medusa          # crée le serveur, la base PostgreSQL, et propose une vitrine Next.js
cd boutique-medusa && npx medusa user -e boutique@corp.exemple.fr -p 'MdpAdmin2026!'
npm run build && npm run start                         # serveur sur le port 9000, administration sur /app
```

Variables clés (`.env`) : `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`.

## Vendure 3

```bash
npx @vendure/create boutique-vendure                   # questions : base de données, données d'exemple, compte super-administrateur
cd boutique-vendure && npm run dev
```

Serveur et API GraphQL (`/shop-api`, `/admin-api`) et tableau de bord d'administration ; extensions en TypeScript (*plugins*). Vérifier la licence (GPL v3 ou licence commerciale) selon l'usage.

## Sylius 2

```bash
composer create-project sylius/sylius-standard boutique-sylius && cd boutique-sylius
# DATABASE_URL dans .env.local, puis :
yarn install && yarn build
php bin/console sylius:install                        # schéma, données d'exemple facultatives, administrateur
```

Administration : `/admin`. Production : PHP-FPM + NGINX, `APP_ENV=prod`, Messenger pour les tâches asynchrones.

## Shopware 6 (Community)

```bash
composer create-project shopware/production boutique-shopware && cd boutique-shopware
# DATABASE_URL et APP_URL dans .env.local, puis :
bin/console system:install --basic-setup --create-database
```

Administration : `/admin` (compte `admin`, mot de passe `shopware` avec `--basic-setup` : à changer). Le dépôt `shopware/docker` fournit une image de base (PHP, Caddy ou NGINX) pour construire l'image de production du projet.

## Bagisto

```bash
docker run -d --name bagisto -p 127.0.0.1:8080:80 webkul/bagisto:latest      # base intégrée ; DB_HOST pour une base externe
# ou : composer create-project bagisto/bagisto boutique-bagisto && cd boutique-bagisto && php artisan bagisto:install
```

Administration : `/admin`. Marketplace multi-vendeurs, PWA et applications mobiles en extensions.

## Spree et Solidus

```bash
npx create-spree-app@latest boutique-spree             # Spree 5 : application Rails + vitrine
rails new boutique-solidus && cd boutique-solidus && bundle add solidus && bin/rails g solidus:install
bin/rails s
```

Solidus est un dérivé de Spree, plus conservateur, apprécié pour les boutiques à fort volume. Déploiement classique Rails (Puma, PostgreSQL, Redis, Sidekiq).

## Reaction Commerce (archivé)

Le projet (devenu *Mailchimp Open Commerce*) est **archivé** : migrer les données (catalogue, clients, commandes) vers une plateforme maintenue (Medusa, Vendure, Saleor) à l'aide d'exports GraphQL ou de la base MongoDB.

Commandes : [[90-aide-memoire|aide-mémoire]].
