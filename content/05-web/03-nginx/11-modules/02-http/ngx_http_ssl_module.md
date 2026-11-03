---
title: "ngx_http_ssl_module"
description: "Module nginx ngx_http_ssl_module — The ngx_http_ssl_module module provides the necessary support for HTTPS."
tags: [nginx, module, ngx_http_ssl_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_ssl_module` module provides the necessary support for HTTPS.

This module is not built by default, it should be enabled with the `--with-http_ssl_module` configuration parameter.

> [!NOTE]
> This module requires the [OpenSSL](http://www.openssl.org) library.

## Exemple de configuration

To reduce the processor load, it is recommended to

- set the number of [[12-directives/worker-processes|worker processes]] equal to the number of processors,
- enable [[12-directives/keepalive-timeout-http-core|keep-alive]] connections,
- enable the shared session cache,
- disable the built-in session cache,
- and possibly increase the session [[12-directives/ssl-session-timeout-http-ssl|lifetime]] (by default, 5 minutes):

```nginx
worker_processes auto;

http {

    ...

    server {
        listen              443 ssl;
        keepalive_timeout   70;

        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         AES128-SHA:AES256-SHA:RC4-SHA:DES-CBC3-SHA:RC4-MD5;
        ssl_certificate     /usr/local/nginx/conf/cert.pem;
        ssl_certificate_key /usr/local/nginx/conf/cert.key;
        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 10m;

        ...
    }
```

## Error Processing

The `ngx_http_ssl_module` module supports several non-standard error codes that can be used for redirects using the [[12-directives/error-page|error_page]] directive:

- **495**

  an error has occurred during the client certificate verification;

- **496**

  a client has not presented the required certificate;

- **497**

  a regular request has been sent to the HTTPS port.

The redirection happens after the request is fully parsed and the variables, such as `$request_uri`, `$uri`, `$args` and others, are available.

## Directives

- [[12-directives/ssl-http-ssl|ssl]]
- [[12-directives/ssl-buffer-size|ssl_buffer_size]]
- [[12-directives/ssl-certificate-http-ssl|ssl_certificate]]
- [[12-directives/ssl-certificate-cache-http-ssl|ssl_certificate_cache]]
- [[12-directives/ssl-certificate-compression-http-ssl|ssl_certificate_compression]]
- [[12-directives/ssl-certificate-key-http-ssl|ssl_certificate_key]]
- [[12-directives/ssl-ciphers-http-ssl|ssl_ciphers]]
- [[12-directives/ssl-client-certificate-http-ssl|ssl_client_certificate]]
- [[12-directives/ssl-conf-command-http-ssl|ssl_conf_command]]
- [[12-directives/ssl-crl-http-ssl|ssl_crl]]
- [[12-directives/ssl-dhparam-http-ssl|ssl_dhparam]]
- [[12-directives/ssl-early-data|ssl_early_data]]
- [[12-directives/ssl-ecdh-curve-http-ssl|ssl_ecdh_curve]]
- [[12-directives/ssl-ech-file-http-ssl|ssl_ech_file]]
- [[12-directives/ssl-key-log-http-ssl|ssl_key_log]]
- [[12-directives/ssl-ocsp-http-ssl|ssl_ocsp]]
- [[12-directives/ssl-ocsp-cache-http-ssl|ssl_ocsp_cache]]
- [[12-directives/ssl-ocsp-responder-http-ssl|ssl_ocsp_responder]]
- [[12-directives/ssl-password-file-http-ssl|ssl_password_file]]
- [[12-directives/ssl-prefer-server-ciphers-http-ssl|ssl_prefer_server_ciphers]]
- [[12-directives/ssl-protocols-http-ssl|ssl_protocols]]
- [[12-directives/ssl-reject-handshake-http-ssl|ssl_reject_handshake]]
- [[12-directives/ssl-session-cache-http-ssl|ssl_session_cache]]
- [[12-directives/ssl-session-ticket-key-http-ssl|ssl_session_ticket_key]]
- [[12-directives/ssl-session-tickets-http-ssl|ssl_session_tickets]]
- [[12-directives/ssl-session-timeout-http-ssl|ssl_session_timeout]]
- [[12-directives/ssl-stapling-http-ssl|ssl_stapling]]
- [[12-directives/ssl-stapling-file-http-ssl|ssl_stapling_file]]
- [[12-directives/ssl-stapling-responder-http-ssl|ssl_stapling_responder]]
- [[12-directives/ssl-stapling-verify-http-ssl|ssl_stapling_verify]]
- [[12-directives/ssl-trusted-certificate-http-ssl|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-client-http-ssl|ssl_verify_client]]
- [[12-directives/ssl-verify-depth-http-ssl|ssl_verify_depth]]

## Variables intégrées

- [[13-variables/ssl-alpn-protocol-http-ssl|$ssl_alpn_protocol]]
- [[13-variables/ssl-cipher-http-ssl|$ssl_cipher]]
- [[13-variables/ssl-ciphers-http-ssl|$ssl_ciphers]]
- [[13-variables/ssl-client-escaped-cert|$ssl_client_escaped_cert]]
- [[13-variables/ssl-client-cert-http-ssl|$ssl_client_cert]]
- [[13-variables/ssl-client-fingerprint-http-ssl|$ssl_client_fingerprint]]
- [[13-variables/ssl-client-i-dn-http-ssl|$ssl_client_i_dn]]
- [[13-variables/ssl-client-i-dn-legacy|$ssl_client_i_dn_legacy]]
- [[13-variables/ssl-client-raw-cert-http-ssl|$ssl_client_raw_cert]]
- [[13-variables/ssl-client-s-dn-http-ssl|$ssl_client_s_dn]]
- [[13-variables/ssl-client-s-dn-legacy|$ssl_client_s_dn_legacy]]
- [[13-variables/ssl-client-serial-http-ssl|$ssl_client_serial]]
- [[13-variables/ssl-client-sigalg-http-ssl|$ssl_client_sigalg]]
- [[13-variables/ssl-client-v-end-http-ssl|$ssl_client_v_end]]
- [[13-variables/ssl-client-v-remain-http-ssl|$ssl_client_v_remain]]
- [[13-variables/ssl-client-v-start-http-ssl|$ssl_client_v_start]]
- [[13-variables/ssl-client-verify-http-ssl|$ssl_client_verify]]
- [[13-variables/ssl-curve-http-ssl|$ssl_curve]]
- [[13-variables/ssl-curves-http-ssl|$ssl_curves]]
- [[13-variables/ssl-early-data|$ssl_early_data]]
- [[13-variables/ssl-ech-outer-server-name-http-ssl|$ssl_ech_outer_server_name]]
- [[13-variables/ssl-ech-status-http-ssl|$ssl_ech_status]]
- [[13-variables/ssl-protocol-http-ssl|$ssl_protocol]]
- [[13-variables/ssl-server-name-http-ssl|$ssl_server_name]]
- [[13-variables/ssl-session-id-http-ssl|$ssl_session_id]]
- [[13-variables/ssl-session-reused-http-ssl|$ssl_session_reused]]
- [[13-variables/ssl-sigalg-http-ssl|$ssl_sigalg]]
- [[13-variables/ssl-sigalgs-http-ssl|$ssl_sigalgs]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
