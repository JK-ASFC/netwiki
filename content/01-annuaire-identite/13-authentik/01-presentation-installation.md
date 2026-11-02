---
title: Présentation, installation et configuration
description: Authentik — fournisseur d'identité (IdP) open source en Python/Go, protocoles (OIDC/OAuth2, SAML, LDAP, RADIUS, proxy d'authentification pour applications sans SSO), concepts (applications, fournisseurs, avant-postes, flux et étapes, politiques), installation Docker Compose et Kubernetes (Helm), configuration initiale, source Active Directory/LDAP, MFA (TOTP, WebAuthn), intégration d'applications (Grafana, Nextcloud, Proxmox, Traefik), sauvegarde et mises à jour.
tags: [authentik, sso, idp, oidc, saml, ldap, mfa, forward auth]
icon: info
---

**Authentik** (licence MIT pour l'édition libre ; édition Enterprise payante) est un **fournisseur d'identité** complet, plus convivial que [[05-keycloak/01-presentation-installation|Keycloak]] et plus riche qu'[[06-authelia/01-presentation-configuration|Authelia]] :

| Protocole | Usage |
| --- | --- |
| **OIDC / OAuth2** | Applications modernes (Grafana, GitLab, Nextcloud, Proxmox, Portainer, Vaultwarden…) |
| **SAML 2.0** | Applications d'entreprise, SaaS |
| **Proxy** (*forward auth*) | Protéger une application sans SSO derrière Traefik, Nginx ou Caddy |
| **LDAP** (avant-poste) | Applications anciennes qui ne parlent que LDAP |
| **RADIUS** (avant-poste) | Équipements réseau, VPN |

| Concept | Description |
| --- | --- |
| Application | Ce que voit l'utilisateur (tuile du portail) |
| Fournisseur (*provider*) | Protocole utilisé par l'application (OIDC, SAML, proxy, LDAP) |
| Avant-poste (*outpost*) | Composant déployé pour les fournisseurs proxy, LDAP et RADIUS |
| Flux (*flow*) et étapes (*stages*) | Parcours d'authentification, d'inscription, de récupération (identifiant, mot de passe, MFA, consentement) |
| Politique | Règles (groupe, réseau, expression Python) pour autoriser une application ou une étape |
| Source | Fédération entrante : Active Directory/LDAP, Google, Entra ID, autre IdP |

## Installation (Docker Compose)

```bash
mkdir -p /opt/authentik && cd /opt/authentik
wget https://goauthentik.io/docker-compose.yml
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" >> .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" >> .env
echo "AUTHENTIK_ERROR_REPORTING__ENABLED=false" >> .env
cat >> .env <<'EOF'
AUTHENTIK_EMAIL__HOST=smtp.corp.exemple.fr
AUTHENTIK_EMAIL__PORT=587
AUTHENTIK_EMAIL__USE_TLS=true
AUTHENTIK_EMAIL__FROM=authentik@corp.exemple.fr
EOF
docker compose pull && docker compose up -d
```

Configuration initiale : `https://sso.corp.exemple.fr/if/flow/initial-setup/` (compte **akadmin**). Publiez Authentik derrière un proxy inverse TLS ([[04-traefik/01-presentation-installation|Traefik]], [[05-nginx-proxy-manager/01-presentation-installation-exploitation|Nginx Proxy Manager]]). Kubernetes : chart Helm `authentik/authentik`.

## Source Active Directory

*Directory → Federation and Social login → Create → LDAP Source* : serveur `ldaps://dc01.corp.exemple.fr`, compte de liaison en lecture, base `DC=corp,DC=exemple,DC=fr`, filtres utilisateurs/groupes, synchronisation des groupes, **mot de passe vérifié contre l'AD** (*password sync* ou étape *LDAP* dans le flux).

## MFA

Étapes *Authenticator Validation* (TOTP, WebAuthn/clés FIDO2, codes statiques, Duo) dans le flux d'authentification par défaut ; politique pour l'exiger seulement hors réseau interne ou pour les administrateurs.

## Intégrer une application (OIDC)

1. *Applications → Create with Provider* : nom, slug `grafana`, fournisseur **OAuth2/OpenID**, *Redirect URI* `https://grafana.corp.exemple.fr/login/generic_oauth`.
2. Récupérer *Client ID*, *Client Secret* et l'URL de découverte `https://sso.corp.exemple.fr/application/o/grafana/.well-known/openid-configuration`.
3. Côté application (Grafana) :

```ini grafana.ini
[auth.generic_oauth]
enabled = true
name = Authentik
client_id = <client-id>
client_secret = <client-secret>
scopes = openid profile email
auth_url = https://sso.corp.exemple.fr/application/o/authorize/
token_url = https://sso.corp.exemple.fr/application/o/token/
api_url = https://sso.corp.exemple.fr/application/o/userinfo/
role_attribute_path = contains(groups[*], 'grafana-admins') && 'Admin' || 'Viewer'
```

**Proxy (forward auth) avec Traefik** : fournisseur *Proxy* en mode *Forward auth (single application)*, avant-poste intégré, puis middleware Traefik `forwardAuth` vers `http://authentik-server:9000/outpost.goauthentik.io/auth/traefik`.

## Exploitation

- Sauvegarde : base **PostgreSQL** (`docker compose exec postgresql pg_dump -U authentik authentik > authentik.sql`) et dossiers `media`, `certs`, `custom-templates`.
- Mises à jour : changer la version dans `docker-compose.yml` (versions `AAAA.M`), lire les notes de version, `docker compose pull && docker compose up -d`.
- Journaux : `docker compose logs -f server worker` ; *Events → Logs* dans l'interface (connexions, échecs, changements).

Interface : [[03-interface-graphique|interface d'administration]] · commandes : [[90-aide-memoire|aide-mémoire]].
