---
title: traceroute, fping, arp-scan et arping — aide-mémoire
description: Commandes traceroute (UDP, ICMP, TCP 443, MPLS, AS), tracepath, tracert et pathping, fping (balayage de sous-réseau, hôtes muets, statistiques, boucle), arp-scan (réseau local, interface, VLAN, sortie brute, doublons) et arping (présence, détection d'adresse en double, ARP gratuit), cache ARP Linux et Windows.
tags: [aide-mémoire, traceroute, tracert, fping, arp-scan, arping, arp]
icon: terminal
---

Explications : [[01-traceroute-fping-arp-scan-arping|traceroute, fping, arp-scan et arping]].

## Installation

```bash
sudo apt install traceroute fping arp-scan iputils-arping              # Debian / Ubuntu
sudo dnf install epel-release && sudo dnf install traceroute fping arp-scan   # RHEL / Rocky
brew install fping arp-scan arping                                     # macOS
```

## traceroute

```bash
traceroute -n -q 1 10.30.0.10                      # UDP, sans DNS, 1 sonde par saut
sudo traceroute -I -n 10.30.0.10                   # ICMP
sudo traceroute -T -p 443 -n intranet.corp.exemple.fr   # TCP SYN vers 443
traceroute -e -n 198.51.100.20                     # étiquettes MPLS
traceroute -A -n 9.9.9.9                           # numéros d'AS
traceroute -m 15 -w 2 -n 10.30.0.10                # 15 sauts max, 2 s d'attente
tracepath -n srv-backup.corp.exemple.fr            # sans root, avec MTU
```

```powershell
tracert -d 10.30.0.10
pathping -n 10.30.0.10
Test-NetConnection 10.30.0.10 -TraceRoute
```

## fping

```bash
fping -a -q -g 10.0.20.0/24                        # hôtes vivants
fping -u -f /srv/inventaire/serveurs.txt           # hôtes muets d'une liste
fping -c 20 -q srv-web-01 srv-web-02 srv-db-01     # perte et latence
fping -l -D -p 1000 10.30.0.1                      # boucle horodatée, 1/s
fping -r 3 -t 500 -a -g 10.0.20.0/24               # réseau lent
fping -6 -a -g 2001:db8:20::/120                   # IPv6 (petite plage)
```

## arp-scan

```bash
sudo arp-scan --localnet
sudo arp-scan -I ens192 10.0.20.0/24
sudo arp-scan -I ens192 --retry=3 --timeout=500 10.0.20.0/24
sudo arp-scan -I ens192 --vlan=30 10.0.30.0/24
sudo arp-scan -I ens192 --plain 10.0.20.0/24 | sort -t . -k 4 -n
sudo arp-scan --localnet | grep DUP                # adresses IP en double
sudo setcap cap_net_raw+ep "$(command -v arp-scan)"   # sans sudo ensuite
```

## arping

```bash
sudo arping -I ens192 -c 3 10.0.20.15              # présence (iputils)
sudo arping -D -I ens192 -c 2 10.0.20.50 && echo libre   # adresse en double ?
sudo arping -U -I ens192 -c 3 10.0.20.100          # ARP gratuit après bascule
sudo arping -i en0 -c 3 10.0.20.15                 # variante Habets (macOS, BSD)
```

## Cache ARP

```bash
ip neigh show dev ens192
sudo ip neigh flush dev ens192
```

```powershell
Get-NetNeighbor -InterfaceAlias "Ethernet" -AddressFamily IPv4
arp -a
Remove-NetNeighbor -InterfaceAlias "Ethernet" -IPAddress 10.0.20.15 -Confirm:$false
```

## Retrouver un équipement par son adresse MAC

```text
show mac address-table address b827.eb44.5566          ! Cisco IOS
show mac-address-table address b8:27:eb:44:55:66       ! Aruba AOS-CX
display mac-address b827-eb44-5566                     # HPE Comware / Huawei
```
