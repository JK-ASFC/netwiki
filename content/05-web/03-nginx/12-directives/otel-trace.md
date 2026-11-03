---
title: "otel_trace"
description: "Directive nginx otel_trace (ngx_otel_module) — Enables or disables OpenTelemetry tracing. The directive can also be enabled by specifying a variable: nginx split_clients \"$otel_trace_id\" $ratio_sampler { 10% on; off; } server { location / {…"
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_trace on \| off \| $variable;` |
| **Valeur par défaut** | `otel_trace off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Enables or disables OpenTelemetry tracing. The directive can also be enabled by specifying a variable:

```nginx
split_clients "$otel_trace_id" $ratio_sampler {
              10%              on;
              *                off;
}

server {
    location / {
        otel_trace         $ratio_sampler;
        otel_trace_context inject;
        proxy_pass         http://backend;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
