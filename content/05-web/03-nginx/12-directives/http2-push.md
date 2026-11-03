---
title: "http2_push"
description: "Directive nginx http2_push (ngx_http_v2_module) — NOTE This directive is obsolete since version 1.25.1. The early_hints directive can be used instead. Pre-emptively sends (pushes) a request to the specified uri along with the response to the…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_push uri \| off;` |
| **Valeur par défaut** | `http2_push off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.25.1. The [[12-directives/early-hints|early_hints]] directive can be used instead.

Pre-emptively sends ([pushes](https://datatracker.ietf.org/doc/html/rfc9113#section-8.4)) a request to the specified *uri* along with the response to the original request. Only relative URIs with absolute path will be processed, for example:

```nginx
http2_push /static/css/main.css;
```

The *uri* value can contain variables.

Several `http2_push` directives can be specified on the same configuration level. The `off` parameter cancels the effect of the `http2_push` directives inherited from the previous configuration level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
