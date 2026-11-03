---
title: "sendfile_max_chunk"
description: "Directive nginx sendfile_max_chunk (ngx_http_core_module) — Limite la quantité de données transférables en un seul appel sendfile. Sans limite, une connexion rapide peut accaparer entièrement le processus de travail. NOTE Avant la version 1.21.4, il n'y avait…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sendfile_max_chunk size;` |
| **Valeur par défaut** | `sendfile_max_chunk 2m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limite la quantité de données transférables en un seul appel `sendfile`. Sans limite, une connexion rapide peut accaparer entièrement le processus de travail.

> [!NOTE]
> Avant la version 1.21.4, il n'y avait pas de limite par défaut.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
