---
title: "config_url"
description: "Directive nginx config_url (ngx_http_oidc_module) — Définit une URL personnalisée pour récupérer les métadonnées du fournisseur OpenID."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `config_url URL;` |
| **Valeur par défaut** | `config_url <issuer>/.well-known/openid-configuration;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit une URL personnalisée pour récupérer les métadonnées du fournisseur OpenID.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
