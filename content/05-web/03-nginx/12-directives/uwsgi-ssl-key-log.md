---
title: "uwsgi_ssl_key_log"
description: "Directive nginx uwsgi_ssl_key_log (ngx_http_uwsgi_module) — Enables logging of secured uwsgi server connection SSL keys and specifies the path to the key log file. Keys are logged in the SSLKEYLOGFILE format compatible with Wireshark. NOTE This directive is…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_key_log path;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Enables logging of secured uwsgi server connection SSL keys and specifies the path to the key log file. Keys are logged in the [SSLKEYLOGFILE](https://datatracker.ietf.org/doc/html/rfc9850) format compatible with Wireshark.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
