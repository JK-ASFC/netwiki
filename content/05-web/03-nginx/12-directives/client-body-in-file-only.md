---
title: "client_body_in_file_only"
description: "Directive nginx client_body_in_file_only (ngx_http_core_module) — Determines whether nginx should save the entire client request body into a file. This directive can be used during debugging, or when using the $request_body_file variable, or the…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_in_file_only on \| clean \| off;` |
| **Valeur par défaut** | `client_body_in_file_only off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Determines whether nginx should save the entire client request body into a file. This directive can be used during debugging, or when using the `$request_body_file` variable, or the [[11-modules/02-http/ngx_http_perl_module|$r->request_body_file]] method of the module [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]].

When set to the value `on`, temporary files are not removed after request processing.

The value `clean` will cause the temporary files left after request processing to be removed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
