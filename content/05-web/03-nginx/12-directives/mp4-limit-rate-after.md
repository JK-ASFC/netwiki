---
title: "mp4_limit_rate_after"
description: "Directive nginx mp4_limit_rate_after (ngx_http_mp4_module) — Sets the initial amount of media data (measured in playback time) after which the further transmission of the response to a client will be rate limited. NOTE This directive is available as part of…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_limit_rate_after time;` |
| **Valeur par défaut** | `mp4_limit_rate_after 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Sets the initial amount of media data (measured in playback time) after which the further transmission of the response to a client will be rate limited.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
