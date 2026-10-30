---
title: Présentation et installation
description: Graylog, plate-forme de gestion centralisée des journaux — architecture (serveur Graylog, MongoDB, Data Node ou OpenSearch), éditions Open, Enterprise et Security, dimensionnement, installation de Graylog 6 sous Debian/Ubuntu et RHEL, configuration de server.conf, assistant de pré-vol du Data Node, Docker et reverse proxy.
tags: [graylog, journaux, siem, mongodb, opensearch, data node, installation]
icon: info
---

**Graylog** centralise les journaux de toute l'infrastructure (serveurs, équipements réseau, applications), les **normalise**, les rend **cherchables** en quelques secondes et déclenche des **alertes**. Plus simple à exploiter qu'une pile Elastic complète, il est très utilisé par les équipes réseau et système comme puits syslog central.

## Architecture

```mermaid
flowchart LR
  S["Équipements réseau<br/>(syslog)"] --> G
  L["Serveurs Linux / Windows<br/>(Sidecar : Filebeat, Winlogbeat, NXLog)"] --> G
  A["Applications (GELF)"] --> G
  G["Graylog server<br/>entrées, flux, pipelines,<br/>alertes, interface :9000"] --> D[("Data Node / OpenSearch<br/>(messages)")]
  G --> M[("MongoDB<br/>(configuration)")]
```

| Composant | Rôle |
| --- | --- |
| **Graylog server** | Entrées, traitement (flux, pipelines), recherche, alertes, interface web et API (port **9000**) |
| **MongoDB** | Configuration, utilisateurs, métadonnées |
| **Graylog Data Node** (ou OpenSearch 2.x) | Stockage et indexation des messages ; le Data Node est une distribution OpenSearch gérée par Graylog (certificats, mises à jour) |
| Journal disque | Tampon local des messages reçus avant traitement |

## Éditions

| Édition | Remarque |
| --- | --- |
| **Graylog Open** | Gratuite (licence SSPL) : collecte, recherche, flux, pipelines, alertes, tableaux de bord |
| Graylog Enterprise | Archivage, rapports, journal d'audit, synchronisation de groupes LDAP… |
| Graylog Security | Fonctions SIEM (détections, enquêtes, UEBA) |

## Dimensionnement indicatif

| Volume | Proposition |
| --- | --- |
| < 5 Go/jour | Un serveur (Graylog + MongoDB + Data Node), 4 vCPU, 16 Go RAM, SSD |
| 5-50 Go/jour | Graylog et MongoDB sur un nœud, Data Node/OpenSearch sur 3 nœuds |
| Au-delà | Plusieurs serveurs Graylog derrière un répartiteur, MongoDB en replica set |

## Installation (Graylog 6, Debian/Ubuntu)

```bash
# MongoDB (dépôt officiel MongoDB, voir la fiche MongoDB) puis :
wget https://packages.graylog2.org/repo/packages/graylog-6.1-repository_latest.deb
sudo dpkg -i graylog-6.1-repository_latest.deb && sudo apt update
sudo apt install graylog-datanode graylog-server
echo 'vm.max_map_count = 262144' | sudo tee /etc/sysctl.d/99-graylog-datanode.conf && sudo sysctl --system
```

Sous RHEL : `rpm -Uvh https://packages.graylog2.org/repo/packages/graylog-6.1-repository_latest.rpm` puis `dnf install graylog-datanode graylog-server`. La fiche [[03-mongodb/01-presentation-installation|MongoDB]] décrit l'installation de la base.

### Secrets et configuration

```bash
pwgen -N 1 -s 96                                  # password_secret (identique sur tous les nœuds et le Data Node)
echo -n 'MotDePasseAdminLong!' | sha256sum        # root_password_sha2
```

```ini /etc/graylog/server/server.conf (extrait)
password_secret = <96 caractères aléatoires>
root_password_sha2 = <empreinte SHA-256>
root_email = admin-journaux@exemple.fr
root_timezone = Europe/Paris
http_bind_address = 127.0.0.1:9000
http_external_uri = https://graylog.corp.exemple.fr/
mongodb_uri = mongodb://graylog:MotDePasse@127.0.0.1:27017/graylog
message_journal_max_size = 10gb
```

```ini /etc/graylog/datanode/datanode.conf (extrait)
password_secret = <même valeur que server.conf>
mongodb_uri = mongodb://graylog:MotDePasse@127.0.0.1:27017/graylog
opensearch_heap = 4g
```

```bash
sudo systemctl enable --now graylog-datanode graylog-server
sudo tail -f /var/log/graylog-server/server.log     # mot de passe temporaire de l'assistant de pré-vol
```

Au premier démarrage, l'**assistant de pré-vol** (interface web) configure le Data Node et son autorité de certification. Ensuite, connexion avec `admin` et le mot de passe dont l'empreinte figure dans `root_password_sha2`.

## Docker

Des fichiers Compose officiels (Graylog + MongoDB + Data Node) sont publiés par Graylog ; montez des volumes pour MongoDB, le Data Node et le journal Graylog.

## Reverse proxy

```nginx /etc/nginx/sites-available/graylog.conf (extrait)
location / {
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Graylog-Server-URL https://$server_name/;
    proxy_pass http://127.0.0.1:9000;
}
```

## Suite du parcours

1. [[02-entrees-flux-pipelines|Entrées, Sidecar, flux, pipelines et index]]
2. [[03-alertes-securite-exploitation|Alertes, sécurité et exploitation]]
