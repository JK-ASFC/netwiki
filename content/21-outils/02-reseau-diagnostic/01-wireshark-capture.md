---
title: Wireshark — capture
description: Capturer du trafic avec Wireshark — installation (Windows avec Npcap, Linux et groupe wireshark, macOS), où capturer (port miroir SPAN/RSPAN, TAP, hôte, routeur), filtres de capture BPF, dumpcap et tampon circulaire pour les captures longues, capture distante via SSH et tcpdump, captures sur équipements (Cisco EPC, FortiGate, pktmon sous Windows), cadre légal et données personnelles.
tags: [wireshark, capture, tcpdump, bpf, span, npcap, dumpcap, pktmon]
icon: activity
---

**Wireshark** (GPL) est l'analyseur de protocoles de référence : il capture les trames et les décode (plus de 3 000 protocoles), du câble à l'application. C'est l'outil de vérité quand « le réseau » est mis en cause.

> [!IMPORTANT]
> Une capture contient des **données personnelles** et parfois des secrets (identifiants en clair, cookies). Capturez uniquement sur des systèmes que vous administrez, avec l'accord prévu par la politique de sécurité, filtrez au plus juste, stockez les fichiers de façon protégée et supprimez-les après l'analyse.

## Installation

| Système | Méthode |
| --- | --- |
| Windows | `winget install WiresharkFoundation.Wireshark` + **Npcap** (pilote de capture, option *Support raw 802.11* pour le Wi-Fi en mode moniteur selon la carte) |
| Debian / Ubuntu | `sudo apt install wireshark tshark` puis `sudo usermod -aG wireshark $USER` (capture sans root via `dumpcap`) |
| RHEL | `sudo dnf install wireshark` |
| macOS | Installateur officiel + paquet *ChmodBPF* (droits sur `/dev/bpf*`) |

N'exécutez **pas** l'interface graphique en root : seul `dumpcap` a besoin de privilèges.

## Où capturer ?

| Méthode | Remarques |
| --- | --- |
| Sur l'hôte concerné | Simple, mais ne voit que son trafic ; déchargements des cartes (TSO/LRO) faussent tailles et sommes de contrôle |
| **Port miroir** (SPAN) | Copie du trafic d'un port ou VLAN vers le port de capture ; peut perdre des paquets si saturé |
| RSPAN / ERSPAN | Miroir transporté vers un autre commutateur / encapsulé dans GRE |
| **TAP** réseau | Copie matérielle fidèle (aucune perte, erreurs visibles) |
| Sur l'équipement | Capture embarquée des routeurs, pare-feu, contrôleurs Wi-Fi |

```cisco SPAN Cisco IOS
monitor session 1 source interface Gi1/0/10 both
monitor session 1 destination interface Gi1/0/48
```

## Filtres de capture (BPF)

Les filtres de **capture** (syntaxe BPF, comme tcpdump) limitent ce qui est enregistré ; à ne pas confondre avec les filtres d'**affichage** (voir l'article suivant).

| Filtre | Effet |
| --- | --- |
| `host 10.0.20.11` | Trafic d'un hôte |
| `net 10.0.20.0/24 and not port 22` | Sous-réseau, sans SSH |
| `port 53 or port 67 or port 68` | DNS et DHCP |
| `tcp port 443 and host 10.0.20.11` | HTTPS d'un serveur |
| `udp port 1812 or udp port 1813` | RADIUS |
| `vlan 20 and host 10.0.20.11` | Trames étiquetées |

## Captures longues : dumpcap

```bash
# Tampon circulaire : 20 fichiers de 100 Mo, en continu ; ne garde que les en-têtes (96 octets) pour limiter le volume
dumpcap -i ens192 -f "host 10.0.20.11" -s 96 -b filesize:102400 -b files:20 -w /var/tmp/capture/srv.pcapng
```

Laisser tourner jusqu'à la reproduction d'un incident intermittent, puis arrêter et analyser les fichiers concernés.

## Capture distante

```bash
# Depuis un poste Linux/macOS : capture sur un serveur distant, affichage en direct dans Wireshark
ssh admin@srv-web-01 "sudo tcpdump -i ens192 -U -s 0 -w - 'not port 22'" | wireshark -k -i -
```

Windows : interface **SSHdump** (extcap fourni avec Wireshark) pour capturer via SSH, ou **ciscodump** pour les équipements Cisco.

## Captures sur équipements et Windows

```cisco Cisco IOS XE — Embedded Packet Capture
monitor capture CAP interface Gi1/0/1 both match ipv4 host 10.0.20.11 any buffer size 50
monitor capture CAP start
monitor capture CAP stop
monitor capture CAP export flash:cap.pcap
```

```text FortiGate
diagnose sniffer packet any 'host 10.0.20.11 and port 443' 4 0 l
```

```powershell
# Windows sans Wireshark installé : pktmon (intégré)
pktmon filter add -i 10.0.20.11
pktmon start --capture --pkt-size 0 -f C:\Temp\capture.etl
pktmon stop
pktmon etl2pcap C:\Temp\capture.etl -o C:\Temp\capture.pcapng
```

Suite : [[02-wireshark-analyse|analyse et tshark]].
