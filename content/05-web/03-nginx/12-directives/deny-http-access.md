---
title: "deny (ngx_http_access_module)"
description: "Directive nginx deny (ngx_http_access_module) — Refuse l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale unix: (1.5.1), refuse l'accès pour tous les sockets de domaine UNIX. Plusieurs directives deny peuvent être indiquées au…"
tags: [nginx, directive, ngx_http_access_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `deny address \| CIDR \| unix: \| all;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_access_module\|ngx_http_access_module]] |

## Utilisation

Refuse l'accès pour le réseau ou l'adresse indiqués. Avec la valeur spéciale `unix:` (1.5.1), refuse l'accès pour tous les sockets de domaine UNIX.

Plusieurs directives `deny` peuvent être indiquées au même niveau. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `allow` ni `deny` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
