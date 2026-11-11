---
title: Supabase, Appwrite, PocketBase et Parse Server
description: Backends en tant que service (BaaS) auto-hébergés — rôle (base, authentification, stockage de fichiers, temps réel, fonctions, le tout par API), Supabase self-hosted (PostgreSQL, Auth, Storage, Realtime, API PostgREST, Studio, Edge Functions), Appwrite (API REST/GraphQL/Realtime, auth, bases, stockage, fonctions, conteneurs), PocketBase (un seul binaire Go + SQLite, admin web, idéal petits projets) et Parse Server (Node.js + MongoDB, héritier de Parse) ; choix et sécurité.
tags: [baas, supabase, appwrite, pocketbase, parse server, backend, api, auth, temps réel]
icon: database
---

Un **BaaS** (*Backend as a Service*) fournit en un seul produit ce dont une application web ou mobile a besoin côté serveur : **base de données**, **authentification** des utilisateurs, **stockage de fichiers**, **temps réel**, **fonctions**, exposés par des **API** prêtes à l'emploi. Auto-hébergé, il évite de dépendre de Firebase ou d'un service en ligne.

## Supabase (self-hosted)

**Supabase** est le BaaS libre le plus complet, bâti sur **PostgreSQL** : la base est une vraie base SQL, exposée en API REST par **PostgREST** et en temps réel, avec **Auth** (JWT, OAuth), **Storage**, **Edge Functions** et un **Studio** d'administration.

```bash
git clone --depth 1 https://github.com/supabase/supabase && cd supabase/docker
cp .env.example .env            # CHANGER : POSTGRES_PASSWORD, JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, mots de passe Studio
docker compose up -d
# Studio : http://serveur:8000 (derrière Kong) — protéger l'accès
```

Atout majeur : on garde la **puissance de PostgreSQL** (requêtes, vues, fonctions, politiques **RLS** de sécurité au niveau des lignes) tout en profitant des API générées.

## Appwrite

**Appwrite** fournit des API **REST, GraphQL et Realtime** pour l'authentification, les bases (documents), le stockage, les fonctions (plusieurs langages) et la messagerie, avec une console d'administration. Déploiement par conteneurs.

```bash
docker run -it --rm \
  -v /var/run/docker.sock:/var/run/docker.sock -v /srv/appwrite:/usr/src/code/appwrite:rw \
  --entrypoint="install" appwrite/appwrite:latest
# génère un docker-compose.yml et un .env ; puis : docker compose up -d
```

## PocketBase

**PocketBase** est un BaaS en **un seul binaire Go** avec **SQLite** : base, authentification, stockage de fichiers, temps réel, règles d'accès et **interface d'administration**, le tout sans dépendances. Parfait pour un **petit projet**, un prototype ou une application à faible charge.

```bash
# binaire des versions GitHub
./pocketbase serve --http=127.0.0.1:8090
# Admin : http://127.0.0.1:8090/_/  (créer le compte au premier lancement)
```

Un seul fichier de données, sauvegarde triviale (copier le dossier `pb_data`), extensible en l'embarquant comme bibliothèque Go.

## Parse Server

**Parse Server** (Node.js + **MongoDB**, ou PostgreSQL) est l'héritier open source de la plate-forme Parse : API objets, authentification, fichiers, fonctions cloud, notifications. Toujours maintenu, utile notamment pour des applications mobiles existantes bâties sur Parse.

```bash
docker run -d --name parse -p 127.0.0.1:1337:1337 \
  -e PARSE_SERVER_APPLICATION_ID='monapp' -e PARSE_SERVER_MASTER_KEY='…' \
  -e PARSE_SERVER_DATABASE_URI='mongodb://mongo:27017/parse' \
  parseplatform/parse-server
# Tableau de bord séparé : image parseplatform/parse-dashboard
```

## Choisir

| Besoin | Outil |
| --- | --- |
| BaaS complet sur PostgreSQL, puissance SQL | Supabase |
| API variées (REST/GraphQL/Realtime), console, fonctions | Appwrite |
| Petit projet, un binaire, zéro dépendance | PocketBase |
| Application mobile Parse existante | Parse Server |
| Juste une API sur une base SQL | [[12-api-bdd/01-hasura-postgrest-postgraphile\|PostgREST, Hasura]] |

## Sécurité

> [!WARNING]
> Un BaaS expose directement la base aux clients : la sécurité repose sur les **règles d'accès** (RLS PostgreSQL pour Supabase, règles de collection Appwrite/PocketBase, ACL Parse). Les configurer **avant** d'ouvrir l'accès, ne jamais livrer au client la **clé de service** (service_role, master key), changer toutes les clés et mots de passe par défaut, activer HTTPS et sauvegarder la base **et** le stockage de fichiers.

Commandes : [[90-aide-memoire|aide-mémoire]].
