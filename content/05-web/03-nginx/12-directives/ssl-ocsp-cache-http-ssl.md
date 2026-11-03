---
title: "ssl_ocsp_cache (ngx_http_ssl_module)"
description: "Directive nginx ssl_ocsp_cache (ngx_http_ssl_module) — Définit le nom (name) et la taille (size) du cache qui conserve l'état des certificats clients pour la validation OCSP. Le cache est partagé entre tous les processus de travail. Un cache de même nom…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_ocsp_cache off \| [shared:name:size];` |
| **Valeur par défaut** | `ssl_ocsp_cache off;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.19.0 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Définit le nom (`name`) et la taille (`size`) du cache qui conserve l'état des certificats clients pour la validation OCSP. Le cache est partagé entre tous les processus de travail. Un cache de même nom peut servir à plusieurs serveurs virtuels.

Le paramètre `off` interdit l'utilisation du cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
