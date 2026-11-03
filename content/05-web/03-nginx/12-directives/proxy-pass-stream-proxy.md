---
title: "proxy_pass (ngx_stream_proxy_module)"
description: "Directive nginx proxy_pass (ngx_stream_proxy_module) — Définit l'adresse d'un serveur mandaté. L'adresse peut être un nom de domaine ou une adresse IP, suivi d'un port : nginx proxy_pass localhost:12345; ou le chemin d'un socket de domaine UNIX : nginx…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Définit l'adresse d'un serveur mandaté. L'adresse peut être un nom de domaine ou une adresse IP, suivi d'un port :

```nginx
proxy_pass localhost:12345;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
proxy_pass unix:/tmp/stream.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/03-stream/ngx_stream_upstream_module|groupe de serveurs]].

L'adresse peut aussi être indiquée avec des variables (1.11.3) :

```nginx
proxy_pass $upstream;
```

Dans ce cas, le nom du serveur est cherché parmi les [[11-modules/03-stream/ngx_stream_upstream_module|groupes de serveurs]] décrits et, à défaut, déterminé à l'aide d'un [[12-directives/resolver-stream-core|résolveur]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
