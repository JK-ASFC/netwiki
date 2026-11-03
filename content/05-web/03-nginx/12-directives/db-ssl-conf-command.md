---
title: "db_ssl_conf_command"
description: "Directive nginx db_ssl_conf_command (ngx_http_db_module) — Sets arbitrary OpenSSL configuration commands when establishing a connection with the database server. Several db_ssl_conf_command directives can be specified on the same level. These directives are…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Sets arbitrary OpenSSL configuration [commands](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) when establishing a connection with the database server.

Several `db_ssl_conf_command` directives can be specified on the same level. These directives are inherited from the previous configuration level if and only if there are no `db_ssl_conf_command` directives defined on the current level.

> [!NOTE]
> Note that configuring OpenSSL directly might result in unexpected behavior.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
