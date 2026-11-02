---
title: Interface graphique (Horizon)
description: Tableau de bord Horizon d'OpenStack — connexion (domaine, projet), vue d'ensemble et quotas, lancement d'une instance pas à pas, console noVNC, réseaux et topologie, routeurs, IP flottantes, groupes de sécurité, volumes et instantanés, images, administration (projets, utilisateurs, hyperviseurs, gabarits), téléchargement du fichier clouds.yaml, équivalents CLI.
tags: [openstack, horizon, tableau de bord, interface graphique]
icon: app-window
---

**Horizon** est le tableau de bord web d'OpenStack (`https://cloud.corp.exemple.fr` ou l'adresse VIP du déploiement). Il se connecte aux mêmes API que la commande `openstack` : tout ce qui est fait à la souris est faisable en CLI.

## Connexion

Domaine (`Default` ou domaine LDAP), utilisateur, mot de passe — ou bouton **SSO** (OIDC/SAML). Le **sélecteur de projet** en haut à gauche change le contexte.

<!-- CAPTURE: Horizon — page de connexion avec domaine | _assets/horizon-connexion.png -->

## Vue d'ensemble

*Projet → Calcul → Vue d'ensemble* : utilisation et **quotas** (instances, vCPU, RAM, volumes, IP flottantes) sous forme de jauges.

<!-- CAPTURE: Horizon — vue d'ensemble du projet avec les jauges de quotas | _assets/horizon-vue-ensemble.png -->

## Lancer une instance

*Projet → Calcul → Instances → Lancer une instance* :

1. **Détails** : nom, nombre d'instances, zone de disponibilité.
2. **Source** : image (ou volume, instantané), créer un volume persistant ou non.
3. **Gabarit** (*flavor*).
4. **Réseaux** : réseau(x) du projet.
5. **Groupes de sécurité**, **paire de clés**, **Configuration** (script cloud-init).

Puis *Associer une IP flottante* dans le menu de l'instance ; *Console* ouvre noVNC dans le navigateur.

<!-- CAPTURE: Horizon — assistant Lancer une instance, onglet Source | _assets/horizon-lancer-instance.png -->
<!-- CAPTURE: Horizon — console noVNC d'une instance | _assets/horizon-console.png -->

## Réseau

- *Réseau → Topologie du réseau* : schéma interactif des réseaux, routeurs et instances (création directe depuis la vue).
- *Réseaux*, *Routeurs* (passerelle externe, interfaces), *Groupes de sécurité* (règles entrantes/sortantes), *IP flottantes*.

<!-- CAPTURE: Horizon — topologie du réseau d'un projet | _assets/horizon-topologie.png -->

## Volumes et images

*Volumes* : créer, attacher, étendre, instantané, sauvegarde, transfert vers un autre projet. *Images* : téléverser (qcow2), visibilité publique/privée/partagée.

## Administration

Menu **Admin** (rôle `admin`) : *Calcul → Hyperviseurs* (charge des nœuds), *Gabarits*, *Agrégats d'hôtes* ; *Réseau* (réseaux de fournisseur) ; *Identité* (domaines, projets, utilisateurs, groupes, rôles) ; *Système → Informations système* (état des services).

<!-- CAPTURE: Horizon — Admin, liste des hyperviseurs avec leur charge | _assets/horizon-hyperviseurs.png -->

## Accès API depuis Horizon

Menu utilisateur → **Fichier clouds.yaml** (ou *Fichier RC OpenStack*) : à copier dans `~/.config/openstack/clouds.yaml` pour la CLI, Terraform et Ansible ; *Identifiants d'application* pour les scripts (jetons sans mot de passe utilisateur).

## Correspondance Horizon ↔ CLI

| Action | Horizon | Commande |
| --- | --- | --- |
| Lancer une instance | Instances → Lancer | `openstack server create …` |
| IP flottante | Menu instance → Associer | `openstack server add floating ip srv ip` |
| Règle de pare-feu | Groupes de sécurité → Gérer les règles | `openstack security group rule create …` |
| Volume | Volumes → Créer | `openstack volume create --size 50 nom` |
| Quotas | Admin → Identité → Projets → Modifier les quotas | `openstack quota set …` |

Commandes : [[90-aide-memoire|aide-mémoire]].
