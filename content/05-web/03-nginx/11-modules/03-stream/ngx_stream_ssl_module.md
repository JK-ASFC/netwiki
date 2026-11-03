---
title: "ngx_stream_ssl_module"
description: "Module nginx ngx_stream_ssl_module — The ngx_stream_ssl_module module (1.9.0) provides the necessary support for a stream proxy server to work with the SSL/TLS protocol."
tags: [nginx, module, ngx_stream_ssl_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_ssl_module` module (1.9.0) provides the necessary support for a stream proxy server to work with the SSL/TLS protocol.

This module is not built by default, it should be enabled with the `--with-stream_ssl_module` configuration parameter.

> [!NOTE]
> Ce module nécessite la bibliothèque [OpenSSL](http://www.openssl.org).

## Exemple de configuration

Pour réduire la charge du processeur, il est recommandé de

- régler le nombre de [[12-directives/worker-processes|processus de travail]] sur le nombre de processeurs,
- activer le cache de sessions partagé,
- désactiver le cache de sessions intégré,
- and possibly increase the session [[12-directives/ssl-session-timeout-stream-ssl|lifetime]] (by default, 5 minutes):

```nginx
worker_processes auto;

stream {

    ...

    server {
        listen              12345 ssl;

        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         AES128-SHA:AES256-SHA:RC4-SHA:DES-CBC3-SHA:RC4-MD5;
        ssl_certificate     /usr/local/nginx/conf/cert.pem;
        ssl_certificate_key /usr/local/nginx/conf/cert.key;
        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 10m;

        ...
    }
```

## Directives

- [[12-directives/ssl-alpn|ssl_alpn]]
- [[12-directives/ssl-certificate-stream-ssl|ssl_certificate]]
- [[12-directives/ssl-certificate-cache-stream-ssl|ssl_certificate_cache]]
- [[12-directives/ssl-certificate-compression-stream-ssl|ssl_certificate_compression]]
- [[12-directives/ssl-certificate-key-stream-ssl|ssl_certificate_key]]
- [[12-directives/ssl-ciphers-stream-ssl|ssl_ciphers]]
- [[12-directives/ssl-client-certificate-stream-ssl|ssl_client_certificate]]
- [[12-directives/ssl-conf-command-stream-ssl|ssl_conf_command]]
- [[12-directives/ssl-crl-stream-ssl|ssl_crl]]
- [[12-directives/ssl-dhparam-stream-ssl|ssl_dhparam]]
- [[12-directives/ssl-ecdh-curve-stream-ssl|ssl_ecdh_curve]]
- [[12-directives/ssl-ech-file-stream-ssl|ssl_ech_file]]
- [[12-directives/ssl-handshake-timeout|ssl_handshake_timeout]]
- [[12-directives/ssl-key-log-stream-ssl|ssl_key_log]]
- [[12-directives/ssl-ocsp-stream-ssl|ssl_ocsp]]
- [[12-directives/ssl-ocsp-cache-stream-ssl|ssl_ocsp_cache]]
- [[12-directives/ssl-ocsp-responder-stream-ssl|ssl_ocsp_responder]]
- [[12-directives/ssl-password-file-stream-ssl|ssl_password_file]]
- [[12-directives/ssl-prefer-server-ciphers-stream-ssl|ssl_prefer_server_ciphers]]
- [[12-directives/ssl-protocols-stream-ssl|ssl_protocols]]
- [[12-directives/ssl-reject-handshake-stream-ssl|ssl_reject_handshake]]
- [[12-directives/ssl-session-cache-stream-ssl|ssl_session_cache]]
- [[12-directives/ssl-session-ticket-key-stream-ssl|ssl_session_ticket_key]]
- [[12-directives/ssl-session-tickets-stream-ssl|ssl_session_tickets]]
- [[12-directives/ssl-session-timeout-stream-ssl|ssl_session_timeout]]
- [[12-directives/ssl-stapling-stream-ssl|ssl_stapling]]
- [[12-directives/ssl-stapling-file-stream-ssl|ssl_stapling_file]]
- [[12-directives/ssl-stapling-responder-stream-ssl|ssl_stapling_responder]]
- [[12-directives/ssl-stapling-verify-stream-ssl|ssl_stapling_verify]]
- [[12-directives/ssl-trusted-certificate-stream-ssl|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-client-stream-ssl|ssl_verify_client]]
- [[12-directives/ssl-verify-depth-stream-ssl|ssl_verify_depth]]

## Variables intégrées

- [[13-variables/ssl-alpn-protocol-stream-ssl|$ssl_alpn_protocol]]
- [[13-variables/ssl-cipher-stream-ssl|$ssl_cipher]]
- [[13-variables/ssl-ciphers-stream-ssl|$ssl_ciphers]]
- [[13-variables/ssl-client-cert-stream-ssl|$ssl_client_cert]]
- [[13-variables/ssl-client-fingerprint-stream-ssl|$ssl_client_fingerprint]]
- [[13-variables/ssl-client-i-dn-stream-ssl|$ssl_client_i_dn]]
- [[13-variables/ssl-client-raw-cert-stream-ssl|$ssl_client_raw_cert]]
- [[13-variables/ssl-client-s-dn-stream-ssl|$ssl_client_s_dn]]
- [[13-variables/ssl-client-serial-stream-ssl|$ssl_client_serial]]
- [[13-variables/ssl-client-sigalg-stream-ssl|$ssl_client_sigalg]]
- [[13-variables/ssl-client-v-end-stream-ssl|$ssl_client_v_end]]
- [[13-variables/ssl-client-v-remain-stream-ssl|$ssl_client_v_remain]]
- [[13-variables/ssl-client-v-start-stream-ssl|$ssl_client_v_start]]
- [[13-variables/ssl-client-verify-stream-ssl|$ssl_client_verify]]
- [[13-variables/ssl-curve-stream-ssl|$ssl_curve]]
- [[13-variables/ssl-curves-stream-ssl|$ssl_curves]]
- [[13-variables/ssl-ech-outer-server-name-stream-ssl|$ssl_ech_outer_server_name]]
- [[13-variables/ssl-ech-status-stream-ssl|$ssl_ech_status]]
- [[13-variables/ssl-protocol-stream-ssl|$ssl_protocol]]
- [[13-variables/ssl-server-name-stream-ssl|$ssl_server_name]]
- [[13-variables/ssl-session-id-stream-ssl|$ssl_session_id]]
- [[13-variables/ssl-session-reused-stream-ssl|$ssl_session_reused]]
- [[13-variables/ssl-sigalg-stream-ssl|$ssl_sigalg]]
- [[13-variables/ssl-sigalgs-stream-ssl|$ssl_sigalgs]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
