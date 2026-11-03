---
title: "proxy_half_close"
description: "Directive nginx proxy_half_close (ngx_stream_proxy_module) — Active ou désactive la fermeture indépendante de chaque sens d'une connexion TCP (« semi-fermeture TCP »). Si elle est activée, le relais TCP est maintenu jusqu'à ce que les deux côtés ferment la…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_half_close on \| off;` |
| **Valeur par défaut** | `proxy_half_close off;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Active ou désactive la fermeture indépendante de chaque sens d'une connexion TCP (« semi-fermeture TCP »). Si elle est activée, le relais TCP est maintenu jusqu'à ce que les deux côtés ferment la connexion.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
