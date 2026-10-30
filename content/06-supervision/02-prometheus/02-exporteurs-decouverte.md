---
title: Exporteurs (système, Windows, SNMP, blackbox) et découverte
description: Superviser avec les exporteurs Prometheus — node_exporter (Linux), windows_exporter, blackbox_exporter (HTTP, ICMP, TCP, DNS, certificats), snmp_exporter pour les équipements réseau (modules, SNMPv3, générateur), découverte de cibles par fichiers et DNS, réécriture d'étiquettes (relabel_configs) et sécurisation des points /metrics.
tags: [prometheus, node_exporter, windows_exporter, blackbox_exporter, snmp_exporter, snmp, relabel, file_sd]
icon: plug
---

## node_exporter (Linux)

```bash
sudo apt install prometheus-node-exporter          # ou binaire + unité systemd
curl -s http://localhost:9100/metrics | grep node_load1
```

Collecteurs utiles à activer : `--collector.systemd` (état des services), `--collector.textfile.directory=/var/lib/node_exporter` (métriques écrites par vos scripts, ex. âge de la dernière sauvegarde).

## windows_exporter

```powershell
msiexec /i windows_exporter-0.31.1-amd64.msi ENABLED_COLLECTORS="cpu,cs,logical_disk,memory,net,os,service,system,tcp" LISTEN_PORT=9182
New-NetFirewallRule -DisplayName "windows_exporter" -Direction Inbound -Protocol TCP -LocalPort 9182 -RemoteAddress 10.0.99.10 -Action Allow
```

Collecteurs supplémentaires : `iis`, `ad`, `dns`, `dhcp`, `mssql`, `hyperv`…

## blackbox_exporter : sondes externes

```yaml /etc/prometheus/blackbox.yml
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      preferred_ip_protocol: ip4
      valid_status_codes: []            # 2xx
  icmp:
    prober: icmp
  tcp_connect:
    prober: tcp
  dns_corp:
    prober: dns
    dns:
      query_name: "corp.exemple.fr"
      query_type: "SOA"
```

```yaml prometheus.yml (extrait)
  - job_name: blackbox-http
    metrics_path: /probe
    params: { module: [ http_2xx ] }
    static_configs:
      - targets: [ "https://intranet.corp.exemple.fr", "https://gitlab.corp.exemple.fr/-/health" ]
    relabel_configs:
      - source_labels: [ __address__ ]
        target_label: __param_target
      - source_labels: [ __param_target ]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9115

  - job_name: blackbox-icmp
    metrics_path: /probe
    params: { module: [ icmp ] }
    file_sd_configs:
      - files: [ /etc/prometheus/cibles/equipements-*.yml ]
    relabel_configs:
      - { source_labels: [ __address__ ], target_label: __param_target }
      - { source_labels: [ __param_target ], target_label: instance }
      - { target_label: __address__, replacement: 127.0.0.1:9115 }
```

Métriques clés : `probe_success`, `probe_duration_seconds`, `probe_ssl_earliest_cert_expiry` (expiration des certificats), `probe_http_status_code`.

## snmp_exporter : équipements réseau

```yaml /etc/prometheus/snmp.yml (extrait : authentifications)
auths:
  v2_lecture:
    community: CommunauteLongueEtSecrete
    version: 2
  v3_supervision:
    version: 3
    username: supervision
    security_level: authPriv
    auth_protocol: SHA256
    password: MotDePasseAuth
    priv_protocol: AES
    priv_password: MotDePassePriv
```

Les **modules** (`if_mib`, `cisco_wlc`, `paloalto_fw`, `synology`…) décrivent les OID à collecter ; le fichier `snmp.yml` fourni en contient beaucoup, et le **générateur** permet d'en créer à partir des MIB des constructeurs.

```yaml prometheus.yml (extrait)
  - job_name: snmp-reseau
    scrape_interval: 60s
    scrape_timeout: 50s
    metrics_path: /snmp
    params:
      auth: [ v3_supervision ]
      module: [ if_mib ]
    file_sd_configs:
      - files: [ /etc/prometheus/cibles/equipements-*.yml ]
    relabel_configs:
      - { source_labels: [ __address__ ], target_label: __param_target }
      - { source_labels: [ __param_target ], target_label: instance }
      - { target_label: __address__, replacement: 127.0.0.1:9116 }
```

```yaml /etc/prometheus/cibles/equipements-paris.yml
- targets: [ "10.0.0.2", "10.0.0.3" ]
  labels: { site: paris, role: coeur }
- targets: [ "10.0.1.10", "10.0.1.11", "10.0.1.12" ]
  labels: { site: paris, role: acces }
```

```text Débit entrant d'une interface (bit/s) et utilisation (%)
rate(ifHCInOctets{instance="10.0.0.2", ifName="Te1/1/1"}[5m]) * 8
rate(ifHCInOctets[5m]) * 8 / (ifHighSpeed * 1e6) * 100
```

Pour la télémétrie en flux (gNMI, streaming), voir [[09-telegraf/01-presentation-configuration|Telegraf]] ou gnmic, qui exposent aussi des métriques Prometheus.

## Découverte des cibles

| Méthode | Usage |
| --- | --- |
| `static_configs` | Peu de cibles fixes |
| **`file_sd_configs`** | Fichiers YAML/JSON générés par vos outils (CMDB, Ansible, NetBox) : rechargés automatiquement |
| `dns_sd_configs` | Enregistrements SRV ou A |
| `consul_sd_configs`, `kubernetes_sd_configs`, `azure_sd_configs`, `ec2_sd_configs` | Plates-formes dynamiques |
| `http_sd_configs` | API renvoyant la liste des cibles (NetBox, inventaire maison) |

## Réécriture d'étiquettes

| Action | Exemple |
| --- | --- |
| Garder certaines cibles | `- { source_labels: [role], regex: "coeur\|distribution", action: keep }` |
| Créer une étiquette | `- { source_labels: [__address__], regex: "([^.]+)\\..*", target_label: hote }` |
| Supprimer des métriques coûteuses | `metric_relabel_configs: - { source_labels: [__name__], regex: "go_.*", action: drop }` |

## Sécuriser les points /metrics

```yaml /etc/prometheus/web.yml (node_exporter, Prometheus : --web.config.file)
tls_server_config:
  cert_file: /etc/prometheus/tls/serveur.crt
  key_file: /etc/prometheus/tls/serveur.key
basic_auth_users:
  prometheus: $2y$10$…            # hachage bcrypt (htpasswd -nBC 10 "" | tr -d ':')
```

Côté Prometheus : `scheme: https`, `tls_config`, `basic_auth` dans le job. À défaut, limitez l'accès aux ports des exporteurs au seul serveur Prometheus par pare-feu.
