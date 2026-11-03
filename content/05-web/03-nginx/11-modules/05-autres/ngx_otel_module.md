---
title: "ngx_otel_module"
description: "Module nginx ngx_otel_module — The ngx_otel_module module provides OpenTelemetry distributed tracing support. The module supports W3C context propagation and OTLP/gRPC export protocol."
tags: [nginx, module, ngx_otel_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_otel_module` module provides [OpenTelemetry](https://opentelemetry.io) distributed tracing support. The module supports [W3C](https://w3c.github.io/trace-context) context propagation and OTLP/gRPC export protocol.

The source code of the module is available [here](https://github.com/nginx/nginx-otel). Download and install instructions are available [here](https://github.com/nginx/nginx-otel/blob/main/README.md).

The module is also available in a prebuilt `nginx-module-otel` package since 1.25.3 and in `nginx-plus-module-otel` package as part of our [abonnement commercial](https://nginx.com/products/) since 1.23.4.

## Exemple de configuration

```nginx
load_module modules/ngx_otel_module.so;

events {
}

http {

    otel_exporter {
        endpoint localhost:4317;
    }

    server {
        listen 127.0.0.1:8080;

        location / {
            otel_trace         on;
            otel_trace_context inject;

            proxy_pass http://backend;
        }
    }
}
```

## Default span attributes

The following [span attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/http/) are added automatically:

- `http.method`
- `http.target`
- `http.route`
- `http.scheme`
- `http.flavor`
- `http.user_agent`
- `http.request_content_length`
- `http.response_content_length`
- `http.status_code`
- `net.host.name`
- `net.host.port`
- `net.sock.peer.addr`
- `net.sock.peer.port`

## Directives

- [[12-directives/otel-exporter|otel_exporter]]
- [[12-directives/otel-service-name|otel_service_name]]
- [[12-directives/otel-resource-attr|otel_resource_attr]]
- [[12-directives/otel-trace|otel_trace]]
- [[12-directives/otel-trace-context|otel_trace_context]]
- [[12-directives/otel-span-name|otel_span_name]]
- [[12-directives/otel-span-attr|otel_span_attr]]

## Variables intégrées

- [[13-variables/otel-trace-id|$otel_trace_id]]
- [[13-variables/otel-span-id|$otel_span_id]]
- [[13-variables/otel-parent-id|$otel_parent_id]]
- [[13-variables/otel-parent-sampled|$otel_parent_sampled]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
