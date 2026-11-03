---
title: "proxy_password"
description: "Directive nginx proxy_password (ngx_mgmt_module) — Sets the password used for authentication on the proxy. The password is sent unencrypted by default. If the proxy supports TLS, the connection to the proxy can be protected with the stream module:…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_password string;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Sets the password used for authentication on the [[12-directives/proxy|proxy]].

The password is sent unencrypted by default. If the proxy supports TLS, the connection to the proxy can be protected with the [[11-modules/03-stream/ngx_stream_proxy_module|stream]] module:

```nginx
mgmt {
    proxy          127.0.0.1:8080;
    proxy_username <name>;
    proxy_password <password>;
}

stream {
    server {
        listen 127.0.0.1:8080;

        proxy_ssl                     on;
        proxy_ssl_verify              on;
        proxy_ssl_trusted_certificate <proxy_ca_file>;

        proxy_pass <proxy_host>:<proxy_port>;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
