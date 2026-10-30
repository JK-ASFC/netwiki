---
title: UniFi Network — consoles, réseau et Wi-Fi
description: Écosystème Ubiquiti UniFi — consoles UniFi OS (Cloud Gateway, UDM, Cloud Key, serveur auto-hébergé), application UniFi Network, adoption (couche 2, set-inform en SSH, option DHCP 43, DNS unifi), réseaux et VLAN, profils de ports des commutateurs, Wi-Fi (SSID, WPA3, VLAN, RADIUS), pare-feu et zones, VPN (site à site, WireGuard, Teleport), comptes et accès distant, sauvegardes, SSH et commandes des équipements, dépannage.
tags: [ubiquiti, unifi, unifi network, udm, set-inform, wi-fi, vlan, pare-feu]
icon: radio-tower
---

**UniFi** (Ubiquiti) regroupe passerelles, commutateurs, points d'accès Wi-Fi, caméras (Protect) et contrôle d'accès, gérés par l'application **UniFi Network** qui tourne sur une **console UniFi OS**. Très répandu dans les PME, l'hôtellerie, l'enseignement.

## Consoles

| Console | Remarques |
| --- | --- |
| **Cloud Gateway** (UCG Ultra/Max/Fiber), **Dream Machine** (UDM Pro/SE), UDR | Passerelle + contrôleur intégré |
| Cloud Key (UCK G2) | Contrôleur seul |
| UniFi OS Server / application auto-hébergée | Logiciel sur serveur Linux ou Windows (et conteneurs) |
| Hébergement cloud (UniFi Cloud Hosting) | Contrôleur hébergé par Ubiquiti |

L'accès se fait par `https://<console>` (local) ou `unifi.ui.com` (**accès distant** via le compte Ubiquiti, à protéger par MFA, ou désactivé au profit d'un VPN).

## Adoption des équipements

Les équipements doivent connaître l'adresse du contrôleur (*inform*, TCP **8080**) :

| Méthode | Usage |
| --- | --- |
| Même réseau de niveau 2 | Découverte automatique |
| **SSH** + `set-inform` | Équipement sur un autre réseau |
| Option **DHCP 43** | Adresse du contrôleur fournie par DHCP |
| DNS `unifi` | Le nom `unifi` résolu vers le contrôleur |

```bash
ssh ubnt@192.168.1.20                 # identifiants par défaut ubnt/ubnt sur un équipement non adopté
set-inform http://10.0.99.30:8080/inform
info                                  # état, version, adresse d'inform
```

Après adoption, les identifiants SSH des équipements sont ceux définis dans *Settings → System → Device SSH Authentication* (mot de passe ou clé, à définir).

## Réseaux et commutation

| Élément (*Settings*) | Réglages |
| --- | --- |
| **Networks** | Réseau = VLAN + sous-réseau + DHCP (ou VLAN seul si la passerelle n'est pas UniFi) ; isolation des réseaux |
| Profils de ports (*Ports*) | VLAN natif et VLAN étiquetés (*Allow All*, *Block All*, liste), PoE, STP, LAG, port mirroring, 802.1X |
| Internet (WAN) | DHCP, IP fixe, PPPoE, VLAN opérateur, basculement/répartition multi-WAN |

## Wi-Fi

SSID avec **WPA2/WPA3-Personnel** ou **Entreprise** (RADIUS interne ou externe, VLAN dynamique), réseau invité (portail, isolation), bandes, puissance et canaux (*Wi-Fi AI*), roaming rapide, limitation de débit, PPSK (plusieurs clés sur un SSID, chacune liée à un VLAN).

## Pare-feu et VPN

- **Pare-feu par zones** (versions récentes de UniFi Network) : zones *Internal*, *External*, *Gateway*, *VPN*, *Hotspot*, *DMZ* ou personnalisées, règles entre zones ; anciennes versions : règles *LAN In / WAN In*.
- Redirections de ports, IPS/IDS (selon la console), filtrage de contenu et de pays.
- VPN : **site à site** (Site Magic entre passerelles UniFi, IPsec vers tiers, OpenVPN), **serveur VPN** (WireGuard, L2TP, OpenVPN), **Teleport** (accès simplifié via le cloud).

## Sécurité

- [ ] Compte propriétaire Ubiquiti avec **MFA** ; comptes administrateurs locaux et rôles limités
- [ ] Accès distant désactivé si un VPN d'administration existe
- [ ] Mises à jour régulières des consoles, de l'application Network et des équipements (des vulnérabilités critiques ont été corrigées dans UniFi Network et UniFi OS)
- [ ] Mot de passe SSH des équipements défini et unique ; SSH désactivé si inutile
- [ ] Réseau de gestion séparé des réseaux utilisateurs

## Sauvegarde

*Settings → System → Backups* : sauvegardes automatiques (planification, rétention, export vers le cloud). Une sauvegarde `.unf` restaurée sur une nouvelle console récupère toute la configuration ; les équipements doivent ensuite joindre la nouvelle adresse d'*inform*.

## Commandes utiles sur les équipements (SSH)

| Équipement | Commandes |
| --- | --- |
| Point d'accès / commutateur | `info`, `set-inform …`, `syswrapper.sh restore-default` (réinitialisation), `mca-cli` puis `info` |
| Commutateur | `telnet localhost` (CLI interne de type Cisco/Broadcom sur certains modèles) : `show interfaces status`, `show mac-addr-table` |
| Console UniFi OS | Shell Linux : journaux dans `/var/log`, `unifi-os` |

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Équipement « Adopting » en boucle | Inform injoignable (8080 filtré), identifiants SSH différents | `set-inform`, pare-feu, réinitialisation |
| Point d'accès en *Isolated* | Lien filaire perdu (réseau maillé) | Câble, PoE, VLAN de gestion |
| Clients sans adresse dans un VLAN | Profil de port sans le VLAN, DHCP absent | Profil de port, réseau (DHCP) |
| Accès distant impossible | Compte ou accès distant désactivé | Activer, ou VPN |

Pour les routeurs EdgeRouter en ligne de commande, voir [[02-edgerouter-uisp|EdgeRouter et UISP]].
