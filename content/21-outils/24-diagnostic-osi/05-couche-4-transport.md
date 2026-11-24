---
title: Couche 4 — Transport
description: Diagnostic de la couche transport OSI — TCP (fiable, handshake SYN/SYN-ACK/ACK, fenêtre, MSS/SACK), UDP (rapide, sans état), SCTP, plages de ports (well-known, registered, dynamic), ports critiques côté sécurité, MTU et fragmentation, pare-feu et proxy ; symptômes (ping OK mais l'appli ne se connecte pas, application en timeout, VoIP/visio dégradée, imprimante injoignable) et tests de port.
tags: [osi, couche transport, tcp, udp, sctp, ports, mtu, pare-feu, proxy, diagnostic]
icon: layers
---

**Rôle** : communication **de bout en bout** entre deux applications via les **ports**, avec fiabilité (TCP) ou rapidité (UDP). Côté infrastructure : ports d'écoute des services (443, 3389, 445, 22…), règles de pare-feu et de proxy, santé des sessions TCP, flux UDP (DNS, DHCP, SNMP, VoIP).

## Technologies et protocoles

| Techno | Points clés |
| --- | --- |
| **TCP** | Fiable, ordonné : numéros de séquence + ACK, fenêtre glissante. Handshake `SYN → SYN/ACK → ACK`, clôture `FIN → FIN/ACK`. Options : MSS, Window Scale, SACK, Timestamp |
| **UDP** | Sans connexion ni état ; datagrammes sans garantie. Idéal latence : DNS, DHCP, NTP, VoIP, streaming, SNMP |
| **SCTP** | Orienté connexion comme TCP mais **multi-homing** (plusieurs IP) et **multi-stream** ; signalisation télécom (SS7/Diameter) |
| **Ports** | 0–1023 well-known (IANA), 1024–49151 registered, 49152–65535 dynamiques/éphémères (côté client) |
| **MTU / segmentation** | MTU Ethernet = 1500 o ; TCP segmente (MSS ≈ 1460 o), UDP peut être fragmenté par IP (bit DF). La fragmentation dégrade et s'exploite |
| **Pare-feu & proxy** | Filtrage par port/protocole/IP ; un proxy HTTPS (SSL inspection) peut casser des connexions si son certificat racine n'est pas déployé sur les postes |

### Ports à maîtriser

```text
22  SSH        80  HTTP       443 HTTPS      25  SMTP      53  DNS
67/68 DHCP     389 LDAP       636 LDAPS      88  Kerberos  445 SMB
3389 RDP       9100 impr. raw 123 NTP        161/162 SNMP  514 Syslog
143 IMAP       993 IMAPS      110/995 POP3    587 SMTP-TLS  21/20 FTP
631 IPP        3306 MySQL
```

### Ports critiques côté sécurité

| Port | Risque |
| --- | --- |
| **22 (SSH)** | Force brute → MFA + fail2ban |
| **3389 (RDP)** | Vecteur de rançongiciel → jamais exposé sans VPN |
| **445 (SMB)** | WannaCry, NotPetya |
| **23 (Telnet)** | En clair → bloquer |
| **21 (FTP)** | Préférer SFTP/FTPS |

> [!WARNING]
> **Côté cyber** — chaque port ouvert = surface d'attaque ; audit régulier et ACL strictes. La SSL inspection déchiffre/rechiffre : si le certificat racine du proxy manque côté poste → erreur TLS (diagnostic à faire en couche 6).

## Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **Ping OK mais l'appli ne se connecte pas** | Port fermé ou filtré (pare-feu, proxy, service arrêté) | Tester le **port exact** |
| **Application métier en timeout (réseau OK)** | Port spécifique de l'appli bloqué | Tester le port précis, pas seulement 443 |
| **VoIP / visio dégradée** | Sessions coupées par un pare-feu, ou média forcé en TCP (UDP bloqué) | Vérifier les sessions établies, autoriser l'UDP |
| **Imprimante injoignable (vue mais pas de job)** | Port 9100 (raw) ou 631 (IPP) bloqué, file bloquée côté serveur | Tester 9100 / 631 |

```bash
Test-NetConnection <hôte> -Port 443        # TcpTestSucceeded : False -> port bloqué
Test-NetConnection <hôte> -Port 3389       # RDP
Test-NetConnection <hôte> -Port 9100       # impression raw
Get-NetTCPConnection -State Established | ? RemotePort -eq 443
ss -tan state established                  # équivalent Linux
```

> [!NOTE]
> **Ping OK + port KO = couche 4.** Le réflexe qui distingue un admin confirmé d'un débutant. Ne jamais conclure « réseau HS » avant d'avoir testé le port précis de l'application.

> [!WARNING]
> **Côté cyber** — les flux média (VoIP, visio) exigent l'UDP pour la latence. UDP bloqué → repli TCP → latence et gigue élevées.

Suite : [[06-couches-5-6-session-presentation|Couches 5 et 6 — Session et Présentation]]. Commandes : [[90-aide-memoire|aide-mémoire]].
