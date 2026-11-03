---
title: "mirror_request_body"
description: "Directive nginx mirror_request_body (ngx_http_mirror_module) — Indique si le corps de la requête du client est dupliqué. Si cette option est activée, le corps est lu avant la création des sous-requêtes miroirs ; le relais sans tampon du corps de la requête,…"
tags: [nginx, directive, ngx_http_mirror_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mirror_request_body on \| off;` |
| **Valeur par défaut** | `mirror_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mirror_module\|ngx_http_mirror_module]] |

## Utilisation

Indique si le corps de la requête du client est dupliqué. Si cette option est activée, le corps est lu avant la création des sous-requêtes miroirs ; le relais sans tampon du corps de la requête, défini par les directives [[12-directives/proxy-request-buffering|proxy_request_buffering]], [[12-directives/fastcgi-request-buffering|fastcgi_request_buffering]], [[12-directives/scgi-request-buffering|scgi_request_buffering]] et [[12-directives/uwsgi-request-buffering|uwsgi_request_buffering]], est alors désactivé.

```nginx
location / {
    mirror /mirror;
    mirror_request_body off;
    proxy_pass http://backend;
}

location = /mirror {
    internal;
    proxy_pass http://log_backend;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
