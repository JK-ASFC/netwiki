---
title: Logstash — aide-mémoire des commandes
description: Commandes Logstash avec exemples — test de configuration (--config.test_and_exit), exécution en premier plan, rechargement automatique, pipelines multiples, plugins (logstash-plugin list/install/update), magasin de secrets (logstash-keystore), API de supervision (node stats, hot threads), pipeline type (entrée syslog/beats, filtres grok, date, mutate, geoip, sortie Elasticsearch), débogage (stdout rubydebug).
tags: [aide-mémoire, logstash, grok, pipeline, elastic, keystore]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Logstash]]. Binaire : `/usr/share/logstash/bin/logstash`.

## Exécution et tests

```bash
L=/usr/share/logstash/bin
sudo -u logstash $L/logstash --path.settings /etc/logstash --config.test_and_exit
sudo -u logstash $L/logstash --path.settings /etc/logstash -f /etc/logstash/conf.d/reseau.conf --config.test_and_exit
sudo -u logstash $L/logstash -e 'input { stdin {} } output { stdout { codec => rubydebug } }'
sudo systemctl restart logstash
sudo journalctl -u logstash -f
```

```yaml
# /etc/logstash/pipelines.yml
- pipeline.id: reseau
  path.config: "/etc/logstash/conf.d/reseau.conf"
  pipeline.workers: 4
- pipeline.id: windows
  path.config: "/etc/logstash/conf.d/windows.conf"
```

## Plugins et secrets

```bash
sudo $L/logstash-plugin list --verbose | grep -E "input-syslog|filter-grok"
sudo $L/logstash-plugin install logstash-filter-translate
sudo $L/logstash-plugin update
sudo -u logstash $L/logstash-keystore --path.settings /etc/logstash create
sudo -u logstash $L/logstash-keystore --path.settings /etc/logstash add ES_PWD
sudo -u logstash $L/logstash-keystore --path.settings /etc/logstash list
```

## Pipeline type

```ruby
input {
  syslog { port => 5514 type => "reseau" }
  beats  { port => 5044 }
}
filter {
  if [type] == "reseau" {
    grok {
      match => { "message" => "%{CISCOTIMESTAMP:horodatage}: %%{DATA:facility}-%{INT:gravite}-%{DATA:mnemonique}: %{GREEDYDATA:detail}" }
      tag_on_failure => ["_grok_cisco_echec"]
    }
    date { match => ["horodatage", "MMM dd HH:mm:ss", "MMM  d HH:mm:ss"] }
    mutate { add_field => { "[observer][type]" => "commutateur" } remove_field => ["horodatage"] }
  }
  if [source][ip] { geoip { source => "[source][ip]" target => "[source][geo]" } }
}
output {
  elasticsearch {
    hosts => ["https://es1.exemple.fr:9200"]
    user => "logstash_writer"
    password => "${ES_PWD}"
    ssl_certificate_authorities => ["/etc/logstash/certs/ca.crt"]
    data_stream => true
  }
  # stdout { codec => rubydebug }        # débogage
}
```

## API de supervision

```bash
curl -s http://127.0.0.1:9600/?pretty
curl -s http://127.0.0.1:9600/_node/stats/pipelines?pretty | jq '.pipelines[] | .events'
curl -s http://127.0.0.1:9600/_node/hot_threads?human=true
curl -s http://127.0.0.1:9600/_node/stats/jvm | jq '.jvm.mem.heap_used_percent'
```

Outil utile : le **Grok Debugger** de Kibana (*Dev Tools*) pour mettre au point les motifs.
