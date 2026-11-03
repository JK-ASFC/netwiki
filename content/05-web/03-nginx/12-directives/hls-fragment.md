---
title: "hls_fragment"
description: "Directive nginx hls_fragment (ngx_http_hls_module) — Définit la longueur de fragment par défaut pour les URI de liste de lecture demandés sans l'argument « len »."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_fragment time;` |
| **Valeur par défaut** | `hls_fragment 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Définit la longueur de fragment par défaut pour les URI de liste de lecture demandés sans l'argument « `len` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
