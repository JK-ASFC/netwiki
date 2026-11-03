---
title: "fastcgi_pass"
description: "Directive nginx fastcgi_pass (ngx_http_fastcgi_module) — Sets the address of a FastCGI server. The address can be specified as a domain name or IP address, and a port: nginx fastcgi_pass localhost:9000; or as a UNIX-domain socket path: nginx fastcgi_pass…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Sets the address of a FastCGI server. The address can be specified as a domain name or IP address, and a port:

```nginx
fastcgi_pass localhost:9000;
```

or as a UNIX-domain socket path:

```nginx
fastcgi_pass unix:/tmp/fastcgi.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

Parameter value can contain variables. In this case, if an address is specified as a domain name, the name is searched among the described [[11-modules/02-http/ngx_http_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
