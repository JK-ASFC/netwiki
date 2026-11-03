---
title: "db_ssl_conf_command"
description: "Directive nginx db_ssl_conf_command (ngx_http_db_module) — Définit des commandes de configuration OpenSSL quelconques à appliquer lors de l'établissement de la connexion avec le serveur de base de données. Plusieurs directives db_ssl_conf_command peuvent…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Définit des [commandes](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) de configuration OpenSSL quelconques à appliquer lors de l'établissement de la connexion avec le serveur de base de données.

Plusieurs directives `db_ssl_conf_command` peuvent être indiquées au même niveau. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `db_ssl_conf_command` n'est définie au niveau courant.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
