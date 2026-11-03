---
title: "zone_sync_ssl_name"
description: "Directive nginx zone_sync_ssl_name (ngx_stream_zone_sync_module) — Permet de remplacer le nom de serveur utilisé pour vérifier le certificat d'un serveur du cluster et transmis via SNI lors de l'établissement de la connexion avec lui. Par défaut, la partie hôte de…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_name name;` |
| **Valeur par défaut** | `zone_sync_ssl_name host from zone_sync_server;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.15.7 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Permet de remplacer le nom de serveur utilisé pour [[12-directives/zone-sync-ssl-verify|vérifier]] le certificat d'un serveur du cluster et [[12-directives/zone-sync-ssl-server-name|transmis via SNI]] lors de l'établissement de la connexion avec lui.

Par défaut, la partie hôte de l'adresse de [[12-directives/zone-sync-server|zone_sync_server]] est utilisée, ou l'adresse IP résolue si le paramètre `resolve` est indiqué.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
