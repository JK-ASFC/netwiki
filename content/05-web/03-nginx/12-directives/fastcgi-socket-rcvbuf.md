---
title: "fastcgi_socket_rcvbuf"
description: "Directive nginx fastcgi_socket_rcvbuf (ngx_http_fastcgi_module) — Définit la taille du tampon de réception (option SO_RCVBUF) des connexions sortantes vers un serveur FastCGI. La valeur spéciale 0 annule l'effet de la directive fastcgi_socket_rcvbuf héritée du…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_socket_rcvbuf size;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.31.3 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit la taille du tampon de réception (option `SO_RCVBUF`) des connexions sortantes vers un serveur FastCGI. La valeur spéciale `0` annule l'effet de la directive `fastcgi_socket_rcvbuf` héritée du niveau de configuration précédent, ce qui laisse s'appliquer les réglages du système d'exploitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
