---
title: "http2_body_preread_size"
description: "Directive nginx http2_body_preread_size (ngx_http_v2_module) — Définit la taille (size) du tampon, par requête, dans lequel le corps de la requête peut être conservé avant le début de son traitement."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_body_preread_size size;` |
| **Valeur par défaut** | `http2_body_preread_size 64k;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.11.0 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Définit la taille (*size*) du tampon, par requête, dans lequel le corps de la requête peut être conservé avant le début de son traitement.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
