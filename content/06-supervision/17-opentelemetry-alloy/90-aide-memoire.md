---
title: OpenTelemetry Collector et Alloy — aide-mémoire des commandes
description: Commandes du Collector OpenTelemetry (validate, components, journaux, zpages, health_check, métriques internes, telemetrygen pour tester) et de Grafana Alloy (run, fmt, convert, tools, interface 12345, service), variables d'environnement OTEL_* pour les applications, avec exemples.
tags: [aide-mémoire, opentelemetry, otelcol, grafana alloy]
icon: terminal
---

Explications : [[01-presentation-installation|OpenTelemetry Collector et Alloy]].

```bash
otelcol-contrib --version ; otelcol-contrib components | head ; otelcol-contrib validate --config config.yaml
sudo journalctl -u otelcol-contrib -f ; curl -s localhost:13133 ; curl -s localhost:8888/metrics | grep otelcol_exporter_sent
telemetrygen traces --otlp-endpoint localhost:4317 --otlp-insecure --traces 10      # générer des traces de test
alloy fmt config.alloy ; alloy run config.alloy ; alloy convert --source-format=prometheus prometheus.yml -o config.alloy
sudo systemctl status alloy ; curl -s localhost:12345/-/ready
export OTEL_SERVICE_NAME=inventaire OTEL_EXPORTER_OTLP_ENDPOINT=http://otel.corp.exemple.fr:4318 OTEL_RESOURCE_ATTRIBUTES=deployment.environment=prod
```
