---
title: "charset"
description: "Directive nginx charset (ngx_http_charset_module) — Adds the specified charset to the Content-Type response header field. If this charset is different from the charset specified in the source_charset directive, a conversion is performed. The parameter…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `charset charset \| off;` |
| **Valeur par défaut** | `charset off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Adds the specified charset to the `Content-Type` response header field. If this charset is different from the charset specified in the [[12-directives/source-charset|source_charset]] directive, a conversion is performed.

The parameter `off` cancels the addition of charset to the `Content-Type` response header field.

A charset can be defined with a variable:

```nginx
charset $charset;
```

In such a case, all possible values of a variable need to be present in the configuration at least once in the form of the [[12-directives/charset-map|charset_map]], [[12-directives/charset|charset]], or [[12-directives/source-charset|source_charset]] directives. For `utf-8`, `windows-1251`, and `koi8-r` charsets, it is sufficient to include the files `conf/koi-win`, `conf/koi-utf`, and `conf/win-utf` into configuration. For other charsets, simply making a fictitious conversion table works, for example:

```nginx
charset_map iso-8859-5 _ { }
```

In addition, a charset can be set in the `X-Accel-Charset` response header field. This capability can be disabled using the [[12-directives/proxy-ignore-headers|proxy_ignore_headers]], [[12-directives/fastcgi-ignore-headers|fastcgi_ignore_headers]], [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]], [[12-directives/scgi-ignore-headers|scgi_ignore_headers]], and [[12-directives/grpc-ignore-headers|grpc_ignore_headers]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
