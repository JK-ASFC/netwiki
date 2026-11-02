---
title: Présentation, installation et utilisation
description: Rundeck Community (PagerDuty, Apache 2.0) — orchestration des opérations et libre-service : projets, nœuds (sources de ressources, SSH, WinRM, Ansible), tâches (commandes, scripts, enchaînements, options, filtres de nœuds, gestion des erreurs), planification, ACL, journal d'exécution, authentification LDAP/AD, stockage de clés, installation (paquets Debian/RHEL, Docker, Java 11/17), base externe (MariaDB, PostgreSQL), CLI rd, API, intégration Ansible, et différences avec Runbook Automation (édition commerciale).
tags: [rundeck, runbook, automatisation, libre-service, ssh, winrm, ordonnancement]
icon: info
---

**Rundeck** permet de transformer les procédures d'exploitation (« redémarrer le service X sur les serveurs du pool Y », « purger les journaux », « relancer une interface ») en **tâches** cliquables, paramétrées et tracées, que l'on peut confier au support ou au niveau 1 sans leur donner d'accès SSH. Il exécute les commandes par **SSH**, **WinRM** ou via [[01-ansible/01-presentation-installation|Ansible]], planifie et garde un **journal** complet. L'édition commerciale s'appelle désormais *Runbook Automation*.

## Installation

```bash
# Debian/Ubuntu : dépôt Rundeck (packagecloud) puis
sudo apt install openjdk-17-jre-headless rundeck
sudoedit /etc/rundeck/framework.properties     # framework.server.url=https://rundeck.corp.exemple.fr
sudoedit /etc/rundeck/rundeck-config.properties # grails.serverURL, dataSource vers MariaDB/PostgreSQL
sudo systemctl enable --now rundeckd           # http://<hôte>:4440 (admin/admin à changer)
```

RHEL : dépôt RPM ; Docker : `rundeck/rundeck`. Remplacer immédiatement le compte `admin` par défaut (`/etc/rundeck/realm.properties`) et configurer l'authentification **LDAP/AD** (JAAS).

## Concepts

| Notion | Rôle |
| --- | --- |
| **Projet** | Regroupe nœuds, tâches, ACL |
| **Nœuds** | Liste statique (YAML), import depuis Ansible, VMware, cloud |
| **Key Storage** | Clés SSH et mots de passe, jamais visibles des utilisateurs |
| **Tâche** | Étapes (commande, script, tâche imbriquée, module Ansible), **options** (listes, valeurs validées), filtre de nœuds, parallélisme |
| **ACL** | Qui peut voir/lancer quelles tâches sur quels nœuds |

```yaml
# Exemple d'export de tâche (rd jobs load -f tache.yaml)
- name: Redémarrer le service web
  group: exploitation/web
  options:
    - name: serveur
      values: [srv-web-01, srv-web-02]
      enforced: true
      required: true
  nodefilters: { filter: "name: ${option.serveur}" }
  sequence:
    commands:
      - exec: sudo systemctl restart nginx
      - exec: systemctl is-active nginx
```

Interface : [[02-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
