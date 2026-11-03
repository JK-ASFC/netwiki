---
title: "limit_rate_after"
description: "Directive nginx limit_rate_after (ngx_http_core_module) — Définit la quantité initiale au-delà de laquelle la suite de la transmission de la réponse au client est limitée en débit. La valeur du paramètre peut contenir des variables (1.17.0). Exemple : nginx…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_rate_after size;` |
| **Valeur par défaut** | `limit_rate_after 0;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la quantité initiale au-delà de laquelle la suite de la transmission de la réponse au client est limitée en débit. La valeur du paramètre peut contenir des variables (1.17.0).

Exemple :

```nginx
location /flv/ {
    flv;
    limit_rate_after 500k;
    limit_rate       50k;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
