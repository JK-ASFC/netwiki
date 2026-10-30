---
title: Panorama, haute disponibilité et dépannage
description: Exploiter des pare-feu Palo Alto — Panorama et Strata Cloud Manager (groupes d'équipements, piles de modèles, push), haute disponibilité actif/passif et actif/actif (liens HA1/HA2, surveillance des liens et chemins), journaux (Monitor, ACC, transfert syslog, Cortex Data Lake / Strata Logging Service), commandes de dépannage CLI (test security-policy-match, sessions, compteurs globaux, captures, flow basic), problèmes fréquents.
tags: [palo alto, panorama, ha, journaux, dépannage, cli, test security-policy-match]
icon: bug
---

## Panorama et Strata Cloud Manager

**Panorama** (appliance ou VM) gère de façon centralisée un parc de pare-feu :

| Notion | Rôle |
| --- | --- |
| **Device groups** | Politiques et objets (règles *pre* et *post* qui encadrent les règles locales), hiérarchie |
| **Templates / template stacks** | Configuration réseau et système (interfaces, zones, routage, paramètres) |
| Commit et **push** | Valider dans Panorama puis pousser vers les équipements |
| Journaux | Collecte centralisée (Log Collectors) |
| Mises à jour | Logiciels et contenus pour tout le parc |

**Strata Cloud Manager** (cloud) est l'évolution proposée par Palo Alto pour la gestion des NGFW et de Prisma Access.

## Haute disponibilité

| Mode | Usage |
| --- | --- |
| **Actif/passif** | Recommandé dans la plupart des cas |
| Actif/actif | Routage asymétrique, centres de données complexes |
| Clustering (PAN-OS 11+) | Plusieurs pare-feu sur les modèles haut de gamme |

| Lien | Rôle |
| --- | --- |
| **HA1** | Plan de contrôle : battements de cœur, synchronisation de configuration (doublé par HA1 backup) |
| **HA2** | Synchronisation des sessions |
| Surveillance | *Link monitoring* (interfaces) et *path monitoring* (joignabilité d'adresses) déclenchent la bascule |

```panos
show high-availability state
show high-availability all
# mettre l'unité en suspension (maintenance)
request high-availability state suspend
request high-availability state functional
request high-availability sync-to-remote running-config
```

Mise à jour d'un cluster : unité passive d'abord, bascule, puis l'autre ; contenus dynamiques synchronisés.

## Journaux

| Outil | Usage |
| --- | --- |
| **Monitor → Logs** | Trafic, menaces, URL, WildFire, authentification, User-ID, GlobalProtect, système, configuration |
| **ACC** (*Application Command Center*) | Vue synthétique : applications, utilisateurs, menaces |
| Filtres | Syntaxe `( addr.src in 10.0.20.15 ) and ( action eq deny )` |
| Transfert | Profils de transfert de journaux : syslog (SIEM), courriel, HTTP ; Strata Logging Service (ex-Cortex Data Lake) |

## Dépannage en CLI

```panos
# Quelle règle de sécurité s'applique ?
test security-policy-match from TRUST to UNTRUST source 10.0.20.15 destination 8.8.8.8 protocol 6 destination-port 443 application ssl
# Quelle règle de NAT ?
test nat-policy-match from TRUST to UNTRUST source 10.0.20.15 destination 8.8.8.8 protocol 6 destination-port 443
# Route utilisée
test routing fib-lookup virtual-router default ip 10.60.1.10
show routing route
# Sessions
show session all filter source 10.0.20.15
show session id 123456
# Compteurs de rejets
show counter global filter delta yes severity drop
# Ressources
show system resources
show running resource-monitor
# Interfaces
show interface ethernet1/1
# VPN
show vpn ike-sa
show vpn ipsec-sa
test vpn ike-sa gateway GW-LYON
test vpn ipsec-sa tunnel TUN-LYON
```

### Capture de paquets

*Monitor → Packet Capture* (ou CLI `debug dataplane packet-diag`) : définir des **filtres** (adresses, ports), puis des **étapes** de capture (*receive*, *firewall*, *transmit*, *drop*). Les fichiers sont téléchargeables pour [[02-reseau-diagnostic/02-wireshark-analyse|Wireshark]].

```panos
debug dataplane packet-diag set filter match source 10.0.20.15 destination 8.8.8.8
debug dataplane packet-diag set filter on
debug dataplane packet-diag set capture stage drop file drop.pcap
debug dataplane packet-diag set capture on
# … reproduire …
debug dataplane packet-diag set capture off
debug dataplane packet-diag set filter off
debug dataplane packet-diag clear all
```

## Sécurisation

- [ ] PAN-OS sur une version préférée et **à jour** (vulnérabilités critiques exploitées sur GlobalProtect et l'interface de gestion en 2024–2025)
- [ ] **Interface de gestion jamais exposée sur Internet** ; `permitted-ip` restreint, profils de gestion d'interface minimaux
- [ ] Comptes nominatifs, MFA, journal des configurations (*Monitor → Logs → Configuration*)
- [ ] Contenus dynamiques planifiés, groupes de profils sur toutes les règles autorisantes
- [ ] Bonnes pratiques vérifiées avec le **Best Practice Assessment** (BPA) / outils d'analyse de Palo Alto

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Changements sans effet | `commit` oublié | Commit (et push depuis Panorama) |
| Application bloquée alors que le port est ouvert | Règle par application, `application-default`, application non identifiée (`incomplete`, `insufficient-data`) | Journaux de trafic, App-ID, `test security-policy-match` |
| Serveur publié injoignable | Zones de la règle NAT/sécurité inversées | Voir la logique NAT (zone pré-NAT, adresse pré-NAT) |
| Utilisateurs inconnus dans les journaux | User-ID non alimenté (agent, droits de lecture du journal sécurité) | `show user ip-user-mapping all`, compte de service |
| Tunnel IPsec monté, pas de trafic | Proxy-ID, route, règle de sécurité vers la zone VPN | `show vpn ipsec-sa`, compteurs |
| Désynchronisation HA | Contenus ou versions différents | Aligner versions et contenus, `sync-to-remote` |
