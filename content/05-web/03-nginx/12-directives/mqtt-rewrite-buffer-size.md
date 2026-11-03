---
title: "mqtt_rewrite_buffer_size"
description: "Directive nginx mqtt_rewrite_buffer_size (ngx_stream_mqtt_filter_module) — NOTE Cette directive est obsolète depuis la version 1.25.1. Utilisez plutôt la directive mqtt_buffers. Définit la taille du tampon utilisé pour écrire un message modifié. Par défaut, elle vaut une…"
tags: [nginx, directive, ngx_stream_mqtt_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mqtt_rewrite_buffer_size size;` |
| **Valeur par défaut** | `mqtt_rewrite_buffer_size 4k\|8k;` |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_mqtt_filter_module\|ngx_stream_mqtt_filter_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.25.1. Utilisez plutôt la directive [[12-directives/mqtt-buffers|mqtt_buffers]].

Définit la *taille* du tampon utilisé pour écrire un message modifié. Par défaut, elle vaut une page mémoire, soit 4K ou 8K selon la plate-forme. Elle peut toutefois être réduite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
