---
title: "ssl_session_cache (ngx_stream_ssl_module)"
description: "Directive nginx ssl_session_cache (ngx_stream_ssl_module) — Définit les types et tailles des caches qui conservent les paramètres de session. Un cache peut être de l'un des types suivants : - off l'utilisation d'un cache de sessions est strictement interdite…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_session_cache off \| none \| [builtin[:size]] [shared:name:size];` |
| **Valeur par défaut** | `ssl_session_cache none;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Définit les types et tailles des caches qui conservent les paramètres de session. Un cache peut être de l'un des types suivants :

- **`off`**

  l'utilisation d'un cache de sessions est strictement interdite : nginx indique explicitement au client que les sessions ne peuvent pas être réutilisées.

- **`none`**

  l'utilisation d'un cache de sessions est poliment refusée : nginx indique au client que les sessions peuvent être réutilisées, mais ne conserve pas réellement leurs paramètres dans le cache.

- **`builtin`**

  cache intégré à OpenSSL, utilisé par un seul processus de travail. Sa taille s'exprime en sessions ; sans taille, elle vaut 20480 sessions. L'utilisation du cache intégré peut fragmenter la mémoire.

- **`shared`**

  a cache shared between all worker processes. The cache size is specified in bytes; one megabyte can store about 4000 sessions. Each shared cache should have an arbitrary name. A cache with the same name can be used in several virtual servers. It is also used to automatically generate, store, and periodically rotate TLS session ticket keys (1.23.2) unless configured explicitly using the [[12-directives/ssl-session-ticket-key-stream-ssl|ssl_session_ticket_key]] directive.

Les deux types de cache peuvent être utilisés ensemble, par exemple :

```nginx
ssl_session_cache builtin:1000 shared:SSL:10m;
```

mais utiliser uniquement le cache partagé, sans le cache intégré, est en principe plus efficace.

If the directive is specified on the [[12-directives/server-stream-core|server]] level, the value from the default server can be used. Details are provided in the “[[10-guides/02-http/server-names|Virtual server selection]]” section.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
