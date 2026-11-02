---
title: Interface graphique (Sunstone)
description: Interface web Sunstone d'OpenNebula (servie par FireEdge) — connexion, tableau de bord, instances (création depuis un modèle, console VNC, instantanés, migration), modèles, images et Marketplace, réseaux virtuels, hôtes et clusters, utilisateurs, groupes, quotas et VDC, vue utilisateur en libre-service, équivalents CLI.
tags: [opennebula, sunstone, fireedge, interface graphique]
icon: app-window
---

**Sunstone** est l'interface web d'OpenNebula, servie par le service **FireEdge** (`https://one.corp.exemple.fr:2616` par défaut ; publiez-la derrière un proxy inverse TLS — [[03-nginx/01-presentation|Nginx]] ou [[01-haproxy/01-presentation|HAProxy]]). Connexion avec `oneadmin` ou un compte (LDAP/AD, SAML possibles).

<!-- CAPTURE: Sunstone — tableau de bord (hôtes, VM, utilisation) | _assets/sunstone-tableau-de-bord.png -->

## Instances

*Instances → VM → Créer* : choisir un **modèle**, nom, nombre d'instances, capacité (CPU, mémoire), disques, réseaux, contextualisation (clé SSH, script de démarrage). Une fois créée : **console VNC** dans le navigateur, actions (arrêter, suspendre, redémarrer), *Stockage* (instantanés de disque, redimensionnement), *Réseau* (ajouter une carte), *Planifier* (actions programmées), *Sauvegardes*.

<!-- CAPTURE: Sunstone — création d'une VM depuis un modèle | _assets/sunstone-creer-vm.png -->
<!-- CAPTURE: Sunstone — console VNC d'une VM | _assets/sunstone-console-vnc.png -->

## Modèles, images, Marketplace

*Stockage → Apps* (**Marketplace** public : images prêtes Debian, Ubuntu, Alma, Windows avec contextualisation, applications) → *Importer* ; *Images* (téléverser un qcow2, type OS/CDROM/disque persistant) ; *Modèles* (assistant ou édition avancée).

<!-- CAPTURE: Sunstone — Marketplace et import d'une image Debian | _assets/sunstone-marketplace.png -->

## Infrastructure

*Infrastructure → Hôtes* (ajouter un nœud KVM, désactiver pour maintenance, charge), *Clusters*, *Magasins de données* (capacité), *Réseaux → Réseaux virtuels* (plages d'adresses, VLAN, réservations, groupes de sécurité).

<!-- CAPTURE: Sunstone — liste des hôtes avec leur charge | _assets/sunstone-hotes.png -->

## Utilisateurs et délégation

*Système → Utilisateurs / Groupes* : quotas (CPU, mémoire, VM, images), **vues** (vue *admin* complète, vue *user* simplifiée pour le libre-service), **VDC** pour déléguer une partie de l'infrastructure à une équipe.

## Correspondance Sunstone ↔ CLI

| Action | Sunstone | Commande |
| --- | --- | --- |
| Créer une VM | Instances → Créer | `onetemplate instantiate <modèle> --name srv-01` |
| Console | Bouton VNC | `onevm show srv-01` (port VNC) |
| Migrer | Actions → Migrer (live) | `onevm migrate --live srv-01 kvm-02` |
| Désactiver un hôte | Hôtes → Désactiver | `onehost disable kvm-01` |
| Quotas | Groupes → Quotas | `onegroup quota <groupe>` |

Commandes : [[90-aide-memoire|aide-mémoire]].
