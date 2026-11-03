---
title: "ngx_http_fastcgi_module"
description: "Module nginx ngx_http_fastcgi_module — The ngx_http_fastcgi_module module allows passing requests to a FastCGI server."
tags: [nginx, module, ngx_http_fastcgi_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_fastcgi_module` module allows passing requests to a FastCGI server.

## Exemple de configuration

```nginx
location / {
    fastcgi_pass  localhost:9000;
    fastcgi_index index.php;

    fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
    fastcgi_param QUERY_STRING    $query_string;
    fastcgi_param REQUEST_METHOD  $request_method;
    fastcgi_param CONTENT_TYPE    $content_type;
    fastcgi_param CONTENT_LENGTH  $content_length;
}
```

## Parameters Passed to a FastCGI Server

HTTP request header fields are passed to a FastCGI server as parameters. In applications and scripts running as FastCGI servers, these parameters are usually made available as environment variables. For example, the `User-Agent` header field is passed as the `HTTP_USER_AGENT` parameter. In addition to HTTP request header fields, it is possible to pass arbitrary parameters using the [[12-directives/fastcgi-param|fastcgi_param]] directive.

## Directives

- [[12-directives/fastcgi-allow-upstream|fastcgi_allow_upstream]]
- [[12-directives/fastcgi-bind|fastcgi_bind]]
- [[12-directives/fastcgi-bind-dynamic|fastcgi_bind_dynamic]]
- [[12-directives/fastcgi-buffer-size|fastcgi_buffer_size]]
- [[12-directives/fastcgi-buffering|fastcgi_buffering]]
- [[12-directives/fastcgi-buffers|fastcgi_buffers]]
- [[12-directives/fastcgi-busy-buffers-size|fastcgi_busy_buffers_size]]
- [[12-directives/fastcgi-cache|fastcgi_cache]]
- [[12-directives/fastcgi-cache-background-update|fastcgi_cache_background_update]]
- [[12-directives/fastcgi-cache-bypass|fastcgi_cache_bypass]]
- [[12-directives/fastcgi-cache-key|fastcgi_cache_key]]
- [[12-directives/fastcgi-cache-lock|fastcgi_cache_lock]]
- [[12-directives/fastcgi-cache-lock-age|fastcgi_cache_lock_age]]
- [[12-directives/fastcgi-cache-lock-timeout|fastcgi_cache_lock_timeout]]
- [[12-directives/fastcgi-cache-max-range-offset|fastcgi_cache_max_range_offset]]
- [[12-directives/fastcgi-cache-methods|fastcgi_cache_methods]]
- [[12-directives/fastcgi-cache-min-uses|fastcgi_cache_min_uses]]
- [[12-directives/fastcgi-cache-path|fastcgi_cache_path]]
- [[12-directives/fastcgi-cache-purge|fastcgi_cache_purge]]
- [[12-directives/fastcgi-cache-revalidate|fastcgi_cache_revalidate]]
- [[12-directives/fastcgi-cache-use-stale|fastcgi_cache_use_stale]]
- [[12-directives/fastcgi-cache-valid|fastcgi_cache_valid]]
- [[12-directives/fastcgi-catch-stderr|fastcgi_catch_stderr]]
- [[12-directives/fastcgi-connect-timeout|fastcgi_connect_timeout]]
- [[12-directives/fastcgi-force-ranges|fastcgi_force_ranges]]
- [[12-directives/fastcgi-hide-header|fastcgi_hide_header]]
- [[12-directives/fastcgi-ignore-client-abort|fastcgi_ignore_client_abort]]
- [[12-directives/fastcgi-ignore-headers|fastcgi_ignore_headers]]
- [[12-directives/fastcgi-index|fastcgi_index]]
- [[12-directives/fastcgi-intercept-errors|fastcgi_intercept_errors]]
- [[12-directives/fastcgi-keep-conn|fastcgi_keep_conn]]
- [[12-directives/fastcgi-limit-rate|fastcgi_limit_rate]]
- [[12-directives/fastcgi-max-temp-file-size|fastcgi_max_temp_file_size]]
- [[12-directives/fastcgi-next-upstream|fastcgi_next_upstream]]
- [[12-directives/fastcgi-next-upstream-timeout|fastcgi_next_upstream_timeout]]
- [[12-directives/fastcgi-next-upstream-tries|fastcgi_next_upstream_tries]]
- [[12-directives/fastcgi-no-cache|fastcgi_no_cache]]
- [[12-directives/fastcgi-param|fastcgi_param]]
- [[12-directives/fastcgi-pass|fastcgi_pass]]
- [[12-directives/fastcgi-pass-header|fastcgi_pass_header]]
- [[12-directives/fastcgi-pass-request-body|fastcgi_pass_request_body]]
- [[12-directives/fastcgi-pass-request-headers|fastcgi_pass_request_headers]]
- [[12-directives/fastcgi-read-timeout|fastcgi_read_timeout]]
- [[12-directives/fastcgi-request-buffering|fastcgi_request_buffering]]
- [[12-directives/fastcgi-request-dynamic|fastcgi_request_dynamic]]
- [[12-directives/fastcgi-send-lowat|fastcgi_send_lowat]]
- [[12-directives/fastcgi-send-timeout|fastcgi_send_timeout]]
- [[12-directives/fastcgi-socket-keepalive|fastcgi_socket_keepalive]]
- [[12-directives/fastcgi-socket-rcvbuf|fastcgi_socket_rcvbuf]]
- [[12-directives/fastcgi-socket-sndbuf|fastcgi_socket_sndbuf]]
- [[12-directives/fastcgi-split-path-info|fastcgi_split_path_info]]
- [[12-directives/fastcgi-store|fastcgi_store]]
- [[12-directives/fastcgi-store-access|fastcgi_store_access]]
- [[12-directives/fastcgi-temp-file-write-size|fastcgi_temp_file_write_size]]
- [[12-directives/fastcgi-temp-path|fastcgi_temp_path]]

## Variables intégrées

- [[13-variables/fastcgi-script-name|$fastcgi_script_name]]
- [[13-variables/fastcgi-path-info|$fastcgi_path_info]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
