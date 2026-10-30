---
title: InfluxDB — aide-mémoire des commandes
description: Commandes InfluxDB 2.x avec exemples — initialisation (influx setup), configurations du client (influx config), organisations, buckets et rétention, jetons (auth create), écriture (influx write, protocole ligne), requêtes Flux et InfluxQL (influx query, v1 shell), suppression de données, sauvegarde et restauration, tâches, santé et API HTTP, remarques sur InfluxDB 3.
tags: [aide-mémoire, influxdb, flux, influx, séries temporelles, sauvegarde]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|InfluxDB]].

## Initialisation et client

```bash
influx setup --org exemple --bucket supervision --username admin --password 'MotDePasseLong' --retention 30d --force
influx config create --config-name prod --host-url https://influx.exemple.fr:8086 --org exemple --token "$INFLUX_TOKEN" --active
influx config list
influx ping
curl -s https://influx.exemple.fr:8086/health | jq .
```

## Organisations, buckets, jetons

```bash
influx org list
influx bucket list
influx bucket create --name reseau --retention 90d
influx bucket update --id <id> --retention 180d
influx bucket delete --name ancien
influx auth list
influx auth create --org exemple --description "telegraf-paris" --write-bucket <id-bucket>
influx auth create --org exemple --description "grafana-lecture" --read-buckets
influx user create --name amartin --org exemple
```

## Écrire et lire

```bash
influx write --bucket reseau --precision s "interface,hote=sw-paris,port=Gi1/0/1 entrant=12345i,sortant=67890i $(date +%s)"
influx write --bucket reseau --file metriques.lp
influx query 'from(bucket: "reseau") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "interface") |> limit(n: 5)'
influx query --raw 'from(bucket:"supervision") |> range(start:-15m) |> filter(fn:(r) => r._measurement == "cpu" and r._field == "usage_user") |> mean()'
# Compatibilité InfluxQL (mapping DBRP)
influx v1 dbrp create --bucket-id <id> --db reseau --rp autogen --default
influx v1 shell
```

```flux
from(bucket: "supervision")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "disk" and r._field == "used_percent")
  |> aggregateWindow(every: 1h, fn: max)
  |> filter(fn: (r) => r._value > 85.0)
```

## Supprimer, sauvegarder, restaurer

```bash
influx delete --bucket reseau --start 2026-01-01T00:00:00Z --stop 2026-02-01T00:00:00Z --predicate '_measurement="test"'
influx backup /srv/sauvegardes/influx-$(date +%F) -t "$OPERATOR_TOKEN"
influx restore /srv/sauvegardes/influx-2026-10-29 --full -t "$OPERATOR_TOKEN"
influx restore /srv/sauvegardes/influx-2026-10-29 --bucket reseau --new-bucket reseau-restaure
```

## Tâches et API

```bash
influx task list
influx task log list --task-id <id>
curl -s -H "Authorization: Token $INFLUX_TOKEN" -H "Content-Type: application/vnd.flux" \
  "https://influx.exemple.fr:8086/api/v2/query?org=exemple" -d 'from(bucket:"reseau") |> range(start:-5m) |> limit(n:3)'
curl -s -XPOST -H "Authorization: Token $INFLUX_TOKEN" "https://influx.exemple.fr:8086/api/v2/write?org=exemple&bucket=reseau&precision=s" \
  --data-binary "test,hote=srv01 valeur=1i $(date +%s)"
```

> [!NOTE]
> **InfluxDB 3** (Core/Enterprise) change d'architecture (SQL et InfluxQL, CLI `influxdb3`) ; ces commandes concernent la branche 2.x, encore très répandue.
