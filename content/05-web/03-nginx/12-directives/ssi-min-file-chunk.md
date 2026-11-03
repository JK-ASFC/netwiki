---
title: "ssi_min_file_chunk"
description: "Directive nginx ssi_min_file_chunk (ngx_http_ssi_module) — Définit la taille (size) minimale des parties d'une réponse stockées sur disque à partir de laquelle il est intéressant de les envoyer avec sendfile."
tags: [nginx, directive, ngx_http_ssi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssi_min_file_chunk size;` |
| **Valeur par défaut** | `ssi_min_file_chunk 1k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_ssi_module\|ngx_http_ssi_module]] |

## Utilisation

Définit la taille (*size*) minimale des parties d'une réponse stockées sur disque à partir de laquelle il est intéressant de les envoyer avec [[12-directives/sendfile|sendfile]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
