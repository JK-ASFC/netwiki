---
title: "$ssl_curve (ngx_http_ssl_module)"
description: "Variable nginx $ssl_curve (ngx_http_ssl_module) — renvoie la courbe négociée pour l'échange de clés de la négociation SSL (1.21.5). Les courbes connues sont listées par leur nom, les inconnues en hexadécimal, par exemple : nginx prime256v1 NOTE La…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_curve` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie la courbe négociée pour l'échange de clés de la négociation SSL (1.21.5). Les courbes connues sont listées par leur nom, les inconnues en hexadécimal, par exemple :

```nginx
prime256v1
```

> [!NOTE]
> La variable n'est prise en charge qu'avec OpenSSL 3.0 ou plus récent. Avec les versions plus anciennes, sa valeur est une chaîne vide.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
