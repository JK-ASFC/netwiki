---
title: GNS3, Containerlab et Kathará
description: Laboratoires réseau virtuels — GNS3 (GPL : interface graphique, serveur local ou distant, images d'équipements réseau en machine virtuelle ou conteneur, liaison avec le réseau réel, usage pédagogique et préproduction), Containerlab (BSD : topologies déclaratives en YAML, NOS conteneurisés comme Nokia SR Linux, Arista cEOS, Juniper cRPD, FRR, démarrage rapide, intégration CI) et Kathará (GPL : laboratoires légers par conteneurs, lab.conf, fichiers de démarrage, successeur de Netkit) ; légalité des images, ressources et choix.
tags: [gns3, containerlab, kathara, laboratoire réseau, simulation, nos, frr, srlinux, ceos]
icon: flask-conical
---

Un **laboratoire réseau virtuel** reproduit routeurs, commutateurs et liens sur une seule machine, pour apprendre, préparer une certification, maquetter une architecture ou **valider une configuration avant de la déployer** en production.

## GNS3

**GNS3** est le plus connu, avec une **interface graphique** où l'on dessine la topologie. Il exécute de vraies images d'équipements (Cisco, Arista, Juniper, MikroTik…) sous forme de machines virtuelles (QEMU/KVM) ou de conteneurs, et peut relier le labo au **réseau réel**.

```bash
# Linux : PPA/paquets du projet ; une « GNS3 VM » (VMware/VirtualBox/KVM) héberge les équipements lourds
sudo add-apt-repository ppa:gns3/ppa && sudo apt update && sudo apt install gns3-gui gns3-server
# Ajouter l'utilisateur aux groupes nécessaires (ubridge, kvm, libvirt), puis se reconnecter
```

| Type d'équipement | Exécution |
| --- | --- |
| Routeurs/commutateurs constructeurs | Images QEMU ou conteneurs, à fournir soi-même |
| Hôtes de test | Conteneurs Docker (interface web, serveurs) |
| Routage libre | FRR, VyOS, OpenWrt |
| Lien avec le réel | Nuage (cloud) relié à une interface physique ou un VLAN |

> [!WARNING]
> Les images des systèmes d'exploitation réseau des constructeurs (IOS, IOS-XE, NX-OS…) sont **soumises à licence** : les utiliser suppose de les posséder légalement. GNS3 ne les fournit pas. Des alternatives libres (FRR, VyOS, Nokia SR Linux, Arista cEOS sous conditions) permettent de travailler sans ces images.

## Containerlab

**Containerlab** décrit un labo en **YAML** et lance des systèmes d'exploitation réseau **conteneurisés** en quelques secondes. Il vise les réseaux modernes (data center, automatisation) et s'intègre très bien à la **CI** pour tester des configurations.

```bash
bash -c "$(curl -sL https://get.containerlab.dev)"      # script d'installation officiel ; nécessite Docker
```

```yaml dc.clab.yml
name: dc-test
topology:
  nodes:
    spine1: { kind: nokia_srlinux, image: ghcr.io/nokia/srlinux }
    leaf1:  { kind: nokia_srlinux, image: ghcr.io/nokia/srlinux }
    leaf2:  { kind: linux, image: alpine:latest }       # hôte de test
  links:
    - endpoints: [ "spine1:e1-1", "leaf1:e1-1" ]
    - endpoints: [ "spine1:e1-2", "leaf2:eth1" ]
```

```bash
sudo containerlab deploy -t dc.clab.yml
sudo containerlab inspect -t dc.clab.yml
ssh admin@clab-dc-test-leaf1            # se connecter à un nœud
sudo containerlab destroy -t dc.clab.yml --cleanup
```

Systèmes pris en charge : **Nokia SR Linux** et **FRR** (images libres), Arista cEOS, Juniper cRPD, Cumulus, SONiC… (selon la licence et la disponibilité des images). Idéal pour rejouer une topologie de façon reproductible.

## Kathará

**Kathará** (université Roma Tre, successeur de Netkit) privilégie la **légèreté** : chaque équipement est un conteneur minimal, décrit par un fichier `lab.conf` et des scripts de démarrage. Très utilisé en enseignement (BGP, routage, services).

```bash
# Installation par paquet (.deb) ou pip ; nécessite Docker
pip install kathara
```

```text lab.conf
r1[0]="A"
r2[0]="A"
r1[image]="kathara/frr"
r2[image]="kathara/frr"
```

```bash
# r1.startup : commandes exécutées au démarrage du nœud r1
# ip address add 10.0.0.1/24 dev eth0
kathara lstart          # démarre le labo du dossier courant
kathara linfo ; kathara connect r1
kathara lclean          # arrête et nettoie
```

## Choisir

| Besoin | Outil |
| --- | --- |
| Apprentissage visuel, certifications, images constructeurs | GNS3 (ou EVE-NG) |
| Topologies reproductibles, data center, CI | Containerlab |
| Labos pédagogiques légers, routage, services | Kathará |
| Protocoles bas niveau, émulation fine, SDN | [[02-core-ns3-mininet\|CORE, ns-3, Mininet]] |

Pour relier un labo au réseau de l'entreprise, l'**isoler** (VLAN ou hôte dédié) : des équipements virtuels mal configurés peuvent perturber le réseau réel (DHCP pirate, boucles, annonces de routes).

Voir aussi : [[02-core-ns3-mininet|CORE, ns-3 et Mininet]] · [[18-open-vswitch/01-open-vswitch|Open vSwitch]]. Commandes : [[90-aide-memoire|aide-mémoire]].
