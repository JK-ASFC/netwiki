---
title: "pkce"
description: "Directive nginx pkce (ngx_http_oidc_module) — Active ou désactive explicitement PKCE. Par défaut, PKCE est activé automatiquement selon les métadonnées du fournisseur OpenID."
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pkce on \| off;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Active ou désactive explicitement PKCE. Par défaut, PKCE est activé automatiquement selon les métadonnées du fournisseur OpenID.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
