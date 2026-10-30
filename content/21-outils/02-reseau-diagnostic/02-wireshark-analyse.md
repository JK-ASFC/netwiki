---
title: Wireshark — analyse et tshark
description: Analyser une capture avec Wireshark — filtres d'affichage, colonnes et profils, informations d'expert, analyse TCP (retransmissions, fenêtres nulles, RST), suivre un flux, statistiques (conversations, terminaux, hiérarchie des protocoles, graphes d'E/S, temps de réponse), déchiffrement TLS avec SSLKEYLOGFILE, cas d'usage réseau (DHCP, DNS, RADIUS/EAP, OSPF/BGP, VoIP SIP/RTP), tshark et editcap en ligne de commande.
tags: [wireshark, analyse, filtres d'affichage, tcp, tls, tshark, voip, dépannage]
icon: search
---

## Filtres d'affichage

| Filtre | Effet |
| --- | --- |
| `ip.addr == 10.0.20.11` | Paquets vers ou depuis l'adresse |
| `tcp.port == 443 && ip.addr == 10.0.20.11` | HTTPS d'un serveur |
| `dns && dns.flags.rcode != 0` | Réponses DNS en erreur |
| `dhcp` (ou `bootp`) | Échanges DHCP |
| `tcp.analysis.flags` | Anomalies TCP (retransmissions, doublons, fenêtres) |
| `tcp.flags.reset == 1` | Connexions réinitialisées |
| `tcp.time_delta > 1` | Silences de plus d'une seconde dans un flux |
| `http.response.code >= 500` | Erreurs serveur HTTP (en clair) |
| `tls.handshake.type == 1` | *Client Hello* (SNI visible : `tls.handshake.extensions_server_name`) |
| `radius` / `eap` | Authentification RADIUS / 802.1X |
| `icmp.type == 3` | Destination injoignable |
| `frame contains "erreur"` | Recherche de chaîne |

Clic droit sur un champ → *Appliquer comme filtre* ; *Appliquer comme colonne* pour afficher par exemple `tcp.stream`, `dns.qry.name`, `tls.handshake.extensions_server_name`. Enregistrez vos réglages dans des **profils** (un profil « TCP », un profil « VoIP »).

## Lire une capture TCP

| Indicateur (*Expert Information*) | Interprétation |
| --- | --- |
| *Retransmission*, *Fast retransmission* | Pertes sur le chemin (lien, file d'attente saturée) |
| *Duplicate ACK* | Le récepteur signale un trou (perte) |
| *Zero window* | Le récepteur ne suit pas (application lente, serveur saturé) |
| *RST* juste après le SYN | Port fermé ou pare-feu qui rejette |
| SYN sans réponse | Filtrage silencieux, route de retour absente |
| Délai entre requête et réponse | Lenteur applicative (le réseau a fini son travail) |

*Statistiques → Graphes de flux TCP (Stevens, débit, RTT)* ; *Suivre → Flux TCP/TLS/HTTP* pour reconstituer un échange ; `tcp.analysis.ack_rtt` pour la latence réseau.

## Statistiques

| Menu | Usage |
| --- | --- |
| Hiérarchie des protocoles | Composition du trafic |
| **Conversations** / Terminaux | Qui parle avec qui, volumes ; trouver le « bavard » |
| Graphe d'E/S | Débit dans le temps, avec filtres (pics, micro-coupures) |
| Temps de réponse (DNS, HTTP, SMB) | Latence par requête |
| Téléphonie → Appels VoIP / Flux RTP | Gigue, pertes, lecture des appels |

## Déchiffrer TLS

Le trafic TLS moderne (clés éphémères) ne se déchiffre pas avec la clé privée du serveur : il faut les **clés de session**, exportées par le client.

```powershell
# Navigateur (Chrome, Firefox) ou application utilisant OpenSSL/NSS : journal des clés de session
$env:SSLKEYLOGFILE = "C:\Temp\cles-tls.log"
Start-Process "C:\Program Files\Mozilla Firefox\firefox.exe"
```

*Préférences → Protocols → TLS → (Pre)-Master-Secret log filename* : `C:\Temp\cles-tls.log`. Supprimez ce fichier après usage (il permet de déchiffrer les sessions).

## Cas d'usage réseau

| Problème | Ce qu'on cherche |
| --- | --- |
| Poste sans adresse IP | `dhcp` : DISCOVER sans OFFER (relais, serveur), OFFER sans REQUEST, NAK |
| Résolution lente | `dns` : requêtes sans réponse, réponses lentes, recherche de suffixes successifs |
| 802.1X en échec | `eap` côté commutateur/AP, `radius` côté serveur : Access-Reject, échange TLS interrompu (certificat) |
| Adjacence OSPF/BGP | `ospf` (Hello, paramètres, MTU des DBD), `bgp` (OPEN, NOTIFICATION avec code d'erreur) |
| Qualité VoIP | `sip` (signalisation), `rtp` (gigue, perte), DSCP (`ip.dsfield.dscp == 46`) |
| MTU / fragmentation | `icmp.type == 3 && icmp.code == 4` (*fragmentation needed*), paquets DF trop grands |

## tshark et outils associés

```bash
tshark -r capture.pcapng -Y "dns.flags.rcode != 0" -T fields -e frame.time -e ip.src -e dns.qry.name -e dns.flags.rcode
tshark -r capture.pcapng -q -z conv,tcp                  # conversations TCP
tshark -r capture.pcapng -q -z io,stat,1,"tcp.analysis.retransmission"
tshark -i ens192 -f "port 53" -T fields -e dns.qry.name  # en direct
editcap -A "2026-10-29 10:00:00" -B "2026-10-29 10:05:00" grande.pcapng extrait.pcapng
mergecap -w fusion.pcapng client.pcapng serveur.pcapng
capinfos capture.pcapng
```

> [!TIP]
> Pour un problème entre deux machines, capturez **des deux côtés** en même temps : comparer ce qui part et ce qui arrive localise l'élément qui perd ou modifie les paquets (pare-feu, NAT, équilibreur).
