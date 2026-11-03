---
title: "xml_entities"
description: "Directive nginx xml_entities (ngx_http_xslt_module) — Indique le fichier DTD qui déclare les entités de caractères. Ce fichier est compilé lors de la configuration. Pour des raisons techniques, le module ne peut pas utiliser le sous-ensemble externe…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xml_entities path;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Indique le fichier DTD qui déclare les entités de caractères. Ce fichier est compilé lors de la configuration. Pour des raisons techniques, le module ne peut pas utiliser le sous-ensemble externe déclaré dans le XML traité : il est ignoré et un fichier défini spécialement est utilisé à la place. Ce fichier ne doit pas décrire la structure XML ; il suffit d'y déclarer les entités de caractères nécessaires, par exemple :

```nginx
<!ENTITY nbsp "&#xa0;">
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
