---
title: "ngx_stream_mqtt_filter_module"
description: "Module nginx ngx_stream_mqtt_filter_module — The ngx_stream_mqtt_filter_module module (1.23.4) provides support for Message Queuing Telemetry Transport protocol (MQTT) versions 3.1.1 and 5.0."
tags: [nginx, module, ngx_stream_mqtt_filter_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_mqtt_filter_module` module (1.23.4) provides support for Message Queuing Telemetry Transport protocol (MQTT) versions [3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html) and [5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html).

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
listen            127.0.0.1:18883;
proxy_pass        backend;
proxy_buffer_size 16k;

mqtt             on;
mqtt_set_connect clientid "$client";
mqtt_set_connect username "$name";
```

## Directives

- [[12-directives/mqtt|mqtt]]
- [[12-directives/mqtt-buffers|mqtt_buffers]]
- [[12-directives/mqtt-rewrite-buffer-size|mqtt_rewrite_buffer_size]]
- [[12-directives/mqtt-set-connect|mqtt_set_connect]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
