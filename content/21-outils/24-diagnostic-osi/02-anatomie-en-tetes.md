---
title: Anatomie des en-têtes
description: Décorticage champ par champ des en-têtes réseau pour lire une capture et comprendre les attaques — trame Ethernet II, en-tête IPv4, segment TCP, datagramme UDP, requête ARP, message ICMP, charge DNS et DHCP : rôle de chaque champ, champs à surveiller et vecteurs d'attaque associés (spoofing, fragmentation, amplification, tunneling).
tags: [osi, en-têtes, ethernet, ipv4, tcp, udp, arp, icmp, dns, dhcp, capture, sécurité]
icon: layers
---

Pour lire une [[02-reseau-diagnostic/01-wireshark-capture|capture réseau]] et comprendre les attaques, il faut connaître les **en-têtes** que chaque couche ajoute. Les champs marqués 🔎 sont ceux qu'un analyste inspecte en priorité (usurpation, anomalie, exfiltration).

## Trame Ethernet II — L2 (le contenant)

18 octets d'en-tête + charge.

| Champ | Taille | Rôle |
| --- | --- | --- |
| Préambule | 7 o | Alternance 1/0 qui synchronise l'horloge du récepteur |
| SFD | 1 o | `10101011` : signale le début des données utiles |
| 🔎 MAC destination | 6 o | Adresse physique cible ; `FF:FF:FF:FF:FF:FF` = broadcast (ARP, DHCP) |
| 🔎 MAC source | 6 o | Adresse de l'émetteur ; alimente la table CAM du switch, **rien ne l'authentifie** |
| 🔎 EtherType | 2 o | Protocole encapsulé : `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6, `0x8100` tag VLAN |
| Charge utile | 46–1500 o | Le paquet L3 ; min. 46 o (padding), max. 1500 o = MTU standard |
| FCS / CRC | 4 o | Empreinte CRC-32 ; si elle diffère, la trame est jetée en silence (TCP retransmet) |

> [!WARNING]
> **Côté cyber** — MAC spoofing (contourner un filtrage MAC, fausser la table du switch), VLAN hopping par double tag 802.1Q, flood de trames. Parades : **802.1X** (L2), **port security**, surveillance (Zeek).

## En-tête IPv4 — L3 (l'adressage)

20 octets (sans options).

| Champ | Taille | Rôle |
| --- | --- | --- |
| Version + IHL | 1 o | Version (4) + longueur d'en-tête (variable à cause des options) |
| DSCP / ToS | 1 o | Priorité QoS : fait passer voix/visio avant un téléchargement |
| Longueur totale | 2 o | Taille du paquet complet (jusqu'à 65535 o) |
| 🔎 Identification | 2 o | ID du datagramme ; partagé par tous les fragments pour réassemblage |
| 🔎 Flags + Offset | 2 o | `DF` interdit la fragmentation, `MF` annonce d'autres fragments, offset = position |
| 🔎 TTL | 1 o | Décrémenté à chaque routeur ; à 0 → ICMP Time Exceeded (base de `tracert`) |
| 🔎 Protocol | 1 o | Transport encapsulé : `6` TCP, `17` UDP, `1` ICMP |
| Header Checksum | 2 o | Intégrité de l'**en-tête** seulement, recalculé à chaque saut (TTL change) |
| 🔎 IP source | 4 o | Émetteur ; **forgeable** (IP spoofing → attaques par réflexion) |
| 🔎 IP destination | 4 o | Cible lue par chaque routeur pour le prochain saut ; base du filtrage/géo-blocage |

> [!WARNING]
> **Côté cyber** — IP spoofing, OS fingerprinting via le TTL, évasion d'IDS par fragmentation (teardrop). Un IDS/IPS (Suricata, Snort) doit **réassembler les fragments** avant analyse.

## Segment TCP — L4 (transport fiable)

20 octets (sans options).

| Champ | Taille | Rôle |
| --- | --- | --- |
| 🔎 Port source | 2 o | Application émettrice (port éphémère 49152+ en général) |
| 🔎 Port destination | 2 o | Service visé (443 HTTPS, 3389 RDP, 445 SMB…) |
| 🔎 Sequence Number | 4 o | Position du segment dans le flux → remise en ordre |
| 🔎 Acknowledgment | 4 o | Prochain octet attendu = « reçu jusqu'ici » ; cœur de la fiabilité |
| 🔎 Data Offset + Flags | 2 o | Drapeaux `SYN`/`ACK`/`FIN`/`RST`/`PSH`/`URG` ; le *handshake* SYN → SYN-ACK → ACK naît ici |
| Window | 2 o | Contrôle de flux : octets que le récepteur peut encore encaisser |
| Checksum | 2 o | Intégrité en-tête **ET** données |
| Urgent Pointer | 2 o | Données prioritaires (quasi inutilisé, détourné pour l'évasion d'IDS) |
| Options | 0–40 o | `MSS`, `Window Scale`, `SACK`, `Timestamp` négociées au handshake |

> [!WARNING]
> **Côté cyber** — SYN flood (déni de service), scans de ports (SYN furtif, NULL/FIN/**XMAS**), injection de `RST`. Un segment aux flags XMAS (FIN+PSH+URG) = reconnaissance suspecte.

## Datagramme UDP — L4 (transport rapide)

8 octets (en-tête fixe).

| Champ | Taille | Rôle |
| --- | --- | --- |
| 🔎 Port source | 2 o | Port émetteur (optionnel, peut valoir 0) |
| 🔎 Port destination | 2 o | Service visé : 53 DNS, 123 NTP, 161 SNMP, 67/68 DHCP |
| Length | 2 o | Longueur en-tête + données (chaque datagramme est autonome) |
| Checksum | 2 o | Intégrité ; optionnel en IPv4, obligatoire en IPv6 |

> [!WARNING]
> **Côté cyber** — sans handshake, l'IP source se forge trivialement → **attaques par amplification/réflexion** (DNS, NTP monlist, SNMP) et UDP flood. Des réponses DNS/NTP anormalement volumineuses en sortie = signe d'amplification.

## Requête ARP — L2/L3 (résolution MAC)

| Champ | Rôle |
| --- | --- |
| Hardware/Protocol Type, Lengths | Généricité (Ethernet = 1, IPv4 = `0x0800`, MAC 6 o / IP 4 o) |
| 🔎 Operation | `1` = requête (broadcast « qui a cette IP ? »), `2` = réponse (unicast) |
| 🔎 Sender MAC / Sender IP | L'émetteur ; le récepteur met à jour son cache ARP → faille d'empoisonnement |
| Target MAC / 🔎 Target IP | MAC recherchée (vide en requête) ; IP dont on cherche la MAC |

> [!WARNING]
> **Côté cyber** — **ARP spoofing / poisoning** = cœur des attaques MITM sur un LAN (répondre « c'est moi » pour la passerelle). Parades : **Dynamic ARP Inspection (DAI)** sur les switches, journalisation des anomalies.

## Message ICMP — diagnostic & tunneling

| Champ | Rôle |
| --- | --- |
| 🔎 Type | `8`/`0` Echo Request/Reply (ping), `3` Destination Unreachable, `11` Time Exceeded (tracert) |
| Code | Précise le Type (réseau/hôte/port/fragmentation injoignable) |
| Identifier / Sequence | Apparient réponses et requêtes, détecte pertes et désordre |
| 🔎 Data | Charge de test non contrôlée → **ICMP tunneling** (exfiltration) |

> [!WARNING]
> **Côté cyber** — ICMP tunneling, ping flood, attaque Smurf (amplification par broadcast). Un volume anormal de pings à Data volumineux = exfiltration possible : limiter et journaliser l'ICMP en périmètre.

## Charge DNS — résolution de noms (UDP 53)

| Champ | Rôle |
| --- | --- |
| 🔎 Transaction ID | Apparie réponse et requête ; le deviner permet le **cache poisoning** |
| 🔎 Flags | `QR`, `RD`, `RA`, `AA`, `TC` (bascule TCP), `RCODE` (code d'erreur) |
| Compteurs RR | Nombre d'entrées par section (Question/Answer/Authority/Additional) |
| 🔎 Question | Nom + Type (A, AAAA, MX, CNAME, SRV) ; un nom long/aléatoire trahit un **tunnel DNS** |
| Answer | Enregistrements + TTL (durée de cache → explique la lenteur de propagation) |

> [!WARNING]
> **Côté cyber** — DNS spoofing/cache poisoning, **DNS tunneling** (exfiltration / C2 encodés dans les sous-domaines), amplification (requêtes ANY). Un résolveur filtrant + l'inspection des requêtes anormales détectent l'exfiltration.

## Charge DHCP — attribution d'adresse (UDP 67/68)

| Champ | Rôle |
| --- | --- |
| 🔎 Op | `1` BootRequest (client), `2` BootReply (serveur) |
| Htype / Hlen | Type/longueur d'adresse matérielle (Ethernet = 1 / 6) |
| 🔎 Xid | ID de transaction, fil rouge du **DORA** (DISCOVER → OFFER → REQUEST → ACK) |
| 🔎 Ci/Yi/Si/Giaddr | IP Client, **Your** (proposée), Server, Gateway/relais (Giaddr = relais inter-VLAN) |
| 🔎 Chaddr | MAC du client ; forger des MAC ici = **DHCP starvation** |
| 🔎 Options | TLV : `53` type, `1` masque, `3` passerelle, `6` DNS, `51` durée du bail |

> [!WARNING]
> **Côté cyber** — **Rogue DHCP server** (fausse passerelle/DNS → MITM sur le sous-réseau) et DHCP starvation. Le **DHCP Snooping** n'autorise le serveur que sur les ports de confiance ; un OFFER depuis un port non approuvé = alerte.

Suite : diagnostic couche par couche à partir des [[03-couches-1-2-physique-liaison|couches 1 et 2]]. Commandes : [[90-aide-memoire|aide-mémoire]].
