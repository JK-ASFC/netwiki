---
title: Graylog — aide-mémoire des commandes
description: Commandes Graylog avec exemples — service et configuration (password_secret, root_password_sha2, http_bind_address), données (MongoDB, OpenSearch/Data Node), entrées (Syslog, GELF, Beats), API REST (système, entrées, flux, recherche, ingestion), tests d'envoi GELF et syslog, règles de pipeline, sauvegarde, journaux du serveur.
tags: [aide-mémoire, graylog, gelf, syslog, opensearch, mongodb, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Graylog]].

## Configuration initiale

```bash
pwgen -N 1 -s 96                                              # password_secret
echo -n 'MotDePasseAdmin2026' | sha256sum | cut -d" " -f1     # root_password_sha2
sudo nano /etc/graylog/server/server.conf                     # http_bind_address = 0.0.0.0:9000, http_external_uri…
sudo systemctl restart graylog-server
sudo tail -f /var/log/graylog-server/server.log
```

## API REST

```bash
G=https://graylog.exemple.fr/api; A=(-s -u "$JETON:token" -H "X-Requested-By: cli" -H "Accept: application/json")
curl "${A[@]}" $G/system | jq '{version, is_processing, lb_status}'
curl "${A[@]}" $G/system/inputs | jq '.inputs[] | {id, title, type: .name}'
curl "${A[@]}" $G/system/inputstates | jq '.states[] | {id, state}'
curl "${A[@]}" $G/streams | jq '.streams[] | {id, title}'
curl "${A[@]}" "$G/search/universal/relative?query=source:sw-paris-01%20AND%20level:%3C4&range=3600&limit=20" | jq '.messages[].message.message'
curl "${A[@]}" $G/system/journal | jq '{uncommitted_journal_entries, journal_size}'
curl "${A[@]}" $G/system/indexer/cluster/health | jq .
```

## Créer une entrée Syslog UDP par l'API

```bash
curl "${A[@]}" -X POST -H "Content-Type: application/json" $G/system/inputs -d '{
  "title": "Syslog réseau", "type": "org.graylog2.inputs.syslog.udp.SyslogUDPInput", "global": true,
  "configuration": { "bind_address": "0.0.0.0", "port": 1514, "recv_buffer_size": 262144, "allow_override_date": true } }'
```

## Tests d'envoi

```bash
logger -n graylog.exemple.fr -P 1514 -d "Test syslog vers Graylog"
echo -n '{"version":"1.1","host":"srv-test","short_message":"Test GELF","level":5,"_application":"netwiki"}' | nc -u -w1 graylog.exemple.fr 12201
curl -s -X POST -H "Content-Type: application/json" http://graylog.exemple.fr:12201/gelf -d '{"short_message":"Test GELF HTTP","host":"srv-test"}'
```

## Règle de pipeline

```text
rule "Ajouter le site des équipements de Paris"
when
  has_field("source") && starts_with(to_string($message.source), "sw-paris")
then
  set_field("site", "Paris");
end
```

## Sauvegarde

```bash
mongodump --db graylog --gzip --archive=/srv/sauvegardes/graylog-mongo-$(date +%F).gz       # configuration
sudo cp /etc/graylog/server/server.conf /srv/sauvegardes/
# Les messages sont dans OpenSearch : instantanés (_snapshot) ou rétention selon la politique
```
