---
title: Interface graphique (portail d'administration)
description: Portails web d'oVirt — page d'accueil du moteur, portail d'administration (tableau de bord, centres de données, clusters, hôtes, stockage, réseaux, VM, modèles, événements), création d'une VM, console (noVNC, SPICE avec virt-viewer), portail VM en libre-service, Cockpit des hôtes, équivalents API.
tags: [ovirt, portail d'administration, interface graphique, virt-viewer, cockpit]
icon: app-window
---

Accès : `https://engine.corp.exemple.fr/ovirt-engine/` → **Portail d'administration** (administrateurs) ou **Portail VM** (utilisateurs). Compte initial : `admin`, profil `internal` (ou domaine LDAP/AD ajouté avec `ovirt-engine-extension-aaa-ldap-setup`). Importez le certificat de l'autorité du moteur (lien sur la page d'accueil) pour éviter les alertes et utiliser SPICE.

<!-- CAPTURE: oVirt — page d'accueil du moteur avec les liens vers les portails | _assets/ovirt-accueil.png -->

## Portail d'administration

Barre latérale : **Tableau de bord**, **Calcul** (machines virtuelles, modèles, pools, hôtes, centres de données, clusters), **Réseau**, **Stockage** (domaines, disques, volumes), **Administration** (utilisateurs, rôles, quotas, fournisseurs), **Événements**.

<!-- CAPTURE: oVirt — tableau de bord (capacité CPU, mémoire, stockage, alertes) | _assets/ovirt-tableau-de-bord.png -->

### Créer une machine virtuelle

*Calcul → Machines virtuelles → Nouveau* : cluster, **modèle** (Blank ou modèle cloud-init), système d'exploitation, type (serveur, bureau, haute performance), nom, **disques** (créer/attacher, domaine de stockage, allocation fine), **interfaces** (profil de réseau logique). Onglets *Système* (mémoire, processeurs), *Initial Run* (cloud-init/Sysprep : nom d'hôte, clés SSH, réseau), *Hôte* (épinglage, migration), *Haute disponibilité*, *Console*.

<!-- CAPTURE: oVirt — fenêtre Nouvelle machine virtuelle, onglet Général | _assets/ovirt-nouvelle-vm.png -->

### Console

Bouton **Console** : SPICE (fichier `console.vv` ouvert par **virt-viewer** — `winget install RedHat.VirtViewer`, `apt install virt-viewer`) ou **noVNC** dans le navigateur (*Options de console*).

<!-- CAPTURE: oVirt — console noVNC d'une VM dans le navigateur | _assets/ovirt-console-novnc.png -->

### Hôtes, stockage, réseau

- *Hôtes* : état, **Maintenance** (évacuation des VM), *Installation → Mettre à niveau*, *Gestion de l'alimentation* (fencing IPMI).
- *Stockage → Domaines* : capacité, ajout NFS/iSCSI/FC, import d'un domaine existant.
- *Hôte → Interfaces réseau → Configurer les réseaux* : glisser-déposer des réseaux logiques sur les interfaces ou agrégats.

<!-- CAPTURE: oVirt — configuration des réseaux d'un hôte par glisser-déposer | _assets/ovirt-reseaux-hote.png -->

## Portail VM

Pour les utilisateurs auxquels l'administrateur donne le rôle *UserRole* sur des VM ou un pool : démarrer, arrêter, ouvrir la console, créer des instantanés, sans accès à l'infrastructure.

## Cockpit sur les hôtes

`https://hote-01.corp.exemple.fr:9090` : état de l'hôte, journaux, terminal, assistant *Hosted Engine*.

## Correspondance interface ↔ API / CLI

| Action | Portail | API REST / outil |
| --- | --- | --- |
| Lister les VM | Calcul → Machines virtuelles | `GET /ovirt-engine/api/vms` |
| Démarrer une VM | Bouton Exécuter | `POST /ovirt-engine/api/vms/<id>/start` |
| Maintenance d'hôte | Hôtes → Gestion → Maintenance | `POST /ovirt-engine/api/hosts/<id>/deactivate` |
| État du moteur auto-hébergé | Tableau de bord | `hosted-engine --vm-status` |

Commandes : [[90-aide-memoire|aide-mémoire]].
