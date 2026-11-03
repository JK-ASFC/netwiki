---
title: "otel_service_name"
description: "Directive nginx otel_service_name (ngx_otel_module) — Sets the “service.name” attribute of the OTel resource."
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_service_name name;` |
| **Valeur par défaut** | `otel_service_name unknown_service:nginx;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Sets the “[`service.name`](https://opentelemetry.io/docs/reference/specification/resource/semantic_conventions/#service)” attribute of the OTel resource.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
