---
title: "fastcgi_next_upstream_tries"
description: "Directive nginx fastcgi_next_upstream_tries (ngx_http_fastcgi_module) — Limite le nombre de tentatives de transmission d'une requête au serveur suivant. La valeur 0 supprime cette limite."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_next_upstream_tries number;` |
| **Valeur par défaut** | `fastcgi_next_upstream_tries 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.5 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Limite le nombre de tentatives de transmission d'une requête au [[12-directives/fastcgi-next-upstream|serveur suivant]]. La valeur `0` supprime cette limite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
