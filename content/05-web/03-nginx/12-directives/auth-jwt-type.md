---
title: "auth_jwt_type"
description: "Directive nginx auth_jwt_type (ngx_http_auth_jwt_module) — Indique le type de JSON Web Token attendu : JWS (signed), JWE (encrypted) ou JWT imbriqué signé puis chiffré (nested) (1.21.0)."
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_type signed \| encrypted \| nested;` |
| **Valeur par défaut** | `auth_jwt_type signed;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.19.7 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Indique le type de JSON Web Token attendu : JWS (`signed`), JWE (`encrypted`) ou JWT imbriqué signé puis chiffré (`nested`) (1.21.0).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
