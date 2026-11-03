---
title: "otel_span_name"
description: "Directive nginx otel_span_name (ngx_otel_module) — Définit le nom du span OTel. Par défaut, c'est le nom du bloc location de la requête. Le nom peut contenir des variables."
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_span_name name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Définit le nom du [span](https://opentelemetry.io/docs/concepts/observability-primer/#spans) OTel. Par défaut, c'est le nom du bloc location de la requête. Le nom peut contenir des variables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
