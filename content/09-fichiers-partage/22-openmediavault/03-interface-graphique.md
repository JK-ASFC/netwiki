---
title: Interface graphique
description: Interface web d'OpenMediaVault — tableau de bord et widgets, menus Système, Réseau, Stockage (disques, SMART, RAID, systèmes de fichiers, dossiers partagés), Services (SMB, NFS, SSH, Rsync), Utilisateurs, Diagnostics, bandeau d'application des changements, omv-extras et Compose, équivalents en ligne de commande.
tags: [openmediavault, interface web, nas, interface graphique]
icon: app-window
---

Accès : `http://nas-omv.corp.exemple.fr` (puis HTTPS). Menu latéral : **Tableau de bord**, **Système**, **Réseau**, **Stockage**, **Services**, **Utilisateurs**, **Diagnostics**.

<!-- CAPTURE: OpenMediaVault — tableau de bord avec widgets (système, systèmes de fichiers, services) | _assets/omv-tableau-de-bord.png -->

## Appliquer les changements

Après chaque enregistrement, un **bandeau jaune** propose *Appliquer* : rien n'est actif tant qu'il n'est pas validé (OMV régénère alors les fichiers de configuration).

<!-- CAPTURE: OpenMediaVault — bandeau « changements en attente » | _assets/omv-appliquer.png -->

## Stockage

*Disques* (effacement, SMART), *RAID logiciel* (création, état, reconstruction), *Systèmes de fichiers* (créer, monter, quotas), *Dossiers partagés* (permissions par utilisateur/groupe, ACL).

<!-- CAPTURE: OpenMediaVault — Stockage, systèmes de fichiers montés | _assets/omv-systemes-de-fichiers.png -->
<!-- CAPTURE: OpenMediaVault — dossier partagé et ses permissions | _assets/omv-dossier-partage.png -->

## Services

*SMB/CIFS* (paramètres globaux + partages : navigable, invités, corbeille, versions précédentes), *NFS*, *SSH*, *Rsync* (tâches et serveur), *Compose* (omv-extras : fichiers Compose, conteneurs, journaux).

<!-- CAPTURE: OpenMediaVault — Services, partage SMB | _assets/omv-smb.png -->

## Diagnostics

*Tableau de bord des performances* (graphiques CPU, réseau, disques), *Journaux système*, *Processus*, *Services*.

## Correspondance interface ↔ ligne de commande

| Action | Interface | Commande |
| --- | --- | --- |
| Mettre à jour | Système → Gestion des mises à jour | `omv-upgrade` |
| Régénérer SMB | Appliquer | `omv-salt deploy run samba` |
| Réparer l'accès web | — | `omv-firstaid` |
| État du RAID | Stockage → RAID logiciel | `cat /proc/mdstat` |
