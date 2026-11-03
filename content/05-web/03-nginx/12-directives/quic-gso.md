---
title: "quic_gso"
description: "Directive nginx quic_gso (ngx_http_v3_module) — Active l'envoi en mode lot optimisé grâce au déchargement de la segmentation. NOTE L'envoi optimisé n'est pris en charge que sous Linux avec UDP_SEGMENT."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_gso on \| off;` |
| **Valeur par défaut** | `quic_gso off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Active l'envoi en mode lot optimisé grâce au déchargement de la segmentation.

> [!NOTE]
> L'envoi optimisé n'est pris en charge que sous Linux avec `UDP_SEGMENT`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
