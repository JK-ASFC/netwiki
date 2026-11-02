---
title: Comparatif et choix
description: Comparatif des plateformes IAM open source — Zitadel, Casdoor, Logto, Ory (Kratos, Hydra, Keto, Oathkeeper), Gluu Flex (Janssen), OpenAM, face à Keycloak, Authentik et Authelia : protocoles, multi-tenant, MFA et passkeys, API et SDK, licence, langage, base de données, cas d'usage (SSO interne, application SaaS B2B/B2C, CIAM), critères de choix.
tags: [iam, sso, ciam, zitadel, casdoor, logto, ory, gluu, openam, comparatif]
icon: info
---

Deux familles d'usages :

- **SSO des collaborateurs** (applications internes, annuaire AD) : [[05-keycloak/01-presentation-installation|Keycloak]], [[13-authentik/01-presentation-installation|Authentik]], [[15-lemonldap-ng/01-presentation-installation|LemonLDAP::NG]], [[06-authelia/01-presentation-configuration|Authelia]].
- **Identité des clients** d'une application (CIAM, SaaS multi-locataires, inscription en libre-service, API) : Zitadel, Logto, Ory, Casdoor.

| Produit | Langage | Licence | Points forts | Base |
| --- | --- | --- | --- | --- |
| [[02-zitadel\|Zitadel]] | Go | AGPL 3 | Multi-tenant natif (organisations), audit par événements, passkeys, API complète | PostgreSQL |
| [[03-casdoor\|Casdoor]] | Go | Apache 2.0 | Très nombreux fournisseurs (OAuth, SAML, CAS, LDAP, SMS), interface simple | MySQL/PostgreSQL/SQLite |
| [[04-logto\|Logto]] | TypeScript | MPL 2.0 | Expérience développeur, SDK, organisations B2B, écrans de connexion soignés | PostgreSQL |
| [[05-ory\|Ory]] (Kratos, Hydra) | Go | Apache 2.0 | Briques sans interface (*headless*), très scalable, certifiée OpenID | PostgreSQL, MySQL, CockroachDB |
| [[06-gluu-flex-openam\|Gluu Flex / Janssen]] | Java | Apache 2.0 (Janssen) | Grandes organisations, conformité, OpenID certifié | PostgreSQL, MySQL |
| [[06-gluu-flex-openam\|OpenAM]] | Java | CDDL | Historique (Sun/ForgeRock), parc existant | Annuaire LDAP |

## Critères de choix

| Besoin | Orientation |
| --- | --- |
| SSO interne avec AD, applications existantes (SAML, OIDC, LDAP) | Keycloak ou Authentik |
| Application SaaS multi-clients (organisations, inscription, MFA, marque blanche) | **Zitadel** ou **Logto** |
| Identité intégrée à votre propre interface (pas d'écran imposé) | **Ory Kratos + Hydra** |
| Nombreux fournisseurs sociaux et SMS, petite équipe | **Casdoor** |
| Parc OpenAM/ForgeRock existant | **OpenAM** (communauté) ou migration |

Points communs à vérifier : passkeys/WebAuthn, journal d'audit, export des utilisateurs, haute disponibilité, sauvegarde de la base, conformité RGPD (hébergement en interne).
