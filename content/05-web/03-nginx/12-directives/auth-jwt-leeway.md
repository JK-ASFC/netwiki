---
title: "auth_jwt_leeway"
description: "Directive nginx auth_jwt_leeway (ngx_http_auth_jwt_module) — Définit la tolérance maximale admise pour compenser le décalage d'horloge lors de la vérification des revendications JWT exp et nbf."
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_leeway time;` |
| **Valeur par défaut** | `auth_jwt_leeway 0s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.10 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Définit la tolérance maximale admise pour compenser le décalage d'horloge lors de la vérification des revendications JWT [exp](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.4) et [nbf](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.5).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
