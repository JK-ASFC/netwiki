---
title: Pare-feu, commutateurs Zyxel et Nebula
description: Zyxel pour PME — pare-feu USG FLEX / ATP / ZyWALL (interface web, zones et objets, politiques de sécurité, NAT, VPN IPsec et SSL/WireGuard, services de sécurité), CLI de ZLD/uOS (configure terminal, show, write), commutateurs XGS/GS (interface web et CLI), gestion cloud Nebula, sécurisation (vulnérabilités exploitées sur les pare-feu Zyxel), sauvegarde et dépannage.
tags: [zyxel, usg flex, atp, nebula, pare-feu, commutateur, vpn]
icon: shield
---

**Zyxel** propose pare-feu (**USG FLEX**, **ATP**, ZyWALL VPN), commutateurs (**GS/XGS**) et Wi-Fi pour PME, gérables localement ou dans le cloud **Nebula**.

## Pare-feu USG FLEX / ATP

### Interface web

`https://192.168.1.1` (port LAN par défaut ; identifiants `admin` / `1234` sur les anciennes versions — changement imposé) : assistant de démarrage puis menus :

| Menu | Usage |
| --- | --- |
| *Network → Interface* | WAN (DHCP, IP fixe, PPPoE, VLAN), LAN, VLAN, ponts |
| *Network → Zone* | Zones (LAN1, LAN2, DMZ, WAN, SSL_VPN, IPSec_VPN) |
| **Security Policy → Policy Control** | Règles entre zones (source, destination, service, utilisateur, profils de sécurité) |
| *Network → NAT* | Redirections de ports, NAT 1:1 |
| VPN | IPsec site à site (assistant, compatible autres constructeurs), VPN d'accès distant (IPsec IKEv2, SSL, **WireGuard** sur uOS) |
| Security Service | Antivirus, IPS, filtrage web et applicatif, réputation (licences) |
| *Maintenance → File Manager* | Configuration (`startup-config.conf`), micrologiciel |

### CLI

Console ou SSH : une CLI de **style Cisco** (système ZLD ; les modèles récents passent à **uOS**) :

```zyxel
Router> enable
Router# configure terminal
Router(config)# show interface all
Router(config)# show ip route
Router(config)# show secure-policy
Router(config)# show sessions
Router(config)# write
Router(config)# show version
```

La configuration courante est un fichier texte (`show running-config`) que l'on peut éditer et réappliquer (*File Manager → Run script*), pratique pour déployer une configuration modèle.

## Commutateurs

| Gamme | Gestion |
| --- | --- |
| GS1900 (smart) | Interface web |
| GS2220, XGS2220, XGS4600 (managés, L3) | Interface web + **CLI** de style Cisco (`configure`, `vlan 20`, `fixed`/`untagged` dans le contexte VLAN sur les anciens modèles, `interface port-channel`) |
| Gamme Nebula (NSW) | Cloud Nebula |

```zyxel Commutateur managé (syntaxe ZyNOS « historique »)
configure
vlan 20
 name UTILISATEURS
 fixed 1-24,49
 untagged 1-24
 exit
interface port-channel 1-24
 pvid 20
 exit
write memory
```

## Nebula

**Nebula Control Center** gère dans le cloud pare-feu, commutateurs et points d'accès Zyxel (licences Base gratuites, Plus/Pro payantes) : organisations et sites, configuration par profils, VPN automatique entre sites, surveillance et mises à jour. Un équipement passé en mode Nebula n'est plus géré localement.

## Sécurité

> [!WARNING]
> Plusieurs vulnérabilités **critiques** des pare-feu Zyxel ont été massivement exploitées (injection de commandes sans authentification en 2023, comptes et identifiants exposés en 2024–2025, campagnes de rançongiciels visant les VPN). Appliquez les correctifs dès leur publication, n'exposez pas l'administration web/SSH sur Internet, et changez les mots de passe (y compris ceux des comptes VPN) après une mise à jour corrigeant une faille d'identifiants.

- [ ] Administration accessible seulement depuis le LAN/VPN d'administration (*System → WWW/SSH → Service Control*)
- [ ] VPN d'accès distant avec MFA (fonction intégrée ou RADIUS)
- [ ] Comptes administrateurs nominatifs, mots de passe forts ; comptes par défaut supprimés
- [ ] Journaux envoyés à un syslog/SIEM ; sauvegarde régulière de la configuration

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Trafic bloqué entre zones | Règle de politique absente ou ordre | *Policy Control*, journaux de sécurité |
| VPN IPsec non établi avec un autre constructeur | Propositions (chiffrement, DH), identifiants, NAT-T | Aligner phases 1 et 2, journaux VPN |
| Débit réduit | Services de sécurité actifs sur tout le trafic | Profils ciblés, modèle adapté au débit |
| Interface d'administration inaccessible | *Service Control* restreint | Accès par le LAN ou la console |
