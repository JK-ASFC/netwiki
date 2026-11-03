---
title: "xml_external_entities"
description: "Directive nginx xml_external_entities (ngx_http_xslt_module) — Enables or disables loading of external entities declared in the internal DTD subset of the processed XML. Only loading of file-based external entities is supported. NOTE To prevent reading arbitrary…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xml_external_entities on \| off;` |
| **Valeur par défaut** | `xml_external_entities off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Enables or disables loading of external entities declared in the internal DTD subset of the processed XML. Only loading of file-based external entities is supported.

> [!NOTE]
> To prevent reading arbitrary local files accessible to the worker process, it is recommended to enable external entities only when the processed XML is trusted.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
