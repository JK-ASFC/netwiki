---
title: "hls_fragment"
description: "Directive nginx hls_fragment (ngx_http_hls_module) — Defines the default fragment length for playlist URIs requested without the “len” argument."
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_fragment time;` |
| **Valeur par défaut** | `hls_fragment 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Defines the default fragment length for playlist URIs requested without the “`len`” argument.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
