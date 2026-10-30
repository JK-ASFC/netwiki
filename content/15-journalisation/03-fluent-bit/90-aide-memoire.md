---
title: Fluent Bit — aide-mémoire des commandes
description: Commandes Fluent Bit avec exemples — exécution et test (--dry-run, -c, ligne de commande -i/-o), configuration YAML et classique (entrées tail, systemd, syslog, winlog ; filtres parser, modify, grep, kubernetes ; sorties Elasticsearch/OpenSearch, Loki, Kafka, forward), analyseurs, tampon sur disque, serveur HTTP de métriques, Kubernetes (Helm), Windows.
tags: [aide-mémoire, fluent bit, logs, kubernetes, loki, elasticsearch]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Fluent Bit]].

## Exécution

```bash
fluent-bit --version
fluent-bit -c /etc/fluent-bit/fluent-bit.yaml --dry-run      # valider la configuration
fluent-bit -i cpu -o stdout -f 1                              # essai rapide en ligne de commande
fluent-bit -i tail -p path=/var/log/syslog -o stdout
sudo systemctl restart fluent-bit && sudo journalctl -u fluent-bit -f
```

## Configuration YAML

```yaml
# /etc/fluent-bit/fluent-bit.yaml
service:
  flush: 5
  log_level: info
  http_server: on
  http_listen: 127.0.0.1
  http_port: 2020
  storage.path: /var/lib/fluent-bit/tampon
pipeline:
  inputs:
    - name: tail
      path: /var/log/nginx/access.log
      tag: web.acces
      db: /var/lib/fluent-bit/tail.db
      storage.type: filesystem
    - name: systemd
      tag: systeme.*
      systemd_filter: _SYSTEMD_UNIT=ssh.service
    - name: syslog
      mode: udp
      listen: 0.0.0.0
      port: 5140
      parser: syslog-rfc3164
      tag: reseau
  filters:
    - name: parser
      match: web.acces
      key_name: log
      parser: nginx
    - name: grep
      match: systeme.*
      regex: MESSAGE Failed
    - name: modify
      match: "*"
      add: site paris
  outputs:
    - name: opensearch
      match: "web.*"
      host: os1.exemple.fr
      port: 9200
      tls: on
      http_user: fluentbit
      http_passwd: ${OS_PWD}
      logstash_format: on
      suppress_type_name: on
    - name: loki
      match: "reseau"
      host: loki.exemple.fr
      port: 3100
      labels: job=reseau
```

## Supervision

```bash
curl -s http://127.0.0.1:2020/api/v1/metrics | jq .
curl -s http://127.0.0.1:2020/api/v1/metrics/prometheus | head
curl -s http://127.0.0.1:2020/api/v1/health
```

## Kubernetes

```bash
helm repo add fluent https://fluent.github.io/helm-charts && helm repo update
helm upgrade --install fluent-bit fluent/fluent-bit -n journalisation --create-namespace -f valeurs.yaml
kubectl logs -n journalisation ds/fluent-bit --tail 50
```

## Windows

```powershell
& "C:\Program Files\fluent-bit\bin\fluent-bit.exe" -c "C:\Program Files\fluent-bit\conf\fluent-bit.yaml" --dry-run
New-Service -Name fluent-bit -BinaryPathName '"C:\Program Files\fluent-bit\bin\fluent-bit.exe" -c "C:\Program Files\fluent-bit\conf\fluent-bit.yaml"' -StartupType Automatic
# Entrée Windows : name: winevtlog, channels: Security,System,Application
```
