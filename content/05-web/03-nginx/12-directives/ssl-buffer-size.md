---
title: "ssl_buffer_size"
description: "Directive nginx ssl_buffer_size (ngx_http_ssl_module) — Définit la taille du tampon utilisé pour envoyer les données. Par défaut, le tampon fait 16k, ce qui minimise le surcoût pour l'envoi de grosses réponses. Pour réduire le délai avant le premier octet…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_buffer_size size;` |
| **Valeur par défaut** | `ssl_buffer_size 16k;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.5.9 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Définit la taille du tampon utilisé pour envoyer les données.

Par défaut, le tampon fait 16k, ce qui minimise le surcoût pour l'envoi de grosses réponses. Pour réduire le délai avant le premier octet (*Time To First Byte*), il peut être utile de choisir une valeur plus petite, par exemple :

```nginx
ssl_buffer_size 4k;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
