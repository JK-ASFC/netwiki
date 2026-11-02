---
title: Semaphore UI
description: Semaphore UI (MIT, Go) — interface web légère pour Ansible, Terraform/OpenTofu, PowerShell, Bash et Python : installation (paquet .deb/.rpm, binaire, Docker, snap), base (BoltDB, MySQL, PostgreSQL), semaphore setup, projets, magasin de clés, dépôts, inventaires, environnements, modèles de tâches, planifications, intégrations par webhook, LDAP et OIDC, rôles, notifications (e-mail, Telegram, Slack, Teams), et comparaison avec AWX.
tags: [semaphore, ansible, terraform, interface web, ci, automatisation]
icon: info
---

**Semaphore UI** offre l'essentiel d'[[01-awx|AWX]] (lancer des playbooks depuis une interface avec historique, droits et planifications) avec une installation **bien plus simple** : un binaire Go et une base de données, sans Kubernetes. Il sait aussi exécuter **Terraform/OpenTofu**, PowerShell, Bash et Python.

## Installation

```bash
# Paquet .deb depuis les versions GitHub (semaphoreui/semaphore)
sudo apt install ./semaphore_*_linux_amd64.deb ansible git
semaphore setup                       # assistant : base (MySQL, PostgreSQL ou BoltDB), URL, administrateur → config.json
semaphore server --config ./config.json
# Docker
docker run -d --name semaphore -p 3000:3000 -e SEMAPHORE_DB_DIALECT=bolt -e SEMAPHORE_ADMIN=admin -e SEMAPHORE_ADMIN_PASSWORD=MdpInitial2026 \
  -e SEMAPHORE_ADMIN_NAME=Admin -e SEMAPHORE_ADMIN_EMAIL=admin@corp.exemple.fr -v semaphore:/etc/semaphore semaphoreui/semaphore:latest
```

Interface : `http://<hôte>:3000` (à publier en HTTPS derrière un reverse proxy). Service systemd pour la version paquet.

## Organisation

| Élément | Rôle |
| --- | --- |
| **Key Store** | Clés SSH, mots de passe, phrase Ansible Vault |
| **Repositories** | Dépôts Git des playbooks ou modules Terraform |
| **Inventory** | Fichier statique, fichier du dépôt ou inventaire dynamique |
| **Variable Groups** | Variables d'environnement et extra-vars (secrets masqués) |
| **Task Templates** | Playbook + inventaire + clés, questionnaire, planification, webhook |

Authentification LDAP/AD ou OIDC dans `config.json` ; rôles par projet (propriétaire, gestionnaire, exécutant, invité).

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
