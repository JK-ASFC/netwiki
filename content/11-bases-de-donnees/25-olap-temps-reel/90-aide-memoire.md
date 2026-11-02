---
title: Doris, Pinot et Druid — aide-mémoire des commandes
description: Commandes Apache Doris (start/stop_fe, start/stop_be, SHOW FRONTENDS, SHOW BACKENDS, ADD BACKEND, SHOW ROUTINE LOAD, PAUSE/RESUME, Stream Load), Apache Pinot (pinot-admin.sh StartController, AddTable, LaunchDataIngestionJob, API du controller et du broker) et Apache Druid (start-druid, API SQL /druid/v2/sql, supervisors, tasks, coordinator rules) avec exemples.
tags: [aide-mémoire, apache doris, apache pinot, apache druid]
icon: terminal
---

Explications : [[01-apache-doris|Doris]] · [[02-apache-pinot|Pinot]] · [[03-apache-druid|Druid]].

## Doris

```bash
fe/bin/start_fe.sh --daemon ; fe/bin/stop_fe.sh ; be/bin/start_be.sh --daemon ; be/bin/stop_be.sh
mysql -h fe -P 9030 -u root -p -e "SHOW FRONTENDS\G; SHOW BACKENDS\G; SHOW ROUTINE LOAD FROM reseau\G"
mysql -h fe -P 9030 -u root -p -e "PAUSE ROUTINE LOAD FOR reseau.flux_kafka; RESUME ROUTINE LOAD FOR reseau.flux_kafka"
```

## Pinot

```bash
bin/pinot-admin.sh AddTable -schemaFile s.json -tableConfigFile t.json -controllerHost ctrl -exec
bin/pinot-admin.sh LaunchDataIngestionJob -jobSpecFile ingestion-job.yaml
curl -s http://ctrl:9000/tables | jq . ; curl -s http://ctrl:9000/health ; curl -s "http://ctrl:9000/segments/flux" | jq '.[0]'
```

## Druid

```bash
bin/start-druid ; curl -s http://router:8888/status/health
curl -s -X POST http://router:8888/druid/v2/sql -H 'Content-Type: application/json' -d '{"query":"SELECT COUNT(*) FROM flux"}'
curl -s http://router:8888/druid/indexer/v1/supervisor | jq . ; curl -s "http://router:8888/druid/indexer/v1/tasks?state=running" | jq '.[].id'
curl -s http://router:8888/druid/coordinator/v1/rules/flux | jq .
```
