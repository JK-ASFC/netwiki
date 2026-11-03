---
title: "hash (ngx_stream_upstream_module)"
description: "Directive nginx hash (ngx_stream_upstream_module) — Indique une méthode de répartition de charge pour un groupe de serveurs dans laquelle l'association client-serveur repose sur la valeur hachée de la clé. La clé peut contenir du texte, des variables…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hash key [consistent];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Indique une méthode de répartition de charge pour un groupe de serveurs dans laquelle l'association client-serveur repose sur la valeur hachée de la *clé*. La *clé* peut contenir du texte, des variables et leurs combinaisons (1.11.2). Exemple :

```nginx
hash $remote_addr;
```

Notez qu'ajouter ou retirer un serveur du groupe peut réaffecter la plupart des clés à d'autres serveurs. La méthode est compatible avec la bibliothèque Perl [Cache::Memcached](https://metacpan.org/pod/Cache::Memcached).

Avec le paramètre `consistent`, la méthode de hachage cohérent [ketama](https://www.metabrew.com/article/libketama-consistent-hashing-algo-memcached-clients) est utilisée à la place. Elle garantit que seules quelques clés sont réaffectées lorsqu'un serveur est ajouté au groupe ou en est retiré, ce qui améliore le taux de réussite des serveurs de cache. Cette méthode est compatible avec la bibliothèque Perl [Cache::Memcached::Fast](https://metacpan.org/pod/Cache::Memcached::Fast) avec le paramètre *ketama\_points* fixé à 160.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
