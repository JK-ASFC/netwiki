---
title: "client_header_timeout"
description: "Directive nginx client_header_timeout (ngx_http_core_module) — Définit le délai de lecture de l'en-tête de la requête du client. Si le client n'envoie pas tout l'en-tête pendant ce délai, la requête se termine par l'erreur 408 Request Time-out."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_header_timeout time;` |
| **Valeur par défaut** | `client_header_timeout 60s;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le délai de lecture de l'en-tête de la requête du client. Si le client n'envoie pas tout l'en-tête pendant ce délai, la requête se termine par l'erreur `408 Request Time-out`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
