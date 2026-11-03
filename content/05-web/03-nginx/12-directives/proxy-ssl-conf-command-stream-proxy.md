---
title: "proxy_ssl_conf_command (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_conf_command (ngx_stream_proxy_module) — Sets arbitrary OpenSSL configuration commands when establishing a connection with the proxied server. NOTE Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent. Plusieurs directives…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Sets arbitrary OpenSSL configuration [commands](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) when establishing a connection with the proxied server.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent.

Plusieurs directives `proxy_ssl_conf_command` peuvent être indiquées au même niveau. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `proxy_ssl_conf_command` n'est définie au niveau courant.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
