---
title: Défense contre l'homme du milieu et les attaques Wi-Fi
description: Comprendre et contrer les outils d'interception utilisés en test d'intrusion — Ettercap, Bettercap, MITMf (archivé) et la suite Aircrack-ng — sans procédure d'attaque ; cadre légal (articles 323-1 et 323-3-1 du Code pénal, mandat d'audit) ; défenses de couche 2 (DHCP snooping, inspection ARP dynamique, IP Source Guard, port-security, 802.1X), IPv6 (RA Guard, DHCPv6 Guard), postes Windows (LLMNR, NetBIOS, WPAD, signature SMB et LDAP), chiffrement applicatif (TLS, HSTS, SSH), Wi-Fi (WPA3-SAE, 802.11w/PMF, WPA2/WPA3-Entreprise EAP-TLS, WPS désactivé, isolation des clients) ; détection (arpwatch, journaux des commutateurs, Kismet, IDS) et liste de contrôle.
tags: [homme du milieu, mitm, arp spoofing, ettercap, bettercap, aircrack-ng, wpa3, 802.11w, dai, dhcp snooping, sécurité réseau]
icon: shield-alert
---

Ettercap, Bettercap, MITMf et Aircrack-ng sont des outils de **test d'intrusion**. Ils démontrent qu'un attaquant présent sur le réseau local ou à portée radio peut **intercepter**, **modifier** ou **déconnecter** des communications. Cette page ne décrit pas leur emploi : elle explique **ce qu'ils exploitent**, comment **le détecter** et surtout comment **concevoir le réseau** pour que ces attaques échouent. C'est le point de vue de l'architecte.

> [!WARNING]
> **Cadre légal.** Utiliser ces outils sur un réseau sans autorisation est un délit (accès et maintien frauduleux, interception, entrave : articles 323-1 à 323-3 du Code pénal), et leur détention ou mise à disposition **sans motif légitime** est également réprimée (article 323-3-1). Un audit se fait avec un **mandat écrit** du responsable du système (périmètre, dates, méthodes), sur un poste dédié, et ses résultats sont traités comme confidentiels.

## Les outils et ce qu'ils exploitent

| Outil | Licence | Ce qu'il démontre | État |
| --- | --- | --- | --- |
| **Ettercap** | GPL 2 | Interception sur réseau commuté par empoisonnement des caches ARP, filtrage et modification du trafic | Maintenu, ancien |
| **Bettercap** | GPL 3 | Cadre modulaire : usurpation ARP, DNS et IPv6 (NDP), proxys HTTP/HTTPS, attaques Wi-Fi et Bluetooth Low Energy, interface web | Maintenu |
| **MITMf** | GPL 3 | Cadre Python d'interception (injection, contournement de HTTPS par rétrogradation) | **Archivé, non maintenu** depuis 2018 |
| **Aircrack-ng** | GPL 2 | Audit Wi-Fi : écoute en mode moniteur, injection de trames, test de la robustesse des clés WEP et WPA-PSK | Maintenu |

Toutes ces techniques reposent sur quelques **faiblesses de conception** des protocoles :

| Faiblesse | Principe (sans détail opérationnel) | Défense principale |
| --- | --- | --- |
| ARP sans authentification | Une machine annonce faussement être la passerelle ; les victimes lui envoient leur trafic | Inspection ARP dynamique (DAI) + DHCP snooping |
| DHCP sans authentification | Un faux serveur DHCP distribue une passerelle ou un DNS piégé | DHCP snooping |
| IPv6 annonces de routeur (RA) | Un poste se déclare routeur IPv6 ou serveur DNS (même si IPv6 « n'est pas utilisé ») | RA Guard, DHCPv6 Guard |
| Résolution de noms par diffusion (LLMNR, NetBIOS, mDNS), WPAD | Un poste répond à la place du serveur demandé et récupère des authentifications | Désactiver LLMNR, NetBIOS sur TCP/IP, WPAD automatique |
| Protocoles en clair ou mal vérifiés | Lecture et modification du trafic intercepté | TLS partout, HSTS, vérification des clés SSH, signature SMB/LDAP |
| Wi-Fi : trames de gestion non protégées | Déconnexion forcée des clients, faux point d'accès (*evil twin*) | 802.11w (PMF), WIDS |
| Wi-Fi WPA2-PSK : clé partagée | Une clé courte se teste hors ligne à partir d'un échange capturé | WPA3-SAE, ou clé longue et aléatoire, ou 802.1X |

## Couche 2 : rendre l'usurpation impossible sur les commutateurs

Le **DHCP snooping** construit une table de correspondance *adresse IP ↔ adresse MAC ↔ port* à partir des baux DHCP réellement attribués, et n'accepte des réponses DHCP que sur les ports déclarés **de confiance** (liens vers le cœur, serveurs DHCP). L'**inspection ARP dynamique** (DAI) s'appuie sur cette table pour rejeter tout paquet ARP dont le couple IP/MAC ne correspond pas. **IP Source Guard** filtre de même le trafic IP. Le détail par constructeur : [[04-cisco-commutateurs/02-securite-acces-8021x|Cisco Catalyst]], [[07-aruba/02-aos-cx-cli|Aruba AOS-CX]].

```text Cisco IOS / IOS XE
ip dhcp snooping
ip dhcp snooping vlan 20,30
no ip dhcp snooping information option
ip arp inspection vlan 20,30
ip arp inspection validate src-mac dst-mac ip
!
interface GigabitEthernet1/0/48
 description Uplink vers le coeur (port de confiance)
 ip dhcp snooping trust
 ip arp inspection trust
!
interface range GigabitEthernet1/0/1 - 46
 description Postes
 switchport mode access
 ip dhcp snooping limit rate 15
 ip arp inspection limit rate 15
 ip verify source
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
```

```text Aruba AOS-CX
dhcpv4-snooping
vlan 20
    dhcpv4-snooping
    arp inspection
interface 1/1/48
    dhcpv4-snooping trust
    arp inspection trust
```

> [!TIP]
> Les adresses IP **fixes** (serveurs, imprimantes, équipements) n'apparaissent pas dans la table DHCP snooping : déclarez-les en liaisons statiques (`ip source binding` sur Cisco) ou placez ces équipements sur des VLAN où DAI s'appuie sur une ACL ARP, sinon DAI les bloquera.

Compléments indispensables :

- **802.1X** (ou MAB pour les équipements sans supplicant) : seul un appareil authentifié obtient un port actif — voir [[01-freeradius/01-presentation|FreeRADIUS]] et [[02-nps/01-presentation-installation|NPS]] ;
- **segmentation** : VLAN par usage, filtrage entre VLAN, **isolation des clients** (PVLAN, *client isolation* en Wi-Fi) là où les postes n'ont pas à se parler ;
- ports inutilisés **désactivés** et placés dans un VLAN poubelle.

## IPv6 : RA Guard et DHCPv6 Guard

Même sans plan d'adressage IPv6, les postes Windows, macOS et Linux activent IPv6 et écoutent les annonces de routeur. Un attaquant peut donc s'annoncer routeur ou serveur DNS IPv6 et intercepter le trafic. Activez **RA Guard** (et DHCPv6 Guard) sur les ports d'accès plutôt que de désactiver IPv6 sur les postes.

```text Cisco IOS XE
ipv6 nd raguard policy HOTES
 device-role host
ipv6 dhcp guard policy CLIENTS-DHCPV6
 device-role client
!
interface range GigabitEthernet1/0/1 - 46
 ipv6 nd raguard attach-policy HOTES
 ipv6 dhcp guard attach-policy CLIENTS-DHCPV6
```

## Postes Windows : supprimer les réponses usurpables

| Mesure | Où la configurer |
| --- | --- |
| Désactiver LLMNR | GPO *Configuration ordinateur → Modèles d'administration → Réseau → Client DNS → Désactiver la résolution de noms multidiffusion* = Activé |
| Désactiver NetBIOS sur TCP/IP | Option DHCP 001 de Microsoft (*Microsoft Disable Netbios Option* = `0x2`) ou propriétés de la carte |
| Désactiver la détection automatique du proxy (WPAD) si elle n'est pas utilisée | GPO ou enregistrement DNS `wpad` maîtrisé — voir [[02-squid/06-transparent-wpad-exploitation\|WPAD]] |
| Exiger la signature SMB | GPO *Sécurité réseau : signer numériquement les communications (toujours)* côté client et serveur |
| Exiger la signature LDAP et la liaison de canal | Contrôleurs de domaine — voir [[01-active-directory/09-securite-durcissement\|durcissement d'Active Directory]] |

## Chiffrement de bout en bout

L'interception de couche 2 devient sans intérêt si les applications **chiffrent et vérifient** leur correspondant :

- **TLS** partout, y compris en interne (intranet, API, LDAPS, SMTP avec STARTTLS obligatoire), avec certificats d'une AC d'entreprise ([[21-pki-step-ca-ejbca/01-step-ca|PKI]]) ;
- **HSTS** sur les sites web pour empêcher la rétrogradation vers HTTP ;
- **SSH** : distribuer les clés d'hôte (`known_hosts` géré, certificats d'hôte) et refuser les alertes de changement de clé non expliquées ;
- **DNS** : résolveurs internes avec validation DNSSEC, DNS chiffré (DoT/DoH) vers ces résolveurs pour les postes nomades.

## Wi-Fi

| Mesure | Effet |
| --- | --- |
| **WPA3-SAE** (personnel) | L'échange SAE résiste aux tests hors ligne de la clé, contrairement à WPA2-PSK |
| **802.11w / PMF** obligatoire | Les trames de déauthentification et de désassociation sont protégées : plus de déconnexion forcée |
| **WPA2/WPA3-Entreprise** (802.1X) avec **EAP-TLS** | Chaque utilisateur ou appareil a son certificat ; pas de clé partagée |
| Validation du **certificat du serveur RADIUS** sur les clients (PEAP, EAP-TTLS) | Empêche un faux point d'accès de récupérer les identifiants |
| WPA2-PSK conservé (anciens appareils) | Clé **aléatoire de 20 caractères ou plus**, changée au départ d'un salarié ; SSID séparé et VLAN restreint |
| **WPS** désactivé | Supprime une méthode d'association faible |
| Isolation des clients, SSID invités séparé | Un client ne peut pas attaquer les autres |
| **WIDS/WIPS** (contrôleur ou [[01-kismet\|Kismet]]) | Alerte sur les points d'accès pirates et les vagues de déauthentification |

Point d'accès Linux (hostapd) en WPA3 avec transition WPA2 et PMF :

```ini /etc/hostapd/hostapd.conf
ssid=Corp-WiFi
wpa=2
wpa_key_mgmt=SAE WPA-PSK
rsn_pairwise=CCMP
ieee80211w=1
sae_require_mfp=1
wpa_passphrase=Remplacer-Par-Une-Cle-Aleatoire-De-Plus-De-20-Caracteres
```

Quand tous les clients sont compatibles WPA3, passez en WPA3 seul : `wpa_key_mgmt=SAE` et `ieee80211w=2` (PMF obligatoire). Voir [[17-wifi-linux/01-hostapd-wpa-supplicant-iw-iwd|hostapd]].

## Détecter une attaque en cours

| Source | Ce qui alerte |
| --- | --- |
| Journaux des commutateurs | Paquets ARP rejetés par DAI (`%SW_DAI-4-DHCP_SNOOPING_DENY` sur Cisco), réponses DHCP sur un port non fiable, violations de port-security |
| **arpwatch** | Changement de MAC pour une IP (`changed ethernet address`, `flip flop`) |
| IDS ([[05-suricata/01-presentation-installation\|Suricata]], [[07-zeek/01-presentation-installation\|Zeek]]) | ARP incohérents, DHCP inattendus, certificats TLS inconnus |
| [[01-kismet\|Kismet]] / contrôleur Wi-Fi | Points d'accès usurpés, déauthentifications massives, chiffrement rétrogradé |
| Postes | Avertissements de certificat inhabituels, alerte SSH de changement de clé d'hôte |

arpwatch sur un serveur Linux du VLAN surveillé :

```bash
sudo apt install arpwatch
sudo systemctl enable --now arpwatch@ens192
journalctl -u arpwatch@ens192 | grep -E "changed ethernet address|flip flop"
```

## Liste de contrôle de l'architecte

- [ ] DHCP snooping et inspection ARP dynamique sur tous les VLAN d'accès, ports de confiance limités aux liens montants et serveurs DHCP
- [ ] RA Guard et DHCPv6 Guard sur les ports d'accès
- [ ] 802.1X (ou MAB) sur les ports d'accès, ports inutilisés désactivés
- [ ] LLMNR et NetBIOS désactivés, WPAD maîtrisé, signature SMB et LDAP exigées
- [ ] TLS vérifié pour tous les flux internes, HSTS sur les sites web
- [ ] Wi-Fi en WPA3 (ou WPA2/3-Entreprise EAP-TLS), PMF activé, WPS désactivé, invités isolés
- [ ] Surveillance : journaux DAI et DHCP snooping envoyés au SIEM, WIDS actif
- [ ] Audits d'intrusion réalisés sous mandat écrit, sur un périmètre défini

Commandes prêtes à copier : [[90-aide-memoire|aide-mémoire]].
