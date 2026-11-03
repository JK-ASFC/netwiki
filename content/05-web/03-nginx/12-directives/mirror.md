---
title: "mirror"
description: "Directive nginx mirror (ngx_http_mirror_module) — Définit l'URI vers lequel la requête d'origine est dupliquée. Plusieurs miroirs peuvent être indiqués au même niveau de configuration."
tags: [nginx, directive, ngx_http_mirror_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mirror uri \| off;` |
| **Valeur par défaut** | `mirror off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mirror_module\|ngx_http_mirror_module]] |

## Utilisation

Définit l'URI vers lequel la requête d'origine est dupliquée. Plusieurs miroirs peuvent être indiqués au même niveau de configuration.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
