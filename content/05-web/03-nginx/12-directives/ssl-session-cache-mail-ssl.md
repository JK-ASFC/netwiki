---
title: "ssl_session_cache (ngx_mail_ssl_module)"
description: "Directive nginx ssl_session_cache (ngx_mail_ssl_module) — Sets the types and sizes of caches that store session parameters. A cache can be of any of the following types: - off the use of a session cache is strictly prohibited: nginx explicitly tells a…"
tags: [nginx, directive, ngx_mail_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_cache off \| none \| [builtin[:size]] [shared:name:size];` |
| **Valeur par défaut** | `ssl_session_cache none;` |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_ssl_module\|ngx_mail_ssl_module]] |

## Utilisation

Sets the types and sizes of caches that store session parameters. A cache can be of any of the following types:

- **`off`**

  the use of a session cache is strictly prohibited: nginx explicitly tells a client that sessions may not be reused.

- **`none`**

  the use of a session cache is gently disallowed: nginx tells a client that sessions may be reused, but does not actually store session parameters in the cache.

- **`builtin`**

  a cache built in OpenSSL; used by one worker process only. The cache size is specified in sessions. If size is not given, it is equal to 20480 sessions. Use of the built-in cache can cause memory fragmentation.

- **`shared`**

  a cache shared between all worker processes. The cache size is specified in bytes; one megabyte can store about 4000 sessions. Each shared cache should have an arbitrary name. A cache with the same name can be used in several servers. It is also used to automatically generate, store, and periodically rotate TLS session ticket keys (1.23.2) unless configured explicitly using the [[12-directives/ssl-session-ticket-key-mail-ssl|ssl_session_ticket_key]] directive.

Both cache types can be used simultaneously, for example:

```nginx
ssl_session_cache builtin:1000 shared:SSL:10m;
```

but using only shared cache without the built-in cache should be more efficient.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
