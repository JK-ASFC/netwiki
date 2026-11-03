---
title: "modern_browser"
description: "Directive nginx modern_browser (ngx_http_browser_module) — Indique la version à partir de laquelle un navigateur est considéré comme moderne. Le navigateur peut être : msie, gecko (navigateurs fondés sur Mozilla), opera, safari ou konqueror. Les versions…"
tags: [nginx, directive, ngx_http_browser_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `modern_browser browser version;` ou `modern_browser unlisted;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_browser_module\|ngx_http_browser_module]] |

## Utilisation

Indique la version à partir de laquelle un navigateur est considéré comme moderne. Le navigateur peut être : `msie`, `gecko` (navigateurs fondés sur Mozilla), `opera`, `safari` ou `konqueror`.

Les versions peuvent s'écrire sous les formes X, X.X, X.X.X ou X.X.X.X. Les valeurs maximales sont respectivement 4000, 4000.99, 4000.99.99 et 4000.99.99.99.

La valeur spéciale `unlisted` considère comme moderne un navigateur qui ne figure ni dans les directives `modern_browser` ni dans [[12-directives/ancient-browser|ancient_browser]] ; sinon, un tel navigateur est considéré comme ancien. Si la requête ne contient pas de champ `User-Agent`, le navigateur est traité comme non listé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
