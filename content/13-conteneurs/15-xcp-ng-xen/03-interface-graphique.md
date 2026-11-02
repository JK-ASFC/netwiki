---
title: Interface graphique (Xen Orchestra et XO Lite)
description: Administrer XCP-ng à la souris — XO Lite intégré à l'hôte, déploiement de Xen Orchestra (appliance XOA ou version depuis les sources), ajout d'un pool, tableau de bord, création de VM, console, stockage et réseaux, sauvegardes delta et réplication, utilisateurs et droits (LDAP/AD), correctifs et mise à jour progressive du pool, équivalents xe.
tags: [xen orchestra, xo lite, xoa, xcp-ng, interface graphique, sauvegarde]
icon: app-window
---

| Interface | Où | Pour quoi |
| --- | --- | --- |
| **XO Lite** | `https://xcp-01.corp.exemple.fr` (servie par l'hôte) | Un hôte : VM, console, déploiement de XOA |
| **Xen Orchestra** | VM ou conteneur dédié, `https://xo.corp.exemple.fr` | Tout le parc : pools, sauvegardes, droits, correctifs |

## XO Lite

Ouvrir l'adresse de l'hôte dans un navigateur, se connecter en **root**. Tableau de bord de l'hôte (processeur, mémoire, stockage), liste des VM, console, démarrage/arrêt, et bouton **Déployer XOA**.

<!-- CAPTURE: XO Lite — tableau de bord d'un hôte XCP-ng | _assets/xo-lite-tableau-de-bord.png -->

## Installer Xen Orchestra

**Appliance XOA (Vates)** : depuis XO Lite (*Déployer XOA*) ou en SSH sur l'hôte :

```bash
bash -c "$(curl -sS https://xoa.io/deploy)"     # questions : réseau, IP fixe ou DHCP, mot de passe
```

L'enregistrement gratuit donne la version *Free* ; sauvegardes, réplication et assistance avancées dépendent de l'abonnement.

**Depuis les sources** (toutes les fonctions, sans support) sur une VM Debian 12 :

```bash
sudo apt install -y build-essential redis-server libpng-dev git python3-minimal libvhdi-utils lvm2 cifs-utils nfs-common ntfs-3g
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash - && sudo apt install -y nodejs && sudo npm install -g yarn
git clone -b master https://github.com/vatesfr/xen-orchestra && cd xen-orchestra
yarn && yarn build
cd packages/xo-server && sudo mkdir -p /etc/xo-server && sudo cp sample.config.toml /etc/xo-server/config.toml
sudo yarn start     # puis créer un service systemd ; identifiants par défaut admin@admin.net / admin, à changer
```

## Ajouter un pool et naviguer

1. *Paramètres → Serveurs* : adresse du maître du pool, compte root (ou compte de service), **Connecter**.
2. **Accueil** : vues VM, Hôtes, Pools, SR ; filtres (`power_state:running`), étiquettes, actions groupées.
3. **Tableau de bord** : santé (SR presque pleins, hôtes sans correctifs, VM sans outils invités).

<!-- CAPTURE: Xen Orchestra — vue Accueil, liste des VM d'un pool avec filtres | _assets/xen-orchestra-accueil-vm.png -->
<!-- CAPTURE: Xen Orchestra — tableau de bord de santé du parc | _assets/xen-orchestra-tableau-de-bord.png -->

## Créer une VM

*Nouveau → VM* : pool, **modèle** (Debian, Windows Server, Ubuntu…), nom, processeurs et mémoire, **méthode d'installation** (ISO, PXE, ou *cloud-init* avec un modèle cloud : clé SSH, nom d'hôte, réseau), interfaces réseau (VLAN), disques (SR, taille), options avancées (démarrage automatique, UEFI, vTPM, Secure Boot) → **Créer**.

<!-- CAPTURE: Xen Orchestra — formulaire de création de VM avec cloud-init | _assets/xen-orchestra-nouvelle-vm.png -->

Onglets d'une VM : **Console** (clavier, *Ctrl+Alt+Suppr*), Statistiques, Réseau, Disques, **Instantanés**, Journaux, Avancé (HA, priorité de démarrage, affinité, pilotes).

<!-- CAPTURE: Xen Orchestra — onglet Console d'une VM Windows | _assets/xen-orchestra-console.png -->

## Stockage et réseau

- *Nouveau → Stockage* : type (NFS, iSCSI, HBA, SMB/ISO), découverte de la cible, création du SR partagé.
- *Pool → Réseau* : créer un réseau VLAN sur tous les hôtes, agrégats (*bonds*), MTU, réseau de migration par défaut.

<!-- CAPTURE: Xen Orchestra — création d'un SR NFS partagé | _assets/xen-orchestra-nouveau-sr.png -->

## Sauvegardes

*Sauvegarde → Nouveau → Sauvegarde de VM* :

1. Mode : **delta** (incrémental) ou complet ; réplication continue vers un autre SR/pool.
2. **Dépôts distants** (*Paramètres → Dépôts distants*) : NFS, SMB, S3 compatible ([[07-minio/01-presentation-installation|MinIO]]), chiffrement possible.
3. Sélection des VM (par nom, étiquette ou pool), **planification** (cron), rétention.
4. *Sauvegarde → Restaurer* : VM complète ou **fichiers isolés**.

<!-- CAPTURE: Xen Orchestra — assistant de sauvegarde delta avec planification | _assets/xen-orchestra-sauvegarde-delta.png -->
<!-- CAPTURE: Xen Orchestra — restauration de fichiers depuis une sauvegarde | _assets/xen-orchestra-restauration-fichiers.png -->

## Utilisateurs et droits

*Paramètres → Utilisateurs / Groupes* ; *Paramètres → Plugins* : **auth-ldap** (Active Directory), auth-saml, auth-oidc. *ACL* : donner à un groupe le rôle *Opérateur* sur un pool ou des VM précises ; *libre-service* pour déléguer un quota de ressources.

## Correctifs

*Pool → Correctifs* : liste des mises à jour disponibles, **Installer les correctifs du pool**, ou **Rolling pool update** (évacuation et redémarrage hôte par hôte).

<!-- CAPTURE: Xen Orchestra — onglet Correctifs d'un pool et bouton Rolling pool update | _assets/xen-orchestra-correctifs.png -->

## Correspondance avec xe

| Action | Xen Orchestra | Commande |
| --- | --- | --- |
| Démarrer / arrêter une VM | Boutons de la VM | `xe vm-start vm=…` / `xe vm-shutdown vm=…` |
| Instantané | Onglet Instantanés | `xe vm-snapshot vm=… new-name-label=…` |
| Migrer | Bouton Migrer | `xe vm-migrate vm=… host=… live=true` |
| Maintenance d'un hôte | Hôte → Maintenance | `xe host-evacuate uuid=…` |
| Redémarrer la pile d'outils | Hôte → Avancé | `xe-toolstack-restart` |

Commandes détaillées : [[90-aide-memoire|aide-mémoire]].
