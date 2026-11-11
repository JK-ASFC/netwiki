---
title: Hasura, PostgREST et PostGraphile
description: Exposer une base PostgreSQL en API automatique — Hasura GraphQL Engine (API GraphQL temps réel générée depuis le schéma, permissions par rôle, actions et events, Docker, console, licence), PostgREST (API REST directe depuis le schéma, authentification par JWT et rôles PostgreSQL, très léger) et PostGraphile (API GraphQL depuis PostgreSQL, extensible par plugins) ; sécurité par le modèle de permissions de la base et choix.
tags: [hasura, postgrest, postgraphile, api, graphql, rest, postgresql, jwt, rls]
icon: database
---

Quand les données vivent déjà dans **PostgreSQL**, ces outils génèrent une **API** directement à partir du schéma — sans écrire de code serveur. La sécurité repose sur les **rôles** et les **politiques** de la base, pas sur une couche applicative à maintenir.

## Hasura GraphQL Engine

**Hasura** génère une **API GraphQL** (et REST) riche et **temps réel** (souscriptions) à partir du schéma PostgreSQL, avec un système de **permissions par rôle** (lignes et colonnes visibles selon des règles), des **relations**, des **actions** (appeler une API externe) et des **events** (déclencheurs vers des webhooks).

```bash
docker run -d --name hasura -p 127.0.0.1:8080:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://user:…@db:5432/app \
  -e HASURA_GRAPHQL_ADMIN_SECRET='…' \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_JWT_SECRET='{"type":"RS256","jwk_url":"https://sso.exemple.fr/jwks"}' \
  hasura/graphql-engine:latest
# Console : http://127.0.0.1:8080/console (protégée par l'admin secret)
```

> [!NOTE]
> Le moteur open source (CE) couvre l'essentiel ; certaines fonctions avancées relèvent des éditions **Enterprise/Cloud**. Vérifier la licence et le périmètre libre selon la version avant un usage professionnel.

## PostgREST

**PostgREST** est **minimaliste** : il expose une **API REST** qui reflète exactement le schéma (tables, vues, fonctions), très rapide et sans configuration applicative. La **sécurité est entièrement déléguée à PostgreSQL** : l'API prend l'identité d'un **rôle** (via un **JWT** qui porte le rôle), et les droits SQL (`GRANT`) et les **politiques RLS** décident de ce qui est visible.

```bash
docker run -d --name postgrest -p 127.0.0.1:3000:3000 \
  -e PGRST_DB_URI="postgres://authenticator:…@db:5432/app" \
  -e PGRST_DB_ANON_ROLE="anon" \
  -e PGRST_JWT_SECRET="$JWT_SECRET" \
  postgrest/postgrest
curl http://127.0.0.1:3000/equipements?site=eq.lyon\&select=id,nom
```

C'est l'outil le plus léger pour **publier une base en REST** proprement, en s'appuyant sur le modèle de sécurité de la base.

## PostGraphile

**PostGraphile** génère une **API GraphQL** depuis PostgreSQL, comme Hasura, mais très **extensible** par plugins (schéma personnalisé, logique additionnelle). Il suit de près les relations et contraintes du schéma et respecte les permissions/RLS de la base.

```bash
npx postgraphile -c postgres://user:…@db:5432/app --schema public \
  --jwt-secret "$JWT_SECRET" --jwt-token-identifier app.jwt_token \
  --enhance-graphiql --dynamic-json
# ou via la bibliothèque Node pour intégrer à une application Express/Fastify
```

## Sécurité : tout se joue dans la base

Le point commun — et la clé — de ces outils : **les droits sont dans PostgreSQL**.

```sql
-- Rôle utilisé par l'API et politique RLS : chaque client ne voit que ses lignes
CREATE ROLE anon NOLOGIN;
GRANT SELECT ON public.equipements TO anon;
ALTER TABLE public.equipements ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_visible ON public.equipements FOR SELECT TO anon
  USING (site = current_setting('request.jwt.claims', true)::json->>'site');
```

- Un **rôle à privilèges minimaux** par niveau d'accès, `GRANT` explicites, **RLS** activée sur les tables sensibles.
- **JWT** signés par le fournisseur d'identité ; ne jamais exposer l'**admin secret** (Hasura) ni un rôle superutilisateur.
- HTTPS, limitation de débit en façade, et **ne pas exposer la console** d'administration publiquement.

## Choisir

| Besoin | Outil |
| --- | --- |
| GraphQL riche, temps réel, permissions visuelles | Hasura |
| REST minimal et rapide, sécurité 100 % PostgreSQL | PostgREST |
| GraphQL extensible par plugins, intégré à Node | PostGraphile |
| Backend complet (auth, stockage, fonctions) | [[11-baas/01-supabase-appwrite-pocketbase\|Supabase]] (qui utilise PostgREST) |

Commandes : [[90-aide-memoire|aide-mémoire]].
