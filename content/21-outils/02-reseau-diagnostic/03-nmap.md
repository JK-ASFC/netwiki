---
title: Nmap
description: Nmap, scanner réseau de référence — cadre légal et autorisation, installation (Linux, Windows avec Npcap, macOS), découverte d'hôtes, types de balayage de ports (SYN, connect, UDP), détection de versions et de systèmes, scripts NSE (sécurité, découverte, vulnérabilités, SSL, SMB, SNMP), réglage du temps, formats de sortie, comparaison avec ndiff, Zenmap, usages d'inventaire et de vérification de pare-feu.
tags: [nmap, scan de ports, découverte, nse, inventaire, sécurité, ndiff]
icon: radar
---

**Nmap** (*Network Mapper*) découvre les hôtes d'un réseau, les ports ouverts, les services et leurs versions, et le système d'exploitation probable. Pour l'architecte réseau : **vérifier** qu'un pare-feu applique bien la politique, **inventorier** les services exposés, contrôler un environnement après un changement.

> [!WARNING]
> Balayer des systèmes **sans autorisation** peut être illégal (en France, article 323-1 du Code pénal pour l'accès, et les conditions d'usage des opérateurs) et déclencher des alertes de sécurité. Limitez-vous à vos réseaux, avec l'accord écrit prévu par la politique, et prévenez l'équipe sécurité (SOC) avant un balayage d'ampleur.

## Installation

```bash
sudo apt install nmap          # Debian / Ubuntu ; dnf install nmap (RHEL)
brew install nmap              # macOS
```

```powershell
winget install Insecure.Nmap   # Windows (installe Npcap et l'interface Zenmap)
```

## Découverte d'hôtes

```bash
sudo nmap -sn 10.0.20.0/24                    # ping scan : ARP sur le réseau local, ICMP/TCP au-delà
sudo nmap -sn -PS22,443 -PA80 10.0.0.0/16     # sondes TCP quand l'ICMP est filtré
nmap -sL 10.0.20.0/28                         # liste les cibles (résolution inverse) sans rien envoyer
```

## Balayage de ports

| Option | Type | Remarques |
| --- | --- | --- |
| `-sS` | SYN (semi-ouvert) | Par défaut en root, rapide, discret |
| `-sT` | Connexion complète | Sans privilèges |
| `-sU` | UDP | Lent ; nécessaire pour DNS, SNMP, NTP, RADIUS |
| `-p 22,80,443` / `-p-` / `--top-ports 1000` | Ports ciblés / tous / les plus courants | |
| `-Pn` | Pas de découverte préalable | Hôtes qui ne répondent pas au ping |

| État | Signification |
| --- | --- |
| `open` | Service à l'écoute |
| `closed` | Hôte joignable, port fermé (RST) |
| `filtered` | Pas de réponse : pare-feu qui jette |
| `open\|filtered` | UDP sans réponse : indéterminé |

```bash
sudo nmap -sS -p- --min-rate 1000 10.0.20.11                 # tous les ports TCP d'un serveur
sudo nmap -sU -p 53,123,161,500,1812 10.0.10.0/24            # services UDP d'infrastructure
nmap -sV -p 22,443,3389 10.0.20.0/24                          # versions des services
sudo nmap -O 10.0.20.11                                        # détection du système
sudo nmap -A 10.0.20.11                                        # -sV -O -sC --traceroute
```

## Scripts NSE

```bash
nmap --script ssl-enum-ciphers -p 443 intranet.corp.exemple.fr     # versions TLS et suites acceptées
nmap --script ssl-cert -p 443,636,3389 10.0.20.0/24                 # certificats (expiration, nom)
nmap --script smb-protocols,smb2-security-mode -p 445 10.0.30.0/24  # SMB1 encore actif ? signature exigée ?
nmap -sU --script snmp-info -p 161 10.0.0.0/24                      # équipements SNMP (communauté public)
nmap --script ssh2-enum-algos -p 22 10.0.20.11                      # algorithmes SSH
nmap --script http-title,http-headers -p 80,443,8080 10.0.20.0/24   # applications web
nmap --script "default and safe" 10.0.20.11
```

Les catégories `intrusive`, `exploit`, `dos`, `brute` peuvent **perturber** ou modifier les cibles : réservées aux tests d'intrusion autorisés.

## Temps et discrétion

`-T0` à `-T5` (défaut `-T3`) ; `--max-rate` pour ne pas saturer un lien ou un pare-feu ; `--scan-delay` pour les équipements fragiles (anciens automates, IoT : balayer avec prudence, ils peuvent planter).

## Sorties et comparaison

```bash
sudo nmap -sS -sV -p- 10.0.20.0/24 -oA /srv/scans/serveurs-$(date +%F)    # .nmap, .gnmap, .xml
ndiff /srv/scans/serveurs-2026-10-01.xml /srv/scans/serveurs-2026-10-29.xml   # nouveaux ports, services disparus
xsltproc /srv/scans/serveurs-2026-10-29.xml -o rapport.html
```

Un balayage planifié + `ndiff` détecte l'apparition d'un service non autorisé. Pour des campagnes d'analyse de **vulnérabilités**, utilisez un scanner dédié ([[08-greenbone-openvas|Greenbone]], [[01-nessus|Nessus]]).

## Zenmap et alternatives

**Zenmap** (interface graphique fournie) mémorise les profils et dessine la topologie. Pour un simple inventaire rapide sous Windows : [[04-angry-ip-scanner|Angry IP Scanner]] ; pour des balayages Internet massifs : masscan (à réserver à des cas maîtrisés).
