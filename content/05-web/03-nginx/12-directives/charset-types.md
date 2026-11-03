---
title: "charset_types"
description: "Directive nginx charset_types (ngx_http_charset_module) — Active le traitement par le module des réponses des types MIME indiqués, en plus de « text/html ». La valeur spéciale « » correspond à tous les types MIME (0.8.29). NOTE Jusqu'à la version 1.5.4, «…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `charset_types mime-type ...;` |
| **Valeur par défaut** | `charset_types text/html text/xml text/plain text/vnd.wap.wml application/javascript application/rss+xml;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.9 |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Active le traitement par le module des réponses des types MIME indiqués, en plus de « `text/html` ». La valeur spéciale « `*` » correspond à tous les types MIME (0.8.29).

> [!NOTE]
> Jusqu'à la version 1.5.4, « `application/x-javascript` » était le type MIME par défaut au lieu de « `application/javascript` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
