---
title: "zone_sync_ssl_password_file"
description: "Directive nginx zone_sync_ssl_password_file (ngx_stream_zone_sync_module) — Specifies a file with passphrases for secret keys where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key."
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Specifies a *file* with passphrases for [[12-directives/zone-sync-ssl-certificate-key|secret keys]] where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
