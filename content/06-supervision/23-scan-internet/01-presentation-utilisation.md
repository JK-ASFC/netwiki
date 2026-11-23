---
title: Présentation, installation et utilisation
description: ZMap et Masscan — scanners réseau sans état à très haut débit (des millions de paquets par seconde) capables de balayer l'espace IPv4 : principes (SYN sans état, randomisation), cas d'usage légitimes (inventaire de sa propre exposition Internet, audit de grands réseaux internes, recherche), cadre légal et précautions (autorisation, listes d'exclusion, limitation du débit, contact abuse), installation Linux, macOS et Windows (Masscan), options (ports, débit, exclusions, formats de sortie), modules ZMap et ZGrab2 pour la collecte de bannières, et comparaison avec Nmap.
tags: [zmap, masscan, scan, exposition, audit, sécurité, ipv4]
icon: info
---

**ZMap** et **Masscan** envoient des sondes **sans état** à très grande vitesse : là où [[02-reseau-diagnostic/03-nmap|Nmap]] examine en détail quelques centaines d'hôtes, eux vérifient un ou quelques ports sur des **millions d'adresses**. Usage typique en entreprise : contrôler qu'aucun service n'est exposé par erreur sur ses plages publiques ou faire l'inventaire d'un très grand réseau interne, puis approfondir avec Nmap.

> [!WARNING]
> Scanner des systèmes sans **autorisation écrite** est illégal (article 323-1 du Code pénal en France) et peut saturer des équipements. Limitez-vous à vos propres plages ou à un périmètre contractuel, réduisez le débit, utilisez une **liste d'exclusion**, prévenez votre opérateur et votre SOC.

## Installation

```bash
sudo apt install zmap masscan          # Debian/Ubuntu ; RHEL : EPEL ; macOS : brew install zmap masscan
```

Windows : Masscan se compile (Visual Studio) ou s'utilise via WSL ; ZMap est propre à Linux/BSD/macOS.

## Masscan

```bash
sudo masscan 203.0.113.0/24 198.51.100.0/24 -p22,80,443,3389,8080 --rate 1000 --excludefile exclusions.txt -oL exposition.txt
sudo masscan 10.0.0.0/8 -p445 --rate 20000 --banners --source-port 61000 -oJ smb.json
```

Masscan utilise sa propre pile TCP : pour récupérer les bannières (`--banners`), empêchez le noyau de répondre RST sur le port source choisi (`iptables -A INPUT -p tcp --dport 61000 -j DROP`).

| Option Masscan | Rôle |
| --- | --- |
| `-p22,80,443` / `-p0-65535` / `-pU:53` | Ports TCP (ou UDP avec `U:`) |
| `--rate <pps>` | Débit en paquets/seconde (le réglage le plus important) |
| `--excludefile <f>` | Plages à **ne jamais** scanner (obligatoire en pratique) |
| `--banners` | Récupérer les bannières applicatives |
| `--source-port <p>` | Port source (à protéger du RST noyau) |
| `-oL`/`-oJ`/`-oX`/`-oG` | Sortie liste / JSON / XML / grepable |
| `--shards 1/3` | Répartir un balayage sur plusieurs machines |
| `-c scan.conf` / `--echo` | Lire / écrire la configuration dans un fichier |

Masscan peut reprendre un balayage interrompu (`paused.conf` écrit automatiquement, `--resume paused.conf`).

## ZMap

```bash
sudo zmap -p 443 -B 10M -b exclusions.txt -o https-ouverts.csv 203.0.113.0/24
sudo zmap -p 3389 10.0.0.0/8 -B 50M -o rdp.csv && zgrab2 tls --port 443 < https-ouverts.csv > tls.json   # ZGrab2 : collecte applicative
```

| Option ZMap | Rôle |
| --- | --- |
| `-p <port>` | Port cible (un seul par passe, ZMap étant mono-port) |
| `-B <débit>` | Bande passante (`10M`, `50M`) — alternative à `-r` (pps) |
| `-b <fichier>` | Liste d'exclusion (*blocklist*) |
| `-o <fichier>` | Sortie (CSV par défaut) |
| `-n <nombre>` / `-N <nombre>` | Limiter le nombre de cibles / de résultats |
| `--sender-threads`, `-c <cooldown>` | Parallélisme d'envoi, temps d'attente final |
| `-M <module>` | Module de sonde (`tcp_synscan` par défaut, `icmp_echoscan`, `udp`) |

**ZGrab2** (compagnon de ZMap) fait le second temps applicatif : à partir de la liste d'IP ouvertes, il établit la connexion complète et collecte la bannière, le certificat TLS, l'en-tête HTTP, la version SSH, etc. (`zgrab2 http`, `zgrab2 tls`, `zgrab2 ssh`).

| | **ZMap / Masscan** | **Nmap** |
| --- | --- | --- |
| Échelle | Millions d'IP, 1-quelques ports | Centaines d'hôtes, analyse fine |
| État | Sans état (rapide, pas de suivi de connexion) | Avec état (détection OS/service, scripts NSE) |
| Usage | Repérer *ce qui est ouvert* | Comprendre *ce qu'est* le service |

En pratique on enchaîne : ZMap/Masscan pour le balayage large → ZGrab2/Nmap pour la caractérisation. Résultats à rapprocher de l'inventaire (CMDB, [[08-netbox-nautobot/01-netbox|NetBox]]) : tout service ouvert non référencé est à expliquer ou fermer. Commandes : [[90-aide-memoire|aide-mémoire]].
