---
title: Open vSwitch — aide-mémoire
description: Commandes ovs-vsctl (ponts, ports, VLAN, bond, tunnels), ovs-ofctl (OpenFlow, flux, ports), ovs-appctl et ovs-dpctl (diagnostic), sauvegarde de la base ovsdb.
tags: [aide-mémoire, open vswitch, ovs, ovs-vsctl, ovs-ofctl, vlan, vxlan]
icon: terminal
---

Explications : [[01-open-vswitch|Open vSwitch]].

```bash
# État
ovs-vsctl show ; ovs-vsctl list-br ; ovs-vsctl list-ports ovsbr0
ovs-vsctl get Open_vSwitch . ovs_version

# Ponts et ports
sudo ovs-vsctl add-br ovsbr0
sudo ovs-vsctl add-port ovsbr0 enp2s0
sudo ovs-vsctl add-port ovsbr0 vnet1 tag=20            # accès VLAN 20
sudo ovs-vsctl set port enp2s0 trunks=10,20,30         # trunk
sudo ovs-vsctl del-port ovsbr0 vnet1 ; sudo ovs-vsctl del-br ovsbr0

# Agrégation
sudo ovs-vsctl add-bond ovsbr0 bond0 enp2s0 enp3s0 lacp=active bond_mode=balance-tcp
ovs-appctl bond/show bond0 ; ovs-appctl lacp/show bond0

# Tunnel VXLAN
sudo ovs-vsctl add-port ovsbr0 vxlan0 -- set interface vxlan0 type=vxlan options:remote_ip=203.0.113.8 options:key=100

# OpenFlow et diagnostic
ovs-ofctl show ovsbr0 ; ovs-ofctl dump-flows ovsbr0 ; ovs-ofctl dump-ports ovsbr0
ovs-appctl fdb/show ovsbr0 ; ovs-dpctl show
ovs-vsctl list interface vnet1

# Sauvegarde / restauration de la configuration
ovsdb-client backup > /sauvegardes/ovs-$(date +%F).db
# restauration : arrêter ovsdb-server, remplacer conf.db, redémarrer
```
