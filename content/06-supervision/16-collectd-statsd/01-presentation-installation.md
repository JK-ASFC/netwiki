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
sudo collectd -t && sudo systemctl restart collectd     # -t : tester la configuration
curl -s localhost:9103/metrics | head
```

### Catalogue des greffons collectd

Plus de 100 greffons ; les plus courants, par rôle :

| Rôle | Greffons `LoadPlugin` |
| --- | --- |
| Système | `cpu`, `memory`, `load`, `df`, `disk`, `interface`, `swap`, `processes`, `uptime`, `users`, `irq`, `entropy`, `vmem`, `thermal`, `sensors`, `ipmi`, `numa` |
| Réseau / sondes | `ping`, `dns`, `tcpconns`, `netlink`, `conntrack`, `snmp`, `snmp_agent` |
| Services | `apache`, `nginx`, `mysql`, `postgresql`, `redis`, `memcached`, `varnish`, `openvpn`, `ntpd`, `chrony`, `bind`, `ceph` |
| Virtualisation | `virt` (libvirt/KVM), `docker` (via `exec`) |
| Entrées génériques | `exec` (script), `tail` (journaux), `python`, `perl`, `curl`, `curl_json`, `table` |
| Sorties (*write*) | `write_prometheus`, `write_graphite`, `write_http`, `write_kafka`, `write_log`, `network` (protocole collectd), `rrdtool`, `csv`, `amqp`, `write_tsdb` (OpenTSDB), `write_mongodb` |
| Prétraitement | `aggregation`, `filter` (chaînes), `target_*`, `match_*`, `threshold` (alertes/notifications) |

Les types de mesures sont définis dans `types.db` (`gauge`, `counter`, `derive`, `absolute`). Le greffon `network` permet d'empiler collectd en **client/serveur** (agents qui poussent vers un collecteur central), et `threshold` + `notification` déclenchent des alertes (`exec` ou `notify_email`).

```text /etc/collectd/collectd.conf (seuil + notification)
LoadPlugin threshold
<Plugin threshold>
  <Plugin "df">
    <Type "percent_bytes">
      Instance "free"
      WarningMin 10
      FailureMin 5
    </Type>
  </Plugin>
</Plugin>
```

## StatsD

Les applications envoient des lignes texte en UDP (port **8125**) : `nom:valeur|type[|@échantillonnage]`.

| Type | Suffixe | Usage |
| --- | --- | --- |
| Compteur | `\|c` | Incréments (requêtes, erreurs) ; agrégés en débit par seconde |
| Jauge | `\|g` | Valeur instantanée (file d'attente, connexions) ; `+5`/`-3` pour un delta |
| Durée (*timer*) | `\|ms` | Latences ; StatsD en calcule moyenne, médiane, centiles (p90, p95, p99) |
| Histogramme | `\|h` | Variante des *timers* (certaines implémentations) |
| Ensemble (*set*) | `\|s` | Nombre de valeurs **uniques** (ex. utilisateurs distincts) |

```bash
echo "inventaire.connexions:1|c" | nc -u -w0 127.0.0.1 8125            # compteur
echo "inventaire.connexions:1|c|@0.1" | nc -u -w0 127.0.0.1 8125       # échantillonné à 10 %
echo "inventaire.temps_requete:320|ms" | nc -u -w0 127.0.0.1 8125      # durée
echo "inventaire.file_attente:42|g" | nc -u -w0 127.0.0.1 8125         # jauge
echo "inventaire.utilisateurs:kevin|s" | nc -u -w0 127.0.0.1 8125      # ensemble
```

L'intervalle de **vidage** (*flush*, 10 s par défaut) détermine la fréquence d'agrégation vers la sortie. Serveurs compatibles : StatsD d'origine (`npm install -g statsd`), **Telegraf** (entrée `statsd`, avec analyse des `topic`/*templates*), **statsd_exporter** (expose en format Prometheus, avec fichier de *mapping* `name → métrique + labels`), VictoriaMetrics via statsd_exporter.

Commandes : [[90-aide-memoire|aide-mémoire]].
