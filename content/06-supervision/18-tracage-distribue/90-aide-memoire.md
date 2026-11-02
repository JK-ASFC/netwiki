---
title: Jaeger, Zipkin et Tempo — aide-mémoire
description: Ports et API de traçage (OTLP 4317/4318, Jaeger 16686 et API /api/traces, Zipkin 9411 et /api/v2), commandes Tempo (tempo-cli query trace-id, list blocks, API /api/traces, /api/search, /ready, /status), requêtes TraceQL courantes et variables OpenTelemetry d'instrumentation, avec exemples.
tags: [aide-mémoire, jaeger, zipkin, tempo, traceql]
icon: terminal
---

Explications : [[01-jaeger-zipkin|Jaeger et Zipkin]] · [[02-tempo|Tempo]].

```bash
curl -s "http://jaeger:16686/api/services" | jq . ; curl -s "http://jaeger:16686/api/traces?service=inventaire&limit=5" | jq '.data[].traceID'
curl -s "http://zipkin:9411/api/v2/services" ; curl -s "http://zipkin:9411/api/v2/traces?serviceName=inventaire&limit=5" | jq length
curl -s http://tempo:3200/ready ; curl -s http://tempo:3200/api/traces/<trace_id> | jq '.batches | length'
curl -sG http://tempo:3200/api/search --data-urlencode 'q={ resource.service.name = "inventaire" && status = error }' | jq '.traces[].traceID'
tempo-cli query api trace-id tempo:3200 <trace_id> ; tempo-cli list blocks <locataire> -c tempo.yaml
export OTEL_TRACES_SAMPLER=parentbased_traceidratio OTEL_TRACES_SAMPLER_ARG=0.1     # échantillonnage à 10 %
```

TraceQL : `{ status = error }` · `{ duration > 1s }` · `{ span.http.status_code >= 500 }` · `{ resource.service.name = "a" } >> { resource.service.name = "b" }` · `| count() > 3`.
