---
title: SigNoz, HyperDX et Uptrace — aide-mémoire
description: Commandes d'exploitation des plates-formes d'observabilité (docker compose ps/logs/pull/up, helm upgrade, état de ClickHouse : tailles des tables, rétention, partitions), test d'envoi OTLP (telemetrygen, curl), et réglages de rétention, avec exemples.
tags: [aide-mémoire, signoz, hyperdx, uptrace, clickhouse]
icon: terminal
---

Explications : [[01-presentation-installation|SigNoz, HyperDX et Uptrace]].

```bash
docker compose ps ; docker compose logs -f --tail=50 ; docker compose pull && docker compose up -d
helm upgrade signoz signoz/signoz -n platform -f valeurs.yaml
telemetrygen traces --otlp-endpoint obs.corp.exemple.fr:4317 --otlp-insecure --traces 20
telemetrygen logs --otlp-endpoint obs.corp.exemple.fr:4317 --otlp-insecure --logs 20
docker exec -it signoz-clickhouse clickhouse-client -q "SELECT database, table, formatReadableSize(sum(bytes_on_disk)) FROM system.parts WHERE active GROUP BY database, table ORDER BY sum(bytes_on_disk) DESC LIMIT 10"
```
