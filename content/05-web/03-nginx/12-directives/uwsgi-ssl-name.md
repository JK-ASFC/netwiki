---
title: "uwsgi_ssl_name"
description: "Directive nginx uwsgi_ssl_name (ngx_http_uwsgi_module) — Allows overriding the server name used to verify the certificate of the secured uwsgi server and to be passed through SNI when establishing a connection with the secured uwsgi server. By default, the…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_name name;` |
| **Valeur par défaut** | `uwsgi_ssl_name host from uwsgi_pass;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/uwsgi-ssl-verify|verify]] the certificate of the secured uwsgi server and to be [[12-directives/uwsgi-ssl-server-name|passed through SNI]] when establishing a connection with the secured uwsgi server.

By default, the host part from [[12-directives/uwsgi-pass|uwsgi_pass]] is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
