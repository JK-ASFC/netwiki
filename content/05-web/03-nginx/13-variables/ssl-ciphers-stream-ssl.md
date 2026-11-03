---
title: "$ssl_ciphers (ngx_stream_ssl_module)"
description: "Variable nginx $ssl_ciphers (ngx_stream_ssl_module) — renvoie la liste des suites de chiffrement prises en charge par le client (1.11.7). Les suites connues sont listées par leur nom, les inconnues en hexadécimal, par exemple : nginx…"
tags: [nginx, variable, ngx_stream_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ciphers` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

renvoie la liste des suites de chiffrement prises en charge par le client (1.11.7). Les suites connues sont listées par leur nom, les inconnues en hexadécimal, par exemple :

```nginx
AES128-SHA:AES256-SHA:0x00ff
```

> [!NOTE]
> La variable n'est entièrement prise en charge qu'avec OpenSSL 1.0.2 ou plus récent. Avec les versions plus anciennes, elle n'est disponible que pour les nouvelles sessions et ne liste que les suites connues.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
