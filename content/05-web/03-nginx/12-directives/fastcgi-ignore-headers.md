---
title: "fastcgi_ignore_headers"
description: "Directive nginx fastcgi_ignore_headers (ngx_http_fastcgi_module) — Désactive le traitement de certains champs d'en-tête de réponse du serveur FastCGI. Les champs suivants peuvent être ignorés : X-Accel-Redirect, X-Accel-Expires, X-Accel-Limit-Rate (1.1.6),…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Désactive le traitement de certains champs d'en-tête de réponse du serveur FastCGI. Les champs suivants peuvent être ignorés : `X-Accel-Redirect`, `X-Accel-Expires`, `X-Accel-Limit-Rate` (1.1.6), `X-Accel-Buffering` (1.1.6), `X-Accel-Charset` (1.1.6), `Expires`, `Cache-Control`, `Set-Cookie` (0.8.44) et `Vary` (1.7.7).

S'il n'est pas désactivé, le traitement de ces champs a l'effet suivant :

- `X-Accel-Expires`, `Expires`, `Cache-Control`, `Set-Cookie` et `Vary` définissent les paramètres de [[12-directives/fastcgi-cache-valid|mise en cache]] de la réponse ;

- `X-Accel-Redirect` effectue une [[12-directives/internal|redirection interne]] vers l'URI indiqué ;

- `X-Accel-Limit-Rate` définit la [[12-directives/limit-rate|limite de débit]] de transmission de la réponse au client ;

- `X-Accel-Buffering` active ou désactive la [[12-directives/fastcgi-buffering|mise en tampon]] de la réponse ;

- `X-Accel-Charset` définit le [[12-directives/charset|jeu de caractères]] souhaité pour la réponse.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
