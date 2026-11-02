---
title: Présentation, installation et configuration
description: collectd et StatsD — collecteurs de métriques historiques encore très répandus : collectd (démon C à greffons : cpu, memory, df, interface, load, snmp, apache, nginx, mysql, postgresql, ping ; sorties network, write_graphite, write_prometheus, rrdtool, InfluxDB ; installation Linux et BSD, collectd.conf) et StatsD (Etsy, Node.js : compteurs, jauges, durées et ensembles envoyés en UDP par les applications, agrégation et vidage vers Graphite ou autres ; implémentations compatibles Telegraf, statsd_exporter), place face à Telegraf et Prometheus et migration.
tags: [collectd, statsd, métriques, graphite, influxdb, udp]
icon: info
---

Ces deux outils ont fondé la supervision par métriques « à la Graphite ». On les rencontre encore partout (NAS, distributions, applications instrumentées) ; pour un nouveau déploiement, [[09-telegraf/01-presentation-configuration|Telegraf]] ou les exporteurs [[02-prometheus/02-exporteurs-decouverte|Prometheus]] sont plus courants.

| | **collectd** | **StatsD** |
| --- | --- | --- |
| Rôle | Démon qui **collecte** les métriques système et services | Agrégateur de métriques **envoyées par les applications** (UDP) |
| Langage | C, greffons | Node.js (protocole repris par de nombreux outils) |
| Sorties | Graphite, InfluxDB (protocole collectd), Prometheus, RRD, Kafka… | Graphite principalement (backends) |

## collectd

```bash
sudo apt install collectd-core collectd-utils      # Debian/Ubuntu (collectd = avec dépendances des greffons)
sudo dnf install collectd collectd-snmp            # RHEL (EPEL), greffons en sous-paquets
```

```text
# /etc/collectd/collectd.conf (Debian) — extraits
Interval 30
LoadPlugin cpu
LoadPlugin memory
LoadPlugin df
LoadPlugin interface
LoadPlugin load
LoadPlugin write_prometheus
<Plugin df>
  FSType "tmpfs"
  IgnoreSelected true
</Plugin>
<Plugin write_prometheus>
  Port "9103"
</Plugin>
```

```bash
sudo collectd -t && sudo systemctl restart collectd
curl -s localhost:9103/metrics | head
```

## StatsD

Les applications envoient des lignes texte en UDP (port **8125**) : `nom:valeur|type`.

```bash
echo "inventaire.connexions:1|c" | nc -u -w0 127.0.0.1 8125          # compteur
echo "inventaire.temps_requete:320|ms" | nc -u -w0 127.0.0.1 8125     # durée
echo "inventaire.file_attente:42|g" | nc -u -w0 127.0.0.1 8125        # jauge
```

Serveurs compatibles : StatsD d'origine (`npm install -g statsd`), **Telegraf** (entrée `statsd`), **statsd_exporter** (expose en format Prometheus), VictoriaMetrics via statsd_exporter.

Commandes : [[90-aide-memoire|aide-mémoire]].
