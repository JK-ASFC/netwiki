---
title: "early_hints"
description: "Directive nginx early_hints (ngx_http_core_module) — Définit les conditions dans lesquelles la réponse 103 Early Hints est transmise au client. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse est transmise : nginx…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `early_hints string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit les conditions dans lesquelles la réponse `103 Early Hints` est transmise au client. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse est transmise :

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
> Les réponses `103 Early Hints` reçues d'un serveur amont sont transmises telles quelles au client, sans interprétation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
