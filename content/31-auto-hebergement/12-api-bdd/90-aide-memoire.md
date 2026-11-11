---
title: API sur base de données — aide-mémoire
description: Déploiement de Hasura, PostgREST et PostGraphile sur PostgreSQL, et exemple de rôle et politique RLS pour sécuriser l'API.
tags: [aide-mémoire, hasura, postgrest, postgraphile, graphql, rest, postgresql, rls]
icon: terminal
---

Explications : [[01-hasura-postgrest-postgraphile|Hasura, PostgREST et PostGraphile]].

| Outil | API | Port |
| --- | --- | --- |
| Hasura | GraphQL (+ REST) | 8080 |
| PostgREST | REST | 3000 |
| PostGraphile | GraphQL | 5000 |

```bash
# Hasura
docker run -d -p 8080:8080 -e HASURA_GRAPHQL_DATABASE_URL=postgres://u:…@db/app \
  -e HASURA_GRAPHQL_ADMIN_SECRET='…' -e HASURA_GRAPHQL_ENABLE_CONSOLE=true hasura/graphql-engine:latest

# PostgREST
docker run -d -p 3000:3000 -e PGRST_DB_URI="postgres://authenticator:…@db/app" \
  -e PGRST_DB_ANON_ROLE="anon" -e PGRST_JWT_SECRET="$JWT" postgrest/postgrest
curl 'http://127.0.0.1:3000/equipements?site=eq.lyon&select=id,nom'

# PostGraphile
npx postgraphile -c postgres://u:…@db/app --schema public --jwt-secret "$JWT"
```

```sql
-- Sécurité dans la base
CREATE ROLE anon NOLOGIN; GRANT SELECT ON public.t TO anon;
ALTER TABLE public.t ENABLE ROW LEVEL SECURITY;
CREATE POLICY p ON public.t FOR SELECT TO anon USING (proprietaire = current_setting('request.jwt.claims',true)::json->>'sub');
```
