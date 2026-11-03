---
title: "ngx_otel_module"
description: "Module nginx ngx_otel_module — Le module ngx_otel_module fournit la prise en charge du traçage distribué OpenTelemetry. Il prend en charge la propagation de contexte W3C et le protocole d'export OTLP/gRPC."
tags: [nginx, module, ngx_otel_module]
icon: puzzle
---

Le module `ngx_otel_module` fournit la prise en charge du traçage distribué [OpenTelemetry](https://opentelemetry.io). Il prend en charge la propagation de contexte [W3C](https://w3c.github.io/trace-context) et le protocole d'export OTLP/gRPC.

Le code source du module est disponible [ici](https://github.com/nginx/nginx-otel). Les instructions de téléchargement et d'installation sont disponibles [ici](https://github.com/nginx/nginx-otel/blob/main/README.md).

Le module est aussi disponible dans le paquet précompilé `nginx-module-otel` depuis la version 1.25.3 et, dans le cadre de notre [abonnement commercial](https://nginx.com/products/), dans le paquet `nginx-plus-module-otel` depuis la version 1.23.4.

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

## Attributs de span par défaut

Les [attributs de span](https://opentelemetry.io/docs/specs/semconv/registry/attributes/http/) suivants sont ajoutés automatiquement :

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
