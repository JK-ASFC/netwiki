---
title: "ngx_http_v2_module"
description: "Module nginx ngx_http_v2_module — The ngx_http_v2_module module (1.9.5) provides support for HTTP/2."
tags: [nginx, module, ngx_http_v2_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_v2_module` module (1.9.5) provides support for [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540).

This module is not built by default, it should be enabled with the `--with-http_v2_module` configuration parameter.

## Known Issues

Before version 1.9.14, buffering of a client request body could not be disabled regardless of [[12-directives/proxy-request-buffering|proxy_request_buffering]], [[12-directives/fastcgi-request-buffering|fastcgi_request_buffering]], [[12-directives/uwsgi-request-buffering|uwsgi_request_buffering]], and [[12-directives/scgi-request-buffering|scgi_request_buffering]] directive values.

Before version 1.19.1, the [[12-directives/lingering-close|lingering_close]] mechanism was not used to control closing HTTP/2 connections.

## Exemple de configuration

```nginx
server {
    listen 443 ssl;

    http2 on;

    ssl_certificate server.crt;
    ssl_certificate_key server.key;
}
```

Note that accepting HTTP/2 connections over TLS requires the “Application-Layer Protocol Negotiation” (ALPN) TLS extension support, which is available since [OpenSSL](http://www.openssl.org) version 1.0.2.

Also note that if the [[12-directives/ssl-prefer-server-ciphers-http-ssl|ssl_prefer_server_ciphers]] directive is set to the value “`on`”, the [[12-directives/ssl-ciphers-http-ssl|ciphers]] should be configured to comply with [RFC 9113, Appendix A](https://datatracker.ietf.org/doc/html/rfc9113#appendix-A) black list and supported by clients.

## Directives

- [[12-directives/http2|http2]]
- [[12-directives/http2-body-preread-size|http2_body_preread_size]]
- [[12-directives/http2-chunk-size|http2_chunk_size]]
- [[12-directives/http2-idle-timeout|http2_idle_timeout]]
- [[12-directives/http2-max-concurrent-pushes|http2_max_concurrent_pushes]]
- [[12-directives/http2-max-concurrent-streams|http2_max_concurrent_streams]]
- [[12-directives/http2-max-field-size|http2_max_field_size]]
- [[12-directives/http2-max-header-size|http2_max_header_size]]
- [[12-directives/http2-max-requests|http2_max_requests]]
- [[12-directives/http2-push|http2_push]]
- [[12-directives/http2-push-preload|http2_push_preload]]
- [[12-directives/http2-recv-buffer-size|http2_recv_buffer_size]]
- [[12-directives/http2-recv-timeout|http2_recv_timeout]]

## Variables intégrées

- [[13-variables/http2|$http2]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
