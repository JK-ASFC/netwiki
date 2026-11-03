---
title: "ssl_verify_depth (ngx_stream_ssl_module)"
description: "Directive nginx ssl_verify_depth (ngx_stream_ssl_module) — Définit la profondeur de vérification dans la chaîne de certificats du client."
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_verify_depth number;` |
| **Valeur par défaut** | `ssl_verify_depth 1;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.11.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
