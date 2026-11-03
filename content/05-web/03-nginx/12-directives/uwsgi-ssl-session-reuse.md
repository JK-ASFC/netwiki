---
title: "uwsgi_ssl_session_reuse"
description: "Directive nginx uwsgi_ssl_session_reuse (ngx_http_uwsgi_module) — Determines whether SSL sessions can be reused when working with a secured uwsgi server. If the errors “digest check failed” appear in the logs, try disabling session reuse."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `uwsgi_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Determines whether SSL sessions can be reused when working with a secured uwsgi server. If the errors “`digest check failed`” appear in the logs, try disabling session reuse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
