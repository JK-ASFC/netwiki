---
title: "hash (ngx_http_upstream_module)"
description: "Directive nginx hash (ngx_http_upstream_module) — Indique une méthode de répartition de charge pour un groupe de serveurs, dans laquelle l'association client-serveur repose sur la valeur hachée de la clé (key). La clé peut contenir du texte, des…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hash key [consistent];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.7.2 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Indique une méthode de répartition de charge pour un groupe de serveurs, dans laquelle l'association client-serveur repose sur la valeur hachée de la clé (*key*). La clé peut contenir du texte, des variables ou une combinaison des deux. L'ajout ou le retrait d'un serveur du groupe peut réaffecter la plupart des clés à d'autres serveurs. Cette méthode est compatible avec la bibliothèque Perl [Cache::Memcached](https://metacpan.org/pod/Cache::Memcached).

Avec le paramètre `consistent`, la méthode de hachage cohérent [ketama](https://www.metabrew.com/article/libketama-consistent-hashing-algo-memcached-clients) est utilisée à la place. Elle garantit que seules quelques clés sont réaffectées lorsqu'un serveur est ajouté au groupe ou en est retiré, ce qui améliore le taux de réussite des serveurs de cache. Cette méthode est compatible avec la bibliothèque Perl [Cache::Memcached::Fast](https://metacpan.org/pod/Cache::Memcached::Fast) avec le paramètre *ketama\_points* fixé à 160.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
