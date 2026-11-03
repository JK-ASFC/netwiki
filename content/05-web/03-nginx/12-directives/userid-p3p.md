---
title: "userid_p3p"
description: "Directive nginx userid_p3p (ngx_http_userid_module) — Définit la valeur du champ d'en-tête P3P envoyé avec le cookie. Avec la valeur spéciale none, l'en-tête P3P n'est pas envoyé."
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_p3p string \| none;` |
| **Valeur par défaut** | `userid_p3p none;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Définit la valeur du champ d'en-tête `P3P` envoyé avec le cookie. Avec la valeur spéciale `none`, l'en-tête `P3P` n'est pas envoyé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
