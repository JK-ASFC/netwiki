---
title: "ngx_http_proxy_module"
description: "Module nginx ngx_http_proxy_module — The ngx_http_proxy_module module allows passing requests to another server."
tags: [nginx, module, ngx_http_proxy_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_proxy_module` module allows passing requests to another server.

## Example Configuration

```nginx
location / {
    proxy_pass       http://localhost:8000;
    proxy_set_header Host      $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Directives

- [[12-directives/proxy-allow-upstream|proxy_allow_upstream]]
- [[12-directives/proxy-bind-http-proxy|proxy_bind]]
- [[12-directives/proxy-bind-dynamic-http-proxy|proxy_bind_dynamic]]
- [[12-directives/proxy-buffer-size-http-proxy|proxy_buffer_size]]
- [[12-directives/proxy-buffering|proxy_buffering]]
- [[12-directives/proxy-buffers|proxy_buffers]]
- [[12-directives/proxy-busy-buffers-size|proxy_busy_buffers_size]]
- [[12-directives/proxy-cache|proxy_cache]]
- [[12-directives/proxy-cache-background-update|proxy_cache_background_update]]
- [[12-directives/proxy-cache-bypass|proxy_cache_bypass]]
- [[12-directives/proxy-cache-convert-head|proxy_cache_convert_head]]
- [[12-directives/proxy-cache-key|proxy_cache_key]]
- [[12-directives/proxy-cache-lock|proxy_cache_lock]]
- [[12-directives/proxy-cache-lock-age|proxy_cache_lock_age]]
- [[12-directives/proxy-cache-lock-timeout|proxy_cache_lock_timeout]]
- [[12-directives/proxy-cache-max-range-offset|proxy_cache_max_range_offset]]
- [[12-directives/proxy-cache-methods|proxy_cache_methods]]
- [[12-directives/proxy-cache-min-uses|proxy_cache_min_uses]]
- [[12-directives/proxy-cache-path|proxy_cache_path]]
- [[12-directives/proxy-cache-purge|proxy_cache_purge]]
- [[12-directives/proxy-cache-revalidate|proxy_cache_revalidate]]
- [[12-directives/proxy-cache-use-stale|proxy_cache_use_stale]]
- [[12-directives/proxy-cache-valid|proxy_cache_valid]]
- [[12-directives/proxy-connect-timeout-http-proxy|proxy_connect_timeout]]
- [[12-directives/proxy-cookie-domain|proxy_cookie_domain]]
- [[12-directives/proxy-cookie-flags|proxy_cookie_flags]]
- [[12-directives/proxy-cookie-path|proxy_cookie_path]]
- [[12-directives/proxy-force-ranges|proxy_force_ranges]]
- [[12-directives/proxy-headers-hash-bucket-size|proxy_headers_hash_bucket_size]]
- [[12-directives/proxy-headers-hash-max-size|proxy_headers_hash_max_size]]
- [[12-directives/proxy-hide-header|proxy_hide_header]]
- [[12-directives/proxy-http-version|proxy_http_version]]
- [[12-directives/proxy-ignore-client-abort|proxy_ignore_client_abort]]
- [[12-directives/proxy-ignore-headers|proxy_ignore_headers]]
- [[12-directives/proxy-intercept-errors|proxy_intercept_errors]]
- [[12-directives/proxy-limit-rate|proxy_limit_rate]]
- [[12-directives/proxy-max-temp-file-size|proxy_max_temp_file_size]]
- [[12-directives/proxy-method|proxy_method]]
- [[12-directives/proxy-next-upstream-http-proxy|proxy_next_upstream]]
- [[12-directives/proxy-next-upstream-timeout-http-proxy|proxy_next_upstream_timeout]]
- [[12-directives/proxy-next-upstream-tries-http-proxy|proxy_next_upstream_tries]]
- [[12-directives/proxy-no-cache|proxy_no_cache]]
- [[12-directives/proxy-pass-http-proxy|proxy_pass]]
- [[12-directives/proxy-pass-header|proxy_pass_header]]
- [[12-directives/proxy-pass-request-body|proxy_pass_request_body]]
- [[12-directives/proxy-pass-request-headers|proxy_pass_request_headers]]
- [[12-directives/proxy-pass-trailers|proxy_pass_trailers]]
- [[12-directives/proxy-read-timeout|proxy_read_timeout]]
- [[12-directives/proxy-redirect|proxy_redirect]]
- [[12-directives/proxy-request-buffering|proxy_request_buffering]]
- [[12-directives/proxy-request-dynamic|proxy_request_dynamic]]
- [[12-directives/proxy-send-lowat|proxy_send_lowat]]
- [[12-directives/proxy-send-timeout|proxy_send_timeout]]
- [[12-directives/proxy-set-body|proxy_set_body]]
- [[12-directives/proxy-set-header|proxy_set_header]]
- [[12-directives/proxy-socket-keepalive-http-proxy|proxy_socket_keepalive]]
- [[12-directives/proxy-socket-rcvbuf-http-proxy|proxy_socket_rcvbuf]]
- [[12-directives/proxy-socket-sndbuf-http-proxy|proxy_socket_sndbuf]]
- [[12-directives/proxy-ssl-certificate-http-proxy|proxy_ssl_certificate]]
- [[12-directives/proxy-ssl-certificate-cache-http-proxy|proxy_ssl_certificate_cache]]
- [[12-directives/proxy-ssl-certificate-key-http-proxy|proxy_ssl_certificate_key]]
- [[12-directives/proxy-ssl-ciphers-http-proxy|proxy_ssl_ciphers]]
- [[12-directives/proxy-ssl-conf-command-http-proxy|proxy_ssl_conf_command]]
- [[12-directives/proxy-ssl-crl-http-proxy|proxy_ssl_crl]]
- [[12-directives/proxy-ssl-key-log-http-proxy|proxy_ssl_key_log]]
- [[12-directives/proxy-ssl-name-http-proxy|proxy_ssl_name]]
- [[12-directives/proxy-ssl-password-file-http-proxy|proxy_ssl_password_file]]
- [[12-directives/proxy-ssl-protocols-http-proxy|proxy_ssl_protocols]]
- [[12-directives/proxy-ssl-server-name-http-proxy|proxy_ssl_server_name]]
- [[12-directives/proxy-ssl-session-reuse-http-proxy|proxy_ssl_session_reuse]]
- [[12-directives/proxy-ssl-trusted-certificate-http-proxy|proxy_ssl_trusted_certificate]]
- [[12-directives/proxy-ssl-verify-http-proxy|proxy_ssl_verify]]
- [[12-directives/proxy-ssl-verify-depth-http-proxy|proxy_ssl_verify_depth]]
- [[12-directives/proxy-store|proxy_store]]
- [[12-directives/proxy-store-access|proxy_store_access]]
- [[12-directives/proxy-temp-file-write-size|proxy_temp_file_write_size]]
- [[12-directives/proxy-temp-path|proxy_temp_path]]

## Variables intégrées

- [[13-variables/proxy-host|$proxy_host]]
- [[13-variables/proxy-port|$proxy_port]]
- [[13-variables/proxy-add-x-forwarded-for|$proxy_add_x_forwarded_for]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
