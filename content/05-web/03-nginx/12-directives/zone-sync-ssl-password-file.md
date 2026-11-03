---
title: "zone_sync_ssl_password_file"
description: "Directive nginx zone_sync_ssl_password_file (ngx_stream_zone_sync_module) — Indique un fichier de phrases secrètes pour les clés secrètes, une par ligne. Les phrases sont essayées tour à tour lors du chargement de la clé."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Indique un *fichier* de phrases secrètes pour les [[12-directives/zone-sync-ssl-certificate-key|clés secrètes]], une par ligne. Les phrases sont essayées tour à tour lors du chargement de la clé.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
