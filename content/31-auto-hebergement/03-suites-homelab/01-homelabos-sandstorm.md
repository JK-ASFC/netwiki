---
title: HomelabOS, Ansible-NAS, Sandstorm et FreedomBox
description: Suites d'auto-hébergement tout-en-un — HomelabOS (déploiement de dizaines de services par Ansible, VPN par défaut, état du projet), Ansible-NAS (rôles Ansible pour transformer un serveur en NAS et plate-forme de services), Sandstorm (applications web isolées en « grains », permissions par document, état du projet) et FreedomBox (distribution Debian serveur personnel : services de souveraineté, interface Plinth) ; public visé, maintenance et choix face aux solutions par conteneur.
tags: [homelabos, ansible-nas, sandstorm, freedombox, auto-hébergement, ansible, souveraineté, homelab]
icon: server-cog
---

Ces projets déploient **plusieurs services d'un coup** sur un serveur personnel ou familial, avec une approche « clé en main ». Ils diffèrent des PaaS ([[02-paas/01-coolify-dokku-caprover|Coolify, Dokku]]) : ici on installe un **catalogue de services prêts** plutôt qu'on ne déploie ses propres applications.

## HomelabOS

**HomelabOS** déploie des **dizaines de services** auto-hébergés (Nextcloud, médias, supervision, VPN…) à partir de fichiers de configuration, via **Ansible**, avec un VPN activé par défaut pour l'accès distant.

```bash
git clone https://gitlab.com/NickBusey/HomelabOS.git && cd HomelabOS
make config          # éditer settings.yml (domaine, services voulus, mots de passe)
make install         # déploiement Ansible
```

> [!NOTE]
> HomelabOS a connu une période de **faible activité** ; vérifier l'état du projet et la fraîcheur des rôles avant de s'en servir en production. Pour un déploiement maîtrisé, beaucoup préfèrent aujourd'hui composer eux-mêmes leurs services avec Docker Compose et un gestionnaire ([[01-plateformes-auto-hebergement/01-presentation-comparatif|voir le panorama]]).

## Ansible-NAS

**Ansible-NAS** est un ensemble de **rôles Ansible** qui transforment un serveur Ubuntu en **NAS** et plate-forme de services (partage de fichiers, médias, domotique, supervision…). On active les services voulus dans l'inventaire et on applique le playbook.

```bash
git clone https://github.com/davestephens/ansible-nas && cd ansible-nas
cp group_vars/all.yml.dist group_vars/all.yml      # configurer les services à activer
ansible-playbook -i inventory nas.yml
```

Approche **reproductible et versionnable** (toute la configuration est en YAML), appréciée de ceux qui connaissent Ansible.

## Sandstorm

**Sandstorm** a une approche originale : chaque application tourne dans un **« grain »** isolé (une instance par document/projet), avec des **permissions fines** par grain et un partage façon Google Drive. La sécurité par isolement est son point fort.

```bash
curl https://install.sandstorm.io | bash       # installation guidée
# Applications depuis l'App Market ; accès par comptes et invitations
```

> [!NOTE]
> Sandstorm est **peu maintenu** et son catalogue d'applications a vieilli. Son modèle d'isolement reste intéressant à connaître, mais ce n'est pas un choix recommandé pour de nouveaux déploiements.

## FreedomBox

**FreedomBox** (projet Debian) est un **serveur personnel** orienté **souveraineté numérique** : une distribution Debian avec une interface web (**Plinth**) qui active en quelques clics des services respectueux de la vie privée — VPN (WireGuard), partage de fichiers, messagerie (Matrix/XMPP), DNS, Tor, calendrier, etc. Conçu pour tourner sur une carte type Raspberry Pi à la maison.

```bash
# Image FreedomBox pour carte ARM/PC, ou sur un Debian existant :
sudo apt install freedombox
# Interface Plinth : https://IP/ (créer l'administrateur au premier accès)
```

Public visé : particuliers et associations voulant reprendre le contrôle de leurs services, sans compétences d'administration poussées.

## Choisir

| Besoin | Outil |
| --- | --- |
| Serveur personnel « vie privée » clé en main | FreedomBox |
| Déploiement reproductible par Ansible (NAS + services) | Ansible-NAS |
| Catalogue de services homelab via Ansible | HomelabOS (vérifier l'activité) |
| Isolement fort par application | Sandstorm (peu maintenu) |
| Contrôle fin, services au cas par cas | Docker Compose + [[07-dashboards/01-homepage-homarr-dashy\|tableau de bord]] et [[06-gestion-docker/01-dockge-yacht-komodo\|gestion de conteneurs]] |

Pour un comparatif des socles (YunoHost, CasaOS…), voir [[01-plateformes-auto-hebergement/01-presentation-comparatif|le panorama de l'auto-hébergement]].

Commandes : [[90-aide-memoire|aide-mémoire]].
