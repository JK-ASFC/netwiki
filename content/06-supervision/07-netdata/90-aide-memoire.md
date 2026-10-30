---
title: Netdata — aide-mémoire des commandes
description: Commandes Netdata avec exemples — installation (kickstart), service, édition de la configuration (edit-config), netdatacli (reload-health, ping, aclk-state), collecteurs go.d (lister, déboguer), alertes de santé (configuration, test des notifications), API v1 (data, alarms, info), connexion à Netdata Cloud, streaming parent/enfant, conteneur Docker.
tags: [aide-mémoire, netdata, supervision, alertes, api, docker]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Netdata]].

## Installation et service

```bash
wget -O /tmp/netdata-kickstart.sh https://get.netdata.cloud/kickstart.sh && sh /tmp/netdata-kickstart.sh --stable-channel --disable-telemetry
sudo systemctl status netdata
sudo netdatacli ping
sudo netdatacli reload-health
sudo netdatacli aclk-state                  # état de la connexion à Netdata Cloud
netdata -W buildinfo | head
```

## Configuration

```bash
cd /etc/netdata
sudo ./edit-config netdata.conf
sudo ./edit-config go.d/nginx.conf
sudo ./edit-config health.d/cpu.conf
sudo ./edit-config health_alarm_notify.conf
sudo ./edit-config stream.conf
```

```ini
# /etc/netdata/netdata.conf — limiter l'accès au tableau de bord local
[web]
    bind to = 127.0.0.1:19999 10.0.99.20:19999
    allow connections from = localhost 10.0.99.*
```

## Collecteurs (go.d)

```bash
sudo -u netdata /usr/libexec/netdata/plugins.d/go.d.plugin -d -m nginx          # déboguer un module
ls /usr/lib/netdata/conf.d/go.d/ | head                                          # modèles disponibles
```

## Alertes

```bash
sudo -u netdata /usr/libexec/netdata/plugins.d/alarm-notify.sh test             # tester les notifications
curl -s "http://127.0.0.1:19999/api/v1/alarms?active" | jq '.alarms | keys'
```

## API

```bash
curl -s http://127.0.0.1:19999/api/v1/info | jq '.version, .os_name'
curl -s "http://127.0.0.1:19999/api/v1/data?chart=system.cpu&after=-300&points=10&format=json" | jq '.data[0]'
curl -s "http://127.0.0.1:19999/api/v1/allmetrics?format=prometheus" | head          # pour Prometheus
```

## Streaming et Cloud

```ini
# Enfant : /etc/netdata/stream.conf
[stream]
    enabled = yes
    destination = 10.0.98.30:19999
    api key = 11111111-2222-3333-4444-555555555555
# Parent : section [11111111-2222-3333-4444-555555555555] avec enabled = yes
```

```bash
sudo netdata-claim.sh -token=JETON -rooms=SALLE -url=https://app.netdata.cloud     # rattacher au Cloud
```

## Docker

```bash
docker run -d --name=netdata --pid=host --network=host -v /etc/passwd:/host/etc/passwd:ro -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro -v /var/run/docker.sock:/var/run/docker.sock:ro --cap-add SYS_PTRACE --security-opt apparmor=unconfined netdata/netdata
```
