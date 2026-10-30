---
title: VPN, haute disponibilité, supervision et dépannage
description: Exploiter un pare-feu Stormshield SNS — VPN IPsec site à site (IKEv2, profils de chiffrement, PSK ou certificats, tunnels virtuels VTI), VPN d'accès distant (VPN SSL avec Stormshield VPN Client, IPsec IKEv2), haute disponibilité (cluster actif/passif, liens HA, synchronisation), journaux et supervision (Monitoring, syslog, SNMP), sécurisation de l'administration, commandes de diagnostic en console et problèmes fréquents.
tags: [stormshield, sns, vpn, ipsec, vpn ssl, haute disponibilité, supervision, dépannage]
icon: bug
---

## VPN IPsec site à site

Interface web : *Configuration → VPN → VPN IPsec* (assistant de création d'un tunnel site à site), avec :

| Élément | Recommandation |
| --- | --- |
| Version | **IKEv2** |
| Authentification | **Certificats** (PKI interne du pare-feu ou externe) de préférence ; clé pré-partagée longue sinon |
| Profils de chiffrement | Profils renforcés (AES-GCM, groupes DH 19/20/21) ; aligner avec le pair si autre constructeur |
| Topologie | Tunnels par politique (réseaux locaux/distants) ou **interfaces virtuelles IPsec (VTI)** pour router (statique, OSPF, BGP) dans les tunnels |
| Filtrage | Le trafic VPN passe par la politique de filtrage (règles avec l'interface/l'objet VPN) |

Profils conformes aux recommandations de l'ANSSI disponibles (le produit est qualifié). SMC génère automatiquement des topologies VPN (étoile, maillage) pour un parc ([[01-presentation-acces-administration|SMC]]).

## VPN d'accès distant

| Type | Client | Remarques |
| --- | --- | --- |
| **VPN SSL** (OpenVPN) | **Stormshield VPN Client** (ou client OpenVPN) | Le plus utilisé ; configuration poussée automatiquement au client, authentification annuaire + **MFA** (TOTP intégré ou RADIUS) |
| IPsec IKEv2 (mode config) | Stormshield VPN Client Exclusive / client natif | Pour les postes gérés, certificats |

Sur les versions récentes, l'authentification à deux facteurs TOTP est intégrée (*Configuration → Utilisateurs → Authentification*).

## Haute disponibilité

Deux pare-feu identiques forment un **cluster** actif/passif : *Configuration → Système → Haute disponibilité*.

| Élément | Recommandation |
| --- | --- |
| Liens HA | Un lien principal et un lien de secours **dédiés** (câble direct) |
| Synchronisation | Configuration et sessions (bascule transparente pour la plupart des connexions) |
| Critères de bascule | Qualité des interfaces surveillées (poids), défaillance du membre actif |
| Mises à jour | Membre passif d'abord, bascule, puis l'autre (procédure de la note « haute disponibilité ») |

## Supervision et journaux

| Outil | Usage |
| --- | --- |
| *Monitoring* (interface web) | Journaux d'alarmes, de connexions, de filtrage, d'authentification, de VPN ; supervision du système, des interfaces, de la QoS, des utilisateurs, des tunnels VPN, de la haute disponibilité |
| **Syslog** (TLS possible) | Envoi vers le SIEM (*Configuration → Notifications → Traces – Syslog*) |
| SNMP (v3) | Supervision externe ([[04-zabbix/01-presentation-installation\|Zabbix]], [[01-centreon/01-presentation\|Centreon]]) |
| Rapports | Rapports intégrés (menaces, utilisation) |
| Stormshield Log Supervisor (SLS) / SMC | Centralisation |

Les journaux peuvent contenir des données personnelles : SNS restreint par défaut l'affichage des identités (droit spécifique à accorder, conformité RGPD).

## Diagnostic en console

En SSH (compte `admin`), le pare-feu fournit des outils système et des commandes *serverd* :

| Besoin | Commande / outil |
| --- | --- |
| Tester la configuration et les règles | `sfctl -s filter` (règles actives), `sfctl -s conn` (connexions), filtres par adresse |
| Capture | `tcpdump -ni ethernet1 host 10.0.20.15` |
| Routage | `netstat -rn`, `routectl` |
| VPN IPsec | `ipsecinfo`, journaux VPN dans *Monitoring* ; `showSAD`/`showSPD` selon les versions |
| État du système | `sysinfo`, `top`, `uptime` |
| CLI serverd | `nsrpc -c "MONITOR SYSTEM" admin@localhost`, `nsrpc -c "CONFIG FILTER EXPLICIT index=9 type=filter" admin@localhost` |

(Les noms et options exacts varient selon la version de SNS : consulter le guide des commandes *serverd* et la base de connaissances Stormshield.)

## Sécurisation

- [ ] Version de SNS maintenue (branche LTSB pour la stabilité, ou la plus récente), avis de sécurité suivis
- [ ] Administration limitée au réseau d'administration (`CONFIG WEBADMIN ACCESS`), **SSH désactivé** s'il n'est pas utilisé
- [ ] Comptes administrateurs nominatifs, MFA, compte `admin` réservé à l'urgence
- [ ] VPN avec MFA, profils de chiffrement renforcés
- [ ] Sauvegardes automatiques chiffrées ; partition de secours à jour

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Changement CLI sans effet | `… ACTIVATE` oublié | Exécuter la commande d'activation de la section |
| `Command denied: no write access` | Un autre administrateur a la main en écriture | `MODIFY ON FORCE` |
| Trafic publié bloqué | Règle NAT présente mais pas de règle de filtrage, ou mauvaise destination | Ajouter la règle de filtrage, *Monitoring → Journaux de filtrage* |
| VPN IPsec non établi avec un autre constructeur | Profils de chiffrement, identifiants (ID locaux/distants), NAT-T | Aligner les propositions, journaux VPN |
| Clients VPN SSL ne récupèrent pas la configuration | Port 443/1194, certificat, accès au portail | Pare-feu amont, certificat valide |
| Bascule HA intempestive | Lien HA instable, interfaces surveillées | Câblage dédié, revoir les poids |
