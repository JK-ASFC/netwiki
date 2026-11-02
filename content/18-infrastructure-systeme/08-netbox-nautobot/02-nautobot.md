---
title: Nautobot
description: Nautobot — plateforme de source de vérité et d'automatisation réseau (Network to Code, fork de NetBox), différences avec NetBox (Jobs, dépôts Git, statuts et relations, applications), installation (Docker, paquets Python, PostgreSQL et Redis), applications (Golden Config, Device Onboarding, SSoT, ChatOps), Jobs Python, API REST et GraphQL, intégrations Ansible et Nornir.
tags: [nautobot, source de vérité, automatisation réseau, ipam, dcim, golden config, jobs]
icon: info
---

**Nautobot** (Apache 2.0, Network to Code) est né en 2021 d'un fork de [[01-netbox|NetBox]] avec une orientation **plateforme d'automatisation** : en plus de l'IPAM/DCIM, il exécute du code (Jobs), synchronise des **dépôts Git** (modèles, configurations, Jobs) et propose un écosystème d'**applications**.

| | NetBox | Nautobot |
| --- | --- | --- |
| Cible | Source de vérité, très large communauté | Source de vérité + plateforme d'automatisation |
| Code exécuté dans l'outil | Scripts personnalisés | **Jobs** (formulaires, planification, approbation) |
| Git intégré | Synchronisation de données (récent) | **Dépôts Git** : Jobs, modèles de configuration, données |
| Relations entre objets | Champs personnalisés | **Relationships** et **statuts** personnalisables |
| Applications | Greffons | Applications officielles (Golden Config, Onboarding, SSoT, ChatOps…) |

## Installation (Docker)

```bash
git clone https://github.com/nautobot/nautobot-docker-compose.git && cd nautobot-docker-compose
cp environments/local.env.example environments/local.env     # mots de passe, secret
docker compose up -d
docker compose exec nautobot nautobot-server createsuperuser
```

Installation par paquet Python : `pip install nautobot` dans un environnement virtuel, `nautobot-server init`, PostgreSQL ou MySQL, Redis, services `nautobot`, `nautobot-worker` (Celery) et `nautobot-scheduler`.

## Applications phares

| Application | Usage |
| --- | --- |
| **Golden Config** | Sauvegarde des configurations, configuration « idéale » générée par modèles Jinja, **conformité** (écarts) et remédiation |
| Device Onboarding | Ajout d'un équipement à partir de son IP (découverte SSH) |
| SSoT | Synchronisation avec d'autres sources (ServiceNow, Infoblox, IPFabric, vSphere…) |
| ChatOps | Interrogation depuis Slack/Teams/Mattermost |

## Jobs

Un Job est une classe Python (dans un dépôt Git ou le dossier `jobs`) avec un formulaire : par exemple « créer un site standard » (préfixes, VLAN, équipements) ou « vérifier la cohérence du câblage ».

```bash
docker compose exec nautobot nautobot-server runjob --username admin mon_module.MonJob
curl -s -H "Authorization: Token $TOKEN" https://nautobot.corp.exemple.fr/api/dcim/devices/?site=paris-dc1 | jq '.results[].name'
```

Ansible : collection `networktocode.nautobot` ; Nornir : `nornir-nautobot` (inventaire).

Interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
