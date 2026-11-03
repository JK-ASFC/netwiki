---
title: "ngx_http_scgi_module"
description: "Module nginx ngx_http_scgi_module — The ngx_http_scgi_module module allows passing requests to an SCGI server."
tags: [nginx, module, ngx_http_scgi_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_scgi_module` module allows passing requests to an SCGI server.

## Example Configuration

```nginx
location / {
    include   scgi_params;
    scgi_pass localhost:9000;
}
```

## Directives

- [[12-directives/scgi-allow-upstream|scgi_allow_upstream]]
- [[12-directives/scgi-bind|scgi_bind]]
- [[12-directives/scgi-bind-dynamic|scgi_bind_dynamic]]
- [[12-directives/scgi-buffer-size|scgi_buffer_size]]
- [[12-directives/scgi-buffering|scgi_buffering]]
- [[12-directives/scgi-buffers|scgi_buffers]]
- [[12-directives/scgi-busy-buffers-size|scgi_busy_buffers_size]]
- [[12-directives/scgi-cache|scgi_cache]]
- [[12-directives/scgi-cache-background-update|scgi_cache_background_update]]
- [[12-directives/scgi-cache-bypass|scgi_cache_bypass]]
- [[12-directives/scgi-cache-key|scgi_cache_key]]
- [[12-directives/scgi-cache-lock|scgi_cache_lock]]
- [[12-directives/scgi-cache-lock-age|scgi_cache_lock_age]]
- [[12-directives/scgi-cache-lock-timeout|scgi_cache_lock_timeout]]
- [[12-directives/scgi-cache-max-range-offset|scgi_cache_max_range_offset]]
- [[12-directives/scgi-cache-methods|scgi_cache_methods]]
- [[12-directives/scgi-cache-min-uses|scgi_cache_min_uses]]
- [[12-directives/scgi-cache-path|scgi_cache_path]]
- [[12-directives/scgi-cache-purge|scgi_cache_purge]]
- [[12-directives/scgi-cache-revalidate|scgi_cache_revalidate]]
- [[12-directives/scgi-cache-use-stale|scgi_cache_use_stale]]
- [[12-directives/scgi-cache-valid|scgi_cache_valid]]
- [[12-directives/scgi-connect-timeout|scgi_connect_timeout]]
- [[12-directives/scgi-force-ranges|scgi_force_ranges]]
- [[12-directives/scgi-hide-header|scgi_hide_header]]
- [[12-directives/scgi-ignore-client-abort|scgi_ignore_client_abort]]
- [[12-directives/scgi-ignore-headers|scgi_ignore_headers]]
- [[12-directives/scgi-intercept-errors|scgi_intercept_errors]]
- [[12-directives/scgi-limit-rate|scgi_limit_rate]]
- [[12-directives/scgi-max-temp-file-size|scgi_max_temp_file_size]]
- [[12-directives/scgi-next-upstream|scgi_next_upstream]]
- [[12-directives/scgi-next-upstream-timeout|scgi_next_upstream_timeout]]
- [[12-directives/scgi-next-upstream-tries|scgi_next_upstream_tries]]
- [[12-directives/scgi-no-cache|scgi_no_cache]]
- [[12-directives/scgi-param|scgi_param]]
- [[12-directives/scgi-pass|scgi_pass]]
- [[12-directives/scgi-pass-header|scgi_pass_header]]
- [[12-directives/scgi-pass-request-body|scgi_pass_request_body]]
- [[12-directives/scgi-pass-request-headers|scgi_pass_request_headers]]
- [[12-directives/scgi-read-timeout|scgi_read_timeout]]
- [[12-directives/scgi-request-buffering|scgi_request_buffering]]
- [[12-directives/scgi-request-dynamic|scgi_request_dynamic]]
- [[12-directives/scgi-send-timeout|scgi_send_timeout]]
- [[12-directives/scgi-socket-keepalive|scgi_socket_keepalive]]
- [[12-directives/scgi-socket-rcvbuf|scgi_socket_rcvbuf]]
- [[12-directives/scgi-socket-sndbuf|scgi_socket_sndbuf]]
- [[12-directives/scgi-store|scgi_store]]
- [[12-directives/scgi-store-access|scgi_store_access]]
- [[12-directives/scgi-temp-file-write-size|scgi_temp_file_write_size]]
- [[12-directives/scgi-temp-path|scgi_temp_path]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
