---
title: Présentation, installation et exploitation
description: OpenNebula — cloud privé et virtualisation légère (front-end oned, nœuds KVM et LXC, magasins de données, réseaux virtuels, modèles, groupes et VDC), installation rapide miniONE, installation du front-end sur Debian/Ubuntu/RHEL (dépôt officiel), ajout d'hôtes KVM, réseaux par pont et VLAN, images, modèles et instances en ligne de commande, haute disponibilité, sauvegardes et mises à jour.
tags: [opennebula, cloud privé, kvm, oned, minione, sunstone, virtualisation]
icon: info
---

**OpenNebula** (OpenNebula Systems, Apache 2.0) est une plateforme de **cloud privé** plus simple qu'[[19-openstack/01-presentation-installation|OpenStack]] : un **front-end** (démon `oned`, base SQLite ou MariaDB, ordonnanceur, interface **Sunstone**) pilote des **hôtes** KVM, LXC ou Firecracker par SSH, sans agent lourd. Libre-service, quotas, multi-sites (*fédération*) et cloud hybride.

| Notion | Description |
| --- | --- |
| Hôte | Nœud KVM/LXC administré par SSH depuis le front-end |
| Cluster | Groupe d'hôtes, de magasins de données et de réseaux |
| Magasin de données (*datastore*) | `system` (disques en cours d'exécution), `image` (images), `files` ; partagé (NFS, Ceph) ou SSH (copie) |
| Réseau virtuel | Pont Linux, VLAN 802.1Q, VXLAN, Open vSwitch ; plages d'adresses (*address ranges*) |
| Modèle (*template*) | Définition d'une VM : processeurs, mémoire, disques, réseau, contextualisation |
| Groupe, VDC | Équipes et centres de données virtuels (délégation, quotas) |

## Installation rapide (miniONE)

Front-end et nœud KVM sur la même machine (Debian, Ubuntu, RHEL et dérivés), pour une évaluation :

```bash
wget https://github.com/OpenNebula/minione/releases/latest/download/minione
sudo bash minione --frontend          # front-end seul ; sans option : front-end + nœud KVM local
```

À la fin, miniONE affiche l'adresse de **Sunstone** et le mot de passe de `oneadmin`.

## Installation du front-end (production)

Le dépôt officiel porte le numéro de version (`<version>` = `7.0` par exemple, voir `downloads.opennebula.io/repo/`).

```bash
# Debian / Ubuntu
wget -q -O- https://downloads.opennebula.io/repo/repo2.key | sudo gpg --dearmor -o /etc/apt/keyrings/opennebula.gpg
echo "deb [signed-by=/etc/apt/keyrings/opennebula.gpg] https://downloads.opennebula.io/repo/<version>/Ubuntu/24.04 stable opennebula" | \
  sudo tee /etc/apt/sources.list.d/opennebula.list
sudo apt update && sudo apt install opennebula opennebula-fireedge opennebula-gate opennebula-flow
# RHEL / Rocky / Alma 9 : fichier /etc/yum.repos.d/opennebula.repo pointant vers …/repo/<version>/AlmaLinux/9/x86_64, puis :
# sudo dnf install opennebula opennebula-fireedge opennebula-gate opennebula-flow

sudo -u oneadmin cat /var/lib/one/.one/one_auth      # mot de passe initial de oneadmin
sudo systemctl enable --now opennebula opennebula-fireedge opennebula-gate opennebula-flow
```

Production : base **MariaDB/MySQL** (`DB = [ BACKEND = "mysql", … ]` dans `/etc/one/oned.conf`) et haute disponibilité à trois front-ends (consensus Raft intégré, adresse virtuelle flottante).

## Hôtes KVM

```bash
# Sur chaque nœud (même dépôt)
sudo apt install opennebula-node-kvm        # dnf install opennebula-node-kvm
sudo systemctl restart libvirtd
# Sur le front-end : clés SSH de oneadmin distribuées aux nœuds, puis
sudo -u oneadmin ssh-copy-id oneadmin@kvm-01.corp.exemple.fr   # ou copie de /var/lib/one/.ssh
sudo -u oneadmin onehost create kvm-01.corp.exemple.fr --im kvm --vm kvm
sudo -u oneadmin onehost list
```

## Réseaux, images, modèles

```bash
cat > vnet-vlan30.tpl <<'EOF'
NAME   = "VM-VLAN30"
VN_MAD = "802.1Q"
PHYDEV = "eno1"
VLAN_ID = 30
AR = [ TYPE = "IP4", IP = "10.0.30.100", SIZE = "100" ]
NETWORK_ADDRESS = "10.0.30.0"
NETWORK_MASK = "255.255.255.0"
GATEWAY = "10.0.30.1"
DNS = "10.0.10.53"
EOF
onevnet create vnet-vlan30.tpl
# Image depuis le Marketplace public (Debian, Ubuntu, Alma… avec contextualisation)
onemarketapp list | grep -i debian
onemarketapp export "Debian 12" debian12 --datastore default
onetemplate instantiate debian12 --name srv-web-01 --nic VM-VLAN30
onevm list
```

La **contextualisation** (paquet `one-context` dans les images) configure réseau, nom d'hôte, clés SSH et scripts au démarrage, à la manière de cloud-init.

## Exploitation

| Tâche | Commande |
| --- | --- |
| Migration à chaud | `onevm migrate --live srv-web-01 kvm-02` |
| Hôte en maintenance | `onehost disable kvm-01` (plus de nouveaux déploiements) puis migrer les VM |
| Instantané de disque | `onevm disk-snapshot-create srv-web-01 0 avant-maj` |
| Sauvegarde de VM | Magasins de sauvegarde (*backup datastores*, restic ou rsync) : `onevm backup srv-web-01 -d sauvegardes` |
| Sauvegarde du front-end | Base (`onedb backup`), `/etc/one`, `/var/lib/one/.one` |
| Mise à jour | Suivre la procédure de la version ; `onedb upgrade` après mise à jour des paquets |

Journaux : `/var/log/one/oned.log`, `/var/log/one/<id>.log` (par VM), `/var/log/one/sched.log`.

Interface : [[03-interface-graphique|Sunstone]] · commandes : [[90-aide-memoire|aide-mémoire]].
