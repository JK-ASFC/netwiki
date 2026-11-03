---
title: "xslt_last_modified"
description: "Directive nginx xslt_last_modified (ngx_http_xslt_module) — Permet de conserver le champ d'en-tête Last-Modified de la réponse d'origine pendant les transformations XSLT, pour faciliter la mise en cache. Par défaut, ce champ est supprimé, car le contenu de la…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_last_modified on \| off;` |
| **Valeur par défaut** | `xslt_last_modified off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Permet de conserver le champ d'en-tête `Last-Modified` de la réponse d'origine pendant les transformations XSLT, pour faciliter la mise en cache.

Par défaut, ce champ est supprimé, car le contenu de la réponse est modifié pendant les transformations et peut contenir des éléments générés dynamiquement ou des parties qui changent indépendamment de la réponse d'origine.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
