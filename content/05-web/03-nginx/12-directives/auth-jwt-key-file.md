---
title: "auth_jwt_key_file"
description: "Directive nginx auth_jwt_key_file (ngx_http_auth_jwt_module) — Specifies a file in JSON Web Key Set format for validating JWT signature. Parameter value can contain variables. Several auth_jwt_key_file directives can be specified on the same level (1.21.1):…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Specifies a *file* in [JSON Web Key Set](https://datatracker.ietf.org/doc/html/rfc7517#section-5) format for validating JWT signature. Parameter value can contain variables.

Several `auth_jwt_key_file` directives can be specified on the same level (1.21.1):

```nginx
auth_jwt_key_file conf/keys.json;
auth_jwt_key_file conf/key.jwk;
```

If at least one of the specified keys cannot be loaded or processed, nginx will return the `500 Internal Server Error` error.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
