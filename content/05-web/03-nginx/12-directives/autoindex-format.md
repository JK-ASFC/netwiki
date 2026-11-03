---
title: "autoindex_format"
description: "Directive nginx autoindex_format (ngx_http_autoindex_module) — Définit le format de la liste du répertoire. Avec le format JSONP, le nom de la fonction de rappel est défini par l'argument de requête callback. Si l'argument est absent ou vide, le format JSON est…"
tags: [nginx, directive, ngx_http_autoindex_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `autoindex_format html \| xml \| json \| jsonp;` |
| **Valeur par défaut** | `autoindex_format html;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.9 |
| **Module** | [[11-modules/02-http/ngx_http_autoindex_module\|ngx_http_autoindex_module]] |

## Utilisation

Définit le format de la liste du répertoire.

Avec le format JSONP, le nom de la fonction de rappel est défini par l'argument de requête `callback`. Si l'argument est absent ou vide, le format JSON est utilisé.

La sortie XML peut être transformée avec le module [[11-modules/02-http/ngx_http_xslt_module|ngx_http_xslt_module]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
