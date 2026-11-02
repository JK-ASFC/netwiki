---
title: Zitadel
description: Zitadel — plateforme d'identité en Go (instances, organisations, projets, applications), OIDC/OAuth2 et SAML, passkeys et MFA, inscription en libre-service, actions, installation Docker Compose avec PostgreSQL, Kubernetes (Helm), premier administrateur, console d'administration, intégration d'une application OIDC, API (gRPC/REST), CLI et sauvegarde.
tags: [zitadel, iam, oidc, saml, multi-tenant, passkeys, ciam]
icon: key-round
---

**Zitadel** (AGPL 3, Zitadel AG) est une plateforme d'identité **multi-tenant** : une instance contient des **organisations** (vos clients ou services), chacune avec ses utilisateurs, sa politique de connexion et sa marque ; les **projets** regroupent les **applications** (OIDC, SAML, API) et leurs rôles. Toutes les modifications sont des événements (*event sourcing*) : audit complet.

## Installation (Docker Compose)

```yaml compose.yaml
services:
  zitadel:
    image: ghcr.io/zitadel/zitadel:latest
    command: start-from-init --masterkeyFromEnv --tlsMode external
    environment:
      ZITADEL_MASTERKEY: "UneCleMaitreDe32CaracteresExact!"
      ZITADEL_EXTERNALDOMAIN: id.corp.exemple.fr
      ZITADEL_EXTERNALPORT: 443
      ZITADEL_EXTERNALSECURE: "true"
      ZITADEL_DATABASE_POSTGRES_HOST: db
      ZITADEL_DATABASE_POSTGRES_PORT: 5432
      ZITADEL_DATABASE_POSTGRES_DATABASE: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_USERNAME: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_PASSWORD: MdpZitadel
      ZITADEL_DATABASE_POSTGRES_ADMIN_USERNAME: postgres
      ZITADEL_DATABASE_POSTGRES_ADMIN_PASSWORD: MdpPostgres
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME: admin
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD: "Chang3-Moi!-2026"
    ports: ["8080:8080"]
    depends_on: { db: { condition: service_healthy } }
  db:
    image: postgres:17
    environment: { POSTGRES_PASSWORD: MdpPostgres }
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U postgres"], interval: 10s }
volumes:
  pgdata:
```

```bash
docker compose up -d
# Publier derrière un proxy inverse TLS (HTTP/2 nécessaire pour gRPC) : https://id.corp.exemple.fr/ui/console
```

La **clé maître** (32 caractères) chiffre les secrets : conservez-la dans un coffre ([[07-vault/01-presentation-installation|Vault]]). Kubernetes : chart Helm `zitadel/zitadel`.

## Console d'administration

`https://id.corp.exemple.fr/ui/console` : organisations, utilisateurs (humains et machines), **projets → applications** (assistant OIDC : web, SPA, natif, API ; SAML), rôles et autorisations, **paramètres de connexion** (mot de passe, passkeys, MFA obligatoire, fournisseurs externes : Entra ID, Google, LDAP, OIDC/SAML), marque (logo, couleurs, domaine personnalisé), **actions** (scripts lors de la connexion), journal d'événements.

<!-- CAPTURE: Zitadel — console, liste des projets et applications | _assets/zitadel-console-projets.png -->
<!-- CAPTURE: Zitadel — paramètres de connexion (passkeys, MFA) | _assets/zitadel-parametres-connexion.png -->

## Intégrer une application

Découverte OIDC : `https://id.corp.exemple.fr/.well-known/openid-configuration` ; client créé dans un projet (type *Web*, méthode *Code + PKCE* ou *Basic*), URI de redirection, rôles ajoutés au jeton (`urn:zitadel:iam:org:project:roles`).

## API et CLI

API gRPC et REST (administration, gestion, authentification) avec compte machine et jeton personnel (PAT) ; fournisseur Terraform `zitadel/zitadel`.

```bash
curl -s -H "Authorization: Bearer $PAT" https://id.corp.exemple.fr/management/v1/users/_search -d '{}' | jq '.result[].userName'
docker compose exec db pg_dump -U postgres zitadel > zitadel-$(date +%F).sql     # sauvegarde (avec la clé maître)
```
