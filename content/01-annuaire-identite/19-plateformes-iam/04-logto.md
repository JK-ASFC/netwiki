---
title: Logto
description: Logto — plateforme d'identité orientée développeurs (TypeScript, MPL 2.0) pour applications B2C et B2B : expérience de connexion personnalisable, passkeys et MFA, organisations multi-tenant, RBAC, M2M, connecteurs sociaux et SSO d'entreprise (SAML/OIDC), installation Docker Compose avec PostgreSQL, console d'administration, SDK et API de gestion.
tags: [logto, iam, ciam, oidc, b2b, sdk, passkeys]
icon: key-round
---

**Logto** (MPL 2.0 ; offre cloud payante) vise les équipes qui développent une application : SDK pour la plupart des langages et frameworks, écrans de connexion personnalisables (« Sign-in experience »), **organisations** pour le B2B (membres, rôles, SSO d'entreprise par organisation), RBAC, applications machine-à-machine, connecteurs sociaux et e-mail/SMS.

## Installation (Docker Compose)

```yaml compose.yaml
services:
  logto:
    image: svhd/logto:latest
    entrypoint: ["sh", "-c", "npm run cli db seed -- --swe && npm start"]
    environment:
      TRUST_PROXY_HEADER: "1"
      DB_URL: postgres://logto:MdpLogto@db:5432/logto
      ENDPOINT: https://login.corp.exemple.fr
      ADMIN_ENDPOINT: https://login-admin.corp.exemple.fr
    ports: ["3001:3001", "3002:3002"]      # 3001 : application et OIDC ; 3002 : console
    depends_on: [db]
  db:
    image: postgres:17
    environment: { POSTGRES_USER: logto, POSTGRES_PASSWORD: MdpLogto }
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
```

Publiez les deux ports derrière un proxy inverse TLS ; créez le compte administrateur à la première visite de la console.

## Console

*Applications* (types : web traditionnelle, SPA, native, M2M ; identifiants et URI), *API resources* (audiences, permissions), *Sign-in experience* (identifiants, inscription, marque), *Connectors* (sociaux, e-mail, SMS), *Enterprise SSO* (SAML/OIDC par domaine e-mail), *Organizations*, *Users*, *Roles*, *Audit logs*.

<!-- CAPTURE: Logto — console, expérience de connexion | _assets/logto-sign-in-experience.png -->
<!-- CAPTURE: Logto — organisations et rôles | _assets/logto-organisations.png -->

## API de gestion

```bash
# Jeton M2M avec la ressource « Logto Management API »
TOKEN=$(curl -s -u "$CLIENT_ID:$CLIENT_SECRET" -d grant_type=client_credentials -d resource=https://default.logto.app/api -d scope=all https://login.corp.exemple.fr/oidc/token | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOKEN" https://login.corp.exemple.fr/api/users | jq '.[].primaryEmail'
docker compose exec db pg_dump -U logto logto > logto-$(date +%F).sql
```
