---
title: "mqtt_rewrite_buffer_size"
description: "Directive nginx mqtt_rewrite_buffer_size (ngx_stream_mqtt_filter_module) — NOTE This directive is obsolete since version 1.25.1. The mqtt_buffers directive should be used instead. Sets the size of the buffer used for writing a modified message. By default, the buffer size…"
tags: [nginx, directive, ngx_stream_mqtt_filter_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_rewrite_buffer_size size;` |
| **Valeur par défaut** | `mqtt_rewrite_buffer_size 4k\|8k;` |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_filter_module\|ngx_stream_mqtt_filter_module]] |

## Utilisation

> [!NOTE]
> This directive is obsolete since version 1.25.1. The [[12-directives/mqtt-buffers|mqtt_buffers]] directive should be used instead.

Sets the *size* of the buffer used for writing a modified message. By default, the buffer size is equal to one memory page. This is either 4K or 8K, depending on a platform. It can be made smaller, however.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
