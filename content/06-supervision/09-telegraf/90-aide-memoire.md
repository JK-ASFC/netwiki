---
title: Telegraf — aide-mémoire des commandes
description: Commandes Telegraf avec exemples — générer une configuration (config, --input-filter, --output-filter), tester (--test, --once, --debug), lister les plugins, service Linux et Windows, configuration type (agent, entrées système, SNMP, ping, http_response, sorties InfluxDB v2 et Prometheus), secrets, tags et filtres.
tags: [aide-mémoire, telegraf, influxdb, snmp, métriques, agent]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Telegraf]].

## Commandes

```bash
telegraf --version
telegraf config > telegraf.conf                                         # configuration complète d'exemple
telegraf --input-filter cpu:mem:disk:net:snmp --output-filter influxdb_v2 config > telegraf.conf
telegraf --config /etc/telegraf/telegraf.conf --test                    # collecter une fois, afficher, ne rien envoyer
telegraf --config /etc/telegraf/telegraf.conf --config-directory /etc/telegraf/telegraf.d --once     # une collecte et envoi
telegraf --config /etc/telegraf/telegraf.conf --debug
telegraf plugins inputs | head
telegraf plugins outputs
sudo systemctl restart telegraf && journalctl -u telegraf -f
```

```powershell
# Windows
.\telegraf.exe --service install --config "C:\Program Files\Telegraf\telegraf.conf"
.\telegraf.exe --service start
.\telegraf.exe --config telegraf.conf --test
```

## Configuration type

```toml
# /etc/telegraf/telegraf.conf
[global_tags]
  site = "paris"

[agent]
  interval = "30s"
  flush_interval = "30s"
  hostname = ""

[[inputs.cpu]]
  percpu = false
  totalcpu = true
[[inputs.mem]]
[[inputs.disk]]
  ignore_fs = ["tmpfs", "devtmpfs", "overlay"]
[[inputs.net]]

[[inputs.ping]]
  urls = ["10.0.0.1", "8.8.8.8"]
  count = 3

[[inputs.http_response]]
  urls = ["https://intranet.exemple.fr/health"]
  response_status_code = 200

[[inputs.snmp]]
  agents = ["udp://10.0.99.10:161"]
  version = 2
  community = "Lecture-Supervision"
  [[inputs.snmp.field]]
    name = "sysName"
    oid = "SNMPv2-MIB::sysName.0"
    is_tag = true
  [[inputs.snmp.table]]
    name = "interface"
    inherit_tags = ["sysName"]
    oid = "IF-MIB::ifXTable"
    [[inputs.snmp.table.field]]
      name = "ifName"
      oid = "IF-MIB::ifName"
      is_tag = true

[[outputs.influxdb_v2]]
  urls = ["https://influx.exemple.fr:8086"]
  token = "${INFLUX_TOKEN}"
  organization = "exemple"
  bucket = "supervision"

[[outputs.prometheus_client]]
  listen = ":9273"
```

Les variables `${...}` sont lues dans l'environnement (fichier `/etc/default/telegraf` sous Debian) : ne mettez pas les jetons en clair dans la configuration.
