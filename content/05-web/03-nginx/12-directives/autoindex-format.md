---
title: "autoindex_format"
description: "Directive nginx autoindex_format (ngx_http_autoindex_module) — Sets the format of a directory listing. When the JSONP format is used, the name of a callback function is set with the callback request argument. If the argument is missing or has an empty value,…"
tags: [nginx, directive, ngx_http_autoindex_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `autoindex_format html \| xml \| json \| jsonp;` |
| **Valeur par défaut** | `autoindex_format html;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.9 |
| **Module** | [[11-modules/02-http/ngx_http_autoindex_module\|ngx_http_autoindex_module]] |

## Utilisation

Sets the format of a directory listing.

When the JSONP format is used, the name of a callback function is set with the `callback` request argument. If the argument is missing or has an empty value, then the JSON format is used.

The XML output can be transformed using the [[11-modules/02-http/ngx_http_xslt_module|ngx_http_xslt_module]] module.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
