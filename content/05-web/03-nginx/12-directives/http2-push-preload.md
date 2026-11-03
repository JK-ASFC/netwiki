---
title: "http2_push_preload"
description: "Directive nginx http2_push_preload (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.25.1. Enables automatic conversion of preload links specified in the Link response header fields into push requests."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_push_preload on \| off;` |
| **Valeur par défaut** | `http2_push_preload off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.25.1.

Enables automatic conversion of [preload links](https://www.w3.org/TR/preload/#server-push-http-2) specified in the `Link` response header fields into [push](https://datatracker.ietf.org/doc/html/rfc9113#section-8.4) requests.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
