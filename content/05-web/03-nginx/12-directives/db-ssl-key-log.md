---
title: "db_ssl_key_log"
description: "Directive nginx db_ssl_key_log (ngx_http_db_module) — Enables logging of database server connection SSL keys and specifies the path to the key log file. Keys are logged in the SSLKEYLOGFILE format compatible with Wireshark. NOTE TLS key logs contain…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_key_log file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Enables logging of database server connection SSL keys and specifies the path to the key log file. Keys are logged in the [SSLKEYLOGFILE](https://datatracker.ietf.org/doc/html/rfc9850) format compatible with Wireshark.

> [!NOTE]
> TLS key logs contain sensitive material that can enable decryption of captured traffic. Protect these files and enable logging only when needed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
