---
title: "zone_sync_ssl_crl"
description: "Directive nginx zone_sync_ssl_crl (ngx_stream_zone_sync_module) — Indique un fichier de certificats révoqués (CRL) au format PEM utilisé pour vérifier le certificat d'un autre serveur du cluster. Avec des certificats intermédiaires, leurs CRL doivent figurer dans…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_crl file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Indique un *fichier* de certificats révoqués (CRL) au format PEM utilisé pour [[12-directives/zone-sync-ssl-verify|vérifier]] le certificat d'un autre serveur du cluster. Avec des certificats intermédiaires, leurs CRL doivent figurer dans le même fichier.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
