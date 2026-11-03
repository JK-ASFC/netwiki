---
title: "db_ssl_password_file"
description: "Directive nginx db_ssl_password_file (ngx_http_db_module) — Specifies a file with passphrases for secret keys where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key."
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_password_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Specifies a *file* with passphrases for [[12-directives/db-ssl-certificate-key|secret keys]] where each passphrase is specified on a separate line. Passphrases are tried in turn when loading the key.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
