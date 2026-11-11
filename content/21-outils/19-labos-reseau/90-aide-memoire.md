---
title: Laboratoires réseau — aide-mémoire
description: Commandes de GNS3 (serveur), Containerlab (deploy, inspect, destroy), Kathará (lstart, connect, lclean), CORE (core-daemon, core-gui), ns-3 (ns3 configure, build, run) et Mininet (mn, nettoyage).
tags: [aide-mémoire, gns3, containerlab, kathara, core, ns-3, mininet]
icon: terminal
---

Explications : [[01-gns3-containerlab|GNS3, Containerlab et Kathará]] · [[02-core-ns3-mininet|CORE, ns-3 et Mininet]].

```bash
# GNS3
sudo systemctl status gns3server        # serveur local ; l'interface se connecte dessus

# Containerlab
bash -c "$(curl -sL https://get.containerlab.dev)"
sudo containerlab deploy -t labo.clab.yml
sudo containerlab inspect -t labo.clab.yml
sudo containerlab destroy -t labo.clab.yml --cleanup

# Kathará
kathara lstart ; kathara linfo ; kathara connect r1 ; kathara lclean

# CORE
sudo systemctl enable --now core-daemon ; core-gui

# ns-3
./ns3 configure --enable-examples ; ./ns3 build ; ./ns3 run <programme>

# Mininet
sudo mn --topo tree,depth=2,fanout=3 --switch ovs --controller=remote,ip=192.0.2.70
sudo mn -c                               # nettoyage après arrêt brutal
```

| Outil | Nature | Vrais logiciels ? |
| --- | --- | --- |
| GNS3, Containerlab, Kathará | Émulation (images / conteneurs) | Oui |
| CORE | Émulation temps réel (espaces de noms) | Oui |
| Mininet | Émulation SDN | Oui (hôtes + OVS) |
| ns-3 | Simulation à événements discrets | Non (modèles) |
