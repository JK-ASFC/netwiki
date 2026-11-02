---
title: ZMap et Masscan — aide-mémoire des commandes
description: Options Masscan (-p, --rate, --excludefile, --banners, --source-port, -oL, -oJ, -oX, --resume, --top-ports, --ping) et ZMap (-p, -B, -r, -b, -w, -o, -M, -f, --dryrun, -N), conversion et exploitation des résultats (jq, grep), et passage à Nmap pour approfondir, avec exemples.
tags: [aide-mémoire, zmap, masscan, scan]
icon: terminal
---

Explications : [[01-presentation-utilisation|ZMap et Masscan]].

```bash
sudo masscan 203.0.113.0/24 --top-ports 100 --rate 500 -oL res.txt ; sudo masscan --resume paused.conf
sudo masscan 10.0.0.0/16 --ping --rate 2000 -oJ ping.json ; sudo masscan 10.0.0.0/16 -p0-65535 --rate 5000 --excludefile ex.txt -oX tout.xml
sudo zmap -p 22 -B 5M -b ex.txt -o ssh.csv 10.0.0.0/8 ; sudo zmap --dryrun -p 80 10.0.0.0/30 ; sudo zmap -M icmp_echoscan -B 5M 10.0.0.0/16 -o vivants.csv
awk '/open/ {print $4}' res.txt | sort -u > hotes.txt ; sudo nmap -sV -p22,443 -iL hotes.txt -oA detail
```
