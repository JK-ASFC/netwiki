---
title: Analyse de trafic — aide-mémoire des commandes
description: Commandes ntopng (service, configuration, journaux, redis), nProbe (collecteur NetFlow), tcpdump (filtres BPF courants, rotation, lecture), iftop (options et touches), vnStat (-d, -m, -h, -l, --add, --json, vnstati) et pktmon sous Windows, avec exemples.
tags: [aide-mémoire, ntopng, tcpdump, iftop, vnstat, pktmon]
icon: terminal
---

Explications : [[01-ntopng|ntopng]] · [[02-tcpdump-iftop-vnstat|tcpdump, iftop et vnStat]].

```bash
sudo systemctl status ntopng ; sudo journalctl -u ntopng -f ; ntopng --version
nprobe -i none -n none --collector-port 2055 --zmq tcp://127.0.0.1:5556     # recevoir du NetFlow et l'envoyer à ntopng (-i tcp://127.0.0.1:5556)
sudo tcpdump -nn -i any host 10.0.20.15 ; sudo tcpdump -nn net 10.0.30.0/24 and not port 22 ; sudo tcpdump -nn 'tcp port 443 and (tcp[tcpflags] & tcp-syn != 0)'
sudo tcpdump -nn -c 100 -w court.pcap ; sudo tcpdump -nn -C 100 -W 5 -w tourn.pcap ; tcpdump -nn -r court.pcap -v | head
sudo iftop -i ens192 -nNP ; sudo iftop -B -i ens192
vnstat --iflist ; vnstat -i ens192 -d ; vnstat -m ; vnstat -h ; vnstat -l ; vnstat --json m | jq '.interfaces[0].traffic.month[-1]'
pktmon filter add -i 10.0.20.15 ; pktmon start --capture ; pktmon stop ; pktmon etl2pcap PktMon.etl
```
