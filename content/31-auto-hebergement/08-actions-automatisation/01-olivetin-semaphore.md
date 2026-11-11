---
title: OliveTin et Ansible Semaphore
description: Déclencher des actions depuis le web — OliveTin (boutons web qui exécutent des commandes prédéfinies et sûres, config.yaml, arguments validés, confirmation, Docker) et Ansible Semaphore (interface web pour lancer des playbooks Ansible, du Terraform/OpenTofu et des scripts : projets, inventaires, clés, modèles de tâches, planification, journaux, API) ; usage pour déléguer des tâches sans donner d'accès SSH et sécurité.
tags: [olivetin, semaphore, ansible, automatisation, actions, playbook, terraform, délégation]
icon: workflow
---

Donner à un collègue ou à un utilisateur la possibilité de **lancer une action** (redémarrer un service, relancer une sauvegarde, déployer) **sans lui ouvrir un accès SSH complet** : c'est le rôle de ces deux outils, à deux échelles.

## OliveTin

**OliveTin** affiche des **boutons** dans une page web ; chaque bouton exécute une **commande prédéfinie** sur le serveur. L'intérêt est la **sûreté** : seules les commandes déclarées existent, et les arguments libres sont **validés** par une expression régulière, ce qui évite l'injection.

```yaml config.yaml
logLevel: INFO
actions:
  - title: Redémarrer Nginx
    icon: 🔄
    shell: systemctl restart nginx
    timeout: 20
  - title: Sauvegarde manuelle
    shell: /usr/local/bin/sauvegarde.sh
  - title: Vider le cache de {{ site }}
    shell: /usr/local/bin/purge-cache.sh {{ site }}
    arguments:
      - name: site
        type: ascii_identifier          # restreint les valeurs possibles (pas d'injection)
        choices:
          - { title: Intranet, value: intranet }
          - { title: Portail, value: portail }
    popupOnStart: true                    # demande confirmation
```

```bash
docker run -d --name olivetin -p 127.0.0.1:1337:1337 \
  -v /srv/olivetin/config.yaml:/config/config.yaml \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jamesread/olivetin
```

Parfait pour un **tableau d'actions du quotidien** partagé avec une équipe support : relancer un conteneur, purger un cache, envoyer un rapport, sans accès shell.

## Ansible Semaphore

**Semaphore** est une **interface web** pour exécuter des **playbooks Ansible** (et aussi du **Terraform/OpenTofu**, du **PowerShell** et des scripts) sans ligne de commande : on y gère des **projets**, des **inventaires**, des **clés** (SSH, coffre Ansible), des **modèles de tâches** (quel playbook, quel inventaire), avec **planification**, **journaux** et **API**.

```bash
docker run -d --name semaphore -p 127.0.0.1:3000:3000 \
  -e SEMAPHORE_DB_DIALECT=bolt \
  -e SEMAPHORE_ADMIN=admin -e SEMAPHORE_ADMIN_PASSWORD='…' \
  -e SEMAPHORE_ADMIN_NAME="Administrateur" -e SEMAPHORE_ADMIN_EMAIL=admin@exemple.fr \
  -v /srv/semaphore:/etc/semaphore \
  semaphoreui/semaphore:latest
# En production : base PostgreSQL/MySQL plutôt que BoltDB
```

| Notion | Rôle |
| --- | --- |
| Projet | Regroupe dépôts, inventaires, clés, modèles |
| Dépôt | Où sont les playbooks (Git) |
| Inventaire | Hôtes cibles (statique ou dynamique) |
| **Clé** | SSH, mot de passe, *vault* Ansible — stockées chiffrées |
| Modèle de tâche | Playbook + inventaire + options, lançable d'un clic ou planifié |

Semaphore permet de **déléguer** l'exécution de playbooks à des personnes qui n'ont pas accès au contrôleur Ansible, avec rôles et journal d'audit. Voir [[17-automatisation/01-ansible/01-presentation-installation|Ansible]] pour les playbooks eux-mêmes.

## Sécurité

> [!WARNING]
> Ces outils **exécutent des commandes privilégiées** déclenchées par une interface web : leur accès doit être strictement contrôlé (authentification forte, HTTPS, réseau d'administration, journal d'audit). Avec OliveTin, n'autoriser que des commandes **précises** et valider tous les arguments (pas de champ libre non contraint). Avec Semaphore, protéger les **clés** stockées et limiter les modèles par utilisateur. Dans les deux cas, le compte qui exécute doit avoir le **minimum de privilèges** nécessaires.

## Choisir

| Besoin | Outil |
| --- | --- |
| Quelques actions prédéfinies, boutons simples | OliveTin |
| Lancer des playbooks Ansible/Terraform par le web | Ansible Semaphore |
| Automatisation événementielle plus large | [[21-outils/05-ia-productivite/06-n8n\|n8n]], Rundeck |

Commandes : [[90-aide-memoire|aide-mémoire]].
