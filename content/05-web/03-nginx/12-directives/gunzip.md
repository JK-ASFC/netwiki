---
title: "gunzip"
description: "Directive nginx gunzip (ngx_http_gunzip_module) — Active ou désactive la décompression des réponses compressées pour les clients qui ne prennent pas en charge gzip. Si elle est activée, les directives suivantes sont également prises en compte pour…"
tags: [nginx, directive, ngx_http_gunzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gunzip on \| off;` |
| **Valeur par défaut** | `gunzip off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gunzip_module\|ngx_http_gunzip_module]] |

## Utilisation

Active ou désactive la décompression des réponses compressées pour les clients qui ne prennent pas en charge gzip. Si elle est activée, les directives suivantes sont également prises en compte pour déterminer si les clients prennent en charge gzip : [[12-directives/gzip-http-version|gzip_http_version]], [[12-directives/gzip-proxied|gzip_proxied]] et [[12-directives/gzip-disable|gzip_disable]]. Voir aussi la directive [[12-directives/gzip-vary|gzip_vary]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
