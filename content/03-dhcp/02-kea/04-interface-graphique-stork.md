---
title: Interface graphique (Stork)
description: Stork (ISC) — tableau de bord et gestion de Kea DHCP et de BIND9 : architecture (serveur Stork, base PostgreSQL, agents sur les serveurs), installation sur Debian/Ubuntu et RHEL (dépôt Cloudsmith ISC), enregistrement des machines, tableau de bord (utilisation des sous-réseaux, haute disponibilité), recherche de baux, réservations, revue de configuration, journaux, alertes et exportation Prometheus/Grafana.
tags: [stork, kea, dhcp, isc, interface graphique, supervision, bind9]
icon: app-window
---

**Stork** (ISC, MPL 2.0) est l'interface web officielle de [[01-presentation-installation|Kea]] (et la supervision de BIND9) : vue d'ensemble des serveurs, **taux d'occupation des sous-réseaux et des pools**, état de la **haute disponibilité**, recherche de baux, gestion des **réservations** et revue automatique de la configuration.

| Composant | Rôle |
| --- | --- |
| **stork-server** | Interface web et API, base **PostgreSQL** |
| **stork-agent** | Sur chaque serveur Kea/BIND9 : relaie l'API de contrôle de Kea et les statistiques ; exportateur Prometheus |

## Installation

```bash
# Dépôt ISC (Cloudsmith) — Debian/Ubuntu
curl -1sLf 'https://dl.cloudsmith.io/public/isc/stork/cfg/setup/bash.deb.sh' | sudo bash
sudo apt install isc-stork-server postgresql            # serveur
sudo apt install isc-stork-agent                        # sur chaque serveur Kea
# RHEL / Rocky / Alma : bash.rpm.sh puis dnf install isc-stork-server / isc-stork-agent
sudo stork-tool db-create --db-name stork --db-user stork     # base et utilisateur PostgreSQL
sudoedit /etc/stork/server.env                          # STORK_DATABASE_PASSWORD, STORK_REST_HOST…
sudo systemctl enable --now isc-stork-server
```

Interface : `http://stork.corp.exemple.fr:8080` — compte initial **admin / admin** (changement imposé).

Sur chaque serveur Kea : activer le *control agent* de Kea (ou la socket de contrôle selon la version), puis enregistrer l'agent :

```bash
sudo su stork-agent -s /bin/sh -c 'stork-agent register --server-url http://stork.corp.exemple.fr:8080'
sudo systemctl enable --now isc-stork-agent
```

Autorisez la machine dans *Services → Machines → Unauthorized*.

## Pages principales

| Page | Contenu |
| --- | --- |
| **Tableau de bord** | Sous-réseaux et pools les plus utilisés, état des serveurs, haute disponibilité |
| **DHCP → Subnets / Shared networks** | Occupation (%), adresses allouées, statistiques par pool |
| **DHCP → Host reservations** | Réservations (configuration ou base de Kea), ajout et modification depuis l'interface |
| **DHCP → Leases search** | Recherche d'un bail par adresse IP, MAC, identifiant client ou nom d'hôte |
| **Services → Machines / Apps** | Serveurs, versions, journaux, état des démons, **revue de configuration** (alertes sur les erreurs courantes) |
| **Events** | Historique (bascule HA, connexion perdue, modification) |

<!-- CAPTURE: Stork — tableau de bord DHCP (occupation des sous-réseaux) | _assets/stork-tableau-de-bord.png -->
<!-- CAPTURE: Stork — recherche de baux | _assets/stork-recherche-baux.png -->
<!-- CAPTURE: Stork — réservations d'hôtes | _assets/stork-reservations.png -->

## Supervision

L'agent expose des métriques Prometheus (`:9547` pour Kea, `:9119` pour BIND9) ; ISC fournit des tableaux de bord [[03-grafana/01-presentation-installation|Grafana]]. Alertes recommandées : pool occupé à plus de 80 %, partenaire HA injoignable.
