---
title: CORE, ns-3 et Mininet
description: Émulateurs et simulateurs réseau — CORE (Common Open Research Emulator, BSD : émulation temps réel par espaces de noms Linux, interface graphique et API Python, nœuds routeurs et hôtes, liaison au réseau réel, mobilité sans fil), ns-3 (GPL : simulateur à événements discrets pour la recherche, modèles précis Wi-Fi/LTE/5G/TCP, scénarios C++ ou Python, traces et NetAnim) et Mininet (BSD : émulation de réseaux SDN avec Open vSwitch, topologies Python, contrôleur OpenFlow externe) ; émulation contre simulation et choix.
tags: [core, ns-3, mininet, émulation réseau, simulation, sdn, openflow, recherche]
icon: flask-conical
---

Contrairement aux laboratoires à base d'images d'équipements ([[01-gns3-containerlab|GNS3, Containerlab]]), ces outils servent à **émuler ou simuler** le comportement du réseau lui-même : protocoles, SDN, performances, sans-fil. On distingue :

- **Émulation** : de vraies piles réseau Linux s'exécutent en temps réel (CORE, Mininet) — utile pour tester logiciels et configurations.
- **Simulation** : un modèle mathématique calcule le comportement, éventuellement plus vite ou plus lentement que le temps réel (ns-3) — utile pour la recherche et la mesure de performances.

## CORE

**CORE** (Common Open Research Emulator) émule un réseau en temps réel à l'aide des **espaces de noms Linux** : chaque nœud est un environnement réseau isolé exécutant de vrais programmes (FRR, services, outils). Interface graphique pour dessiner la topologie, et **API Python** pour l'automatiser.

```bash
# Paquets .deb fournis par le projet (daemon + interface) ; nécessite des privilèges réseau
sudo systemctl enable --now core-daemon
core-gui                      # dessiner la topologie, puis « démarrer » la session
```

```python
# API Python (extrait) : deux nœuds reliés par un commutateur
from core.emulator.coreemu import CoreEmu
from core.emulator.data import IpPrefixes
from core.nodes.base import CoreNode
from core.nodes.network import SwitchNode

coreemu = CoreEmu()
session = coreemu.create_session()
prefixes = IpPrefixes(ip4_prefix="10.0.0.0/24")
commutateur = session.add_node(SwitchNode)
for _ in range(2):
    n = session.add_node(CoreNode)
    session.add_link(n, commutateur, iface1_data=prefixes.create_iface(n))
session.instantiate()
```

CORE sait relier la session au **réseau réel** (RJ45) et émuler la **mobilité** et les liens **sans fil** (portée, pertes). Il est très utilisé pour tester des protocoles de routage et des réseaux tactiques ou maillés.

## ns-3

**ns-3** est un **simulateur à événements discrets** de référence dans la recherche réseau. Il modélise finement Wi-Fi, LTE, 5G, satellite, TCP, files d'attente, et produit des **traces** analysables ; **NetAnim** rejoue la simulation visuellement.

```bash
# Depuis les sources (le projet fournit l'outil ns3 / CMake)
tar xjf ns-allinone-*.tar.bz2 && cd ns-allinone-*/ns-3*/
./ns3 configure --enable-examples --enable-python
./ns3 build
./ns3 run first                       # exemple fourni
```

Les scénarios s'écrivent en **C++** (ou Python) : création des nœuds, pile Internet, applications (générateurs de trafic), collecte de statistiques. ns-3 **ne fait pas tourner de vrais logiciels** : il modélise leur comportement, ce qui le rend adapté aux études de performances reproductibles, pas au test d'une configuration d'équipement.

## Mininet

**Mininet** émule un réseau **SDN** complet sur une machine : hôtes (espaces de noms), commutateurs **Open vSwitch** et un **contrôleur OpenFlow**. C'est l'outil d'apprentissage et de test du SDN par excellence.

```bash
sudo apt install mininet
sudo mn --topo tree,depth=2,fanout=3 --controller=remote,ip=192.0.2.70 --switch ovs
# dans l'invite mininet :
mininet> nodes
mininet> net
mininet> h1 ping -c3 h9
mininet> iperf h1 h9
mininet> exit
sudo mn -c                            # nettoyage après un arrêt brutal
```

```python
# Topologie Python
from mininet.net import Mininet
from mininet.topo import Topo

class MaTopo(Topo):
    def build(self):
        s1 = self.addSwitch("s1")
        for i in range(1, 4):
            self.addLink(self.addHost(f"h{i}"), s1)

net = Mininet(topo=MaTopo())
net.start(); net.pingAll(); net.stop()
```

Mininet se couple à un contrôleur SDN (Ryu, ONOS, OpenDaylight) pour développer et tester des applications OpenFlow avant de les porter sur du matériel réel ou sur [[18-open-vswitch/01-open-vswitch|Open vSwitch]].

## Choisir

| Besoin | Outil |
| --- | --- |
| Tester de vrais logiciels et protocoles en temps réel | CORE |
| Mesurer des performances, étudier Wi-Fi/5G/TCP (recherche) | ns-3 |
| Développer et tester du SDN/OpenFlow | Mininet |
| Reproduire une architecture d'équipements constructeurs | [[01-gns3-containerlab\|GNS3, Containerlab]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
