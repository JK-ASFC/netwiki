---
title: "otel_span_name"
description: "Directive nginx otel_span_name (ngx_otel_module) — Defines the name of the OTel span. By default, it is a name of the location for a request. The name can contain variables."
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_span_name name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Defines the name of the OTel [span](https://opentelemetry.io/docs/concepts/observability-primer/#spans). By default, it is a name of the location for a request. The name can contain variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
