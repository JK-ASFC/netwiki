---
title: "send_lowat"
description: "Directive nginx send_lowat (ngx_http_core_module) — Si la directive a une valeur non nulle, nginx tente de réduire le nombre d'opérations d'envoi sur les sockets des clients, en utilisant soit l'option NOTE_LOWAT de la méthode kqueue, soit l'option de…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `send_lowat size;` |
| **Valeur par défaut** | `send_lowat 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Si la directive a une valeur non nulle, nginx tente de réduire le nombre d'opérations d'envoi sur les sockets des clients, en utilisant soit l'option `NOTE_LOWAT` de la méthode [[10-guides/01-introduction/events|kqueue]], soit l'option de socket `SO_SNDLOWAT`. Dans les deux cas, la taille (*size*) indiquée est utilisée.

Cette directive est ignorée sous Linux, Solaris et Windows.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
