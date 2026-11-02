---
title: QuestDB — aide-mémoire des commandes
description: Commandes QuestDB avec exemples — questdb.sh start/stop/status, API REST (/exec, /exp, /imp, /write), psql sur le port 8812, tables(), table_partitions(), SHOW COLUMNS, SAMPLE BY avec FILL, LATEST ON, ASOF JOIN, DROP PARTITION, VACUUM TABLE, SNAPSHOT pour la sauvegarde.
tags: [aide-mémoire, questdb, séries temporelles]
icon: terminal
---

Explications : [[01-presentation-installation|QuestDB]].

```bash
./questdb.sh start -d /srv/questdb ; ./questdb.sh status ; ./questdb.sh stop
curl -G 'http://localhost:9000/exec' --data-urlencode "query=SELECT count() FROM interfaces"
curl -G 'http://localhost:9000/exp' --data-urlencode "query=SELECT * FROM interfaces WHERE ts IN yesterday()" > export.csv
curl -F data=@mesures.csv 'http://localhost:9000/imp?name=mesures&timestamp=ts&partitionBy=DAY'
curl -s http://localhost:9003/metrics | head
psql -h localhost -p 8812 -U admin -d qdb
```

```sql
SELECT * FROM tables(); SELECT * FROM table_partitions('interfaces'); SHOW COLUMNS FROM interfaces;
SELECT ts, avg(in_octets) FROM interfaces SAMPLE BY 1h FILL(PREV) ALIGN TO CALENDAR;
SELECT * FROM a ASOF JOIN b ON (equipement);
ALTER TABLE interfaces DROP PARTITION LIST '2026-01-01'; VACUUM TABLE interfaces;
SNAPSHOT PREPARE; -- copier le répertoire db/ puis : SNAPSHOT COMPLETE;
```
