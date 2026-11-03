---
title: "ngx_stream_mqtt_preread_module"
description: "Module nginx ngx_stream_mqtt_preread_module — Le module ngx_stream_mqtt_preread_module (1.23.4) permet d'extraire des informations du message CONNECT du protocole Message Queuing Telemetry Transport (MQTT) versions 3.1.1 et 5.0, par exemple un nom d'utilisateur ou…"
tags: [nginx, module, ngx_stream_mqtt_preread_module]
icon: puzzle
---

Le module `ngx_stream_mqtt_preread_module` (1.23.4) permet d'extraire des informations du message CONNECT du protocole Message Queuing Telemetry Transport (MQTT) versions [3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html) et [5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), par exemple un nom d'utilisateur ou un identifiant client.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

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
