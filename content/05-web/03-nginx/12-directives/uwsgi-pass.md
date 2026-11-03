---
title: "uwsgi_pass"
description: "Directive nginx uwsgi_pass (ngx_http_uwsgi_module) — Sets the protocol and address of a uwsgi server. As a protocol, “uwsgi” or “suwsgi” (secured uwsgi, uwsgi over SSL) can be specified. The address can be specified as a domain name or IP address, and…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_pass [protocol://]address;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Sets the protocol and address of a uwsgi server. As a *protocol*, “`uwsgi`” or “`suwsgi`” (secured uwsgi, uwsgi over SSL) can be specified. The address can be specified as a domain name or IP address, and a port:

```nginx
uwsgi_pass localhost:9000;
uwsgi_pass uwsgi://localhost:9000;
uwsgi_pass suwsgi://[2001:db8::1]:9090;
```

or as a UNIX-domain socket path:

```nginx
uwsgi_pass unix:/tmp/uwsgi.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

Parameter value can contain variables. In this case, if an address is specified as a domain name, the name is searched among the described [[11-modules/02-http/ngx_http_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-http-core|resolver]].

> [!NOTE]
> Secured uwsgi protocol is supported since version 1.5.8.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
