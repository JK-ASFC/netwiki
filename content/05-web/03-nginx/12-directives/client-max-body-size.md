---
title: "client_max_body_size"
description: "Directive nginx client_max_body_size (ngx_http_core_module) — Définit la taille maximale autorisée du corps de la requête du client. Si la taille dépasse la valeur configurée, l'erreur 413 Request Entity Too Large est renvoyée au client. Attention : les…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_max_body_size size;` |
| **Valeur par défaut** | `client_max_body_size 1m;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille maximale autorisée du corps de la requête du client. Si la taille dépasse la valeur configurée, l'erreur `413 Request Entity Too Large` est renvoyée au client. Attention : les navigateurs n'affichent pas correctement cette erreur. Une taille (*size*) de 0 désactive la vérification de la taille du corps.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
