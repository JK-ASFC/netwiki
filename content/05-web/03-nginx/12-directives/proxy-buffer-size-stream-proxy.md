---
title: "proxy_buffer_size (ngx_stream_proxy_module)"
description: "Directive nginx proxy_buffer_size (ngx_stream_proxy_module) — Définit la taille du tampon de lecture des données du serveur mandaté. Définit aussi la taille du tampon de lecture des données du client."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_buffer_size size;` |
| **Valeur par défaut** | `proxy_buffer_size 16k;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit la *taille* du tampon de lecture des données du serveur mandaté. Définit aussi la *taille* du tampon de lecture des données du client.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
