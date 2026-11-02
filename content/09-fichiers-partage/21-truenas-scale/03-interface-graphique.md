---
title: Interface graphique
description: Interface web de TrueNAS Community Edition — tableau de bord, assistant de création de pool, jeux de données et permissions (éditeur d'ACL), assistants de partage SMB/NFS/iSCSI, services, protection des données (instantanés, réplication, Cloud Sync, SMART, scrub), réseau, utilisateurs et services d'annuaire, applications, alertes, shell, sauvegarde de la configuration, équivalents midclt.
tags: [truenas, interface web, nas, zfs, interface graphique]
icon: app-window
---

Accès : `https://nas-01.corp.exemple.fr` (compte `truenas_admin`). Remplacez le certificat autosigné (*Credentials → Certificates*, ACME possible) et limitez l'accès au réseau d'administration.

## Tableau de bord

Widgets : système (version, disponibilité), processeur, mémoire (ARC), réseau, état des pools, alertes (cloche en haut à droite).

<!-- CAPTURE: TrueNAS — tableau de bord | _assets/truenas-tableau-de-bord.png -->

## Stockage

*Storage → Create Pool* : nom, chiffrement, **Data** (disposition mirror/RAIDZ, largeur, nombre de vdev), puis vdev *Log*, *Cache*, *Spare*, *Metadata*. La page *Storage* montre l'état (topologie, utilisation, *Scrub*, état des disques) ; *Disks* donne SMART et températures.

<!-- CAPTURE: TrueNAS — assistant de création de pool (étape Data, RAIDZ2) | _assets/truenas-creer-pool.png -->
<!-- CAPTURE: TrueNAS — page Storage, état d'un pool et de ses vdev | _assets/truenas-storage.png -->

## Jeux de données et permissions

*Datasets* : arborescence, **Add Dataset** (préréglage SMB/NFS/générique/applications, compression, quota), **Edit Permissions** (éditeur d'ACL : propriétaire, entrées pour groupes AD/locaux, héritage).

<!-- CAPTURE: TrueNAS — éditeur d'ACL d'un jeu de données SMB | _assets/truenas-acl.png -->

## Partages

*Shares* : **SMB** (chemin, nom, préréglage, *Time Machine*, accès invité désactivé), **NFS** (réseaux et hôtes autorisés, mappage), **iSCSI** (assistant : zvol, portail, initiateurs). Le service correspondant (*System → Services*) doit être démarré et coché *Start Automatically*.

<!-- CAPTURE: TrueNAS — assistant d'ajout de partage SMB | _assets/truenas-partage-smb.png -->

## Protection des données

*Data Protection* : tâches d'**instantanés périodiques**, **réplication** (assistant source/destination, SSH, planification), **Cloud Sync**, **rsync**, **scrub**, **tests SMART** — chacune avec planification et historique.

<!-- CAPTURE: TrueNAS — page Data Protection avec tâches d'instantanés et de réplication | _assets/truenas-data-protection.png -->

## Système

*Network* (interfaces, agrégats, VLAN, passerelle, DNS — modification testée avec retour arrière automatique), *Credentials* (utilisateurs, groupes, **Directory Services** : Active Directory/LDAP, certificats, clés SSH), *System* (mises à jour, **sauvegarde de configuration**, alertes et e-mail, services, **Shell** web), *Apps* (catalogue, installation, journaux des conteneurs).

<!-- CAPTURE: TrueNAS — Directory Services, rejoindre Active Directory | _assets/truenas-active-directory.png -->

## Correspondance interface ↔ ligne de commande

L'interface s'appuie sur l'API **middleware** : utilisez `midclt` (ou l'API REST/WebSocket) plutôt que des commandes ZFS directes, sinon l'interface ignore vos changements.

| Action | Interface | Commande |
| --- | --- | --- |
| État des pools | Storage | `zpool status -x` (lecture) |
| Lister les jeux de données | Datasets | `midclt call pool.dataset.query \| jq '.[].name'` |
| Créer un instantané | Datasets → Create Snapshot | `midclt call zfs.snapshot.create '{"dataset":"tank/partage","name":"manuel"}'` |
| Version | Dashboard | `midclt call system.info \| jq .version` |
