---
title: "otel_trace_context"
description: "Directive nginx otel_trace_context (ngx_otel_module) — Indique comment propager les en-têtes traceparent/tracestate : - extract utilise le contexte de trace existant de la requête : les identifiants de la trace et du span parent sont hérités de la…"
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_trace_context extract \| inject \| propagate \| ignore;` |
| **Valeur par défaut** | `otel_trace_context ignore;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Indique comment propager les en-têtes [traceparent/tracestate](https://www.w3.org/TR/trace-context/#design-overview) :

- **`extract`**

  utilise le contexte de trace existant de la requête : les identifiants de la [[13-variables/otel-trace-id|trace]] et du [[13-variables/otel-parent-id|span parent]] sont hérités de la requête entrante.

- **`inject`**

  ajoute un nouveau contexte à la requête, en écrasant les en-têtes existants le cas échéant.

- **`propagate`**

  met à jour le contexte existant (combine `extract` et `inject`).

- **`ignore`**

  ignore le traitement des en-têtes de contexte.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
