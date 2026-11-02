---
title: Fluentd
description: Fluentd (CNCF, Apache 2.0) — collecteur de journaux unifié en Ruby avec plus de 1000 greffons : distribution fluent-package (ex td-agent) pour Linux, Windows et macOS, structure de configuration (source, filter, match, label, buffer), étiquettes de routage, greffons courants (tail, syslog, forward, http, record_transformer, grep, parser, elasticsearch/opensearch, s3, loki, kafka), tampons et retransmissions, architecture agent/agrégateur, Fluent Bit comme agent léger, Kubernetes (DaemonSet, opérateur Fluent), supervision et dépannage.
tags: [fluentd, journaux, collecte, cncf, greffons, fluent bit]
icon: info
---

**Fluentd** collecte des journaux de sources multiples, les structure en JSON, les **route** par étiquettes et les envoie vers une ou plusieurs destinations (OpenSearch, S3, Loki, Kafka, SIEM). Plus lourd que [[03-fluent-bit/01-presentation-installation|Fluent Bit]] (Ruby), il sert souvent d'**agrégateur** central derrière des agents Fluent Bit.

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | Script officiel `fluent-package` (ex-td-agent) depuis toolbelt.treasuredata.com, service `fluentd` |
| RHEL | Dépôt RPM `fluent-package` |
| Windows | MSI `fluent-package` (service Windows) |
| macOS | Paquet `.dmg` ou `gem install fluentd` |
| Docker | `fluent/fluentd` |

Configuration : `/etc/fluent/fluentd.conf` ; greffons : `sudo fluent-gem install fluent-plugin-opensearch`.

## Configuration

```text
<source>
  @type tail
  path /var/log/nginx/access.log
  pos_file /var/lib/fluent/nginx.pos
  tag nginx.acces
  <parse>
    @type nginx
  </parse>
</source>

<source>
  @type forward          # réception depuis des agents Fluent Bit / Fluentd (port 24224)
  bind 0.0.0.0
  port 24224
</source>

<filter nginx.**>
  @type record_transformer
  <record>
    hote "#{Socket.gethostname}"
    environnement prod
  </record>
</filter>

<match nginx.**>
  @type opensearch
  host opensearch.corp.exemple.fr
  port 9200
  scheme https
  user fluentd
  password MdpFluentd2026
  index_name nginx-%Y.%m.%d
  <buffer tag,time>
    @type file
    path /var/lib/fluent/buffer/nginx
    timekey 1d
    flush_interval 10s
    retry_max_times 30
  </buffer>
</match>
```

Le **tampon sur disque** évite de perdre des journaux quand la destination est indisponible ; surveiller sa taille (greffon `monitor_agent`, port 24220).

```bash
fluentd --dry-run -c /etc/fluent/fluentd.conf && sudo systemctl restart fluentd
curl -s localhost:24220/api/plugins.json | jq '.plugins[] | {type, buffer_total_queued_size, retry_count}'
```

Suite : [[02-vector|Vector]] · [[90-aide-memoire|aide-mémoire]].
