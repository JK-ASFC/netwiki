---
title: PromQL, règles et Alertmanager
description: Interroger les métriques avec PromQL (sélecteurs, rate, agrégations, opérateurs, prévisions), règles d'enregistrement et d'alerte (seuils, durées, étiquettes, annotations), tests avec promtool, et Alertmanager (routage par équipe et gravité, regroupement, inhibition, silences, récepteurs courriel, Teams, webhook, cluster).
tags: [prometheus, promql, alerting, règles, alertmanager, routage, silences, amtool]
icon: bell
---

## PromQL

| Requête | Résultat |
| --- | --- |
| `up` | 1 si la cible répond, 0 sinon |
| `up{job="linux"} == 0` | Cibles Linux injoignables |
| `rate(node_network_receive_bytes_total{device="ens192"}[5m]) * 8` | Débit reçu en bit/s (moyenne sur 5 min) |
| `100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100` | Utilisation CPU (%) |
| `node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100` | Espace libre (%) |
| `predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24 * 3600) < 0` | Disque plein dans moins de 24 h (tendance) |
| `topk(10, sum by (instance) (rate(ifHCInOctets[5m])) * 8)` | 10 équipements les plus chargés |
| `probe_ssl_earliest_cert_expiry - time() < 15 * 86400` | Certificats expirant dans moins de 15 jours |
| `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | Latence au 95ᵉ centile |

| Fonction | Usage |
| --- | --- |
| `rate(v[d])` / `irate` | Vitesse d'un **compteur** (gère les remises à zéro) |
| `increase(v[d])` | Augmentation sur la période |
| `sum`, `avg`, `max`, `count` `by (étiquettes)` | Agrégations |
| `absent(v)` | Alerte si une métrique disparaît |
| `changes`, `resets`, `delta`, `deriv` | Variations |
| `offset 1w` | Comparaison avec la semaine précédente |

## Règles

```yaml /etc/prometheus/regles/infrastructure.yml
groups:
  - name: enregistrement
    rules:
      - record: instance:node_cpu_utilisation:ratio
        expr: 1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))

  - name: infrastructure
    rules:
      - alert: CibleInjoignable
        expr: up == 0
        for: 3m
        labels: { severite: critique }
        annotations:
          summary: "{{ $labels.instance }} ({{ $labels.job }}) ne répond plus"

      - alert: DisquePleinSous24h
        expr: predict_linear(node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}[6h], 24 * 3600) < 0
        for: 30m
        labels: { severite: avertissement }
        annotations:
          summary: "{{ $labels.instance }} : {{ $labels.mountpoint }} sera plein sous 24 h"

      - alert: InterfaceSaturee
        expr: rate(ifHCOutOctets[5m]) * 8 / (ifHighSpeed * 1e6) > 0.9 and ifHighSpeed > 0
        for: 15m
        labels: { severite: avertissement, equipe: reseau }
        annotations:
          summary: "{{ $labels.instance }} {{ $labels.ifName }} > 90 % en sortie"

      - alert: CertificatBientotExpire
        expr: probe_ssl_earliest_cert_expiry - time() < 15 * 86400
        for: 1h
        labels: { severite: avertissement }
        annotations:
          summary: "Certificat de {{ $labels.instance }} expire dans {{ $value | humanizeDuration }}"
```

```bash
promtool check rules /etc/prometheus/regles/*.yml
promtool test rules tests/regles_test.yml        # tests unitaires des alertes
```

`for:` évite les alertes sur des pics passagers ; l'alerte passe d'abord par l'état *pending*.

## Alertmanager

```yaml /etc/alertmanager/alertmanager.yml
global:
  smtp_smarthost: relais.corp.exemple.fr:25
  smtp_from: alertes@exemple.fr
  smtp_require_tls: false

route:
  receiver: exploitation
  group_by: [ alertname, site ]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers: [ 'equipe="reseau"' ]
      receiver: reseau
    - matchers: [ 'severite="critique"' ]
      receiver: astreinte
      continue: true

receivers:
  - name: exploitation
    email_configs:
      - to: exploitation@exemple.fr
  - name: reseau
    email_configs:
      - to: reseau@exemple.fr
    msteamsv2_configs:
      - webhook_url: "https://….webhook.office.com/…"
  - name: astreinte
    webhook_configs:
      - url: "https://outil-astreinte.corp.exemple.fr/api/alertes"

inhibit_rules:
  # Si un site entier est injoignable, ne pas notifier chaque équipement du site
  - source_matchers: [ 'alertname="SiteInjoignable"' ]
    target_matchers: [ 'alertname="CibleInjoignable"' ]
    equal: [ site ]
```

```bash
amtool check-config /etc/alertmanager/alertmanager.yml
amtool alert query --alertmanager.url=http://127.0.0.1:9093
amtool silence add 'instance=~"10.0.0.2.*"' --duration=2h --comment="Maintenance cœur Paris" --alertmanager.url=http://127.0.0.1:9093
amtool silence query
```

| Notion | Rôle |
| --- | --- |
| Regroupement (`group_by`) | Une notification pour plusieurs alertes similaires |
| Routage | Arbre de routes selon les étiquettes |
| **Inhibition** | Une alerte en masque d'autres (cause racine) |
| **Silence** | Mise en sourdine temporaire (maintenance) |
| Cluster | Plusieurs Alertmanager (`--cluster.peer`) : déduplication, haute disponibilité |
