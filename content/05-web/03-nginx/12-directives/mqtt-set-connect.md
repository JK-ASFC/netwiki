---
title: "mqtt_set_connect"
description: "Directive nginx mqtt_set_connect (ngx_stream_mqtt_filter_module) — Sets the message field to the given value for CONNECT message. The following fields are supported: clientid, username, and password. The value can contain text, variables, and their combination.…"
tags: [nginx, directive, ngx_stream_mqtt_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_set_connect field value;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_filter_module\|ngx_stream_mqtt_filter_module]] |

## Utilisation

Sets the message `field` to the given `value` for CONNECT message. The following fields are supported: `clientid`, `username`, and `password`. The value can contain text, variables, and their combination.

Several `mqtt_set_connect` directives can be specified on the same level:

```nginx
mqtt_set_connect clientid "$client";
mqtt_set_connect username "$name";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
