---
title: "proxy_pass (ngx_stream_proxy_module)"
description: "Directive nginx proxy_pass (ngx_stream_proxy_module) — Sets the address of a proxied server. The address can be specified as a domain name or IP address, and a port: nginx proxy_pass localhost:12345; ou le chemin d'un socket de domaine UNIX : nginx…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Sets the address of a proxied server. The address can be specified as a domain name or IP address, and a port:

```nginx
proxy_pass localhost:12345;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
proxy_pass unix:/tmp/stream.socket;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/03-stream/ngx_stream_upstream_module|groupe de serveurs]].

The address can also be specified using variables (1.11.3):

```nginx
proxy_pass $upstream;
```

In this case, the server name is searched among the described [[11-modules/03-stream/ngx_stream_upstream_module|server groups]], and, if not found, is determined using a [[12-directives/resolver-stream-core|resolver]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
