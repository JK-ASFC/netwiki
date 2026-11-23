---
title: Présentation et installation
description: Netdata — supervision temps réel à la seconde, découverte automatique des services, faible empreinte, stockage local à plusieurs niveaux, architecture agent/parent/cloud, licences, installation par le script kickstart sous Linux, Docker, macOS et Windows, tableau de bord local et sécurisation de l'accès.
tags: [netdata, temps réel, métriques, installation, kickstart, tableau de bord]
icon: info
---

**Netdata** collecte des **milliers de métriques par seconde** sur chaque machine (système, conteneurs, services, réseau) dès l'installation, sans configuration, et les affiche dans des tableaux de bord interactifs. Il est idéal pour le **diagnostic en temps réel** (pic de latence, saturation disque, interface qui sature) et la supervision de parcs de serveurs, en complément d'outils orientés disponibilité et alertes métier.

## Architecture

```mermaid
flowchart LR
  A1["Agent Netdata<br/>(serveur 1)"] -- "streaming" --> P["Parent Netdata<br/>(centralisation, rétention longue)"]
  A2["Agent (serveur 2)"] --> P
  A3["Agent (conteneur / VM)"] --> P
  P -. "optionnel" .-> C["Netdata Cloud<br/>(vues multi-nœuds, alertes)"]
  P -- "export" --> PROM["Prometheus / InfluxDB / Graphite"]
```

| Élément | Rôle |
| --- | --- |
| **Agent** | Collecte locale (plus de 800 intégrations : système, Docker, Kubernetes, Nginx, MySQL, SNMP…), stockage, alertes, tableau de bord (port **19999**) |
| **Parent** | Reçoit le flux d'autres agents (*streaming*), conserve leur historique, centralise les alertes |
| Netdata Cloud | Service SaaS optionnel : vue unifiée, gestion des alertes et des équipes (l'interface agent locale fonctionne sans) |
| Stockage | Base `dbengine` à plusieurs niveaux (seconde, minute, heure) : rétention de plusieurs mois en quelques Go |

## Licences

L'agent est libre (GPLv3+) ; l'interface web récente et Netdata Cloud sont soumises à des conditions propres (gratuites avec limites, offres payantes). Vérifiez les conditions de la version utilisée pour un usage en entreprise.

## Installation

```bash
# Linux : script officiel (paquets natifs si disponibles), sans connexion au Cloud
wget -O /tmp/netdata-kickstart.sh https://get.netdata.cloud/kickstart.sh
sh /tmp/netdata-kickstart.sh --stable-channel --disable-telemetry
sudo systemctl status netdata
```

| Plate-forme | Installation |
| --- | --- |
| Debian / Ubuntu / RHEL | Script *kickstart* (dépôts Netdata) ; paquet `netdata` des distributions (plus ancien) |
| Docker | `docker run -d --name netdata --pid=host --network=host -v /proc:/host/proc:ro -v /sys:/host/sys:ro -v /var/run/docker.sock:/var/run/docker.sock:ro --cap-add SYS_PTRACE --cap-add SYS_ADMIN netdata/netdata` |
| Kubernetes | Chart Helm `netdata/netdata` (agent par nœud + parent) |
| macOS | `brew install netdata` |
| Windows | Agent Windows (installateur MSI, collecte via Windows Performance Counters / ETW) |

## Tableau de bord local

`http://serveur:19999` : graphiques organisés par catégorie, mis à jour à la seconde.

| Fonctionnalité du tableau de bord | Usage |
| --- | --- |
| **Metric Correlations** | Sélectionner une fenêtre de temps : Netdata classe les métriques qui ont le plus changé → trouver la cause d'un incident |
| **Anomaly Advisor** | Détection d'anomalies par apprentissage automatique (un modèle par métrique, entraîné en continu) ; score d'anomalie par graphique |
| **Functions** | Tables interactives en direct fournies par les collecteurs : `processes` (comme `top`), `systemd-journal` (journaux), `systemd-list-units`, `streaming`, `block-devices`, `network-connections`, `mount-points` |
| **Alerts** | Onglet des alertes actives, acquittées, et historique |
| **Nodes** | Vue multi-nœuds (sur un parent ou le Cloud) |

La détection d'anomalies s'active/se règle dans `[ml]` de `netdata.conf` (`enabled = yes` par défaut sur la plupart des versions) :

```ini /etc/netdata/netdata.conf
[ml]
    enabled = yes
    maximum num samples to train = 21600     ; 6 h d'entraînement glissant
    num samples to diff = 1
```

> [!WARNING]
> Par défaut, l'agent écoute sur **toutes les interfaces** sans authentification : n'importe qui sur le réseau voit les métriques (noms de processus, utilisateurs, connexions). Restreignez l'écoute ou l'accès.

```ini /etc/netdata/netdata.conf (extrait)
[web]
    bind to = 127.0.0.1 10.0.99.15
    allow connections from = localhost 10.0.99.*
    allow dashboard from = localhost 10.0.99.*
```

```bash
sudo /etc/netdata/edit-config netdata.conf      # outil d'édition fourni (copie le fichier par défaut si besoin)
sudo systemctl restart netdata
```

Publiez le tableau de bord derrière un reverse proxy HTTPS authentifié si un accès distant est nécessaire.

### Durcissement complémentaire

```ini /etc/netdata/netdata.conf
[web]
    mode = static-threaded
    bind to = 127.0.0.1:19999
    # Restreindre les API dangereuses (modification de config, exécution de fonctions) :
    allow management from = localhost
    allow netdata.conf from = localhost
    allow streaming from = 10.0.*
    enable gzip compression = yes
[registry]
    enabled = no                               ; pas d'enregistrement global (vie privée)
[global]
    run as user = netdata
```

- **Désactiver la télémétrie** : `--disable-telemetry` à l'installation, ou fichier `/etc/netdata/.opt-out-from-anonymous-statistics`.
- **Jeton d'API** (lecture) pour un accès programmatique contrôlé : à définir côté reverse proxy (en-tête `Authorization`), Netdata n'authentifie pas lui-même l'agent local.
- Le compte `netdata` tourne **sans privilèges** ; certains collecteurs (eBPF, perf) nécessitent des capacités ajoutées à des binaires précis (déjà réglées par le paquet).

## Suite

[[02-configuration-alertes-parents|Collecteurs, alertes, parents et exports]]
