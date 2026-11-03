---
title: "uwsgi_ssl_ciphers"
description: "Directive nginx uwsgi_ssl_ciphers (ngx_http_uwsgi_module) — Specifies the enabled ciphers for requests to a secured uwsgi server. The ciphers are specified in the format understood by the OpenSSL library. The full list can be viewed using the “openssl…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_ciphers ciphers;` |
| **Valeur par défaut** | `uwsgi_ssl_ciphers DEFAULT;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Specifies the enabled ciphers for requests to a secured uwsgi server. The ciphers are specified in the format understood by the OpenSSL library.

The full list can be viewed using the “`openssl ciphers`” command.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
