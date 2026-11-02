---
title: Interface graphique
description: Interfaces d'Authentik — portail utilisateur (bibliothèque d'applications, paramètres, MFA), interface d'administration (tableau de bord, applications et fournisseurs, avant-postes, flux et éditeur d'étapes, politiques, annuaire : utilisateurs, groupes, sources, jetons), événements et journaux, personnalisation (marque, thème), équivalents API.
tags: [authentik, interface graphique, sso, administration]
icon: app-window
---

## Portail utilisateur

`https://sso.corp.exemple.fr/if/user/` : **bibliothèque d'applications** (tuiles des applications autorisées), *Paramètres* (profil, mot de passe, appareils MFA, sessions, consentements).

<!-- CAPTURE: Authentik — bibliothèque d'applications de l'utilisateur | _assets/authentik-bibliotheque.png -->

## Interface d'administration

Bouton **Admin interface** (`/if/admin/`) :

| Menu | Contenu |
| --- | --- |
| Dashboards | Vue d'ensemble : connexions, échecs, versions, santé des avant-postes |
| **Applications** | Applications, fournisseurs, **avant-postes** (outposts), intégrations (Docker, Kubernetes) |
| **Flows and Stages** | Flux (authentification, autorisation, inscription, récupération) et éditeur d'étapes |
| Customization | Politiques, propriétés de correspondance (claims, attributs SAML/LDAP), marques |
| **Directory** | Utilisateurs, groupes, rôles, **sources** (AD/LDAP, sociales), jetons, invitations |
| Events | Journaux, règles de notification (e-mail, webhook) |
| System | Paramètres, certificats, tâches système, marques (*brands*) |

<!-- CAPTURE: Authentik — tableau de bord d'administration | _assets/authentik-admin-tableau-de-bord.png -->
<!-- CAPTURE: Authentik — assistant « Create with Provider » (OIDC) | _assets/authentik-assistant-application.png -->
<!-- CAPTURE: Authentik — flux d'authentification et ses étapes (MFA) | _assets/authentik-flux-etapes.png -->
<!-- CAPTURE: Authentik — source LDAP Active Directory | _assets/authentik-source-ldap.png -->

## Correspondance interface ↔ API

Toute l'administration est exposée par l'API REST (`/api/v3/`, schéma OpenAPI dans *System → API browser* selon la version) ; jeton dans *Directory → Tokens*.

| Action | Interface | API |
| --- | --- | --- |
| Lister les utilisateurs | Directory → Users | `GET /api/v3/core/users/` |
| Créer un groupe | Directory → Groups | `POST /api/v3/core/groups/` |
| Lister les applications | Applications | `GET /api/v3/core/applications/` |
| Événements | Events → Logs | `GET /api/v3/events/events/` |

Infrastructure as code : fournisseur Terraform `goauthentik/authentik` ou *blueprints* YAML intégrés.
