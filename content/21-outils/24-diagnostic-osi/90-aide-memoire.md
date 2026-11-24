---
title: Diagnostic OSI — aide-mémoire des commandes
description: Commandes de diagnostic réseau classées par couche OSI (Windows et Linux) — couche 1 état du lien et Wi-Fi, couche 2 ARP et cache, couche 3 IP/passerelle/route/traceroute, couche 4 test de ports et sessions TCP, couche 5 sessions SMB/RPC, couche 6 horloge NTP et certificats, couche 7 DNS/DHCP/Kerberos ; démarche du symptôme à la couche responsable.
tags: [aide-mémoire, osi, diagnostic, réseau, ping, dns, ports, windows, linux]
icon: terminal
---

Explications : [[01-demarche-et-encapsulation|Démarche et encapsulation]] · [[02-anatomie-en-tetes|Anatomie des en-têtes]] · couches [[03-couches-1-2-physique-liaison|1-2]], [[04-couche-3-reseau|3]], [[05-couche-4-transport|4]], [[06-couches-5-6-session-presentation|5-6]], [[07-couche-7-application|7]].

## Couche 1 — Physique (lien, signal)

```bash
Get-NetAdapter                              # Windows : Status = Up / Disconnected
netsh wlan show interfaces                  # Wi-Fi : champ Signal %
ip link show                                # Linux : state UP / DOWN / NO-CARRIER
iw dev wlan0 link                           # Linux : signal en dBm
ethtool eth0                                # Linux : débit négocié, lien détecté
```

## Couche 2 — Liaison (MAC, ARP, VLAN)

```bash
arp -a                                      # table IP <-> MAC
Get-NetNeighbor                             # PowerShell
netsh interface ip delete arpcache          # vider le cache ARP (Windows)
ip neigh ; ip neigh flush all               # Linux : voisinage ARP / vidage
netsh wlan show interfaces                  # State = authenticating -> 802.1X (couche 2)
```

## Couche 3 — Réseau (IP, routage)

```bash
ipconfig /all                               # Windows : IP, masque, passerelle, DNS
ip addr ; ip route                          # Linux : adresses et table de routage
ping <passerelle> ; ping 8.8.8.8            # local puis au-delà
tracert <hôte>                              # Windows ; traceroute <hôte> sous Linux
pathping <hôte>                             # localise le saut fautif (pertes)
route print                                 # Windows : table de routage complète
```

## Couche 4 — Transport (ports, sessions)

```bash
Test-NetConnection <hôte> -Port 443         # TcpTestSucceeded : True/False
Get-NetTCPConnection -State Established      # sessions TCP (Windows)
ss -tan ; ss -uan                            # Linux : sockets TCP / UDP
netstat -an                                  # ports en écoute et connexions
nc -vz <hôte> 443                            # test de port (netcat)
```

## Couche 5 — Session (SMB, RPC)

```bash
net use                                     # lecteurs réseau mappés (Status)
net use * /delete                           # supprimer toutes les sessions SMB
Test-NetConnection <DC> -Port 135           # endpoint mapper RPC
smbclient -L //serveur -U utilisateur       # Linux : lister les partages SMB
```

## Couche 6 — Présentation (TLS, horloge)

```bash
w32tm /query /status                        # état de l'horloge NTP (Windows)
w32tm /resync                               # forcer la resynchronisation
timedatectl ; chronyc tracking              # Linux : horloge / synchro NTP
certlm.msc                                   # magasin de certificats machine (Windows)
openssl s_client -connect hôte:443 -servername hôte | openssl x509 -noout -dates
```

## Couche 7 — Application (DNS, DHCP, annuaire)

```bash
nslookup <nom>                              # résolution DNS
Resolve-DnsName <nom>                        # PowerShell
dig <nom> ; dig +trace <nom>                 # Linux : résolution détaillée
ipconfig /flushdns ; ipconfig /displaydns    # cache DNS (Windows)
ipconfig /renew ; ipconfig /release          # bail DHCP
w32tm /query /status                         # horloge (dépendance Kerberos)
net accounts                                 # politique de verrouillage AD
nltest /sc_query:<domaine>                   # état du canal sécurisé avec le DC
```

## Du symptôme à la couche

| Observation | Couche visée |
| --- | --- |
| Interface `Disconnected` / `NO-CARRIER` | 1 |
| Adresse `169.254.x.x` (APIPA) | 2 (VLAN/802.1X) puis 7 (DHCP) |
| Passerelle KO, pas d'Internet | 3 |
| Ping OK mais port fermé | 4 |
| Lecteur réseau déconnecté | 5 |
| Certificat expiré / horloge fausse | 6 |
| Accessible par IP mais pas par nom | 7 (DNS) |

Outils : [[02-reseau-diagnostic/01-wireshark-capture|Wireshark]] · [[02-reseau-diagnostic/03-nmap|Nmap]] · [[02-reseau-diagnostic/06-dig-mtr-curl|dig / mtr / curl]] · [[02-reseau-diagnostic/05-iperf3|iperf3]].
