---
title: "ssl_early_data"
description: "Directive nginx ssl_early_data (ngx_http_ssl_module) — Enables or disables TLS 1.3 early data. NOTE The directive is supported when using OpenSSL 1.1.1 or higher (1.15.4) and BoringSSL. If the directive is specified on the server level, the value from…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_early_data on \| off;` |
| **Valeur par défaut** | `ssl_early_data off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.15.3 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Enables or disables TLS 1.3 [early data](https://datatracker.ietf.org/doc/html/rfc8446#section-2.3).

> [!NOTE]
> The directive is supported when using OpenSSL 1.1.1 or higher (1.15.4) and [BoringSSL](https://boringssl.googlesource.com/boringssl/).

If the directive is specified on the [[12-directives/server-http-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

> [!NOTE]
> Requests sent within early data are subject to [replay attacks](https://datatracker.ietf.org/doc/html/rfc8470). To protect against such attacks at the application layer, the [[13-variables/ssl-early-data|$ssl_early_data]] variable should be used.

```nginx
proxy_set_header Early-Data $ssl_early_data;
```

> [!NOTE]
> OpenSSL built-in replay protection is disabled, because it interferes with session resumption. It can be turned back if deemed necessary.

```nginx
ssl_conf_command Options AntiReplay;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
