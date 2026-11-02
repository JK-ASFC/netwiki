---
title: Interface graphique (Incus UI et LXD UI)
description: Interface web d'Incus (incus-ui-canonical) et de LXD — activation (core.https_address), connexion par certificat client ou OIDC, tableau de bord, création d'instances (conteneurs et VM), console et terminal dans le navigateur, profils, réseaux, stockage, instantanés, projets et cluster, équivalents en ligne de commande.
tags: [incus ui, lxd ui, incus, lxd, interface graphique, interface web]
icon: app-window
---

Incus et LXD proposent une **interface web** servie par le démon lui-même (port 8443) :

| Projet | Paquet / activation |
| --- | --- |
| Incus | `apt install incus-ui-canonical` (dépôt Zabbly) — interface dérivée de celle de LXD |
| LXD | Incluse dans le snap `lxd` |

## Activation

```bash
incus config set core.https_address :8443          # LXD : lxc config set core.https_address :8443
sudo systemctl restart incus
```

Ouvrir `https://incus-01.corp.exemple.fr:8443`. Au premier accès, l'interface guide la création d'un **certificat client** :

1. Générer le certificat dans l'interface (*Generate*), le télécharger (`.pfx`) et l'importer dans le navigateur.
2. Ajouter le certificat comme client de confiance sur le serveur : `incus config trust add-certificate incus-ui.crt` (ou utiliser un jeton : `incus config trust add navigateur`).
3. Recharger la page : l'interface s'ouvre.

Avec **OIDC** (Keycloak, Authentik) configuré (`oidc.issuer`, `oidc.client.id`), la connexion se fait par le fournisseur d'identité, sans certificat.

<!-- CAPTURE: Incus UI — page de connexion et assistant de certificat client | _assets/incus-ui-connexion.png -->

## Instances

*Instances* : liste des conteneurs et VM (état, adresses IP, type, projet), filtres et actions groupées (démarrer, arrêter, redémarrer).

**Créer une instance** : image (catalogue `images:` avec recherche par distribution), type **conteneur** ou **machine virtuelle**, profils, ressources (CPU, mémoire, disque), réseau, stockage, **cloud-init** (données utilisateur YAML), options de sécurité.

<!-- CAPTURE: Incus UI — liste des instances avec filtres | _assets/incus-ui-instances.png -->
<!-- CAPTURE: Incus UI — formulaire de création d'instance (choix de l'image et type VM) | _assets/incus-ui-creer-instance.png -->

Onglets d'une instance : **Vue d'ensemble** (adresses, ressources consommées), **Configuration** (modifiable en formulaire ou YAML), **Instantanés** (créer, restaurer, planifier), **Terminal** (shell dans le navigateur), **Console** (texte ou graphique VGA pour les VM), **Journaux**.

<!-- CAPTURE: Incus UI — terminal d'un conteneur dans le navigateur | _assets/incus-ui-terminal.png -->
<!-- CAPTURE: Incus UI — console graphique d'une machine virtuelle | _assets/incus-ui-console-vm.png -->

## Profils, réseaux, stockage

- **Profils** : créer et modifier (limites, périphériques), voir les instances qui les utilisent.
- **Réseaux** : ponts gérés, OVN, macvlan ; plages DHCP, NAT, redirections (*forwards*), ACL réseau.
- **Stockage** : pools (taille, utilisation), volumes personnalisés à attacher aux instances, images en cache.

<!-- CAPTURE: Incus UI — page Stockage avec un pool ZFS et ses volumes | _assets/incus-ui-stockage.png -->

## Projets et cluster

Sélecteur de **projet** en haut de la barre latérale ; page *Cluster* : membres, rôles, évacuation et restauration d'un membre ; *Paramètres* : configuration du serveur (`core.*`, `images.*`).

## Correspondance interface ↔ ligne de commande

| Action | Interface | Commande |
| --- | --- | --- |
| Créer un conteneur | Instances → Créer | `incus launch images:debian/13 srv-web-04` |
| Créer une VM | Créer → type VM | `incus launch images:debian/13 vm-01 --vm` |
| Shell | Onglet Terminal | `incus exec srv-web-04 -- bash` |
| Instantané | Onglet Instantanés | `incus snapshot create srv-web-04 avant-maj` |
| Limite mémoire | Configuration → Ressources | `incus config set srv-web-04 limits.memory=4GiB` |
| Évacuer un membre | Cluster → Évacuer | `incus cluster evacuate incus-02` |

Commandes : [[90-aide-memoire|aide-mémoire]].
