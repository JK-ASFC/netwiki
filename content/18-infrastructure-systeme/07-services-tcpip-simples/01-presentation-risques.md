---
title: Présentation, usages et risques
description: Services TCP/IP simples (Simple TCP/IP Services) de Windows et services internes inetd sous Linux — Echo (7), Discard (9), Daytime (13), Quote of the Day (17) et Character Generator (19) en TCP et UDP, usages historiques de test, installation et désinstallation sous Windows, risques d'amplification et de boucles (chargen/echo, attaque Fraggle), détection par balayage, alternatives modernes pour tester le réseau.
tags: [simple tcpip, echo, chargen, daytime, discard, sécurité, amplification, windows]
icon: radio-tower
---

Les **services TCP/IP simples** sont de très anciens services réseau (RFC 862 à 865, années 1980) destinés aux **tests**. Windows les propose sous la fonctionnalité **Simple TCP/IP Services** (`Simple-TCPIP`) ; les systèmes Unix les fournissaient par **inetd/xinetd** (services internes).

| Service | Port (TCP et UDP) | Comportement |
| --- | --- | --- |
| **Echo** | 7 | Renvoie tout ce qu'il reçoit |
| **Discard** | 9 | Jette tout ce qu'il reçoit |
| **Daytime** | 13 | Renvoie la date et l'heure en texte |
| **Quote of the Day** (QOTD) | 17 | Renvoie une citation |
| **Character Generator** (chargen) | 19 | Envoie un flux continu de caractères |

## Installation (Windows)

```powershell
Get-WindowsFeature Simple-TCPIP
Install-WindowsFeature Simple-TCPIP          # Windows Server
Enable-WindowsOptionalFeature -Online -FeatureName SimpleTCP     # Windows 10/11
Get-Service simptcp
```

Service `simptcp` ; citations dans `%SystemRoot%\System32\drivers\etc\quotes`.

## Usages

Historiquement : tester une connexion TCP/UDP de bout en bout, mesurer un débit grossier (chargen → discard), vérifier un pare-feu. Aujourd'hui, ces besoins sont mieux couverts par :

| Besoin | Outil moderne |
| --- | --- |
| Tester qu'un port est joignable | `Test-NetConnection -Port`, `nc -vz`, [[03-nmap\|Nmap]] |
| Mesurer un débit | [[05-iperf3\|iPerf3]] |
| Tester l'UDP de bout en bout | iPerf3 en UDP, `nc -u` |
| Heure réseau | NTP ([[01-chrony/01-presentation-client\|chrony]]) |
| Écho applicatif | Petit serveur de test temporaire (`ncat -l --keep-open --exec cat`) |

## Risques

> [!WARNING]
> Exposés, ces services sont dangereux : **chargen** et **echo** en UDP répondent à des requêtes dont l'adresse source peut être usurpée, ce qui en fait des **amplificateurs** d'attaques par déni de service (chargen amplifie fortement). Une requête usurpée entre deux machines (echo ↔ chargen) crée une **boucle** qui sature le réseau (attaque *Fraggle* et variantes). Ils figurent dans les contrôles des scanners de vulnérabilités et des référentiels de durcissement.

- **Ne pas installer** ces services en production ; les **désinstaller** s'ils sont présents.
- Bloquer les ports 7, 9, 13, 17, 19 en entrée sur les pare-feu périmétriques et internes.
- Sous Linux, vérifier qu'aucun service interne d'inetd/xinetd n'est activé (désactivés par défaut sur les distributions modernes).

```powershell
Uninstall-WindowsFeature Simple-TCPIP
Get-NetTCPConnection -State Listen | Where-Object LocalPort -in 7,9,13,17,19
```

```bash
# Détection sur le réseau (avec autorisation)
sudo nmap -sU -sT -p 7,9,13,17,19 10.0.0.0/16 --open
```

Voir [[10-pare-feu-windows/01-profils-regles|pare-feu Windows]] et [[02-reseau-diagnostic/08-greenbone-openvas|analyse de vulnérabilités]].
