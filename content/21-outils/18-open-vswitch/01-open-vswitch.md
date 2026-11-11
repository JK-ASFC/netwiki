---
title: Open vSwitch
description: Open vSwitch (OVS, Apache 2.0), commutateur virtuel multicouche — rôle dans la virtualisation (KVM/libvirt, Proxmox, OpenStack) et le SDN, architecture (ovs-vswitchd, ovsdb-server, module noyau), installation, ponts et ports (ovs-vsctl), VLAN access et trunk, agrégation (bond) et LACP, tunnels VXLAN et GRE, miroir de ports (SPAN), QoS, OpenFlow (ovs-ofctl), supervision (ovs-dpctl, ovs-appctl) ; comparaison avec le pont Linux et sécurité.
tags: [open vswitch, ovs, commutateur virtuel, vlan, vxlan, openflow, sdn, virtualisation]
icon: network
---

**Open vSwitch** (OVS) est un **commutateur réseau virtuel** de qualité production. Là où le pont Linux standard suffit pour relier quelques machines virtuelles, OVS apporte VLAN, agrégation, tunnels, QoS, miroir de ports et pilotage **OpenFlow/SDN**. Il est au cœur de Proxmox (en option), OpenStack Neutron, OVN et de nombreux hyperviseurs KVM.

## Architecture

| Composant | Rôle |
| --- | --- |
| `ovs-vswitchd` | Démon de commutation (chemin rapide dans le noyau ou DPDK) |
| `ovsdb-server` | Base de configuration (ponts, ports, réglages) |
| Module noyau `openvswitch` | Traitement des paquets |
| `ovs-vsctl` | Configurer ponts et ports (via ovsdb) |
| `ovs-ofctl` | Dialoguer en OpenFlow avec un pont |
| `ovs-dpctl`, `ovs-appctl` | Diagnostiquer le chemin de données |

```bash
sudo apt install openvswitch-switch           # dnf install openvswitch ; service ovs-vswitchd
sudo systemctl enable --now openvswitch-switch
ovs-vsctl show
ovs-vsctl get Open_vSwitch . ovs_version
```

## Ponts et ports

```bash
sudo ovs-vsctl add-br ovsbr0
sudo ovs-vsctl add-port ovsbr0 enp2s0                      # relier une interface physique
sudo ovs-vsctl add-port ovsbr0 vnet0                       # port d'une VM (souvent géré par libvirt)
ovs-vsctl list-br ; ovs-vsctl list-ports ovsbr0
sudo ovs-vsctl del-port ovsbr0 vnet0
```

## VLAN

```bash
# Port d'accès (VLAN 20)
sudo ovs-vsctl add-port ovsbr0 vnet1 tag=20
# Port trunk (plusieurs VLAN vers un autre commutateur)
sudo ovs-vsctl set port enp2s0 trunks=10,20,30
```

## Agrégation (bond) et LACP

```bash
sudo ovs-vsctl add-bond ovsbr0 bond0 enp2s0 enp3s0 \
  lacp=active bond_mode=balance-tcp
ovs-appctl bond/show bond0
ovs-appctl lacp/show bond0
```

## Tunnels superposés (VXLAN, GRE)

```bash
# Relier deux hôtes OVS par un tunnel VXLAN (réseau superposé entre sites ou nœuds)
sudo ovs-vsctl add-port ovsbr0 vxlan0 -- set interface vxlan0 \
  type=vxlan options:remote_ip=203.0.113.8 options:key=100
```

## Miroir de ports, QoS, OpenFlow

```bash
# Miroir (SPAN) : copier le trafic de vnet1 vers un port d'analyse vnet9
sudo ovs-vsctl -- set bridge ovsbr0 mirrors=@m \
  -- --id=@src get port vnet1 -- --id=@dst get port vnet9 \
  -- --id=@m create mirror name=miroir0 select-src-port=@src select-dst-port=@src output-port=@dst

# Limiter le débit d'un port à 10 Mbit/s (QoS)
sudo ovs-vsctl set interface vnet1 ingress_policing_rate=10000 ingress_policing_burst=1000

# OpenFlow : règles de flux
ovs-ofctl show ovsbr0
ovs-ofctl dump-flows ovsbr0
sudo ovs-vsctl set-controller ovsbr0 tcp:192.0.2.70:6653      # confier le pont à un contrôleur SDN
```

## Supervision

```bash
ovs-vsctl show
ovs-ofctl dump-ports ovsbr0                 # compteurs par port
ovs-appctl fdb/show ovsbr0                  # table d'apprentissage MAC
ovs-dpctl show                              # chemin de données du noyau
ovs-vsctl list interface vnet1              # statistiques détaillées d'un port
```

## OVS ou pont Linux ?

| Besoin | Choix |
| --- | --- |
| Quelques VM sur un même hôte, réseau simple | Pont Linux (`bridge`, `ip link`) |
| VLAN trunk, agrégation LACP, QoS fine | Open vSwitch |
| Réseaux superposés multi-hôtes (VXLAN) | Open vSwitch (ou OVN) |
| SDN piloté par contrôleur (OpenFlow) | Open vSwitch |
| OpenStack, grandes plates-formes KVM | Open vSwitch / OVN |

> [!NOTE]
> La configuration OVS vit dans sa base `ovsdb` (`/etc/openvswitch/conf.db`), pas dans les fichiers réseau du système : la sauvegarder (`ovsdb-client backup`) et la restaurer avec le reste de l'hôte. Exposer le port du contrôleur (6653) uniquement sur le réseau d'administration.

Voir aussi : [[19-labos-reseau/01-gns3-containerlab|laboratoires réseau]] et les contrôleurs SDN. Commandes : [[90-aide-memoire|aide-mémoire]].
