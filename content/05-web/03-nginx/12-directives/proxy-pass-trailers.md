---
title: "proxy_pass_trailers"
description: "Directive nginx proxy_pass_trailers (ngx_http_proxy_module) — Permits passing trailer fields from a proxied server to a client. NOTE A trailer section should be explicitly enabled: nginx location / { proxy_http_version 1.1; for versions before 1.29.7…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_trailers on \| off;` |
| **Valeur par défaut** | `proxy_pass_trailers off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Permits passing trailer fields from a proxied server to a client.

> [!NOTE]
> A trailer section should be [explicitly enabled](https://datatracker.ietf.org/doc/html/rfc9110#section-6.5.1):

```nginx
location / {
    # proxy_http_version 1.1;  #for versions before 1.29.7
    proxy_set_header     Connection "te";
    proxy_set_header     TE "trailers";
    proxy_pass_trailers  on;

    proxy_pass ...
}
```

> [!NOTE]
> Trailer fields received from an upstream server are passed to a client as is, without interpretation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
