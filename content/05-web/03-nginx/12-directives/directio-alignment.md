---
title: "directio_alignment"
description: "Directive nginx directio_alignment (ngx_http_core_module) — Sets the alignment for directio. In most cases, a 512-byte alignment is enough. However, when using XFS under Linux, it needs to be increased to 4K."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `directio_alignment size;` |
| **Valeur par défaut** | `directio_alignment 512;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.11 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the alignment for [[12-directives/directio|directio]]. In most cases, a 512-byte alignment is enough. However, when using XFS under Linux, it needs to be increased to 4K.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
