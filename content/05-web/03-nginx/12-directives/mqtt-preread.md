---
title: "mqtt_preread"
description: "Directive nginx mqtt_preread (ngx_stream_mqtt_preread_module) — Active l'extraction d'informations du message MQTT CONNECT à la phase de prélecture."
tags: [nginx, directive, ngx_stream_mqtt_preread_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_preread on \| off;` |
| **Valeur par défaut** | `mqtt_preread off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_preread_module\|ngx_stream_mqtt_preread_module]] |

## Utilisation

Active l'extraction d'informations du message MQTT CONNECT à la phase de [[10-guides/03-stream/stream-processing|prélecture]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
