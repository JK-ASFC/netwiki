---
title: "xml_external_entities"
description: "Directive nginx xml_external_entities (ngx_http_xslt_module) — Active ou désactive le chargement des entités externes déclarées dans le sous-ensemble DTD interne du XML traité. Seul le chargement d'entités externes à partir de fichiers est pris en charge. NOTE…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xml_external_entities on \| off;` |
| **Valeur par défaut** | `xml_external_entities off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Active ou désactive le chargement des entités externes déclarées dans le sous-ensemble DTD interne du XML traité. Seul le chargement d'entités externes à partir de fichiers est pris en charge.

> [!NOTE]
> Pour empêcher la lecture de fichiers locaux quelconques accessibles au processus de travail, il est recommandé de n'activer les entités externes que si le XML traité est de confiance.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
