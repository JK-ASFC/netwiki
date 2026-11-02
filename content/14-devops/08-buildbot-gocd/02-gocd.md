---
title: GoCD
description: GoCD (Thoughtworks, Apache 2.0) — serveur de livraison continue centré sur les pipelines et la carte de flux de valeur : architecture serveur et agents, installation (paquets DEB/RPM, Windows, macOS, Docker), ports 8153/8154, enregistrement automatique des agents (clé autoregister), matériaux, étapes, jobs et tâches, pipelines as code (dépôt de configuration YAML), environnements, élastiques agents (Kubernetes, Docker), authentification LDAP, sauvegarde et API.
tags: [gocd, cd, livraison continue, pipelines, agents, yaml]
icon: info
---

**GoCD** modélise la livraison comme une chaîne de **pipelines** reliés (construction → tests → recette → production) et affiche la **carte de flux de valeur** : on voit quelle version de quel dépôt est arrivée jusqu'où. Les déploiements manuels (bouton *approval*) et la traçabilité en font un bon outil de **CD** pour l'infrastructure.

## Installation

```bash
# Debian/Ubuntu
curl -fsSL https://download.gocd.org/GOCD-GPG-KEY.asc | sudo gpg --dearmor -o /usr/share/keyrings/gocd.gpg
echo "deb [signed-by=/usr/share/keyrings/gocd.gpg] https://download.gocd.org /" | sudo tee /etc/apt/sources.list.d/gocd.list
sudo apt update && sudo apt install go-server go-agent
sudo systemctl enable --now go-server
```

RHEL : dépôt `https://download.gocd.org` (fichier `.repo`) puis `dnf install go-server go-agent`. Windows et macOS : installeurs du site gocd.org. Docker : `gocd/gocd-server` et `gocd/gocd-agent-*`.

| Port | Usage |
| --- | --- |
| **8153** | Interface web et API (HTTP ; publier derrière un reverse proxy TLS) |
| 8154 | Ancien port HTTPS des agents (les versions récentes passent par 8153) |

Agents : dans `/usr/share/go-agent/wrapper-config/wrapper-properties.conf`, `wrapper.app.parameter.101=https://gocd.corp.exemple.fr/go` ; pour l'enregistrement automatique, `/var/lib/go-agent/config/autoregister.properties` avec `agent.auto.register.key` (copiée depuis *Admin → Server Configuration*) et `agent.auto.register.environments=prod`.

## Pipeline as code (YAML)

```yaml
# ci.gocd.yaml dans le dépôt, déclaré dans Admin → Config Repositories
format_version: 10
pipelines:
  outils-reseau:
    group: infra
    materials:
      depot:
        git: https://git.corp.exemple.fr/infra/outils-reseau.git
        branch: main
    stages:
      - tests:
          jobs:
            lint:
              tasks:
                - exec: { command: ansible-lint }
      - deploiement-prod:
          approval: { type: manual }
          jobs:
            deployer:
              resources: [ansible]
              tasks:
                - exec: { command: ansible-playbook, arguments: [-i, inventaires/prod, site.yml] }
```

Sécurité : greffon d'authentification (LDAP/AD, fichier), rôles par groupe de pipelines, secrets via *Secret Configs* (fichier chiffré, Vault). Sauvegarde : *Admin → Backup* (configuration et base H2/PostgreSQL).

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
