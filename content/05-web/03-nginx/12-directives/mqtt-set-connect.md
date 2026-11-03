---
title: "mqtt_set_connect"
description: "Directive nginx mqtt_set_connect (ngx_stream_mqtt_filter_module) — Fixe le champ field du message CONNECT à la valeur value. Champs pris en charge : clientid, username et password. La valeur peut contenir du texte, des variables et leur combinaison. Plusieurs…"
tags: [nginx, directive, ngx_stream_mqtt_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_set_connect field value;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_filter_module\|ngx_stream_mqtt_filter_module]] |

## Utilisation

Fixe le champ `field` du message CONNECT à la valeur `value`. Champs pris en charge : `clientid`, `username` et `password`. La valeur peut contenir du texte, des variables et leur combinaison.

Plusieurs directives `mqtt_set_connect` peuvent être indiquées au même niveau :

```nginx
mqtt_set_connect clientid "$client";
mqtt_set_connect username "$name";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
