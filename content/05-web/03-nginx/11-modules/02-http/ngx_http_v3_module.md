---
title: "ngx_http_v3_module"
description: "Module nginx ngx_http_v3_module — The ngx_http_v3_module module (1.25.0) provides experimental support for HTTP/3."
tags: [nginx, module, ngx_http_v3_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_v3_module` module (1.25.0) provides experimental support for [HTTP/3](https://datatracker.ietf.org/doc/html/rfc9114).

This module is not built by default, it should be enabled with the `--with-http_v3_module` configuration parameter.

> [!NOTE]
> This module requires the [OpenSSL](http://www.openssl.org) library version 1.1.1 or higher.

> [!NOTE]
> 0-RTT support requires the [OpenSSL](http://www.openssl.org) library version 3.5.1 or higher. Alternatively, [BoringSSL](https://boringssl.googlesource.com/boringssl), [LibreSSL](https://www.libressl.org), or [QuicTLS](https://github.com/quictls/openssl) libraries can be used to build and run this module.

## Known Issues

The module is experimental, caveat emptor applies.

Before version 1.29.1, 0-RTT support could not be enabled with OpenSSL regardless of the [[12-directives/ssl-early-data|ssl_early_data]] directive value.

The module cannot be built on the Win32 platform.

## Exemple de configuration

```nginx
http {
    log_format quic '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" "$http3"';

    access_log logs/access.log quic;

    server {
        # for better compatibility it's recommended
        # to use the same port for http/3 and https
        listen 8443 quic reuseport;
        listen 8443 ssl;

        ssl_certificate     certs/example.com.crt;
        ssl_certificate_key certs/example.com.key;

        location / {
            # used to advertise the availability of HTTP/3
            add_header Alt-Svc 'h3=":8443"; ma=86400';
        }
    }
}
```

## Directives

- [[12-directives/http3|http3]]
- [[12-directives/http3-hq|http3_hq]]
- [[12-directives/http3-max-concurrent-streams|http3_max_concurrent_streams]]
- [[12-directives/http3-stream-buffer-size|http3_stream_buffer_size]]
- [[12-directives/quic-active-connection-id-limit|quic_active_connection_id_limit]]
- [[12-directives/quic-bpf|quic_bpf]]
- [[12-directives/quic-gso|quic_gso]]
- [[12-directives/quic-host-key|quic_host_key]]
- [[12-directives/quic-retry|quic_retry]]

## Variables intégrées

- [[13-variables/http3|$http3]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
