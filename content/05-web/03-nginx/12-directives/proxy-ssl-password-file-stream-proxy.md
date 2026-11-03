---
title: "proxy_ssl_password_file (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_password_file (ngx_stream_proxy_module) — Indique un fichier (file) de phrases de passe pour les clés secrètes, une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Indique un fichier (*file*) de phrases de passe pour les [[12-directives/proxy-ssl-certificate-key-stream-proxy|clés secrètes]], une phrase par ligne. Les phrases sont essayées tour à tour au chargement de la clé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
