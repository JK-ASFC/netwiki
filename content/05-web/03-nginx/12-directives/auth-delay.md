---
title: "auth_delay"
description: "Directive nginx auth_delay (ngx_http_core_module) — Delays processing of unauthorized requests with 401 response code to prevent timing attacks when access is limited by password, by the result of subrequest, or by JWT."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_delay time;` |
| **Valeur par défaut** | `auth_delay 0s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.17.10 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Delays processing of unauthorized requests with 401 response code to prevent timing attacks when access is limited by [[11-modules/02-http/ngx_http_auth_basic_module|password]], by the [[11-modules/02-http/ngx_http_auth_request_module|result of subrequest]], or by [[11-modules/02-http/ngx_http_auth_jwt_module|JWT]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
