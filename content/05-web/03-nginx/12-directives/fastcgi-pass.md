---
title: "fastcgi_pass"
description: "Directive nginx fastcgi_pass (ngx_http_fastcgi_module) — Définit l'adresse d'un serveur FastCGI. L'adresse peut être un nom de domaine ou une adresse IP, avec un port : nginx fastcgi_pass localhost:9000; ou le chemin d'un socket de domaine UNIX : nginx…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit l'adresse d'un serveur FastCGI. L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
fastcgi_pass localhost:9000;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
fastcgi_pass unix:/tmp/fastcgi.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables. Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les [[11-modules/02-http/ngx_http_upstream_module|groupes de serveurs]] définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
