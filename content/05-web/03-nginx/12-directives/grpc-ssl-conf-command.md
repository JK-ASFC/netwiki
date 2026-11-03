---
title: "grpc_ssl_conf_command"
description: "Directive nginx grpc_ssl_conf_command (ngx_http_grpc_module) — Sets arbitrary OpenSSL configuration commands when establishing a connection with the gRPC SSL server. NOTE Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent. Several…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Sets arbitrary OpenSSL configuration [commands](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html) when establishing a connection with the gRPC SSL server.

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent.

Several `grpc_ssl_conf_command` directives can be specified on the same level. These directives are inherited from the previous configuration level if and only if there are no `grpc_ssl_conf_command` directives defined on the current level.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
