---
title: "memcached_pass"
description: "Directive nginx memcached_pass (ngx_http_memcached_module) — Définit l'adresse du serveur memcached. L'adresse peut être un nom de domaine ou une adresse IP, avec un port : nginx memcached_pass localhost:11211; ou le chemin d'un socket de domaine UNIX : nginx…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Définit l'adresse du serveur memcached. L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
memcached_pass localhost:11211;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
memcached_pass unix:/tmp/memcached.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
