---
title: "sub_filter_last_modified"
description: "Directive nginx sub_filter_last_modified (ngx_http_sub_module) — Permet de conserver le champ d'en-tête Last-Modified de la réponse d'origine pendant le remplacement, pour faciliter la mise en cache. Par défaut, ce champ est supprimé, car le contenu de la réponse…"
tags: [nginx, directive, ngx_http_sub_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sub_filter_last_modified on \| off;` |
| **Valeur par défaut** | `sub_filter_last_modified off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_sub_module\|ngx_http_sub_module]] |

## Utilisation

Permet de conserver le champ d'en-tête `Last-Modified` de la réponse d'origine pendant le remplacement, pour faciliter la mise en cache.

Par défaut, ce champ est supprimé, car le contenu de la réponse est modifié pendant le traitement.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
