---
title: Tableau de bord et configuration
description: Cisco Meraki, gamme gérée dans le cloud — principe (tableau de bord, licences par équipement, organisation, réseaux, modèles), mise en service (réclamation, page de gestion locale), pare-feu et SD-WAN MX (VLAN, règles L3/L7, NAT, Auto VPN, liens montants), commutateurs MS (ports, VLAN, ACL, 802.1X), Wi-Fi MR (SSID, authentification, VLAN), administrateurs et SAML, API et automatisation, journaux, dépannage depuis le tableau de bord.
tags: [cisco, meraki, cloud, sd-wan, auto vpn, tableau de bord, api]
icon: cloud
---

**Cisco Meraki** propose pare-feu/SD-WAN (**MX**), commutateurs (**MS**), Wi-Fi (**MR**), caméras (**MV**), capteurs (**MT**) et gestion des terminaux (**SM**), tous administrés depuis un **tableau de bord web** (*dashboard*) hébergé par Cisco. Il n'y a **pas de CLI de configuration** : tout se fait dans le tableau de bord ou par son **API**. Atout : déploiement très rapide de nombreux sites ; contrepartie : dépendance au cloud et aux **licences** (sans licence valide, les équipements cessent de fonctionner après la période de grâce).

## Organisation

| Niveau | Contenu |
| --- | --- |
| **Organisation** | Entreprise : licences, inventaire, administrateurs, paramètres globaux |
| **Réseau** | Un site (ou un usage) regroupant MX, MS, MR… |
| **Modèle de configuration** (*template*) | Configuration commune liée à de nombreux réseaux (agences identiques) |
| Étiquettes | Ciblage des réglages (ports, SSID) |

## Mise en service

1. **Réclamer** les équipements dans l'organisation (numéro de commande ou de série), les affecter à un réseau.
2. Les brancher sur un réseau avec DHCP et accès Internet sortant vers le cloud Meraki (HTTPS/443 et ports documentés, notamment UDP 7351 pour le tunnel de gestion).
3. L'équipement télécharge sa configuration et son micrologiciel.

**Page de gestion locale** (`http://setup.meraki.com` ou l'IP de l'équipement, identifiant = numéro de série) : configurer une IP fixe, un VLAN de gestion ou PPPoE quand il n'y a pas de DHCP — utile au premier branchement ou en cas de perte du cloud.

## MX : pare-feu et SD-WAN

| Menu (*Security & SD-WAN*) | Réglages |
| --- | --- |
| Addressing & VLANs | VLAN, sous-réseaux, DHCP, réservations |
| **Firewall** | Règles L3 sortantes, règles **L7** (catégories d'applications), NAT 1:1, redirections de ports, services exposés |
| **Site-to-site VPN** | **Auto VPN** : un clic par site (hub ou spoke) ; tunnels IPsec automatiques entre MX ; VPN vers des pairs tiers (non-Meraki) |
| SD-WAN & traffic shaping | Liens montants (2 WAN + cellulaire), choix du lien par application, seuils de performance (latence, perte, gigue) |
| Threat protection | IDS/IPS (Snort), filtrage de contenu, AMP (selon licence *Advanced Security*) |
| Client VPN | VPN d'accès distant (IPsec ou Secure Client selon les versions) |

## MS : commutateurs

*Switching → Switch ports* : sélection multiple de ports, type (accès/trunk), VLAN, VLAN voix, PoE, STP (BPDU Guard, Root Guard), étiquettes ; *ACL*, *Access policies* (802.1X/MAB avec RADIUS), *Routing & DHCP* (SVI sur MS de niveau 3), empilement physique ou virtuel. Les modifications sont poussées en quelques secondes vers tous les commutateurs concernés.

## MR : Wi-Fi

*Wireless → SSIDs* : authentification (WPA2/WPA3-Personnel, **WPA2/WPA3-Entreprise** avec RADIUS ou serveur Meraki, portail captif), affectation de VLAN (par SSID ou dynamique par RADIUS), limitations de débit, bandes et canaux automatiques (*Auto RF*), invités isolés (*NAT mode* ou VLAN invité).

## Administration

- Administrateurs au niveau organisation ou réseau, lecture seule ou complet ; **SAML** (Entra ID, Okta) pour le SSO et la MFA ; 2FA obligatoire.
- **Change log** (journal des modifications) : qui a changé quoi et quand.
- Mises à jour du micrologiciel planifiées par réseau (fenêtres de maintenance).

## API et automatisation

```bash
curl -s -H "Authorization: Bearer $MERAKI_API_KEY" https://api.meraki.com/api/v1/organizations | jq '.[].name'
curl -s -H "Authorization: Bearer $MERAKI_API_KEY" "https://api.meraki.com/api/v1/organizations/<orgId>/devices/statuses" | jq '.[] | select(.status != "online") | {name, serial, status}'
```

Bibliothèque Python officielle (`meraki`), fournisseur Terraform et collection Ansible (`cisco.meraki`) ; webhooks pour les alertes. Clés d'API liées à un administrateur : compte de service dédié, droits minimaux.

## Supervision et dépannage

| Outil du tableau de bord | Usage |
| --- | --- |
| *Network-wide → Clients* | Historique d'un client (connexions, applications, débit) |
| Outils en direct par équipement | Ping, traceroute, table ARP/MAC, test de câble, clignotement des LED, capture de paquets |
| *Event log* | Événements (authentifications 802.1X, DHCP, VPN, ports) |
| Alertes | Courriel, webhooks, SNMP/syslog vers la supervision interne |
| SNMP et syslog | Possibles vers les outils internes (lecture) |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Équipement « hors ligne » dans le tableau de bord | Accès sortant au cloud bloqué (pare-feu, proxy), DNS | Ports Meraki autorisés, page de gestion locale |
| Équipements arrêtés après une date | Licences expirées (après la période de grâce) | Renouveler les licences à temps, alertes de licence |
| Auto VPN non établi | Problème de NAT (le MX derrière un autre routeur), *uplink* | Ports UDP, adresse publique manuelle, mode NAT traversal |
| Port de commutateur sans réseau | Modèle ou étiquette qui écrase la configuration locale | Vérifier les liaisons au modèle |

Pour les équipements Cisco administrés en CLI, voir [[02-cisco-ios-bases/01-cli-fondamentaux|IOS / IOS XE]].
