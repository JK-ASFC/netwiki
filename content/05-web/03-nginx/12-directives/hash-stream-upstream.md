---
title: "hash (ngx_stream_upstream_module)"
description: "Directive nginx hash (ngx_stream_upstream_module) — Specifies a load balancing method for a server group where the client-server mapping is based on the hashed key value. The key can contain text, variables, and their combinations (1.11.2). Usage…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hash key [consistent];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Specifies a load balancing method for a server group where the client-server mapping is based on the hashed *key* value. The *key* can contain text, variables, and their combinations (1.11.2). Usage example:

```nginx
hash $remote_addr;
```

Note that adding or removing a server from the group may result in remapping most of the keys to different servers. The method is compatible with the [Cache::Memcached](https://metacpan.org/pod/Cache::Memcached) Perl library.

Avec le paramètre `consistent`, la méthode de hachage cohérent [ketama](https://www.metabrew.com/article/libketama-consistent-hashing-algo-memcached-clients) est utilisée à la place. Elle garantit que seules quelques clés sont réaffectées lorsqu'un serveur est ajouté au groupe ou en est retiré, ce qui améliore le taux de réussite des serveurs de cache. Cette méthode est compatible avec la bibliothèque Perl [Cache::Memcached::Fast](https://metacpan.org/pod/Cache::Memcached::Fast) avec le paramètre *ketama\_points* fixé à 160.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
