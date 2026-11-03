---
title: "otel_trace_context"
description: "Directive nginx otel_trace_context (ngx_otel_module) — Specifies how to propagate traceparent/tracestate headers: - extract uses an existing trace context from the request, so that the identifiers of a trace and the parent span are inherited from the…"
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_trace_context extract \| inject \| propagate \| ignore;` |
| **Valeur par défaut** | `otel_trace_context ignore;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Specifies how to propagate [traceparent/tracestate](https://www.w3.org/TR/trace-context/#design-overview) headers:

- **`extract`**

  uses an existing trace context from the request, so that the identifiers of a [[13-variables/otel-trace-id|trace]] and the [[13-variables/otel-parent-id|parent span]] are inherited from the incoming request.

- **`inject`**

  adds a new context to the request, overwriting existing headers, if any.

- **`propagate`**

  updates the existing context (combines `extract` and `inject`).

- **`ignore`**

  skips context headers processing.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
