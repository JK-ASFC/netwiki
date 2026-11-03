---
title: "log_format (ngx_stream_log_module)"
description: "Directive nginx log_format (ngx_stream_log_module) — Définit le format du journal, par exemple : nginx log_format proxy '$remote_addr $time_local ' '$protocol $status $bytes_sent $bytes_received ' '$session_time \"$upstream_addr\" '…"
tags: [nginx, directive, ngx_stream_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_format name [escape=default\|json\|none] string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_log_module\|ngx_stream_log_module]] |

## Utilisation

Définit le format du journal, par exemple :

```nginx
log_format proxy '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time "$upstream_addr" '
                 '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';
```

Le paramètre `escape` (1.11.8) permet de choisir l'échappement des caractères dans les variables, `json` ou `default` ; par défaut, `default` est utilisé. Le paramètre `none` (1.13.10) désactive l'échappement.

Avec l'échappement `default`, les caractères « `"` », « `\` » et les autres caractères de valeur inférieure à 32 ou supérieure à 126 sont échappés sous la forme « `\xXX` ». Si la valeur de la variable est introuvable, un tiret (« `-` ») est journalisé.

Avec l'échappement `json`, tous les caractères interdits dans les [chaînes](https://datatracker.ietf.org/doc/html/rfc8259#section-7) JSON sont échappés : les caractères « `"` » et « `\` » deviennent « `\"` » et « `\\` », les caractères de valeur inférieure à 32 deviennent « `\n` », « `\r` », « `\t` », « `\b` », « `\f` » ou « `\u00XX` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
