---
title: Diagnostic VoIP — aide-mémoire des commandes
description: Commandes de diagnostic VoIP avec exemples — capture (tcpdump avec rotation, pktmon), sngrep (filtres, lecture et export pcap), tshark pour SIP et RTP (méthodes, codes, statistiques d'appels et de flux), sipsak (sonde OPTIONS), SIPp (tests de capacité de vos plateformes), heplify vers HOMER.
tags: [aide-mémoire, voip, sngrep, tshark, tcpdump, sipp, sipsak, homer]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-sngrep-wireshark-sipp|outils de diagnostic]] et [[02-homer-voipmonitor|HOMER et VoIPmonitor]].

## Capturer

```bash
sudo tcpdump -i any -n -s 0 -C 100 -W 10 -w /tmp/voip.pcap 'port 5060 or port 5061 or portrange 10000-20000'
sudo tcpdump -i any -n -s 0 -w /tmp/poste.pcap host 10.0.40.21
```

```powershell
pktmon start --capture --pkt-size 0 -f C:\Temp\voip.etl
pktmon stop
pktmon etl2pcap C:\Temp\voip.etl -o C:\Temp\voip.pcapng
```

## sngrep

```bash
sudo sngrep -d any port 5060
sudo sngrep -c                     # appels uniquement
sudo sngrep -I /tmp/voip.pcap
sudo sngrep -O /tmp/sortie.pcap    # enregistrer pendant l'observation
```

## tshark (SIP et RTP)

```bash
tshark -r voip.pcap -Y 'sip.Method == "INVITE"' -T fields -e frame.time -e sip.from.user -e sip.to.user
tshark -r voip.pcap -Y 'sip.Status-Code >= 400' -T fields -e sip.Status-Code -e sip.Call-ID | sort | uniq -c
tshark -r voip.pcap -q -z sip,stat
tshark -r voip.pcap -q -z voip,calls
tshark -r voip.pcap -q -z rtp,streams                 # pertes, gigue max et moyenne par flux
tshark -r voip.pcap -Y 'sdp.connection_info contains "192.168."' -T fields -e ip.src -e sdp.connection_info
```

## Sondes et tests de capacité (vos plateformes uniquement)

```bash
sipsak -vv -s sip:pbx.exemple.fr                       # le serveur répond-il à OPTIONS ?
sipp -sn uas -p 5070                                   # répondeur de test
sipp -sn uac -s 1002 -r 5 -m 100 -l 30 10.0.30.11:5060  # 5 appels/s, 100 au total
sudo ./heplify -i any -hs 10.0.98.40:9060 -m SIPRTCP    # envoi vers HOMER
```
