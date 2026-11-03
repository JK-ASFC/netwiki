---
title: "auth_jwt_key_cache"
description: "Directive nginx auth_jwt_key_cache (ngx_http_auth_jwt_module) — Active ou désactive la mise en cache des clés obtenues depuis un fichier ou une sous-requête, et définit leur durée de mise en cache. La mise en cache des clés obtenues depuis des variables n'est pas…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_cache time;` |
| **Valeur par défaut** | `auth_jwt_key_cache 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Active ou désactive la mise en cache des clés obtenues depuis un [[12-directives/auth-jwt-key-file|fichier]] ou une [[12-directives/auth-jwt-key-request|sous-requête]], et définit leur durée de mise en cache. La mise en cache des clés obtenues depuis des variables n'est pas prise en charge. Par défaut, la mise en cache est désactivée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
