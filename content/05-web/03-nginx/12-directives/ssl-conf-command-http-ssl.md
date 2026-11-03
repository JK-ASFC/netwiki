---
title: "ssl_conf_command (ngx_http_ssl_module)"
description: "Directive nginx ssl_conf_command (ngx_http_ssl_module) — Sets arbitrary OpenSSL configuration commands. NOTE Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent. Several ssl_conf_command directives can be specified on the same level:…"
tags: [nginx, directive, ngx_http_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_conf_command name value;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.19.4 |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

## Utilisation

Sets arbitrary OpenSSL configuration [commands](https://www.openssl.org/docs/man1.1.1/man3/SSL_CONF_cmd.html).

> [!NOTE]
> Cette directive est prise en charge avec OpenSSL 1.0.2 ou plus récent.

Several `ssl_conf_command` directives can be specified on the same level:

```nginx
ssl_conf_command Options PrioritizeChaCha;
ssl_conf_command Ciphersuites TLS_CHACHA20_POLY1305_SHA256;
```

These directives are inherited from the previous configuration level if and only if there are no `ssl_conf_command` directives defined on the current level.

> [!NOTE]
> Configurer OpenSSL directement peut provoquer un comportement inattendu.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
