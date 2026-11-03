---
title: "ngx_http_v2_module"
description: "Module nginx ngx_http_v2_module — Le module ngx_http_v2_module (1.9.5) fournit la prise en charge de HTTP/2."
tags: [nginx, module, ngx_http_v2_module]
icon: puzzle
---

Le module `ngx_http_v2_module` (1.9.5) fournit la prise en charge de [HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540).

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_v2_module`.

## Problèmes connus

Avant la version 1.9.14, la mise en tampon du corps de la requête du client ne pouvait pas être désactivée, quelles que soient les valeurs des directives [[12-directives/proxy-request-buffering|proxy_request_buffering]], [[12-directives/fastcgi-request-buffering|fastcgi_request_buffering]], [[12-directives/uwsgi-request-buffering|uwsgi_request_buffering]] et [[12-directives/scgi-request-buffering|scgi_request_buffering]].

Avant la version 1.19.1, le mécanisme [[12-directives/lingering-close|lingering_close]] n'était pas utilisé pour la fermeture des connexions HTTP/2.

## Exemple de configuration

```nginx
server {
    listen 443 ssl;

    http2 on;

    ssl_certificate server.crt;
    ssl_certificate_key server.key;
}
```

L'acceptation des connexions HTTP/2 sur TLS nécessite la prise en charge de l'extension TLS « Application-Layer Protocol Negotiation » (ALPN), disponible depuis [OpenSSL](http://www.openssl.org) 1.0.2.

Si la directive [[12-directives/ssl-prefer-server-ciphers-http-ssl|ssl_prefer_server_ciphers]] vaut « `on` », les [[12-directives/ssl-ciphers-http-ssl|suites de chiffrement]] doivent respecter la liste noire de la [RFC 9113, annexe A](https://datatracker.ietf.org/doc/html/rfc9113#appendix-A) et être prises en charge par les clients.

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
