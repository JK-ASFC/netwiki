---
title: "read_ahead"
description: "Directive nginx read_ahead (ngx_http_core_module) — Définit la quantité de lecture anticipée par le noyau lors du travail sur un fichier. Sous Linux, l'appel système posix_fadvise(0, 0, 0, POSIX_FADV_SEQUENTIAL) est utilisé ; le paramètre size est…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `read_ahead size;` |
| **Valeur par défaut** | `read_ahead 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la quantité de lecture anticipée par le noyau lors du travail sur un fichier.

Sous Linux, l'appel système `posix_fadvise(0, 0, 0, POSIX_FADV_SEQUENTIAL)` est utilisé ; le paramètre *size* est donc ignoré.

Sous FreeBSD, l'appel système `fcntl(O_READAHEAD,` *size*`)`, disponible depuis FreeBSD 9.0-CURRENT, est utilisé. FreeBSD 7 doit être [corrigé](http://sysoev.ru/freebsd/patch.readahead.txt).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
