---
title: "userid"
description: "Directive nginx userid (ngx_http_userid_module) — Active ou désactive la définition des cookies et la journalisation des cookies reçus : - on active la définition des cookies de version 2 et la journalisation des cookies reçus ; - v1 active la…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid on \| v1 \| log \| off;` |
| **Valeur par défaut** | `userid off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Active ou désactive la définition des cookies et la journalisation des cookies reçus :

- **`on`**

  active la définition des cookies de version 2 et la journalisation des cookies reçus ;

- **`v1`**

  active la définition des cookies de version 1 et la journalisation des cookies reçus ;

- **`log`**

  désactive la définition des cookies, mais active la journalisation des cookies reçus ;

- **`off`**

  désactive la définition des cookies et la journalisation des cookies reçus.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
