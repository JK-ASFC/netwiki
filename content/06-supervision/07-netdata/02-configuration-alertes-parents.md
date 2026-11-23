---
title: Collecteurs, alertes, parents et exports
description: Configurer Netdata — collecteurs (go.d : services, SNMP, ping, ports), rétention dbengine, alertes (fichiers health.d, seuils, notifications courriel/Teams/Slack), streaming vers un parent (clés API, TLS), export vers Prometheus et autres bases, mises à jour et dépannage.
tags: [netdata, collecteurs, snmp, alertes, health, streaming, parent, prometheus]
icon: settings-2
---

## Collecteurs

La plupart des services sont détectés automatiquement. Les collecteurs `go.d` se configurent dans `/etc/netdata/go.d/` :

```bash
sudo /etc/netdata/edit-config go.d/snmp.conf
```

```yaml /etc/netdata/go.d/snmp.conf
jobs:
  - name: r1-paris
    hostname: 10.0.0.1
    update_every: 10
    options:
      version: 3
    user:
      name: supervision
      level: authPriv
      auth_proto: sha256
      auth_key: MotDePasseAuth
      priv_proto: aes
      priv_key: MotDePassePriv
```

```yaml /etc/netdata/go.d/ping.conf
jobs:
  - name: liens-wan
    hosts: [ 10.255.0.1, 10.255.0.5, 8.8.8.8 ]
    update_every: 5
```

### Catalogue des collecteurs `go.d`

Plus de 800 intégrations ; les plus courants en exploitation :

| Domaine | Modules `go.d` |
| --- | --- |
| Système / conteneurs | `docker`, `docker_engine`, `k8s_kubelet`, `k8s_kubeproxy`, `cgroups` (interne), `systemdunits`, `logind`, `filecheck` |
| Réseau | `snmp`, `ping`, `portcheck`, `httpcheck`, `x509check`, `dnsquery`, `dns_query`, `isc_dhcpd`, `wireguard`, `fail2ban`, `nvme`, `smartctl` |
| Web / proxy | `nginx`, `nginxplus`, `apache`, `httpd`, `haproxy`, `traefik`, `web_log` (journaux d'accès), `squidlog`, `varnish` |
| Bases de données | `postgres`, `mysql`, `mariadb`, `redis`, `mongodb`, `couchdb`, `cassandra`, `clickhouse`, `pgbouncer`, `elasticsearch` |
| Messagerie / files | `rabbitmq`, `activemq`, `nats`, `beanstalk`, `mosquitto` (MQTT via `prometheus`) |
| Supervision / divers | `prometheus` (scrape de tout point `/metrics` !), `windows` (windows_exporter), `vsphere`, `proxmox`, `pihole`, `powerdns`, `unbound`, `chrony`, `ntpd`, `openvpn`, `whoisquery` |

Le module `prometheus` est puissant : il permet à Netdata de **collecter n'importe quel exporteur Prometheus** et d'en tracer les métriques en temps réel, sans Prometheus.

```yaml /etc/netdata/go.d/prometheus.conf
jobs:
  - name: traefik
    url: http://127.0.0.1:8082/metrics
```

```bash
# Lister les modules go.d disponibles et déboguer un job précis
ls /usr/lib/netdata/conf.d/go.d/
sudo -u netdata /usr/libexec/netdata/plugins.d/go.d.plugin -d -m snmp     # trace de collecte
```

Au-delà de `go.d`, d'autres greffons collectent : **`ebpf.plugin`** (appels système, latence disque/réseau au niveau noyau), **`apps.plugin`** (ressources par application/utilisateur), **`cgroups.plugin`** (conteneurs/VM), **`python.d.plugin`** (collecteurs hérités), **`charts.d.plugin`** (shell), **`slabinfo`**, **`perf.plugin`** (compteurs matériels).

### Fonctions et journal systemd

Les **Functions** exposent des tables en direct interrogeables depuis le tableau de bord :

```bash
sudo netdatacli functions                                   # lister les fonctions disponibles
# Exemples : processes (top live), systemd-journal, systemd-list-units, streaming, block-devices
```

Le collecteur `systemd-journal` rend les journaux `journald` consultables et filtrables dans Netdata (recherche plein texte, facettes par unité, priorité, hôte) — pratique sur un parent qui centralise plusieurs serveurs.

## Rétention

```ini /etc/netdata/netdata.conf
[db]
    mode = dbengine
    storage tiers = 3
    # niveaux 0, 1 et 2 : résolution à la seconde, à la minute, à l'heure
    dbengine tier 0 retention size = 1GiB
    dbengine tier 1 retention size = 1GiB
    dbengine tier 2 retention size = 1GiB
```

## Alertes

Des centaines d'alertes sont préconfigurées (`/usr/lib/netdata/conf.d/health.d/`). Pour les adapter :

```bash
sudo /etc/netdata/edit-config health.d/cpu.conf
```

```text /etc/netdata/health.d/disque-local.conf
 template: disque_plein_racine
       on: disk.space
   lookup: average -1m percentage of used
    every: 1m
     warn: $this > 85
     crit: $this > 95
     info: utilisation du disque
       to: sysadmin
```

```ini /etc/netdata/health_alarm_notify.conf (extrait)
SEND_EMAIL="YES"
DEFAULT_RECIPIENT_EMAIL="exploitation@exemple.fr"
SEND_MSTEAMS="YES"
MSTEAMS_WEBHOOK_URL="https://….webhook.office.com/…"
DEFAULT_RECIPIENT_MSTEAMS="exploitation"
```

```bash
sudo -u netdata /usr/libexec/netdata/plugins.d/alarm-notify.sh test     # tester les notifications
```

Pour ne garder que les alertes centralisées, désactivez-les sur les agents enfants et laissez le **parent** les évaluer.

## Streaming vers un parent

```ini /etc/netdata/stream.conf (agent enfant)
[stream]
    enabled = yes
    destination = parent-netdata.corp.exemple.fr:19999:SSL
    api key = 11111111-2222-3333-4444-555555555555
    ssl skip certificate verification = no
```

```ini /etc/netdata/stream.conf (parent)
[11111111-2222-3333-4444-555555555555]
    enabled = yes
    allow from = 10.0.*
    db = dbengine
    health enabled by default = auto
```

Un agent enfant léger peut se contenter de collecter et transmettre (`[db] mode = ram`, tableau de bord désactivé). Pour la **haute disponibilité**, un enfant liste plusieurs parents (bascule automatique), et deux parents se répliquent mutuellement en étant à la fois parent et enfant l'un de l'autre :

```ini /etc/netdata/stream.conf (enfant : plusieurs destinations, bascule)
[stream]
    enabled = yes
    destination = parent1:19999:SSL parent2:19999:SSL      ; essaie dans l'ordre
    api key = 11111111-2222-3333-4444-555555555555
```

Depuis Netdata v2, les parents prennent en charge la **réplication** (rattrapage de l'historique manqué après une coupure) et le *streaming* compressé. Dimensionnez le `dbengine` du parent pour la rétention de tous les enfants.

## Exports

Deux sens possibles : **Prometheus collecte Netdata** (pull), ou **Netdata pousse** vers une base externe (push, via `exporting.conf`).

| Destination | Méthode |
| --- | --- |
| **Prometheus** (pull) | Collecte de `http://agent:19999/api/v1/allmetrics?format=prometheus` (ou du parent pour tous les nœuds) |
| InfluxDB, Graphite, OpenTSDB, JSON, Pub/Sub, Kafka, MongoDB | Push via `exporting.conf` |
| Prometheus *remote write* | Push vers tout récepteur compatible (VictoriaMetrics, Mimir, Thanos receive) |

```yaml prometheus.yml (extrait — Prometheus collecte Netdata)
  - job_name: netdata
    metrics_path: /api/v1/allmetrics
    params: { format: [ prometheus ] }
    honor_labels: true
    static_configs:
      - targets: [ "parent-netdata.corp.exemple.fr:19999" ]
```

```ini /etc/netdata/exporting.conf (Netdata pousse vers une base)
[exporting:global]
    enabled = yes
    update every = 10
[prometheus_remote_write:victoria]
    enabled = yes
    destination = https://vm.corp.exemple.fr/api/v1/write
    remote write URL path = /api/v1/write
    send names instead of ids = yes
[influxdb:local]
    enabled = no
    destination = influx.corp.exemple.fr:8086
```

## Mises à jour et dépannage

```bash
sudo /usr/libexec/netdata/netdata-updater.sh       # (installé par kickstart, mises à jour automatiques possibles)
sudo journalctl -u netdata -f
sudo netdatacli reload-health                      # recharger les alertes
```

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Collecteur absent | Service non détecté, droits | `sudo -u netdata /usr/libexec/netdata/plugins.d/go.d.plugin -d -m nginx` (débogage) |
| Enfant absent du parent | Clé API, port 19999, TLS | Journaux de l'enfant et du parent, pare-feu |
| Consommation CPU trop élevée | Fréquence d'une seconde sur de très nombreuses métriques | `update every`, désactiver des collecteurs inutiles |
| Tableau de bord accessible à tous | Écoute sur toutes les interfaces | `bind to`, `allow connections from`, reverse proxy authentifié |
