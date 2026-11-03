---
title: "scgi_pass"
description: "Directive nginx scgi_pass (ngx_http_scgi_module) — Définit l'adresse d'un serveur SCGI. L'adresse peut être un nom de domaine ou une adresse IP, avec un port : nginx scgi_pass localhost:9000; ou le chemin d'un socket de domaine UNIX : nginx scgi_pass…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit l'adresse d'un serveur SCGI. L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
scgi_pass localhost:9000;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
scgi_pass unix:/tmp/scgi.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables. Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les [[11-modules/02-http/ngx_http_upstream_module|groupes de serveurs]] définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
