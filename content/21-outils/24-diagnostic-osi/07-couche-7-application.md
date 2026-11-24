---
title: Couche 7 — Application
description: Diagnostic de la couche application OSI — résolution et adressage (DNS, DHCP), authentification et annuaire (Kerberos, LDAP/LDAPS, RADIUS, NTP), web (HTTP/HTTPS/2/3 QUIC, WebSocket, proxy/PAC), messagerie (SMTP, IMAP, POP3, Autodiscover), partages (SMB, NFS, FTP/SFTP/FTPS), supervision (SNMP, Syslog, UPnP), accès distant (RDP, SSH, Telnet) et impression (IPP, LPD, raw 9100) ; symptômes courants et commandes de diagnostic.
tags: [osi, application, dns, dhcp, kerberos, ldap, http, smtp, smb, snmp, rdp, ssh, diagnostic]
icon: layers
---

**Rôle** : fournir les **services directement utilisés** par l'utilisateur et ses applications. Côté infrastructure : résolution DNS, attribution DHCP, authentification Kerberos/LDAP, partages SMB/NFS, services web, messagerie, supervision SNMP, journalisation Syslog.

## Résolution de noms et adressage

| Protocole | Points clés |
| --- | --- |
| **DNS** (UDP/TCP 53) | Résout noms → IP. Enregistrements A, AAAA, CNAME, MX, **SRV** (AD, Kerberos, SIP), TXT (SPF/DKIM/DMARC). Sécurisé : DNSSEC, DoT, DoH |
| **DHCP** (UDP 67/68) | Flux **DORA** : DISCOVER → OFFER → REQUEST → ACK. Bail = IP, masque, passerelle, DNS, durée. DHCP Relay (`ip helper-address`) entre VLAN |

```bash
nslookup <nom>            # résolution ; Resolve-DnsName <nom> (PowerShell)
ipconfig /displaydns      # cache DNS local ; ipconfig /flushdns pour le vider
ipconfig /renew           # nouveau bail DHCP ; ipconfig /release pour libérer
```

> [!WARNING]
> Piège fréquent : si l'**IP directe fonctionne mais pas le nom** → DNS, à ne pas confondre avec un problème de route (couche 3).

## Authentification et annuaire

| Protocole | Points clés |
| --- | --- |
| **Kerberos** (88) | Authentification par **tickets** (AS → TGS → service), SSO. Dépendances critiques : **NTP** (±5 min) et **DNS** (résolution du KDC). Utilisé par AD, SMB, LDAP, NFS, HTTP (SPNEGO) |
| **LDAP / LDAPS** (389 / 636) | Accès à l'annuaire AD. LDAPS = LDAP over TLS (recommandé) ; LDAP en clair expose les identifiants |
| **RADIUS** (1812 / 1813) | AAA pour VPN, Wi-Fi WPA2-Enterprise (802.1X), équipements. Backend LDAP/AD |
| **NTP** (UDP 123) | Synchronisation d'horloge. Décalage > 5 min = échec Kerberos ; tout décalage = erreurs TLS |

> [!WARNING]
> **Côté cyber** — compromission du KDC (contrôleur de domaine) = compromission de toute l'infra. LDAP signing + channel binding obligatoires depuis Windows Server 2022. RADIUS en **EAP-TLS** (certificats) plus sûr qu'EAP-MSCHAPv2.

## Web et services cloud

| Protocole | Points clés |
| --- | --- |
| **HTTP/HTTPS/2/3** | HTTP (80) clair, HTTPS (443) = HTTP+TLS. HTTP/2 multiplexe sur une connexion TCP ; HTTP/3 = QUIC (UDP 443), latence réduite |
| **WebSocket / WSS** (443) | Canal bidirectionnel persistant (temps réel) ; un proxy qui coupe les connexions longues le brise |
| **Proxy & PAC** | Script JavaScript décidant proxy ou direct. Un PAC mal configuré route tout via le proxy + SSL inspection → latence SaaS |

## Messagerie

| Protocole | Points clés |
| --- | --- |
| **SMTP** (25 / 587 / 465) | Envoi serveur→serveur (25) et client→serveur (587 STARTTLS, 465 SSL). Sécurité : **SPF**, **DKIM**, **DMARC** |
| **IMAP** (143 / 993) | Mails sur le serveur, dossiers synchronisés (multi-appareils). IMAPS = TLS (993) |
| **POP3** (110 / 995) | Télécharge et supprime du serveur ; déconseillé en entreprise |
| **Autodiscover / SRV** | Auto-configuration du client à partir de l'adresse e-mail (HTTPS ou DNS SRV) ; défaillance = client incapable de se connecter |

## Partages de fichiers

| Protocole | Points clés |
| --- | --- |
| **SMB** (445) | Partages, imprimantes, DFS. SMB 3.x : chiffrement + multicanal. Bloquer 445 vers Internet |
| **NFS** (2049) | Partage Unix/Linux/macOS ; NFSv4 avec Kerberos |
| **FTP / SFTP / FTPS** | FTP (21/20) clair et obsolète ; **SFTP** = sur SSH (22) ; FTPS = FTP+TLS. WebDAV = alternative web |

## Supervision et journalisation

| Protocole | Points clés |
| --- | --- |
| **SNMP** (UDP 161/162) | Supervision équipements ; v1/v2c community en clair, **v3** (HMAC+AES) seule recommandée. OID hiérarchiques |
| **Syslog** (UDP 514 / TCP 601 / TLS 6514) | Journalisation (RFC 5424), Facility + Severity (0 Emergency → 7 Debug). Centralisation (rsyslog, Graylog, Wazuh) |
| **UPnP** (SSDP UDP 1900) | Découverte LAN ; ouverture auto de ports (IGD). **Désactiver en entreprise** |

> [!WARNING]
> **Côté cyber** — SNMP : désactiver les community `public`/`private`, préférer v3 authPriv restreint à l'IP du superviseur. Syslog : TCP/TLS (6514) pour l'intégrité des logs. UPnP : vecteur de redirection de port, à désactiver.

## Accès à distance et impression

| Protocole | Points clés |
| --- | --- |
| **RDP** (3389) | Bureau à distance Windows, TLS + **NLA**. Jamais exposé sur Internet (VPN/PAM obligatoire) |
| **SSH** (22) | Terminal chiffré + SCP/SFTP + tunneling ; clés Ed25519 recommandées |
| **Telnet** (23) | En clair → **à bannir**, remplacer par SSH |
| **IPP** (631) | Impression moderne (CUPS, Windows 10+), HTTPS, découverte mDNS |
| **LPD/LPR** (515) | Protocole Unix historique, imprimantes anciennes |
| **Impression raw** (9100) | Flux direct (JetDirect) ; tester avec `Test-NetConnection -Port 9100` |

> [!WARNING]
> **Côté cyber** — RDP sur Internet = cible nº 1 des rançongiciels (VPN + MFA obligatoires). Telnet encore en production = urgence P1 sécurité.

## Symptômes → action

| Symptôme | Cause | Commande |
| --- | --- | --- |
| **« Ce site précis ne s'ouvre pas »** (Internet OK) | DNS (nom non résolu) | `nslookup <nom>` ; `ipconfig /flushdns` |
| **Poste sans IP (169.254.x.x)** | DHCP sans bail (étendue saturée, VLAN, relais absent) | `ipconfig /renew` puis vérifier L2 |
| **Échec de SSO / « identifiants incorrects »** (corrects) | Kerberos : horloge > 5 min, compte verrouillé, DC injoignable | `w32tm /query /status` ; `net accounts` ; `nltest /sc_query:<domaine>` |
| **Client de messagerie « déconnecté »** (réseau OK) | Autodiscover défaillant, certificat expiré, maintenance | `Test-NetConnection <serveur> -Port 443` |
| **Imprimante visible mais impression échoue** | Port 9100/631 bloqué, file bloquée côté serveur | `Test-NetConnection <IP> -Port 9100` |
| **SNMP : équipement injoignable depuis le manager** | Community incorrecte, ACL SNMP, UDP 161 bloqué | Vérifier community v3 et ACL |

> [!NOTE]
> **Remonter la pile** : si L1–L4 sont OK et TLS est valide, le problème est **applicatif** (profil client, découverte de service). Site accessible par IP mais pas par nom → DNS : vider le cache local et tester un résolveur alternatif.

> [!WARNING]
> **Côté cyber** — horloge fausse = TLS + Kerberos en panne : la synchronisation NTP est un **service critique de sécurité**.

Les outils de capture et de test : [[02-reseau-diagnostic/01-wireshark-capture|Wireshark]], [[02-reseau-diagnostic/03-nmap|Nmap]], [[02-reseau-diagnostic/06-dig-mtr-curl|dig / mtr / curl]]. Commandes : [[90-aide-memoire|aide-mémoire]].
