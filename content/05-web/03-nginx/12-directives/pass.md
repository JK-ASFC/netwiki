---
title: "pass"
description: "Directive nginx pass (ngx_stream_pass_module) — Sets server address to pass client connection to. The address can be specified as an IP address and a port: nginx pass 127.0.0.1:12345; ou le chemin d'un socket de domaine UNIX : nginx pass…"
tags: [nginx, directive, ngx_stream_pass_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_pass_module\|ngx_stream_pass_module]] |

## Utilisation

Sets server address to pass client connection to. The address can be specified as an IP address and a port:

```nginx
pass 127.0.0.1:12345;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
pass unix:/tmp/stream.socket;
```

The address can also be specified using variables:

```nginx
pass $upstream;
```

> [!NOTE]
> If the [[11-modules/03-stream/ngx_stream_core_module|PROXY protocol]] is used, the header is read before the connection is passed, so the `proxy_protocol` parameter should be specified on the listening socket of the original server:
>
> ```nginx
> server {
>     listen 12345 proxy_protocol;
>
>     set_real_ip_from 192.168.1.0/24;
>
>     pass 127.0.0.1:8000;
> }
> ```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
