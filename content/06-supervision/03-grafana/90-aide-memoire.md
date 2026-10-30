---
title: Grafana — aide-mémoire des commandes
description: Commandes Grafana avec exemples — service et configuration (grafana.ini, variables GF_), CLI (grafana cli : plugins, réinitialisation du mot de passe admin, migrations), API HTTP avec jeton de compte de service (sources de données, tableaux de bord, dossiers, utilisateurs, équipes, alertes, annotations, santé), provisionnement par fichiers YAML, sauvegarde de la base, conteneur Docker.
tags: [aide-mémoire, grafana, api, provisioning, plugins, dashboards]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Grafana]].

## Service et CLI

```bash
sudo systemctl status grafana-server
sudo grafana cli plugins ls
sudo grafana cli plugins install grafana-clock-panel
sudo grafana cli plugins update-all
sudo grafana cli admin reset-admin-password 'NouveauMotDePasse'
sudo grafana cli admin data-migration encrypt-datasource-passwords
grafana server -v                                    # version
sudo journalctl -u grafana-server -f
```

Toute option de `grafana.ini` peut être fournie par variable : `GF_<SECTION>_<CLE>`, par exemple `GF_SERVER_ROOT_URL=https://grafana.exemple.fr` ou `GF_AUTH_ANONYMOUS_ENABLED=false`.

## API HTTP

```bash
G=https://grafana.exemple.fr
H="Authorization: Bearer $GRAFANA_TOKEN"              # jeton de compte de service
curl -s $G/api/health | jq .
curl -s -H "$H" $G/api/datasources | jq '.[] | {id, name, type, url}'
curl -s -H "$H" "$G/api/search?type=dash-db&query=reseau" | jq '.[] | {uid, title, folderTitle}'
curl -s -H "$H" $G/api/dashboards/uid/abc123 | jq .dashboard > tableau.json      # exporter
jq '{dashboard: .dashboard, overwrite: true, folderUid: "reseau"}' export.json | \
  curl -s -X POST -H "$H" -H "Content-Type: application/json" -d @- $G/api/dashboards/db       # importer
curl -s -X POST -H "$H" -H "Content-Type: application/json" -d '{"title":"Réseau","uid":"reseau"}' $G/api/folders
curl -s -H "$H" "$G/api/users/search?perpage=50" | jq '.users[] | {login, email}'
curl -s -H "$H" $G/api/teams/search | jq '.teams[].name'
curl -s -H "$H" $G/api/v1/provisioning/alert-rules | jq '.[].title'
curl -s -X POST -H "$H" -H "Content-Type: application/json" \
  -d '{"text":"Mise en production v2.3","tags":["deploiement"]}' $G/api/annotations
```

## Provisionnement (fichiers)

```yaml
# /etc/grafana/provisioning/datasources/prometheus.yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://127.0.0.1:9090
    isDefault: true
```

```yaml
# /etc/grafana/provisioning/dashboards/fichiers.yaml
apiVersion: 1
providers:
  - name: tableaux
    folder: Réseau
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

## Sauvegarde

```bash
sudo systemctl stop grafana-server
sudo sqlite3 /var/lib/grafana/grafana.db ".backup '/srv/sauvegardes/grafana-$(date +%F).db'"
sudo tar czf /srv/sauvegardes/grafana-conf-$(date +%F).tar.gz /etc/grafana /var/lib/grafana/plugins
sudo systemctl start grafana-server
```

## Conteneur

```bash
docker run -d --name grafana -p 3000:3000 -v grafana-data:/var/lib/grafana \
  -e GF_SECURITY_ADMIN_PASSWORD__FILE=/run/secrets/admin -e GF_INSTALL_PLUGINS=grafana-clock-panel grafana/grafana-oss:11.3.0
```
