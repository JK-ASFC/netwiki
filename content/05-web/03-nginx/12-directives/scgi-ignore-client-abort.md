---
title: "scgi_ignore_client_abort"
description: "Directive nginx scgi_ignore_client_abort (ngx_http_scgi_module) — Indique si la connexion avec un serveur SCGI doit être fermée lorsque le client ferme la connexion sans attendre la réponse."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_ignore_client_abort on \| off;` |
| **Valeur par défaut** | `scgi_ignore_client_abort off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Indique si la connexion avec un serveur SCGI doit être fermée lorsque le client ferme la connexion sans attendre la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
