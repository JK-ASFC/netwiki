---
title: "fastcgi_ignore_headers"
description: "Directive nginx fastcgi_ignore_headers (ngx_http_fastcgi_module) — Disables processing of certain response header fields from the FastCGI server. The following fields can be ignored: X-Accel-Redirect, X-Accel-Expires, X-Accel-Limit-Rate (1.1.6), X-Accel-Buffering…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Disables processing of certain response header fields from the FastCGI server. The following fields can be ignored: `X-Accel-Redirect`, `X-Accel-Expires`, `X-Accel-Limit-Rate` (1.1.6), `X-Accel-Buffering` (1.1.6), `X-Accel-Charset` (1.1.6), `Expires`, `Cache-Control`, `Set-Cookie` (0.8.44), and `Vary` (1.7.7).

S'il n'est pas désactivé, le traitement de ces champs a l'effet suivant :

- `X-Accel-Expires`, `Expires`, `Cache-Control`, `Set-Cookie`, and `Vary` set the parameters of response [[12-directives/fastcgi-cache-valid|caching]];

- `X-Accel-Redirect` effectue une [[12-directives/internal|redirection interne]] vers l'URI indiqué ;

- `X-Accel-Limit-Rate` définit la [[12-directives/limit-rate|limite de débit]] de transmission de la réponse au client ;

- `X-Accel-Buffering` enables or disables [[12-directives/fastcgi-buffering|buffering]] of a response;

- `X-Accel-Charset` définit le [[12-directives/charset|jeu de caractères]] souhaité pour la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
