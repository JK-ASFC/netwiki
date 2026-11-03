---
title: "zone_sync_buffers"
description: "Directive nginx zone_sync_buffers (ngx_stream_zone_sync_module) — Définit le nombre et la taille des tampons par zone utilisés pour pousser le contenu des zones. Par défaut, la taille vaut une page mémoire, soit 4K ou 8K selon la plate-forme. NOTE Un seul tampon…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_buffers number size;` |
| **Valeur par défaut** | `zone_sync_buffers 8 4k\|8k;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit le *nombre* et la *taille* des tampons par zone utilisés pour pousser le contenu des zones. Par défaut, la taille vaut une page mémoire, soit 4K ou 8K selon la plate-forme.

> [!NOTE]
> Un seul tampon doit pouvoir contenir n'importe quelle entrée de chaque zone synchronisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
