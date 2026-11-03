---
title: "proxy_ssl_name (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_name (ngx_stream_proxy_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat du serveur mandaté et transmis via SNI lors de l'établissement de la connexion. Le nom peut aussi être indiqué avec des…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_name name;` |
| **Valeur par défaut** | `proxy_ssl_name host from proxy_pass;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/proxy-ssl-verify-stream-proxy|vérifier]] le certificat du serveur mandaté et [[12-directives/proxy-ssl-server-name-stream-proxy|transmis via SNI]] lors de l'établissement de la connexion. Le nom peut aussi être indiqué avec des variables (1.11.3).

Par défaut, la partie hôte de l'adresse de [[12-directives/proxy-pass-stream-proxy|proxy_pass]] est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
