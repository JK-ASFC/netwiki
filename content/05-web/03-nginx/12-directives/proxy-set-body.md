---
title: "proxy_set_body"
description: "Directive nginx proxy_set_body (ngx_http_proxy_module) — Permet de redéfinir le corps de la requête transmis au serveur mandaté. La valeur (value) peut contenir du texte, des variables ou une combinaison des deux."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_set_body value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Permet de redéfinir le corps de la requête transmis au serveur mandaté. La valeur (*value*) peut contenir du texte, des variables ou une combinaison des deux.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
