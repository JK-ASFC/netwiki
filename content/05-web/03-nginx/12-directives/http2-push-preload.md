---
title: "http2_push_preload"
description: "Directive nginx http2_push_preload (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.25.1. Active la conversion automatique des liens de préchargement indiqués dans les champs d'en-tête de réponse Link en requêtes push."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_push_preload on \| off;` |
| **Valeur par défaut** | `http2_push_preload off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.25.1.

Active la conversion automatique des [liens de préchargement](https://www.w3.org/TR/preload/#server-push-http-2) indiqués dans les champs d'en-tête de réponse `Link` en requêtes [push](https://datatracker.ietf.org/doc/html/rfc9113#section-8.4).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
