---
title: "zone_sync_ssl_conf_command"
description: "Directive nginx zone_sync_ssl_conf_command (ngx_stream_zone_sync_module) — Définit des commandes de configuration OpenSSL arbitraires lors de l'établissement d'une connexion avec un autre serveur du cluster. NOTE Cette directive est prise en charge avec OpenSSL 1.0.2 ou…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit des [commandes](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) de configuration OpenSSL arbitraires lors de l'établissement d'une connexion avec un autre serveur du cluster.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent.

Plusieurs directives `zone_sync_ssl_conf_command` peuvent être indiquées au même niveau. Elles sont héritées du niveau de configuration précédent si et seulement si aucune directive `zone_sync_ssl_conf_command` n'est définie au niveau courant.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
