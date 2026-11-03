---
title: "proxy_send_lowat"
description: "Directive nginx proxy_send_lowat (ngx_http_proxy_module) — Si la directive a une valeur non nulle, nginx tente de réduire le nombre d'opérations d'envoi sur les connexions sortantes vers un serveur mandaté, en utilisant soit l'option NOTE_LOWAT de la méthode…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_send_lowat size;` |
| **Valeur par défaut** | `proxy_send_lowat 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Si la directive a une valeur non nulle, nginx tente de réduire le nombre d'opérations d'envoi sur les connexions sortantes vers un serveur mandaté, en utilisant soit l'option `NOTE_LOWAT` de la méthode [[10-guides/01-introduction/events|kqueue]], soit l'option de socket `SO_SNDLOWAT`, avec la taille (*size*) indiquée.

Cette directive est ignorée sous Linux, Solaris et Windows.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
