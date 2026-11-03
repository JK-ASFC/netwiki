---
title: "auth_request_set"
description: "Directive nginx auth_request_set (ngx_http_auth_request_module) — Sets the request variable to the given value after the authorization request completes. The value may contain variables from the authorization request, such as $upstream_http_."
tags: [nginx, directive, ngx_http_auth_request_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_request_set $variable value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_auth_request_module\|ngx_http_auth_request_module]] |

## Utilisation

Sets the request *variable* to the given *value* after the authorization request completes. The value may contain variables from the authorization request, such as `$upstream_http_*`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
