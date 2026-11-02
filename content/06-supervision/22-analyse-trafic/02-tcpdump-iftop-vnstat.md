---
title: tcpdump, iftop et vnStat
description: Outils de trafic en ligne de commande — tcpdump (capture et filtres BPF par hôte, réseau, port, protocole, drapeaux TCP, VLAN ; écriture pcap tournante pour Wireshark ; lecture ; options -nn, -i, -c, -s, -w, -r, -G, -C, -W, -v, -A, -X ; capture sur Windows avec pktmon et WinDump), iftop (bande passante par connexion en direct, filtres, ports, tri) et vnStat (statistiques historiques de trafic par interface : horaires, quotidiennes, mensuelles, images vnstati, interface web) ; installation Linux, BSD, macOS et usages de dépannage.
tags: [tcpdump, iftop, vnstat, capture, bpf, bande passante, pcap]
icon: info
---

## tcpdump

Outil de capture de référence, présent sur presque tous les systèmes Unix ; les fichiers `.pcap` s'analysent ensuite dans [[02-reseau-diagnostic/02-wireshark-analyse|Wireshark ou tshark]].

```bash
sudo apt install tcpdump         # RHEL : dnf install tcpdump ; macOS et BSD : préinstallé
sudo tcpdump -D                                              # interfaces disponibles
sudo tcpdump -nn -i ens192 host 10.0.20.15 and port 443      # -nn : pas de résolution de noms ni de ports
sudo tcpdump -nn -i any 'udp port 53 or udp port 67'        # DNS et DHCP
sudo tcpdump -nn -i ens192 'tcp[tcpflags] & (tcp-syn|tcp-rst) != 0'   # tentatives de connexion et réinitialisations
sudo tcpdump -nn -i ens192 -e vlan 30                        # trafic étiqueté VLAN 30 (adresses MAC affichées)
sudo tcpdump -nn -i ens192 -s 0 -w /tmp/capture-%H%M.pcap -G 300 -W 12 'not port 22'   # 12 fichiers de 5 min, sans SSH
sudo tcpdump -nn -r /tmp/capture.pcap 'icmp' | head
sudo tcpdump -nn -A -i lo port 8080                          # contenu ASCII (HTTP en clair)
```

Sur **Windows** : `pktmon start --capture --pkt-size 0 -f C:\Temp\cap.etl` puis `pktmon etl2pcap C:\Temp\cap.etl` (ou Wireshark/Npcap). Sur un serveur distant : `ssh srv 'sudo tcpdump -U -nn -w - not port 22' | wireshark -k -i -`.

## iftop

```bash
sudo apt install iftop
sudo iftop -i ens192 -nNP                      # sans résolution, avec les ports
sudo iftop -i ens192 -f 'not port 22' -F 10.0.20.0/24
```

Touches : `t` (affichage), `s`/`d` (masquer source/destination), `p` (ports), `1`/`2`/`3` (tri sur 2 s, 10 s, 40 s), `q`.

## vnStat

```bash
sudo apt install vnstat && sudo systemctl enable --now vnstat      # collecte continue, très légère
vnstat ; vnstat -i ens192 -d ; vnstat -m ; vnstat -h ; vnstat -l -i ens192     # jours, mois, heures, temps réel
vnstati -s -i ens192 -o /var/www/html/vnstat.png                    # image de synthèse (paquet vnstati)
```

Suite : [[90-aide-memoire|aide-mémoire]].
