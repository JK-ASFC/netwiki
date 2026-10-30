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

Autres collecteurs utiles : `portcheck` (ports TCP), `httpcheck`, `x509check` (expiration de certificats), `dnsquery`, `nginx`, `postgres`, `docker`, `systemdunits`, `wireguard`.

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

Un agent enfant léger peut se contenter de collecter et transmettre (`[db] mode = ram`, tableau de bord désactivé). Deux parents peuvent se répliquer mutuellement pour la haute disponibilité.

## Exports

| Destination | Méthode |
| --- | --- |
| **Prometheus** | Collecte de `http://agent:19999/api/v1/allmetrics?format=prometheus` (ou du parent pour tous les nœuds) |
| InfluxDB, Graphite, OpenTSDB, remote write | `exporting.conf` |

```yaml prometheus.yml (extrait)
  - job_name: netdata
    metrics_path: /api/v1/allmetrics
    params: { format: [ prometheus ] }
    static_configs:
      - targets: [ "parent-netdata.corp.exemple.fr:19999" ]
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
