---
title: "proxy_ssl_name (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_name (ngx_http_proxy_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat du serveur HTTPS mandaté et transmis via SNI lors de l'établissement de la connexion avec ce serveur. Par défaut, la partie…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_name name;` |
| **Valeur par défaut** | `proxy_ssl_name $proxy_host;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.0 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/proxy-ssl-verify-http-proxy|vérifier]] le certificat du serveur HTTPS mandaté et [[12-directives/proxy-ssl-server-name-http-proxy|transmis via SNI]] lors de l'établissement de la connexion avec ce serveur.

Par défaut, la partie hôte de l'URL de [[12-directives/proxy-pass-http-proxy|proxy_pass]] est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
