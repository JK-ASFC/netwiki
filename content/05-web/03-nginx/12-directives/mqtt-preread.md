---
title: "mqtt_preread"
description: "Directive nginx mqtt_preread (ngx_stream_mqtt_preread_module) — Enables extracting information from the MQTT CONNECT message at the preread phase."
tags: [nginx, directive, ngx_stream_mqtt_preread_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_preread on \| off;` |
| **Valeur par défaut** | `mqtt_preread off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_preread_module\|ngx_stream_mqtt_preread_module]] |

## Utilisation

Enables extracting information from the MQTT CONNECT message at the [[10-guides/03-stream/stream-processing|preread]] phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
