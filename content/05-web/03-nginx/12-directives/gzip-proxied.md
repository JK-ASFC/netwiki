---
title: "gzip_proxied"
description: "Directive nginx gzip_proxied (ngx_http_gzip_module) — Enables or disables gzipping of responses for proxied requests depending on the request and response. The fact that the request is proxied is determined by the presence of the Via request header…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_proxied off \| expired \| no-cache \| no-store \| private \| no_last_modified \| no_etag \| auth \| any ...;` |
| **Valeur par défaut** | `gzip_proxied off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Enables or disables gzipping of responses for proxied requests depending on the request and response. The fact that the request is proxied is determined by the presence of the `Via` request header field. The directive accepts multiple parameters:

- **`off`**

  disables compression for all proxied requests, ignoring other parameters;

- **`expired`**

  enables compression if a response header includes the `Expires` field with a value that disables caching;

- **`no-cache`**

  enables compression if a response header includes the `Cache-Control` field with the “`no-cache`” parameter;

- **`no-store`**

  enables compression if a response header includes the `Cache-Control` field with the “`no-store`” parameter;

- **`private`**

  enables compression if a response header includes the `Cache-Control` field with the “`private`” parameter;

- **`no_last_modified`**

  enables compression if a response header does not include the `Last-Modified` field;

- **`no_etag`**

  enables compression if a response header does not include the `ETag` field;

- **`auth`**

  enables compression if a request header includes the `Authorization` field;

- **`any`**

  enables compression for all proxied requests.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
