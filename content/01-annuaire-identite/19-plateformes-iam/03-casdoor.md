---
title: Casdoor
description: Casdoor — plateforme IAM et SSO en Go (Casbin) avec interface web, protocoles OAuth2/OIDC, SAML, CAS, LDAP et RADIUS, très nombreux fournisseurs (sociaux, SMS, e-mail, stockage, paiement), organisations et applications, installation Docker (tout-en-un ou avec MySQL/PostgreSQL), configuration app.conf, intégration OIDC, autorisations Casbin et sauvegarde.
tags: [casdoor, iam, sso, oidc, saml, cas, casbin]
icon: key-round
---

**Casdoor** (Apache 2.0) est un IAM léger avec interface web intégrée, issu du projet d'autorisation **Casbin**. Il expose OAuth2/OIDC, SAML, CAS, un serveur **LDAP** et **RADIUS**, et propose des centaines de **fournisseurs** prêts à configurer (Google, GitHub, Microsoft, WeChat, SMS, e-mail, stockage S3, captcha, paiement).

## Installation

```bash
# Démonstration tout-en-un (base intégrée)
docker run -d --name casdoor -p 8000:8000 casbin/casdoor-all-in-one
# Production : base externe
docker run -d --name casdoor -p 8000:8000 -v /opt/casdoor/conf:/conf casbin/casdoor:latest
```

```ini /opt/casdoor/conf/app.conf (extrait)
appname = casdoor
httpport = 8000
runmode = prod
driverName = postgres
dataSourceName = "user=casdoor password=MdpCasdoor host=db port=5432 sslmode=disable dbname=casdoor"
dbName = casdoor
origin = https://auth.corp.exemple.fr
```

Interface : `https://auth.corp.exemple.fr` — compte initial **admin / 123** à changer immédiatement.

## Concepts et interface

| Élément | Rôle |
| --- | --- |
| Organisation | Ensemble d'utilisateurs (politique de mot de passe, MFA, thème) |
| Application | Client OIDC/SAML/CAS : URI de redirection, fournisseurs proposés à la connexion, inscription |
| Fournisseur | Connexion sociale, SMS, e-mail, stockage, captcha |
| Rôles, permissions | Autorisations (modèles Casbin : RBAC, ABAC) |
| Synchroniseur | Import depuis une base ou un annuaire |

<!-- CAPTURE: Casdoor — liste des applications | _assets/casdoor-applications.png -->
<!-- CAPTURE: Casdoor — édition d'une application (redirections, fournisseurs) | _assets/casdoor-application-edition.png -->

Découverte OIDC : `https://auth.corp.exemple.fr/.well-known/openid-configuration` ; serveur LDAP intégré (port 389) pour les applications qui ne parlent que LDAP.

```bash
docker logs -f casdoor
pg_dump -h db -U casdoor casdoor > casdoor-$(date +%F).sql
```
