---
title: "$ssl_curves (ngx_http_ssl_module)"
description: "Variable nginx $ssl_curves (ngx_http_ssl_module) — renvoie la liste des courbes prises en charge par le client (1.11.7). Les courbes connues sont listées par leur nom, les inconnues en hexadécimal, par exemple : nginx…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_curves` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie la liste des courbes prises en charge par le client (1.11.7). Les courbes connues sont listées par leur nom, les inconnues en hexadécimal, par exemple :

```nginx
0x001d:prime256v1:secp521r1:secp384r1
```

> [!NOTE]
> La variable n'est prise en charge qu'avec OpenSSL 1.0.2 ou plus récent. Avec les versions plus anciennes, sa valeur est une chaîne vide.

> [!NOTE]
> La variable n'est disponible que pour les nouvelles sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
