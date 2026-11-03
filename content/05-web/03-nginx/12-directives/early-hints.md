---
title: "early_hints"
description: "Directive nginx early_hints (ngx_http_core_module) — Defines conditions under which the 103 Early Hints response will be passed to a client. If at least one value of the string parameters is not empty and is not equal to “0” then the response will be…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `early_hints string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines conditions under which the `103 Early Hints` response will be passed to a client. If at least one value of the string parameters is not empty and is not equal to “0” then the response will be passed:

```nginx
map $http_sec_fetch_mode $early_hints {
    navigate $http2$http3;
}

server {
    ...
    location / {
        early_hints $early_hints;
        proxy_pass http://example.com;
    }
}
```

> [!NOTE]
> `103 Early Hints` responses received from an upstream server are passed to a client as is, without interpretation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
