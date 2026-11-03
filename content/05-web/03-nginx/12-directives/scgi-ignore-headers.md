---
title: "scgi_ignore_headers"
description: "Directive nginx scgi_ignore_headers (ngx_http_scgi_module) — Disables processing of certain response header fields from the SCGI server. The following fields can be ignored: X-Accel-Redirect, X-Accel-Expires, X-Accel-Limit-Rate (1.1.6), X-Accel-Buffering…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Disables processing of certain response header fields from the SCGI server. The following fields can be ignored: `X-Accel-Redirect`, `X-Accel-Expires`, `X-Accel-Limit-Rate` (1.1.6), `X-Accel-Buffering` (1.1.6), `X-Accel-Charset` (1.1.6), `Expires`, `Cache-Control`, `Set-Cookie` (0.8.44), and `Vary` (1.7.7).

If not disabled, processing of these header fields has the following effect:

- `X-Accel-Expires`, `Expires`, `Cache-Control`, `Set-Cookie`, and `Vary` set the parameters of response [[12-directives/scgi-cache-valid|caching]];

- `X-Accel-Redirect` performs an [[12-directives/internal|internal redirect]] to the specified URI;

- `X-Accel-Limit-Rate` sets the [[12-directives/limit-rate|rate limit]] for transmission of a response to a client;

- `X-Accel-Buffering` enables or disables [[12-directives/scgi-buffering|buffering]] of a response;

- `X-Accel-Charset` sets the desired [[12-directives/charset|charset]] of a response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
