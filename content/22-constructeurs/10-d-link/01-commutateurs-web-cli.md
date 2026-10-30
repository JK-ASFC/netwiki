---
title: Commutateurs D-Link — interface web, CLI et Nuclias
description: Commutateurs D-Link (DGS-1100 « smart », DGS-1210, DGS-1250/1510 « smart managed », DGS-3130/3630, DXS) — accès initial (adresse par défaut, utilitaire de découverte), interface web (VLAN 802.1Q, ports, LACP, STP, sécurité), deux familles de CLI (CLI historique « create vlan / config vlan » et CLI de style Cisco des gammes récentes), sécurisation, sauvegarde et mise à jour, gestion cloud Nuclias, dépannage.
tags: [d-link, dgs, commutateur, interface web, cli, nuclias, vlan]
icon: network
---

**D-Link** propose des commutateurs pour PME et réseaux d'accès : gammes **smart** (DGS-1100, DGS-1210 : principalement graphiques), **smart managed / managed** (DGS-1250, DGS-1510, DGS-3130, DGS-3630 : interface web + CLI complète), et la plateforme cloud **Nuclias**.

## Accès initial

| Élément | Valeur courante (à vérifier selon le modèle) |
| --- | --- |
| Adresse IP par défaut | `10.90.90.90/8` (beaucoup de modèles), ou DHCP |
| Identifiant | `admin` avec mot de passe défini au premier accès (anciens modèles : `admin` / vide ou `admin`) |
| Utilitaire | **D-Link Network Assistant** (DNA) : découvre les commutateurs smart sur le réseau, change l'IP, ouvre l'interface web |
| Console | Ports console RJ45 ou USB sur les modèles managés (115200 ou 9600 bauds selon la gamme) |

Placez un poste en `10.90.90.1/8` sur le même segment pour joindre un commutateur neuf, puis changez immédiatement l'adresse et le mot de passe.

## Interface web

| Menu (selon le modèle) | Usage |
| --- | --- |
| *System Settings* | IP, nom, date/heure (SNTP), comptes |
| **L2 Features → VLAN → 802.1Q VLAN** | Création des VLAN, ports *Tagged* / *Untagged* / *Not member*, PVID |
| *Link Aggregation* | Groupes statiques ou LACP |
| *Spanning Tree* | RSTP/MSTP, ports *Edge* |
| *Security* | Port Security, 802.1X, ACL, Safeguard Engine (protection CPU) |
| *Voice VLAN* / *Auto Surveillance VLAN* | Téléphonie, caméras |
| *Tools* | Mise à jour, sauvegarde/restauration de la configuration, diagnostic de câble |

> [!TIP]
> Sur les modèles smart, l'enregistrement est parfois **séparé** de l'application : penser à *Save → Save Configuration* (sinon la configuration est perdue au redémarrage).

## CLI : deux familles

### CLI historique (DES-3xxx, DGS-3xxx anciens, DGS-1210 en CLI limitée)

```dlink
create vlan UTILISATEURS tag 20
config vlan UTILISATEURS add untagged 1-44
config vlan UTILISATEURS add tagged 49-50
config vlan default delete 1-44
create ipif GESTION 10.0.99.13/24 ADMINISTRATION state enable
create iproute default 10.0.99.1
config link_aggregation algorithm ip_source_dest
create link_aggregation group_id 1 type lacp
config link_aggregation group_id 1 master_port 49 ports 49-50
enable ssh
disable telnet
show vlan
show ports
save
```

### CLI de style industriel (DGS-1250, DGS-1510, DGS-3130, DGS-3630, DXS)

Les gammes récentes utilisent une CLI proche de Cisco IOS :

```dlink
enable
configure terminal
vlan 20
 name UTILISATEURS
exit
interface range ethernet 1/0/1-44
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast edge
exit
interface ethernet 1/0/49
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,99
exit
interface vlan 99
 ip address 10.0.99.13 255.255.255.0
exit
ip route 0.0.0.0 0.0.0.0 10.0.99.1
username admin privilege 15 password 0 MotDePasseAdminTresLong
ip ssh server
no ip telnet server
end
copy running-config startup-config
```

Les noms d'interfaces (`ethernet 1/0/1`), certaines options et la syntaxe d'agrégation (`channel-group 1 mode active`) varient selon les modèles : consultez le guide CLI de la gamme.

## Sécurisation

- [ ] Mot de passe administrateur fort, comptes nominatifs si possible, **RADIUS/TACACS+** pour l'administration sur les gammes managées
- [ ] HTTPS et SSH ; HTTP et Telnet désactivés
- [ ] Gestion dans un VLAN dédié, **liste d'adresses de confiance** (*Trusted Host*)
- [ ] SNMPv3 ; communauté `public`/`private` supprimée
- [ ] Micrologiciel à jour (des vulnérabilités sont régulièrement publiées sur les équipements D-Link ; les modèles en fin de vie ne reçoivent plus de correctifs : à remplacer)

## Nuclias

**Nuclias** est la gamme gérée dans le cloud de D-Link (commutateurs DBS, points d'accès DBA, passerelles) : **Nuclias Cloud** (abonnement) ou **Nuclias Connect** (contrôleur logiciel ou matériel local pour les points d'accès). Configuration par profils et sites, surveillance, mises à jour centralisées.

## Sauvegarde, mise à jour, dépannage

| Besoin | Méthode |
| --- | --- |
| Sauvegarde | Web : *Tools → Configuration Backup*, ou TFTP/SFTP en CLI (`copy running-config tftp: //10.0.98.30/sw.cfg`) |
| Mise à jour | Web : *Tools → Firmware Upgrade*, deux images sur les modèles managés (`boot image`) |
| Câble | *Cable Diagnostics* (longueur, paires coupées) |
| Boucle | Fonction **Loopback Detection** (LBD) qui coupe le port en boucle |
| Journaux | *System Log*, syslog vers un serveur |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Commutateur injoignable | IP par défaut `10.90.90.90`, autre sous-réseau | Utilitaire DNA, poste dans le même réseau |
| Port dans deux VLAN non étiquetés | VLAN `default` conservé | Retirer le port du VLAN 1 (`config vlan default delete`) |
| Configuration perdue | Non enregistrée | `save` / *Save Configuration* |
