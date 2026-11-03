---
title: "proxy_upload_rate"
description: "Directive nginx proxy_upload_rate (ngx_stream_proxy_module) — Limits the speed of reading the data from the client. The rate is specified in bytes per second. The zero value disables rate limiting. The limit is set per a connection, so if the client…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_upload_rate rate;` |
| **Valeur par défaut** | `proxy_upload_rate 0;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Limits the speed of reading the data from the client. The *rate* is specified in bytes per second. The zero value disables rate limiting. The limit is set per a connection, so if the client simultaneously opens two connections, the overall rate will be twice as much as the specified limit.

Parameter value can contain variables (1.17.0). It may be useful in cases where rate should be limited depending on a certain condition:

```nginx
map $slow $rate {
    1     4k;
    2     8k;
}

proxy_upload_rate $rate;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
