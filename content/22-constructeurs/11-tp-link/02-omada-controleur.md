---
title: Omada — contrôleur et gestion centralisée
description: Plateforme TP-Link Omada (SDN) — contrôleur logiciel (Windows, Linux, Docker), matériel (OC200, OC300) ou cloud (Omada Central), sites, adoption des équipements, passerelles Omada (WAN, VLAN, DHCP, pare-feu, VPN site à site et client), commutateurs (profils de ports, LAG, ACL), points d'accès (SSID, VLAN, portail, roaming), comptes et MFA, sauvegarde, mises à jour, ports réseau et dépannage.
tags: [tp-link, omada, contrôleur, sdn, wi-fi, vpn, docker]
icon: cloud
---

**Omada** est la gestion centralisée de TP-Link pour les **passerelles** (ER605, ER707, ER8411…), **commutateurs** et **points d'accès** Wi-Fi : une interface unique, des **profils** et des **sites**. Alternative économique à [[12-ubiquiti/01-unifi|UniFi]] ou [[26-cisco-meraki/01-tableau-de-bord-configuration|Meraki]].

## Contrôleur : trois options

| Option | Usage |
| --- | --- |
| **Logiciel** (*Omada Software Controller*) | Gratuit : Windows, Linux (Debian/Ubuntu, Java + MongoDB), conteneur Docker ; serveur interne ou VM |
| **Matériel** (OC200, OC300) | Boîtier dédié dans la baie, petits sites |
| **Cloud** (*Omada Central* / Cloud-Based Controller) | Hébergé par TP-Link, abonnement par équipement |

```yaml compose.yaml (contrôleur logiciel, image communautaire largement utilisée)
services:
  omada:
    image: mbentley/omada-controller:5.15      # épingler une version
    network_mode: host                          # découverte des équipements sur le réseau local
    environment:
      TZ: Europe/Paris
      MANAGE_HTTPS_PORT: "8043"
      PORTAL_HTTPS_PORT: "8843"
    volumes:
      - ./data:/opt/tplink/EAPController/data
      - ./logs:/opt/tplink/EAPController/logs
    restart: unless-stopped
```

| Port | Usage |
| --- | --- |
| **8043/TCP** | Interface de gestion HTTPS |
| 8843/TCP | Portail captif HTTPS |
| 29810–29816 (UDP/TCP selon version) | Découverte, adoption et gestion des équipements |

Si le contrôleur est sur un autre réseau que les équipements, indiquer son adresse aux équipements par **option DHCP 138**, l'utilitaire de découverte, ou la configuration manuelle (*Controller Inform URL*).

## Organisation

1. Créer un **site** par lieu (fuseau horaire, pays pour le Wi-Fi).
2. **Adopter** les équipements (état *Pending*), qui reçoivent la configuration du site.
3. Définir les **réseaux** (*LAN* : VLAN, sous-réseau, DHCP) et les **profils** de ports.

| Domaine | Réglages |
| --- | --- |
| Passerelle | WAN (DHCP, IP fixe, PPPoE, VLAN opérateur), répartition/basculement multi-WAN, NAT et redirections, **ACL** de passerelle, VPN IPsec site à site (y compris vers d'autres constructeurs), VPN client (L2TP/IPsec, OpenVPN, WireGuard selon modèles) |
| Commutateurs | **Profils de ports** (VLAN natif, VLAN étiquetés), LAG, STP, ACL, 802.1X, IGMP snooping, PoE |
| Wi-Fi | SSID (WPA2/WPA3-Personnel ou Entreprise avec RADIUS), VLAN par SSID, portail captif, limites de débit, roaming rapide (802.11k/v/r), optimisation des canaux |
| Réseau maillé | Points d'accès en maillage sans fil |

## Comptes et sécurité

- [ ] Comptes administrateurs nominatifs avec rôles, **2FA**
- [ ] Interface 8043 accessible seulement depuis le réseau d'administration (ou cloud avec MFA)
- [ ] Contrôleur et micrologiciels à jour (fonction de mise à jour planifiée)
- [ ] Mot de passe de gestion des équipements (*Device Account*) défini et unique par site
- [ ] Wi-Fi invité isolé (VLAN et règles), WPA3 lorsque les clients le permettent

## Sauvegarde et migration

*Settings → Maintenance → Backup & Restore* : sauvegarde du contrôleur (planifiable) — indispensable avant une mise à jour majeure. Pour changer de contrôleur (logiciel → OC300, ou vers le cloud), restaurer la sauvegarde sur le nouveau, puis faire pointer les équipements vers lui (*Migrate Site*).

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Équipements en *Disconnected* / *Heartbeat Missed* | Ports 29810+ filtrés, contrôleur injoignable, DNS | Pare-feu, option DHCP 138, adresse d'*inform* |
| Adoption impossible | Équipement géré par un autre contrôleur ou mot de passe différent | Réinitialiser l'équipement ou saisir ses identifiants |
| Configuration non appliquée | Profil de port prioritaire, version incompatible | Revoir le profil, mettre à jour le micrologiciel |
| Contrôleur Docker sans découverte | Réseau en pont | `network_mode: host` ou ports publiés + option 138 |
