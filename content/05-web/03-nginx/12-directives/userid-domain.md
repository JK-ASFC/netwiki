---
title: "userid_domain"
description: "Directive nginx userid_domain (ngx_http_userid_module) — Définit le domaine pour lequel le cookie est défini. Le paramètre none désactive l'indication d'un domaine."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_domain name \| none;` |
| **Valeur par défaut** | `userid_domain none;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Définit le domaine pour lequel le cookie est défini. Le paramètre `none` désactive l'indication d'un domaine.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
