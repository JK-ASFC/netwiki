---
title: "scgi_ignore_client_abort"
description: "Directive nginx scgi_ignore_client_abort (ngx_http_scgi_module) — Determines whether the connection with an SCGI server should be closed when a client closes the connection without waiting for a response."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_ignore_client_abort on \| off;` |
| **Valeur par défaut** | `scgi_ignore_client_abort off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Determines whether the connection with an SCGI server should be closed when a client closes the connection without waiting for a response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
