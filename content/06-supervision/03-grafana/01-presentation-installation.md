---
title: Présentation et installation
description: Grafana, plate-forme de visualisation et d'alerte — sources de données (Prometheus, InfluxDB, Loki, Elasticsearch, SQL, Zabbix), éditions OSS et Enterprise, installation sous Debian/Ubuntu, RHEL, Windows, macOS et Docker, grafana.ini (URL publique, base de données, sécurité), reverse proxy et premiers pas.
tags: [grafana, tableaux de bord, visualisation, installation, grafana.ini, prometheus]
icon: info
---

**Grafana** construit des **tableaux de bord** interactifs à partir de nombreuses sources de données — métriques, journaux, traces, bases SQL — et gère des **alertes** unifiées. Il est le compagnon naturel de [[02-prometheus/01-presentation-installation|Prometheus]], [[10-influxdb/01-presentation-installation|InfluxDB]], Loki ou Zabbix.

## Sources de données courantes

| Source | Usage |
| --- | --- |
| **Prometheus** / VictoriaMetrics / Mimir | Métriques système, réseau (SNMP), Kubernetes |
| **InfluxDB** | Séries temporelles (Telegraf, IoT) |
| **Loki** | Journaux (pile Grafana) |
| Elasticsearch / OpenSearch | Journaux, événements |
| PostgreSQL, MySQL, SQL Server | Données métier, inventaires |
| Zabbix (greffon) | Réutiliser les données d'un Zabbix existant |
| Infinity, JSON API | API REST quelconques |

## Éditions

| Édition | Licence |
| --- | --- |
| **Grafana OSS** | AGPLv3 |
| Grafana Enterprise | Commerciale (synchronisation des équipes LDAP, rapports PDF, sources de données entreprise, audit) |
| Grafana Cloud | Service hébergé (offre gratuite limitée) |

## Installation

### Debian / Ubuntu

```bash
sudo apt install -y apt-transport-https software-properties-common wget
sudo mkdir -p /etc/apt/keyrings
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg >/dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update && sudo apt install grafana            # grafana-enterprise pour l'édition Enterprise
sudo systemctl enable --now grafana-server
```

### RHEL / Rocky / Alma

```ini /etc/yum.repos.d/grafana.repo
[grafana]
name=grafana
baseurl=https://rpm.grafana.com
repo_gpgcheck=1
enabled=1
gpgcheck=1
gpgkey=https://rpm.grafana.com/gpg.key
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
```

```bash
sudo dnf install grafana && sudo systemctl enable --now grafana-server
```

### Windows, macOS, Docker

| Plate-forme | Installation |
| --- | --- |
| Windows | Installateur MSI (service *Grafana*), configuration `C:\Program Files\GrafanaLabs\grafana\conf\custom.ini` |
| macOS | `brew install grafana && brew services start grafana` |
| Docker | `docker run -d --name grafana -p 3000:3000 -v grafana-data:/var/lib/grafana grafana/grafana-oss` |

## grafana.ini

```ini /etc/grafana/grafana.ini (extrait)
[server]
protocol = http
http_addr = 127.0.0.1
http_port = 3000
domain = grafana.corp.exemple.fr
root_url = https://grafana.corp.exemple.fr/

[database]
type = postgres                 ; SQLite par défaut (convient aux petites instances)
host = 127.0.0.1:5432
name = grafana
user = grafana
password = MotDePasse

[security]
admin_user = admin
disable_initial_admin_creation = false
cookie_secure = true
disable_gravatar = true

[users]
allow_sign_up = false
default_theme = dark

[auth.anonymous]
enabled = false

[smtp]
enabled = true
host = relais.corp.exemple.fr:25
from_address = grafana@exemple.fr
```

Les variables d'environnement `GF_<SECTION>_<CLÉ>` (ex. `GF_SERVER_ROOT_URL`) surchargent le fichier — pratique en conteneur.

## Reverse proxy

```nginx /etc/nginx/sites-available/grafana.conf (extrait)
map $http_upgrade $connection_upgrade { default upgrade; '' close; }
server {
    listen 443 ssl;
    server_name grafana.corp.exemple.fr;
    location / {
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3000;
    }
    location /api/live/ {                         # WebSocket (mises à jour en direct)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

## Premiers pas

1. Se connecter (`admin` / `admin`, changement imposé).
2. *Connections → Data sources* : ajouter Prometheus (`http://127.0.0.1:9090`).
3. *Dashboards → Import* : importer un tableau communautaire (ex. *Node Exporter Full*, identifiant 1860) puis l'adapter.

## Suite du parcours

1. [[02-tableaux-alertes|Tableaux de bord, variables et alertes]]
2. [[03-securite-exploitation|Authentification, provisionnement et exploitation]]
