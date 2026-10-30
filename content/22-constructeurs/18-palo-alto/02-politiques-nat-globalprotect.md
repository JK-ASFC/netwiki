---
title: Politiques, App-ID, User-ID, NAT et GlobalProtect
description: Configurer la sécurité d'un pare-feu Palo Alto — règles de sécurité par zones, applications (App-ID) et services (application-default), profils de sécurité (antivirus, anti-spyware, vulnérabilités, URL, WildFire, fichiers) et groupes de profils, déchiffrement SSL, User-ID (agent, API, Cloud Identity Engine), règles de NAT (source, destination, U-turn), VPN IPsec et GlobalProtect, en CLI et dans l'interface web.
tags: [palo alto, pan-os, app-id, user-id, nat, globalprotect, ipsec, déchiffrement]
icon: shield
---

## Règles de sécurité

```panos
set address NET-LAN ip-netmask 10.0.0.0/8
set address SRV-WEB ip-netmask 10.0.30.10
set rulebase security rules LAN-VERS-INTERNET from TRUST to UNTRUST source NET-LAN destination any application [ ssl web-browsing ms-office365 dns ] service application-default action allow
set rulebase security rules LAN-VERS-INTERNET profile-setting group PROFILS-STANDARD
set rulebase security rules LAN-VERS-INTERNET log-end yes
set rulebase security rules INTERNET-VERS-WEB from UNTRUST to DMZ source any destination 203.0.113.5 application web-browsing service application-default action allow
set rulebase security rules INTERNET-VERS-WEB profile-setting group PROFILS-SERVEURS
commit
```

| Principe | Explication |
| --- | --- |
| Zones | Règles entre zones ; règles intrazone autorisées et interzone refusées par défaut (règles par défaut en bas de liste) |
| **App-ID** | La règle autorise des **applications** (`ssh`, `ms-rdp`, `office365`…), pas seulement des ports |
| `application-default` | L'application doit utiliser ses **ports standards** (évite le contournement par des ports non standards) |
| Ordre | Première correspondance |
| Journalisation | `log-end` sur chaque règle, y compris de refus explicite en fin de liste |

L'outil **Policy Optimizer** (*Policies → Policy Optimizer*) aide à transformer des règles par ports en règles par applications à partir du trafic observé.

## Profils de sécurité

| Profil | Rôle |
| --- | --- |
| Antivirus | Analyse des fichiers et flux |
| Anti-Spyware | Détection des communications de commande et contrôle, **DNS Security** (sinkhole) |
| Vulnerability Protection | IPS |
| URL Filtering | Catégories d'URL (licence Advanced URL Filtering) |
| File Blocking | Types de fichiers |
| **WildFire** | Analyse en bac à sable des fichiers inconnus |

Regroupez-les en **groupes de profils** (`PROFILS-STANDARD`) appliqués à chaque règle autorisant du trafic. Sans **déchiffrement SSL** (*Policies → Decryption*, certificat d'AC déployé sur les postes), l'inspection du trafic HTTPS reste limitée.

## User-ID

User-ID associe adresses IP et **utilisateurs/groupes** pour écrire des règles par groupe AD :

| Source | Mécanisme |
| --- | --- |
| Agent User-ID (intégré au pare-feu ou Windows) | Lecture des journaux de sécurité des contrôleurs de domaine (connexions 4624) |
| GlobalProtect, portail captif | Utilisateur connu à l'authentification |
| API XML, syslog | Informations d'autres systèmes (NAC, proxy, RADIUS) |
| **Cloud Identity Engine** | Groupes Entra ID/AD dans le cloud |

```panos
show user ip-user-mapping all
show user group list
```

## NAT

```panos
# NAT source dynamique (PAT) vers Internet
set rulebase nat rules SORTIE-INTERNET from TRUST to UNTRUST source NET-LAN destination any service any source-translation dynamic-ip-and-port interface-address interface ethernet1/1
# NAT destination : publication du serveur web
set rulebase nat rules PUBLICATION-WEB from UNTRUST to UNTRUST source any destination 203.0.113.5 service service-https destination-translation translated-address 10.0.30.10
commit
```

> [!IMPORTANT]
> La logique Palo Alto : la règle de **NAT** utilise les zones **avant** traduction (pour une publication : zone de destination = `UNTRUST`, celle de l'adresse publique), tandis que la règle de **sécurité** utilise l'adresse de destination **d'origine** (publique) et la zone de destination **après** traduction (`DMZ`). C'est la source d'erreur la plus fréquente.

## VPN IPsec

Interface web : *Network → IKE Gateways*, *IPSec Tunnels* (interface `tunnel.1` dans une zone `VPN`), *IKE/IPSec Crypto profiles* ; routage vers l'interface tunnel (statique ou dynamique). Les **Proxy-ID** doivent correspondre aux sélecteurs de trafic du pair lorsqu'il fonctionne par politique (Cisco ASA, Stormshield en mode politique…).

## GlobalProtect

**GlobalProtect** fournit le VPN d'accès distant (et l'accès conditionné à l'état du poste) :

| Composant | Rôle |
| --- | --- |
| **Portail** | Distribue la configuration aux agents (passerelles, paramètres), peut héberger un client sans installation |
| **Passerelle** | Termine les tunnels (IPsec avec repli SSL) |
| Agent GlobalProtect | Windows, macOS, Linux, iOS, Android ; mode *always-on* possible |
| HIP | Vérification de l'état du poste (correctifs, antivirus, chiffrement) |

Authentification : SAML (Entra ID, Okta) avec MFA, certificats machine pour le pré-logon. Les portails GlobalProtect ont connu des vulnérabilités critiques exploitées (2024) : mises à jour immédiates.

Suite : [[03-panorama-ha-depannage|Panorama, haute disponibilité et dépannage]].
