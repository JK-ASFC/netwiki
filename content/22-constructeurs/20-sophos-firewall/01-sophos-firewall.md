---
title: Sophos Firewall (SFOS) — interface web, console et Sophos Central
description: Pare-feu Sophos Firewall (appliances XGS, virtuelles et cloud, SFOS ex-XG) — accès (console d'administration web sur le port 4444, assistant initial, console série), zones et interfaces, règles de pare-feu et règles NAT séparées, protection (IPS, filtrage web, contrôle applicatif, inspection TLS, sandbox Zero-day), Synchronized Security avec Intercept X, VPN (IPsec, Sophos Connect, SSL, RED, ZTNA), SD-WAN, haute disponibilité, gestion centralisée dans Sophos Central, console CLI (menu, Device Console, shell avancé), sécurisation et dépannage.
tags: [sophos, sfos, xgs, pare-feu, sophos central, sophos connect, cli, dépannage]
icon: shield
---

**Sophos Firewall** (système **SFOS**, issu des gammes Cyberoam puis XG) équipe les appliances **XGS**, des machines virtuelles (VMware, Hyper-V, KVM) et des instances cloud (AWS, Azure). Il s'administre par une **console web** locale, se gère à grande échelle dans **Sophos Central** et dispose d'une **console CLI** à menus pour l'initialisation et le dépannage. Son point fort est l'intégration avec les postes **Sophos Intercept X** (*Synchronized Security*).

## Accès

| Accès | Paramètres |
| --- | --- |
| Console web d'administration | `https://172.16.16.16:4444` sur le port LAN par défaut ; assistant initial (mot de passe administrateur, enregistrement, licences) |
| Portail utilisateur | Port 443 (VPN, quarantaine, téléchargement de Sophos Connect) — à ne pas exposer inutilement |
| Console série / SSH | Menu d'administration (compte `admin`) ; vitesse série selon le modèle (souvent 38400 ou 115200 bauds) |

## Concepts de configuration

| Élément | Menu web | Remarques |
| --- | --- | --- |
| **Zones** | *Network → Zones* | LAN, WAN, DMZ, VPN, WiFi + zones personnalisées ; services d'administration autorisés par zone (*Administration → Device access*) |
| Interfaces, VLAN, ponts, agrégats | *Network → Interfaces* | Sous-interfaces VLAN sur un port en trunk |
| **Règles de pare-feu** | *Rules and policies → Firewall rules* | Zones et réseaux source/destination, services, utilisateurs ; profils de protection attachés à la règle |
| **Règles NAT** | *Rules and policies → NAT rules* | Séparées des règles de pare-feu (SNAT, DNAT, *linked NAT* créé depuis une règle) |
| Objets | *Hosts and services* | Hôtes, réseaux, groupes, FQDN, services |
| SD-WAN | *Routing → SD-WAN routes / profiles* | Sélection de lien selon la qualité (latence, gigue, pertes) |

L'ordre des règles est **descendant, première correspondance** ; les groupes de règles facilitent la lecture.

## Protection

| Fonction | Usage |
| --- | --- |
| IPS | Politiques d'intrusion par règle |
| Web | Politiques de filtrage (catégories, quotas, mots-clés), proxy ou mode DPI |
| Contrôle applicatif | Applications et catégories |
| **Inspection TLS** | Règles de déchiffrement (*Rules and policies → SSL/TLS inspection rules*) avec un certificat d'AC déployé sur les postes |
| Zero-day protection | Analyse en bac à sable cloud des fichiers inconnus |
| **Synchronized Security** | L'état (*Security Heartbeat*) des postes Intercept X permet d'isoler automatiquement un poste compromis |
| Active Threat Response | Blocage à partir des flux de menaces (Sophos MDR, tiers) |

## VPN et accès distant

| Type | Remarques |
| --- | --- |
| IPsec site à site | IKEv2, connexions basées sur les routes (interfaces `xfrm`) ou les politiques |
| **Sophos Connect** | Client d'accès distant IPsec ou SSL, configuration provisionnée depuis le portail utilisateur |
| SSL VPN | OpenVPN |
| RED / SD-RED | Boîtiers de site distant reliés en tunnel |
| ZTNA | Accès applicatif « zero trust » via Sophos Central |

Authentification des utilisateurs : AD/LDAP, RADIUS, Entra ID (SAML pour le portail), **MFA** (OTP intégré).

## Haute disponibilité

*System services → High availability* : actif/passif (recommandé) ou actif/actif, liens HA dédiés, synchronisation des sessions ; les deux appliances doivent avoir le même modèle et la même version.

## Sophos Central

**Sophos Central** (console cloud) apporte la gestion centralisée du parc : groupes de pare-feu et modèles de configuration, **mises à jour planifiées** du firmware, sauvegardes, rapports (Central Firewall Reporting), déploiement « zero-touch », corrélation avec les postes et l'offre MDR.

## Console CLI

En SSH ou en console, le compte `admin` arrive sur un **menu** :

| Option | Usage |
| --- | --- |
| 1. Network Configuration | Adresses des interfaces (récupération d'accès) |
| 2. System Configuration | Mot de passe, réinitialisations, journaux |
| 3. Route Configuration | Routage |
| **4. Device Console** | CLI SFOS (`show`, `set`, `system`, outils de diagnostic) |
| **5. Device Management** | Réinitialisation, **Advanced Shell** (shell Linux pour le support) |
| 6. VPN Management | Gestion VPN |
| 7. Shutdown/Reboot | |

```sophos
console> system diagnostics show cpu
console> system diagnostics utilities ping 8.8.8.8
console> system diagnostics utilities traceroute 8.8.8.8
console> system ha show details
console> show advanced-firewall
console> tcpdump 'host 10.0.20.15 and port 443'
console> drop-packet-capture 'host 10.0.20.15'
```

`drop-packet-capture` montre les paquets **rejetés** et la raison (règle, anti-usurpation, etc.) : c'est l'outil de base pour comprendre un blocage. Dans l'interface web, l'équivalent est *Diagnostics → Packet capture* et *Log viewer* (filtres par règle, utilisateur, adresse).

## Sauvegarde et mises à jour

*Backup & firmware → Backup & restore* (planifiée, chiffrée, vers un serveur FTP/courriel ou Sophos Central) ; *Firmware* pour installer les nouvelles versions (deux emplacements de firmware : retour arrière possible). Les **correctifs à chaud** (*hotfixes*) sont appliqués automatiquement si l'option est active — à laisser activée.

## Sécurisation

- [ ] Console d'administration (4444) et SSH **jamais ouverts sur la zone WAN** ; restreindre par zone et par adresses sources (*Device access*, *Local service ACL exception*)
- [ ] Portail utilisateur et VPN non exposés sans nécessité ; MFA activée
- [ ] Firmware à jour et hotfixes automatiques (vulnérabilités exploitées massivement par le passé, campagnes « Pacific Rim »)
- [ ] Comptes administrateurs nominatifs avec profils de droits, journalisation envoyée au SIEM (syslog)

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Trafic bloqué sans journal | Rejet hors règles (anti-usurpation, MTU, zone) | `drop-packet-capture`, *Log viewer* |
| Serveur publié injoignable | Règle NAT présente mais pas de règle de pare-feu (ou l'inverse) | Créer les deux (*linked NAT* depuis la règle) |
| Sites HTTPS cassés après activation de l'inspection TLS | Certificat d'AC non déployé, applications à épinglage de certificat | Déployer l'AC, exclusions |
| Heartbeat « rouge » non remonté | Poste non géré par la même instance Sophos Central | Vérifier l'enregistrement du pare-feu et des postes |
