---
title: "quic_gso"
description: "Directive nginx quic_gso (ngx_http_v3_module) — Enables sending in optimized batch mode using segmentation offloading. NOTE Optimized sending is supported only on Linux featuring UDP_SEGMENT."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_gso on \| off;` |
| **Valeur par défaut** | `quic_gso off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Enables sending in optimized batch mode using segmentation offloading.

> [!NOTE]
> Optimized sending is supported only on Linux featuring `UDP_SEGMENT`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
