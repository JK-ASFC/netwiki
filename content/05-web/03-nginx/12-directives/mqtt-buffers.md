---
title: "mqtt_buffers"
description: "Directive nginx mqtt_buffers (ngx_stream_mqtt_filter_module) — Sets the number and size of the buffers used for handling MQTT messages, for a single connection."
tags: [nginx, directive, ngx_stream_mqtt_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_buffers number size;` |
| **Valeur par défaut** | `mqtt_buffers 100 1k;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.25.1 |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_filter_module\|ngx_stream_mqtt_filter_module]] |

## Utilisation

Sets the *number* and *size* of the buffers used for handling MQTT messages, for a single connection.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
