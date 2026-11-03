---
title: "otel_service_name"
description: "Directive nginx otel_service_name (ngx_otel_module) — Définit l'attribut « service.name » de la ressource OTel."
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_service_name name;` |
| **Valeur par défaut** | `otel_service_name unknown_service:nginx;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Définit l'attribut « [`service.name`](https://opentelemetry.io/docs/reference/specification/resource/semantic_conventions/#service) » de la ressource OTel.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
