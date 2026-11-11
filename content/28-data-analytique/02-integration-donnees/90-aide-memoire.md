---
title: NiFi, SeaTunnel, Airbyte, Meltano et Singer — aide-mémoire
description: Ports et commandes d'Apache NiFi (nifi.sh, identifiants), SeaTunnel (seatunnel.sh, grappe Zeta), Airbyte (abctl local), Meltano (init, add, config, select, run, state) et Singer (tap | target).
tags: [aide-mémoire, nifi, seatunnel, airbyte, meltano, singer]
icon: terminal
---

Explications : [[01-apache-nifi|Apache NiFi]] · [[02-seatunnel-airbyte|SeaTunnel et Airbyte]] · [[03-meltano-singer|Meltano et Singer]].

| Outil | Accès |
| --- | --- |
| NiFi | https://serveur:8443/nifi ; NiFi Registry 18443 |
| SeaTunnel | Grappe Zeta 5801, API REST selon configuration |
| Airbyte | http://localhost:8000 (abctl) |
| Meltano | Ligne de commande |

```bash
# NiFi
/opt/nifi/bin/nifi.sh set-single-user-credentials admin '…'
/opt/nifi/bin/nifi.sh start|stop|status ; tail -f /opt/nifi/logs/nifi-app.log

# SeaTunnel
sh bin/install-plugin.sh
./bin/seatunnel.sh --config tache.conf -m local ; ./bin/seatunnel-cluster.sh -d

# Airbyte
abctl local install ; abctl local credentials ; abctl local status

# Meltano
meltano init projet ; meltano add extractor tap-postgres ; meltano add loader target-postgres
meltano config tap-postgres list ; meltano select tap-postgres --list
meltano run tap-postgres target-postgres ; meltano state list

# Singer
tap-csv --config tap.json --discover > catalogue.json
tap-csv --config tap.json --catalog catalogue.json | target-jsonl --config target.json
```
