---
title: "session_sync_leeway"
description: "Directive nginx session_sync_leeway (ngx_http_oidc_module) — Sets the maximum wait time for a session to appear in the key-value zone if a request contains a session cookie but the corresponding session is not found. This allows for session synchronization…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_sync_leeway time;` |
| **Valeur par défaut** | `session_sync_leeway 0;` |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.31.6 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Sets the maximum wait time for a session to appear in the [[12-directives/session-store|key-value zone]] if a request contains a session cookie but the corresponding session is not found. This allows for session [[11-modules/03-stream/ngx_stream_zone_sync_module|synchronization]] delays between cluster nodes.

The value must be in the range from `0` to `5s`. The default value of `0` disables waiting. It is recommended to set the smallest possible value.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
