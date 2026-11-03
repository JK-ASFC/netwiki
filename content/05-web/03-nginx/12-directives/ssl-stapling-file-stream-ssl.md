---
title: "ssl_stapling_file (ngx_stream_ssl_module)"
description: "Directive nginx ssl_stapling_file (ngx_stream_ssl_module) — Si cette directive est définie, la réponse OCSP agrafée est lue dans le fichier (file) indiqué au lieu d'interroger le répondeur OCSP désigné dans le certificat du serveur. Le fichier doit être au…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_stapling_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Si cette directive est définie, la réponse OCSP agrafée est lue dans le fichier (*file*) indiqué au lieu d'interroger le répondeur OCSP désigné dans le certificat du serveur.

Le fichier doit être au format DER, tel que produit par la commande « `openssl ocsp` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
