---
title: "otel_exporter"
description: "Directive nginx otel_exporter (ngx_otel_module) — Specifies OTel data export parameters: - endpoint (http|https)://host:port; OTLP/gRPC endpoint that will accept telemetry data. TLS is supported since 0.1.2. - trusted_certificate path; the CA…"
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_exporter { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Specifies OTel data export parameters:

- **`endpoint [(http|https)://]host:port;`**

  OTLP/gRPC endpoint that will accept telemetry data. TLS is supported since 0.1.2.

- **`trusted_certificate path;`**

  the CA certificates file in PEM format used to verify TLS endpoint (since 0.1.2). Defaults to OS provided CA bundle.

- **`header name value;`**

  a custom HTTP header to add to telemetry export request (since 0.1.2).

- **`interval time;`**

  the maximum interval between two exports, by default is `5` seconds.

- **`batch_size number;`**

  the maximum number of spans to be sent in one batch per worker, by default is `512`.

- **`batch_count number;`**

  the number of pending batches per worker, spans exceeding the limit are dropped, by default is `4`.

Exemple :

```nginx
otel_exporter {
    endpoint https://otel-example.nginx.com:4317;

    header X-API-Token "my-token-value";
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
