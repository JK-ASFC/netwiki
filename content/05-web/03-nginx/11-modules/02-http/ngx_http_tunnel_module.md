---
title: "ngx_http_tunnel_module"
description: "Module nginx ngx_http_tunnel_module — Le module ngx_http_tunnel_module (1.31.0) traite les requêtes HTTP/1.1 CONNECT et établit une connexion virtuelle de bout en bout."
tags: [nginx, module, ngx_http_tunnel_module]
icon: puzzle
---

Le module `ngx_http_tunnel_module` (1.31.0) traite les requêtes HTTP/1.1 [CONNECT](https://datatracker.ietf.org/doc/html/rfc9110#section-9.3.6) et établit une connexion virtuelle de bout en bout.

## Exemple de configuration

```nginx
http {

    map $request_port $allow_port {
        443            1;
    }

    map $host $allow_host {
        hostnames;

        example.org    1;
        *.example.org  1;
    }

    server {
        listen 8000;

        resolver dns.example.com;

        if ($allow_port != 1) {
            return 502;
        }

        if ($allow_host != 1) {
            return 502;
        }

        tunnel_pass;
    }
}
```

## Directives

- [[12-directives/tunnel-allow-upstream|tunnel_allow_upstream]]
- [[12-directives/tunnel-bind|tunnel_bind]]
- [[12-directives/tunnel-bind-dynamic|tunnel_bind_dynamic]]
- [[12-directives/tunnel-buffer-size|tunnel_buffer_size]]
- [[12-directives/tunnel-connect-timeout|tunnel_connect_timeout]]
- [[12-directives/tunnel-next-upstream|tunnel_next_upstream]]
- [[12-directives/tunnel-next-upstream-timeout|tunnel_next_upstream_timeout]]
- [[12-directives/tunnel-next-upstream-tries|tunnel_next_upstream_tries]]
- [[12-directives/tunnel-pass|tunnel_pass]]
- [[12-directives/tunnel-read-timeout|tunnel_read_timeout]]
- [[12-directives/tunnel-send-lowat|tunnel_send_lowat]]
- [[12-directives/tunnel-send-timeout|tunnel_send_timeout]]
- [[12-directives/tunnel-socket-keepalive|tunnel_socket_keepalive]]
- [[12-directives/tunnel-socket-rcvbuf|tunnel_socket_rcvbuf]]
- [[12-directives/tunnel-socket-sndbuf|tunnel_socket_sndbuf]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
