---
title: "uwsgi_pass"
description: "Directive nginx uwsgi_pass (ngx_http_uwsgi_module) — Définit le protocole et l'adresse d'un serveur uwsgi. Le protocole (protocol) peut être « uwsgi » ou « suwsgi » (uwsgi sécurisé, uwsgi sur SSL). L'adresse peut être un nom de domaine ou une adresse…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_pass [protocol://]address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit le protocole et l'adresse d'un serveur uwsgi. Le protocole (*protocol*) peut être « `uwsgi` » ou « `suwsgi` » (uwsgi sécurisé, uwsgi sur SSL). L'adresse peut être un nom de domaine ou une adresse IP, avec un port :

```nginx
uwsgi_pass localhost:9000;
uwsgi_pass uwsgi://localhost:9000;
uwsgi_pass suwsgi://[2001:db8::1]:9090;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
uwsgi_pass unix:/tmp/uwsgi.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables. Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les [[11-modules/02-http/ngx_http_upstream_module|groupes de serveurs]] définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

> [!NOTE]
> Le protocole uwsgi sécurisé est pris en charge depuis la version 1.5.8.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
