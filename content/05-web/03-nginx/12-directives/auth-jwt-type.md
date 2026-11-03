---
title: "auth_jwt_type"
description: "Directive nginx auth_jwt_type (ngx_http_auth_jwt_module) — Specifies which type of JSON Web Token to expect: JWS (signed), JWE (encrypted), or signed and then encrypted Nested JWT (nested) (1.21.0)."
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_type signed \| encrypted \| nested;` |
| **Valeur par défaut** | `auth_jwt_type signed;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.19.7 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Specifies which type of JSON Web Token to expect: JWS (`signed`), JWE (`encrypted`), or signed and then encrypted Nested JWT (`nested`) (1.21.0).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
