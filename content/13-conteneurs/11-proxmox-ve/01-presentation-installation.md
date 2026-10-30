---
title: Présentation, installation et premières VM
description: Proxmox Virtual Environment — plateforme libre de virtualisation (KVM/QEMU et conteneurs LXC) basée sur Debian, versions et dépôts (enterprise, no-subscription), installation par ISO ou sur Debian, interface web (8006), premières machines virtuelles (VirtIO, agent invité, cloud-init, modèles) et conteneurs LXC, utilisateurs, domaines d'authentification (PAM, PVE, LDAP, AD, OIDC), 2FA, API et outils en ligne de commande.
tags: [proxmox, proxmox ve, kvm, lxc, virtualisation, cloud-init, installation]
icon: info
---

**Proxmox VE** (Proxmox Server Solutions, AGPL) est une plateforme de virtualisation **libre** construite sur **Debian** : machines virtuelles **KVM/QEMU**, conteneurs système **LXC**, stockage (ZFS, Ceph, LVM, NFS, iSCSI), réseau (ponts Linux, SDN), **cluster** avec haute disponibilité et sauvegarde intégrée, le tout administré par une interface web et une API. C'est l'alternative la plus courante à VMware vSphere, en particulier depuis les changements de licences de VMware en 2024.

| Version | Base |
| --- | --- |
| Proxmox VE 8 | Debian 12 (bookworm) |
| **Proxmox VE 9** | Debian 13 (trixie) |

Le logiciel est gratuit ; l'**abonnement** (par socket de processeur) donne accès au dépôt *enterprise* (paquets plus testés) et au support. Sans abonnement, on utilise le dépôt *no-subscription*.

## Installation

1. Matériel : processeurs avec virtualisation (VT-x/AMD-V, IOMMU pour le passthrough), RAM ECC conseillée (ZFS), disques **en mode HBA** pour ZFS ou Ceph (pas de RAID matériel sous ZFS), au moins deux interfaces réseau (gestion/cluster et VM).
2. Démarrer l'**ISO** Proxmox VE (clé USB écrite en mode image : `dd` ou Etcher, pas Rufus en mode ISO), choisir le disque système (ZFS RAID1 sur deux SSD recommandé), pays, mot de passe root, **nom d'hôte FQDN** et adresse IP **fixe** de gestion.
3. Se connecter à `https://pve-01.corp.exemple.fr:8006` (compte `root`, domaine *Linux PAM*).

Installation possible aussi **sur une Debian** existante (paquet `proxmox-ve`), utile pour des partitionnements particuliers.

### Dépôts

```bash
# Sans abonnement : désactiver le dépôt enterprise, activer no-subscription (Proxmox VE 9 : fichiers .sources au format deb822)
cat /etc/apt/sources.list.d/*.sources
# Dans l'interface : Nœud → Mises à jour → Dépôts → ajouter « No-Subscription », désactiver « Enterprise » (pve et ceph)
apt update && apt full-upgrade
```

Mettez à jour avec `apt full-upgrade` (jamais `apt upgrade` seul, qui peut laisser le système incohérent) ; les montées de version majeure suivent la procédure officielle (`pve8to9` vérifie les prérequis).

## Premières machines virtuelles

| Réglage (assistant *Créer VM*) | Recommandation |
| --- | --- |
| Système | Type d'OS correct, machine **q35**, BIOS **OVMF (UEFI)** + disque EFI ; TPM v2.0 pour Windows 11 |
| Disque | Bus **VirtIO SCSI single**, cache par défaut, *Discard* (SSD/thin), *IO thread* |
| Processeur | Type `host` (performances) ou type générique (`x86-64-v2-AES`) pour la migration entre processeurs différents |
| Réseau | Modèle **VirtIO**, pont `vmbr0`, étiquette VLAN |
| Agent | Cocher *QEMU Guest Agent* puis l'installer dans l'invité (arrêt propre, adresse IP, sauvegardes cohérentes) |

Windows : monter l'ISO **virtio-win** (pilotes VirtIO de stockage et de réseau, agent invité) pendant l'installation.

### Modèles et cloud-init

```bash
# Modèle Debian à partir d'une image cloud (sur le nœud)
wget https://cloud.debian.org/images/cloud/trixie/latest/debian-13-genericcloud-amd64.qcow2
qm create 9000 --name debian13-modele --memory 2048 --cores 2 --net0 virtio,bridge=vmbr0 --scsihw virtio-scsi-single
qm importdisk 9000 debian-13-genericcloud-amd64.qcow2 local-zfs
qm set 9000 --scsi0 local-zfs:vm-9000-disk-0,discard=on --boot order=scsi0 --ide2 local-zfs:cloudinit --serial0 socket --vga serial0 --agent enabled=1
qm template 9000
# Clonage avec paramètres cloud-init
qm clone 9000 120 --name srv-app-01 --full
qm set 120 --ipconfig0 ip=10.0.20.21/24,gw=10.0.20.1 --nameserver 10.0.10.53 --sshkeys ~/.ssh/ansible.pub --ciuser ansible
qm start 120
```

L'automatisation par **Terraform** (fournisseur `bpg/proxmox`) et **Ansible** est décrite dans [[04-terraform/03-fournisseurs-infra-ci|Terraform]].

### Conteneurs LXC

Conteneurs **système** (une distribution complète partageant le noyau de l'hôte) : très légers pour des services Linux. Modèles téléchargeables (*Stockage → Modèles CT*). Préférez les conteneurs **non privilégiés** ; pour Docker, une VM reste plus simple et plus isolée.

```bash
pveam update && pveam available --section system | grep debian
pct create 130 local:vztmpl/debian-13-standard_13.1-1_amd64.tar.zst --hostname srv-dns-02 --unprivileged 1 \
  --net0 name=eth0,bridge=vmbr0,tag=10,ip=10.0.10.54/24,gw=10.0.10.1 --rootfs local-zfs:8 --memory 512
```

## Utilisateurs et authentification

| Domaine (*realm*) | Usage |
| --- | --- |
| Linux PAM | Comptes système du nœud (`root`) |
| Proxmox VE | Comptes propres à Proxmox (synchronisés dans le cluster) |
| **LDAP / Active Directory** | Comptes de l'annuaire, synchronisation des groupes |
| **OpenID Connect** | SSO (Keycloak, Entra ID) |

Droits par **rôles** (`PVEVMAdmin`, `PVEAuditor`…) sur des chemins (`/vms/120`, `/pool/production`, `/storage/...`), **pools** de ressources, **2FA** (TOTP, WebAuthn, clés de récupération). Des **jetons d'API** limités servent à l'automatisation.

```bash
pvesh get /cluster/resources --type vm --output-format json | jq '.[] | {vmid, name, status, node}'
qm list; pct list
```

Suite : [[02-reseau-stockage-cluster|réseau, stockage et cluster]].
