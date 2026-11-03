---
title: "ngx_http_uwsgi_module"
description: "Module nginx ngx_http_uwsgi_module — The ngx_http_uwsgi_module module allows passing requests to a uwsgi server."
tags: [nginx, module, ngx_http_uwsgi_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_uwsgi_module` module allows passing requests to a uwsgi server.

## Exemple de configuration

```nginx
location / {
    include    uwsgi_params;
    uwsgi_pass localhost:9000;
}
```

## Directives

- [[12-directives/uwsgi-allow-upstream|uwsgi_allow_upstream]]
- [[12-directives/uwsgi-bind|uwsgi_bind]]
- [[12-directives/uwsgi-bind-dynamic|uwsgi_bind_dynamic]]
- [[12-directives/uwsgi-buffer-size|uwsgi_buffer_size]]
- [[12-directives/uwsgi-buffering|uwsgi_buffering]]
- [[12-directives/uwsgi-buffers|uwsgi_buffers]]
- [[12-directives/uwsgi-busy-buffers-size|uwsgi_busy_buffers_size]]
- [[12-directives/uwsgi-cache|uwsgi_cache]]
- [[12-directives/uwsgi-cache-background-update|uwsgi_cache_background_update]]
- [[12-directives/uwsgi-cache-bypass|uwsgi_cache_bypass]]
- [[12-directives/uwsgi-cache-key|uwsgi_cache_key]]
- [[12-directives/uwsgi-cache-lock|uwsgi_cache_lock]]
- [[12-directives/uwsgi-cache-lock-age|uwsgi_cache_lock_age]]
- [[12-directives/uwsgi-cache-lock-timeout|uwsgi_cache_lock_timeout]]
- [[12-directives/uwsgi-cache-max-range-offset|uwsgi_cache_max_range_offset]]
- [[12-directives/uwsgi-cache-methods|uwsgi_cache_methods]]
- [[12-directives/uwsgi-cache-min-uses|uwsgi_cache_min_uses]]
- [[12-directives/uwsgi-cache-path|uwsgi_cache_path]]
- [[12-directives/uwsgi-cache-purge|uwsgi_cache_purge]]
- [[12-directives/uwsgi-cache-revalidate|uwsgi_cache_revalidate]]
- [[12-directives/uwsgi-cache-use-stale|uwsgi_cache_use_stale]]
- [[12-directives/uwsgi-cache-valid|uwsgi_cache_valid]]
- [[12-directives/uwsgi-connect-timeout|uwsgi_connect_timeout]]
- [[12-directives/uwsgi-force-ranges|uwsgi_force_ranges]]
- [[12-directives/uwsgi-hide-header|uwsgi_hide_header]]
- [[12-directives/uwsgi-ignore-client-abort|uwsgi_ignore_client_abort]]
- [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]]
- [[12-directives/uwsgi-intercept-errors|uwsgi_intercept_errors]]
- [[12-directives/uwsgi-limit-rate|uwsgi_limit_rate]]
- [[12-directives/uwsgi-max-temp-file-size|uwsgi_max_temp_file_size]]
- [[12-directives/uwsgi-modifier1|uwsgi_modifier1]]
- [[12-directives/uwsgi-modifier2|uwsgi_modifier2]]
- [[12-directives/uwsgi-next-upstream|uwsgi_next_upstream]]
- [[12-directives/uwsgi-next-upstream-timeout|uwsgi_next_upstream_timeout]]
- [[12-directives/uwsgi-next-upstream-tries|uwsgi_next_upstream_tries]]
- [[12-directives/uwsgi-no-cache|uwsgi_no_cache]]
- [[12-directives/uwsgi-param|uwsgi_param]]
- [[12-directives/uwsgi-pass|uwsgi_pass]]
- [[12-directives/uwsgi-pass-header|uwsgi_pass_header]]
- [[12-directives/uwsgi-pass-request-body|uwsgi_pass_request_body]]
- [[12-directives/uwsgi-pass-request-headers|uwsgi_pass_request_headers]]
- [[12-directives/uwsgi-read-timeout|uwsgi_read_timeout]]
- [[12-directives/uwsgi-request-buffering|uwsgi_request_buffering]]
- [[12-directives/uwsgi-request-dynamic|uwsgi_request_dynamic]]
- [[12-directives/uwsgi-send-timeout|uwsgi_send_timeout]]
- [[12-directives/uwsgi-socket-keepalive|uwsgi_socket_keepalive]]
- [[12-directives/uwsgi-socket-rcvbuf|uwsgi_socket_rcvbuf]]
- [[12-directives/uwsgi-socket-sndbuf|uwsgi_socket_sndbuf]]
- [[12-directives/uwsgi-ssl-certificate|uwsgi_ssl_certificate]]
- [[12-directives/uwsgi-ssl-certificate-cache|uwsgi_ssl_certificate_cache]]
- [[12-directives/uwsgi-ssl-certificate-key|uwsgi_ssl_certificate_key]]
- [[12-directives/uwsgi-ssl-ciphers|uwsgi_ssl_ciphers]]
- [[12-directives/uwsgi-ssl-conf-command|uwsgi_ssl_conf_command]]
- [[12-directives/uwsgi-ssl-crl|uwsgi_ssl_crl]]
- [[12-directives/uwsgi-ssl-key-log|uwsgi_ssl_key_log]]
- [[12-directives/uwsgi-ssl-name|uwsgi_ssl_name]]
- [[12-directives/uwsgi-ssl-password-file|uwsgi_ssl_password_file]]
- [[12-directives/uwsgi-ssl-protocols|uwsgi_ssl_protocols]]
- [[12-directives/uwsgi-ssl-server-name|uwsgi_ssl_server_name]]
- [[12-directives/uwsgi-ssl-session-reuse|uwsgi_ssl_session_reuse]]
- [[12-directives/uwsgi-ssl-trusted-certificate|uwsgi_ssl_trusted_certificate]]
- [[12-directives/uwsgi-ssl-verify|uwsgi_ssl_verify]]
- [[12-directives/uwsgi-ssl-verify-depth|uwsgi_ssl_verify_depth]]
- [[12-directives/uwsgi-store|uwsgi_store]]
- [[12-directives/uwsgi-store-access|uwsgi_store_access]]
- [[12-directives/uwsgi-temp-file-write-size|uwsgi_temp_file_write_size]]
- [[12-directives/uwsgi-temp-path|uwsgi_temp_path]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
