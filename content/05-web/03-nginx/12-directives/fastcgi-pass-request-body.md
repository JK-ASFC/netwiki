---
title: "fastcgi_pass_request_body"
description: "Directive nginx fastcgi_pass_request_body (ngx_http_fastcgi_module) — Indique si le corps de la requête d'origine est transmis au serveur FastCGI. Voir aussi la directive fastcgi_pass_request_headers."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass_request_body on \| off;` |
| **Valeur par défaut** | `fastcgi_pass_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Indique si le corps de la requête d'origine est transmis au serveur FastCGI. Voir aussi la directive [[12-directives/fastcgi-pass-request-headers|fastcgi_pass_request_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
