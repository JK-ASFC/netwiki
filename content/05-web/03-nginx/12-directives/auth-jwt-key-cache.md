---
title: "auth_jwt_key_cache"
description: "Directive nginx auth_jwt_key_cache (ngx_http_auth_jwt_module) — Enables or disables caching of keys obtained from a file or from a subrequest, and sets caching time for them. Caching of keys obtained from variables is not supported. By default, caching of keys is…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_cache time;` |
| **Valeur par défaut** | `auth_jwt_key_cache 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Enables or disables caching of keys obtained from a [[12-directives/auth-jwt-key-file|file]] or from a [[12-directives/auth-jwt-key-request|subrequest]], and sets caching time for them. Caching of keys obtained from variables is not supported. By default, caching of keys is disabled.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
