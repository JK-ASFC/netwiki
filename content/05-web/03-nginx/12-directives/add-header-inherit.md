---
title: "add_header_inherit"
description: "Directive nginx add_header_inherit (ngx_http_headers_module) — Permet de modifier les règles d'héritage des valeurs définies dans les directives add_header. Par défaut, le modèle d'héritage standard s'applique. Le paramètre merge ajoute les valeurs du niveau…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_header_inherit on \| off \| merge;` |
| **Valeur par défaut** | `add_header_inherit on;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Permet de modifier les règles d'héritage des valeurs définies dans les directives [[12-directives/add-header|add_header]]. Par défaut, le modèle d'héritage standard s'applique.

Le paramètre `merge` ajoute les valeurs du niveau précédent à celles définies au niveau courant.

Le paramètre `off` annule l'héritage des valeurs du niveau de configuration précédent.

Les règles d'héritage sont elles-mêmes héritées de façon standard. Par exemple, `add_header_inherit merge;` indiqué au niveau le plus haut est hérité récursivement par tous les niveaux imbriqués, sauf redéfinition plus bas.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
