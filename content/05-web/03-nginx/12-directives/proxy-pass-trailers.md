---
title: "proxy_pass_trailers"
description: "Directive nginx proxy_pass_trailers (ngx_http_proxy_module) — Autorise la transmission des champs de fin de réponse (trailers) du serveur mandaté au client. NOTE La section de fin de réponse doit être explicitement activée : nginx location / {…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_trailers on \| off;` |
| **Valeur par défaut** | `proxy_pass_trailers off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Autorise la transmission des champs de fin de réponse (*trailers*) du serveur mandaté au client.

> [!NOTE]
> La section de fin de réponse doit être [explicitement activée](https://datatracker.ietf.org/doc/html/rfc9110#section-6.5.1) :

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
> Les champs de fin de réponse reçus d'un serveur amont sont transmis tels quels au client, sans interprétation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
