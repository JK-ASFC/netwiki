---
title: Présentation et installation
description: Logstash, moteur de pipelines de la pile Elastic — entrées, filtres, sorties, codecs, pipelines multiples, place face à Fluent Bit et aux pipelines d'ingestion, installation sous Linux, Windows, macOS et Docker, fichiers de configuration, test et premier pipeline syslog vers Elasticsearch ou OpenSearch.
tags: [logstash, elastic stack, pipelines, installation, beats, syslog]
icon: info
---

**Logstash** reçoit des événements de multiples sources, les **transforme** (analyse, enrichissement, normalisation) et les envoie vers une ou plusieurs destinations. Il est le « L » de la pile ELK, mais peut aussi alimenter OpenSearch, Kafka, des fichiers, des bases SQL ou des API.

```mermaid
flowchart LR
  I["Entrées<br/>beats 5044, syslog/tcp/udp,<br/>kafka, fichiers, jdbc"] --> Q[("File d'attente<br/>(mémoire ou persistante)")]
  Q --> F["Filtres<br/>grok, dissect, date, mutate,<br/>geoip, kv, json"]
  F --> O["Sorties<br/>elasticsearch, opensearch,<br/>kafka, file, s3"]
```

## Logstash, Fluent Bit ou pipelines d'ingestion ?

| Outil | Points forts | Limites |
| --- | --- | --- |
| **Logstash** | Transformations riches, nombreux greffons, files persistantes, routage complexe | Lourd (JVM, 1 Go+ de RAM) |
| [[03-fluent-bit/01-presentation-installation\|Fluent Bit]] | Très léger (C), idéal comme agent sur chaque machine et dans Kubernetes | Transformations plus simples |
| Pipelines d'ingestion Elasticsearch / OpenSearch | Pas de composant supplémentaire | Logique limitée, charge sur le cluster |

Architecture courante : agents légers (Fluent Bit, Beats) → **Logstash** central (normalisation) → Elasticsearch/OpenSearch.

## Installation

```bash
# Debian / Ubuntu : dépôt Elastic (même dépôt qu'Elasticsearch)
sudo apt install logstash
sudo systemctl enable --now logstash
# RHEL : dnf install --enablerepo=elasticsearch logstash
```

| Plate-forme | Installation |
| --- | --- |
| Windows | Archive ZIP (Java intégré) ; service via NSSM |
| macOS | Archive `tar.gz` ou Docker |
| Docker | `docker run -d -v ./pipeline/:/usr/share/logstash/pipeline/ -p 5044:5044 docker.elastic.co/logstash/logstash:8.15.0` |

Logstash embarque son propre JDK. Mémoire : `-Xms`/`-Xmx` dans `/etc/logstash/jvm.options` (1 à 4 Go selon le débit).

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `/etc/logstash/logstash.yml` | Paramètres globaux (files, API, journaux) |
| `/etc/logstash/pipelines.yml` | Liste des pipelines (un fichier ou répertoire par pipeline) |
| `/etc/logstash/conf.d/*.conf` | Définitions de pipelines |
| `/var/log/logstash/` | Journaux |

```yaml /etc/logstash/pipelines.yml
- pipeline.id: syslog-reseau
  path.config: "/etc/logstash/conf.d/syslog-reseau.conf"
  pipeline.workers: 4
- pipeline.id: beats-serveurs
  path.config: "/etc/logstash/conf.d/beats.conf"
  queue.type: persisted
```

## Premier pipeline : syslog des équipements → OpenSearch

```logstash /etc/logstash/conf.d/syslog-reseau.conf
input {
  udp { port => 5514 type => "syslog-reseau" }
  tcp { port => 5514 type => "syslog-reseau" }
}

filter {
  grok {
    match => { "message" => "<%{POSINT:syslog_pri}>%{GREEDYDATA:syslog_reste}" }
  }
  syslog_pri { syslog_pri_field_name => "syslog_pri" }
  mutate { add_field => { "[observer][type]" => "reseau" } }
}

output {
  opensearch {
    hosts => ["https://opensearch.corp.exemple.fr:9200"]
    user => "logstash"
    password => "${OS_PASSWORD}"
    index => "syslog-reseau-%{+YYYY.MM.dd}"
    ssl_certificate_verification => true
    cacert => "/etc/logstash/certs/ca.crt"
  }
}
```

Le port **5514** évite de lancer Logstash en root (ports < 1024) ; redirigez si nécessaire 514 → 5514 sur le pare-feu de l'hôte. Le greffon `logstash-output-opensearch` s'installe par `sudo /usr/share/logstash/bin/logstash-plugin install logstash-output-opensearch` ; pour Elasticsearch, la sortie `elasticsearch` est fournie.

## Tester

```bash
sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -t        # syntaxe
sudo -u logstash /usr/share/logstash/bin/logstash --path.settings /etc/logstash -f /etc/logstash/conf.d/test.conf --config.reload.automatic
echo '<189>Oct 29 09:30:12 r1-paris %LINK-3-UPDOWN: Interface Gi0/0/0, changed state to down' | nc -u -w1 127.0.0.1 5514
```

Les mots de passe se stockent dans le **keystore** de Logstash : `sudo -u logstash /usr/share/logstash/bin/logstash-keystore --path.settings /etc/logstash add OS_PASSWORD` puis `${OS_PASSWORD}` dans les pipelines.

## Suite

[[02-filtres-exploitation|Filtres, sorties et exploitation]]
