---
title: "ngx_stream_zone_sync_module"
description: "Module nginx ngx_stream_zone_sync_module — The ngx_stream_zone_sync_module module (1.13.8) provides the necessary support for synchronizing contents of shared memory zones between nodes of a cluster. To enable synchronization for a particular zone, a…"
tags: [nginx, module, ngx_stream_zone_sync_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_zone_sync_module` module (1.13.8) provides the necessary support for synchronizing contents of [[12-directives/zone-stream-upstream|shared memory zones]] between nodes of a cluster. To enable synchronization for a particular zone, a corresponding module must support this feature. Currently, it is possible to synchronize HTTP [[12-directives/sticky|sticky]] sessions, information about [[11-modules/02-http/ngx_http_limit_req_module|excessive HTTP requests]], and key-value pairs both in [[11-modules/02-http/ngx_http_keyval_module|http]] and [[11-modules/03-stream/ngx_stream_keyval_module|stream]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

Minimal configuration:

```nginx
http {
    ...

    upstream backend {
       server backend1.example.com:8080;
       server backend2.example.com:8081;

       sticky learn
              create=$upstream_cookie_examplecookie
              lookup=$cookie_examplecookie
              zone=client_sessions:1m sync;
    }

    ...
}

stream {
    ...


    server {
        zone_sync;

        listen 127.0.0.1:12345;

        # cluster of 2 nodes
        zone_sync_server a.example.com:12345;
        zone_sync_server b.example.com:12345;

    }
```

A more complex configuration with SSL enabled and with cluster members defined by DNS:

```nginx
...

stream {
    ...

    resolver 127.0.0.1 valid=10s;

    server {
        zone_sync;

        # the name resolves to multiple addresses that correspond to cluster nodes
        zone_sync_server cluster.example.com:12345 resolve;

        listen 127.0.0.1:4433 ssl;

        ssl_certificate     localhost.crt;
        ssl_certificate_key localhost.key;

        zone_sync_ssl on;

        zone_sync_ssl_certificate     localhost.crt;
        zone_sync_ssl_certificate_key localhost.key;
    }
}
```

## API endpoints

The synchronization status of a node is available via the [[11-modules/02-http/ngx_http_api_module|/stream/zone_sync/]] endpoint of the API which returns the [[11-modules/02-http/ngx_http_api_module|following]] metrics.

## Starting, stopping, removing a cluster node

To start a new node, update a DNS record of a cluster hostname with the IP address of the new node and start an instance. The new node will discover other nodes from DNS or static configuration and will start sending updates to them. Other nodes will eventually discover the new node using DNS and start pushing updates to it. In case of static configuration, other nodes need to be reloaded in order to send updates to the new node.

To stop a node, send the `QUIT` signal to the instance. The node will finish zone synchronization and gracefully close open connections.

To remove a node, update a DNS record of a cluster hostname and remove the IP address of the node. All other nodes will eventually discover that the node is removed, close connections to the node, and will no longer try to connect to it. After the node is removed, it can be stopped as described above. In case of static configuration, other nodes need to be reloaded in order to stop sending updates to the removed node.

## Directives

- [[12-directives/zone-sync|zone_sync]]
- [[12-directives/zone-sync-buffers|zone_sync_buffers]]
- [[12-directives/zone-sync-connect-retry-interval|zone_sync_connect_retry_interval]]
- [[12-directives/zone-sync-connect-timeout|zone_sync_connect_timeout]]
- [[12-directives/zone-sync-interval|zone_sync_interval]]
- [[12-directives/zone-sync-recv-buffer-size|zone_sync_recv_buffer_size]]
- [[12-directives/zone-sync-server|zone_sync_server]]
- [[12-directives/zone-sync-ssl|zone_sync_ssl]]
- [[12-directives/zone-sync-ssl-certificate|zone_sync_ssl_certificate]]
- [[12-directives/zone-sync-ssl-certificate-key|zone_sync_ssl_certificate_key]]
- [[12-directives/zone-sync-ssl-ciphers|zone_sync_ssl_ciphers]]
- [[12-directives/zone-sync-ssl-conf-command|zone_sync_ssl_conf_command]]
- [[12-directives/zone-sync-ssl-crl|zone_sync_ssl_crl]]
- [[12-directives/zone-sync-ssl-name|zone_sync_ssl_name]]
- [[12-directives/zone-sync-ssl-password-file|zone_sync_ssl_password_file]]
- [[12-directives/zone-sync-ssl-protocols|zone_sync_ssl_protocols]]
- [[12-directives/zone-sync-ssl-server-name|zone_sync_ssl_server_name]]
- [[12-directives/zone-sync-ssl-trusted-certificate|zone_sync_ssl_trusted_certificate]]
- [[12-directives/zone-sync-ssl-verify|zone_sync_ssl_verify]]
- [[12-directives/zone-sync-ssl-verify-depth|zone_sync_ssl_verify_depth]]
- [[12-directives/zone-sync-timeout|zone_sync_timeout]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
