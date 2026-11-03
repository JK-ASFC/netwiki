---
title: "keyval (ngx_stream_keyval_module)"
description: "Directive nginx keyval (ngx_stream_keyval_module) — Crée une nouvelle variable $variable dont la valeur est recherchée par la clé (key) dans la base clé-valeur. Les règles de correspondance sont définies par le paramètre type de la directive…"
tags: [nginx, directive, ngx_stream_keyval_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keyval key $variable zone=name;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_keyval_module\|ngx_stream_keyval_module]] |

## Utilisation

Crée une nouvelle variable *$variable* dont la valeur est recherchée par la clé (*key*) dans la base clé-valeur. Les règles de correspondance sont définies par le paramètre `type` de la directive [[12-directives/keyval-zone-stream-keyval|keyval_zone]]. La base est stockée dans la zone de mémoire partagée indiquée par le paramètre `zone`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
