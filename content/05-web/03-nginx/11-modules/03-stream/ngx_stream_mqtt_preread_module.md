---
title: "ngx_stream_mqtt_preread_module"
description: "Module nginx ngx_stream_mqtt_preread_module — The ngx_stream_mqtt_preread_module module (1.23.4) allows extracting information from the CONNECT message of the Message Queuing Telemetry Transport protocol (MQTT) versions 3.1.1 and 5.0, for example, a username or a…"
tags: [nginx, module, ngx_stream_mqtt_preread_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_mqtt_preread_module` module (1.23.4) allows extracting information from the CONNECT message of the Message Queuing Telemetry Transport protocol (MQTT) versions [3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html) and [5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), for example, a username or a client ID.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

```nginx
mqtt_preread on;
return       $mqtt_preread_clientid;
```

## Directives

- [[12-directives/mqtt-preread|mqtt_preread]]

## Variables intégrées

- [[13-variables/mqtt-preread-clientid|$mqtt_preread_clientid]]
- [[13-variables/mqtt-preread-username|$mqtt_preread_username]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
