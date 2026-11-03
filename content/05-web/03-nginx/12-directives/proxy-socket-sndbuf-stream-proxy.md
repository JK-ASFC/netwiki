---
title: "proxy_socket_sndbuf (ngx_stream_proxy_module)"
description: "Directive nginx proxy_socket_sndbuf (ngx_stream_proxy_module) — Définit la taille du tampon d'envoi (option SO_SNDBUF) des connexions sortantes vers un serveur mandaté. La valeur spéciale 0 annule l'effet de la directive proxy_socket_sndbuf héritée du niveau de…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_socket_sndbuf size;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit la taille du tampon d'envoi (option `SO_SNDBUF`) des connexions sortantes vers un serveur mandaté. La valeur spéciale `0` annule l'effet de la directive `proxy_socket_sndbuf` héritée du niveau de configuration précédent, ce qui laisse s'appliquer les réglages du système d'exploitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
