---
title: "mirror_request_body"
description: "Directive nginx mirror_request_body (ngx_http_mirror_module) — Indicates whether the client request body is mirrored. When enabled, the client request body will be read prior to creating mirror subrequests. In this case, unbuffered client request body proxying…"
tags: [nginx, directive, ngx_http_mirror_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mirror_request_body on \| off;` |
| **Valeur par défaut** | `mirror_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mirror_module\|ngx_http_mirror_module]] |

## Utilisation

Indicates whether the client request body is mirrored. When enabled, the client request body will be read prior to creating mirror subrequests. In this case, unbuffered client request body proxying set by the [[12-directives/proxy-request-buffering|proxy_request_buffering]], [[12-directives/fastcgi-request-buffering|fastcgi_request_buffering]], [[12-directives/scgi-request-buffering|scgi_request_buffering]], and [[12-directives/uwsgi-request-buffering|uwsgi_request_buffering]] directives will be disabled.

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
