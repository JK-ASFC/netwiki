---
title: "scgi_cache"
description: "Directive nginx scgi_cache (ngx_http_scgi_module) — Définit une zone de mémoire partagée utilisée pour le cache. La même zone peut servir à plusieurs endroits. La valeur du paramètre peut contenir des variables (1.7.9). Le paramètre off désactive le…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_cache zone \| off;` |
| **Valeur par défaut** | `scgi_cache off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit une zone de mémoire partagée utilisée pour le cache. La même zone peut servir à plusieurs endroits. La valeur du paramètre peut contenir des variables (1.7.9). Le paramètre `off` désactive le cache hérité du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
