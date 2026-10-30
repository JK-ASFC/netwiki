---
title: iPerf3
description: Mesurer le débit réseau avec iPerf3 — principe client/serveur, installation (Linux, Windows, macOS, équipements), tests TCP (flux parallèles, sens inverse, bidirectionnel, durée, fenêtre), tests UDP (débit cible, gigue, pertes), sortie JSON, iPerf2 pour le multiflux et la multidiffusion, méthodologie (point de mesure, CPU, MTU, chiffrement VPN), interprétation et pièges.
tags: [iperf3, débit, bande passante, tcp, udp, gigue, performance réseau]
icon: gauge
---

**iPerf3** mesure le **débit** atteignable entre deux points en générant du trafic TCP ou UDP synthétique. Il répond aux questions : « le lien de 10 Gbit/s fournit-il vraiment 10 Gbit/s ? », « le VPN limite-t-il le débit ? », « y a-t-il des pertes UDP sur ce lien radio ? ».

## Installation

```bash
sudo apt install iperf3          # Debian / Ubuntu (dnf install iperf3 sur RHEL)
brew install iperf3              # macOS
```

```powershell
winget install ar51an.iPerf3     # Windows (ou archive officielle de builds communautaires)
```

Port par défaut : **5201/TCP** (et UDP pour les tests UDP). Ouvrez-le temporairement sur le pare-feu de l'hôte serveur.

## Tests TCP

```bash
# Serveur (une seule mesure à la fois par instance)
iperf3 -s                         # -D en démon, -p pour un autre port
# Client
iperf3 -c 10.0.20.11              # 10 s, client → serveur
iperf3 -c 10.0.20.11 -t 30 -P 4   # 30 s, 4 flux parallèles (liens rapides, chemins agrégés)
iperf3 -c 10.0.20.11 -R           # sens inverse : serveur → client
iperf3 -c 10.0.20.11 --bidir      # deux sens simultanés
iperf3 -c 10.0.20.11 -w 4M        # fenêtre TCP (liens à forte latence)
iperf3 -c 10.0.20.11 -M 1400      # MSS (tester un chemin à MTU réduite)
```

```text Exemple de résultat
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  10.9 GBytes  9.38 Gbits/sec   12   sender
[  5]   0.00-10.00  sec  10.9 GBytes  9.37 Gbits/sec        receiver
```

`Retr` = retransmissions TCP : un nombre élevé révèle des pertes (congestion, erreurs, duplex, tampon).

## Tests UDP

```bash
iperf3 -c 10.0.20.11 -u -b 500M -t 20          # envoi à 500 Mbit/s
iperf3 -c 10.0.20.11 -u -b 2M -l 200           # flux type voix (petits paquets)
```

Le serveur rapporte la **gigue** et le **taux de pertes** (`Lost/Total Datagrams`) : indispensable pour qualifier un lien destiné à la VoIP ou à la vidéo. Sans `-b`, iPerf3 n'envoie qu'1 Mbit/s en UDP.

## Automatisation

```bash
iperf3 -c 10.0.20.11 -t 10 -J > mesure.json
jq '.end.sum_received.bits_per_second / 1e9' mesure.json      # Gbit/s reçus
```

Des mesures planifiées (avant/après un changement d'opérateur, chaque nuit entre sites) donnent une **référence** comparable dans le temps.

## iPerf2

**iPerf2** (projet distinct, toujours maintenu) gère mieux les tests **multiflux** à très haut débit, la **multidiffusion** et la mesure de latence ; les deux outils ne sont pas compatibles entre eux.

## Méthodologie et pièges

| Piège | Conséquence | Parade |
| --- | --- | --- |
| Mesure depuis un poste Wi-Fi ou une VM chargée | On mesure le Wi-Fi ou la VM, pas le lien | Points de mesure filaires, dédiés, au plus près du lien |
| CPU saturé (un cœur par flux en iPerf3 ancien) | Débit plafonné par l'hôte | `-P`, plusieurs instances, versions ≥ 3.16 (multithread), `top` pendant le test |
| Chiffrement (VPN, IPsec, MACsec) | Débit limité par le chiffrement | Comparer avec et sans tunnel |
| Pare-feu avec inspection | Limite du pare-feu, pas du lien | Mesurer de part et d'autre |
| Test trop court | Démarrage lent de TCP | `-t 30` et plus, `-O 3` (ignorer les premières secondes) |
| Serveurs publics iPerf | Partagés, résultats variables | Préférer vos propres points de mesure |

Le débit TCP d'un seul flux est limité par **fenêtre / RTT** : sur un lien de 100 ms, il faut une fenêtre de 12,5 Mo pour 1 Gbit/s.
