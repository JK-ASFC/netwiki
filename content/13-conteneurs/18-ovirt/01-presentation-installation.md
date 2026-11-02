---
title: Présentation, installation et exploitation
description: oVirt — gestion centralisée de la virtualisation KVM (moteur ovirt-engine, hôtes VDSM, centres de données et clusters), état du projet et dérivés (Oracle Linux Virtualization Manager), installation du moteur sur EL9 (dépôt oVirt 4.5, engine-setup), moteur auto-hébergé (hosted-engine), ajout d'hôtes, domaines de stockage NFS/iSCSI/FC, réseaux logiques et VLAN, migration, haute disponibilité, sauvegarde (engine-backup) et automatisation (API REST, Ansible).
tags: [ovirt, kvm, virtualisation, vdsm, olvm, engine-setup, hosted-engine]
icon: info
---

**oVirt** (Apache 2.0) est une plateforme de gestion de la virtualisation **KVM** à l'échelle d'un centre de données : un **moteur** (*ovirt-engine*, Java + PostgreSQL) pilote des **hôtes** KVM via l'agent **VDSM**, avec stockage partagé, réseaux logiques, migration à chaud, haute disponibilité et répartition de charge. C'est l'amont libre de l'ex-Red Hat Virtualization et la base d'**Oracle Linux Virtualization Manager (OLVM)**.

> [!NOTE]
> Red Hat a arrêté RHV ; oVirt est maintenu par la communauté (Oracle, contributeurs) en version **4.5**, sur **EL9** (CentOS Stream 9, AlmaLinux 9, Rocky Linux 9). Pour un nouveau projet, comparez avec [[11-proxmox-ve/01-presentation-installation|Proxmox VE]], [[15-xcp-ng-xen/01-presentation-installation|XCP-ng]] ou [[19-openstack/01-presentation-installation|OpenStack]].

| Notion | Description |
| --- | --- |
| Centre de données (*Data Center*) | Ensemble logique : clusters, stockage et réseaux partagés |
| Cluster | Hôtes de même famille de processeurs entre lesquels les VM migrent |
| Hôte | Serveur KVM avec VDSM (oVirt Node ou EL9 + `ovirt-host`) |
| Domaine de stockage | NFS, iSCSI, Fibre Channel, POSIX, Gluster (déprécié) ; un domaine **maître** par centre de données |
| Réseau logique | `ovirtmgmt` (gestion), VM (VLAN), migration, stockage, affichage |

## Installation du moteur (machine dédiée EL9)

```bash
sudo dnf install -y https://resources.ovirt.org/pub/yum-repo/ovirt-release45.rpm   # ou : dnf install centos-release-ovirt45 (CentOS Stream)
sudo dnf install -y ovirt-engine
sudo engine-setup          # questions : FQDN (engine.corp.exemple.fr), PostgreSQL local, mot de passe admin@ovirt, pare-feu
```

Le moteur exige un **FQDN résolu** dans les deux sens (DNS) et une horloge synchronisée ([[01-chrony/01-presentation-client|Chrony]]).

### Moteur auto-hébergé (*hosted engine*)

Le moteur tourne dans une VM hébergée par les hôtes qu'il gère (haute disponibilité, pas de serveur dédié) :

```bash
# Sur le premier hôte (oVirt Node ou EL9 avec ovirt-hosted-engine-setup), stockage partagé prêt
sudo hosted-engine --deploy
# Ou par l'assistant Cockpit de l'hôte : https://hote:9090 → Virtualisation → Hosted Engine
sudo hosted-engine --vm-status
```

## Hôtes

**oVirt Node** (ISO minimale prête) ou EL9 avec le dépôt oVirt :

```bash
sudo dnf install -y https://resources.ovirt.org/pub/yum-repo/ovirt-release45.rpm
sudo dnf install -y ovirt-host
```

Puis, dans le portail d'administration : *Calcul → Hôtes → Nouveau* (nom, adresse, mot de passe root ou clé SSH du moteur) — le moteur installe et configure VDSM.

## Stockage et réseau

- *Stockage → Domaines → Nouveau domaine* : fonction **Données**, type NFS (`nas-01:/export/ovirt`, propriétaire `36:36` = `vdsm:kvm`) ou iSCSI (découverte, connexion, choix des LUN).
- *Réseau → Réseaux → Nouveau* : réseau logique avec **VLAN** et rôle (VM, migration, affichage), puis *Hôte → Interfaces réseau → Configurer les réseaux* pour l'associer à une interface ou un agrégat.

```bash
# Export NFS préparé pour oVirt (sur le NAS Linux)
sudo mkdir -p /export/ovirt && sudo chown 36:36 /export/ovirt && sudo chmod 0755 /export/ovirt
echo "/export/ovirt 10.0.50.0/24(rw,sync,no_subtree_check,all_squash,anonuid=36,anongid=36)" | sudo tee -a /etc/exports && sudo exportfs -ra
```

## Exploitation

| Tâche | Où / commande |
| --- | --- |
| Migration à chaud | VM → *Migrer* (automatique en maintenance d'hôte) |
| Haute disponibilité | VM → *Haute disponibilité* (redémarrage sur un autre hôte ; *fencing* par IPMI/iDRAC conseillé) |
| Répartition de charge | Cluster → *Politique d'ordonnancement* (evenly_distributed, power_saving) |
| Modèles, pools de VM | *Calcul → Modèles* ; pools pour postes virtuels |
| Sauvegarde du moteur | `engine-backup --mode=backup --file=engine-$(date +%F).tar.gz --log=engine-backup.log` |
| Restauration du moteur | `engine-backup --mode=restore --file=… --provision-all-databases` puis `engine-setup` |
| Mise à jour | `engine-upgrade-check` puis `dnf update ovirt\*setup\* && engine-setup` ; hôtes : *Installation → Mettre à niveau* |
| Sauvegarde des VM | API de sauvegarde incrémentale (outils compatibles) ou export OVA |

## Automatisation

- **API REST** : `https://engine.corp.exemple.fr/ovirt-engine/api` (authentification `admin@ovirt@internalsso`).
- **Ansible** : collection `ovirt.ovirt` (création de VM, réseaux, stockage, *hosted engine*).
- **SDK Python** : `pip install ovirt-engine-sdk-python`.

```bash
curl -s -k -u 'admin@ovirt@internalsso:MotDePasse' -H 'Accept: application/json' \
  https://engine.corp.exemple.fr/ovirt-engine/api/vms | python3 -m json.tool | head
```

Interface : [[03-interface-graphique|portail d'administration et portail VM]] · commandes : [[90-aide-memoire|aide-mémoire]].
