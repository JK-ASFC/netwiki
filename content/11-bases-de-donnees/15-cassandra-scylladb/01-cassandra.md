---
title: Apache Cassandra
description: Apache Cassandra — base NoSQL distribuée sans maître, orientée colonnes larges (Apache 2.0) : architecture (anneau, partitions, facteur de réplication, niveaux de cohérence), versions 4.1 et 5.0, installation (dépôt Apache pour Debian/Ubuntu, RPM, archive, Docker ; Linux et macOS, Windows via Docker ou WSL), cassandra.yaml (cluster_name, seeds, adresses, snitch), cassandra-rackdc.properties, ports, CQL avec cqlsh (keyspace NetworkTopologyStrategy, tables, TTL), nodetool (status, repair, cleanup, snapshot, decommission), authentification, chiffrement, sauvegarde et exploitation.
tags: [cassandra, nosql, cql, nodetool, wide column, distribué]
icon: info
---

**Cassandra** répartit les données sur un **anneau** de nœuds égaux (pas de maître) et les réplique selon un **facteur de réplication** par datacenter. Elle encaisse des écritures massives et survit à la perte de nœuds ou d'un site entier ; en contrepartie, le **modèle de données** se conçoit à partir des requêtes (pas de jointures).

| Port | Usage |
| --- | --- |
| 7000 (7001 TLS) | Communication entre nœuds |
| **9042** | Clients CQL |
| 7199 | JMX (nodetool) — à garder local |

## Installation

```bash
# Debian/Ubuntu — branche 5.0 (« 50x »)
sudo apt install openjdk-17-jre-headless
curl -fsSL https://downloads.apache.org/cassandra/KEYS | sudo gpg --dearmor -o /usr/share/keyrings/cassandra.gpg
echo "deb [signed-by=/usr/share/keyrings/cassandra.gpg] https://debian.cassandra.apache.org 50x main" | sudo tee /etc/apt/sources.list.d/cassandra.list
sudo apt update && sudo apt install cassandra
```

RHEL : dépôt `https://redhat.cassandra.apache.org/50x/`. macOS : `brew install cassandra`. Docker : `cassandra:5`. Windows n'est plus pris en charge nativement depuis la 4.0.

## Configuration d'un nœud

```yaml
# /etc/cassandra/cassandra.yaml — extraits
cluster_name: 'Corp-Prod'
num_tokens: 16
seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
    parameters:
      - seeds: "10.0.20.101,10.0.21.101"      # 1 à 2 nœuds par datacenter
listen_address: 10.0.20.101
rpc_address: 10.0.20.101
endpoint_snitch: GossipingPropertyFileSnitch
authenticator: PasswordAuthenticator
authorizer: CassandraAuthorizer
```

```ini
# /etc/cassandra/cassandra-rackdc.properties
dc=paris
rack=rack1
```

Démarrer les nœuds **un par un** (graines d'abord) et attendre l'état `UN` (*Up/Normal*).

## CQL et exploitation

```bash
cqlsh 10.0.20.101 -u cassandra -p cassandra     # changer immédiatement ce compte par défaut
```

```sql
CREATE ROLE admin_cql WITH PASSWORD = 'MdpCql2026' AND SUPERUSER = true AND LOGIN = true;
ALTER KEYSPACE system_auth WITH replication = {'class': 'NetworkTopologyStrategy', 'paris': 3, 'lyon': 3};
CREATE KEYSPACE supervision WITH replication = {'class': 'NetworkTopologyStrategy', 'paris': 3, 'lyon': 3};
CREATE TABLE supervision.evenements (equipement text, jour date, ts timestamp, message text,
  PRIMARY KEY ((equipement, jour), ts)) WITH CLUSTERING ORDER BY (ts DESC) AND default_time_to_live = 7776000;
CONSISTENCY LOCAL_QUORUM;
```

```bash
nodetool status ; nodetool info ; nodetool tablestats supervision
nodetool repair -pr supervision        # réparation régulière (au moins une fois par gc_grace_seconds, 10 jours par défaut)
nodetool snapshot -t avant-maj supervision ; nodetool clearsnapshot -t avant-maj
nodetool cleanup                       # après ajout d'un nœud, sur les anciens nœuds
nodetool decommission                  # retirer proprement un nœud
nodetool drain && sudo systemctl stop cassandra   # avant un arrêt
```

> [!WARNING]
> Sans **réparations** régulières (ou Cassandra Reaper), des données supprimées peuvent « ressusciter ». Planifiez-les et supervisez-les.

Suite : [[02-scylladb|ScyllaDB]] · [[90-aide-memoire|aide-mémoire]].
