---
title: Check Point — Gaia, SmartConsole et dépannage
description: Pare-feu Check Point (Quantum, CloudGuard) — architecture à trois niveaux (passerelle, serveur de management, SmartConsole), déploiements standalone et distribué, Gaia Portal et assistant de première configuration, CLI clish et mode expert, objets et couches de politique, publication et installation de la politique, lames logicielles (IPS, Application Control, URL Filtering, Threat Prevention, Identity Awareness), NAT automatique et manuel, VPN (communautés, Remote Access), ClusterXL, API de management (mgmt_cli) et commandes de diagnostic (fw ctl zdebug, fw monitor, cpview, cphaprob).
tags: [check point, gaia, smartconsole, clish, clusterxl, mgmt_cli, pare-feu, dépannage]
icon: shield
---

**Check Point** sépare clairement **trois composants** : la **passerelle de sécurité** (*Security Gateway*, qui filtre), le **serveur de management** (*Security Management Server*, qui stocke politiques, objets et journaux) et la console Windows **SmartConsole** (où l'on administre). Le système d'exploitation des appliances **Quantum** et des machines virtuelles est **Gaia**.

## Déploiements

| Déploiement | Usage |
| --- | --- |
| **Distribué** | Serveur de management dédié (ou appliance Smart-1) pilotant plusieurs passerelles — recommandé |
| Standalone | Passerelle et management sur la même machine (petits sites, laboratoires) |
| Multi-Domain (MDS) | Plusieurs domaines d'administration (fournisseurs de services, grands groupes) |
| **Smart-1 Cloud** / Infinity Portal | Management hébergé par Check Point |
| Quantum Spark | Petites appliances avec interface web locale autonome |

## Gaia : interface web et clish

Après installation, l'**assistant de première configuration** (*First Time Configuration Wizard*) dans le **Gaia Portal** (`https://<adresse>`) définit l'adressage, le rôle (passerelle, management, les deux) et la clé SIC (*Secure Internal Communication*) qui servira à établir la confiance entre passerelle et management.

La CLI de Gaia, **clish**, porte la configuration du système (pas la politique de sécurité) :

```clish
set hostname FW-PARIS
set interface eth1 ipv4-address 10.0.20.254 mask-length 24
set interface eth1 state on
add interface eth2 vlan 30
set interface eth2.30 ipv4-address 10.0.30.254 mask-length 24
set static-route default nexthop gateway address 203.0.113.1 on
set dns primary 10.0.10.53
set ntp server primary 10.0.10.123 version 4
set ntp active on
add user jdupont uid 2001 homedir /home/jdupont
set user jdupont password
add rba user jdupont roles adminRole
save config
show configuration
```

| Commande | Effet |
| --- | --- |
| `save config` | Rendre la configuration Gaia persistante (sinon perdue au redémarrage) |
| `show configuration` | Configuration complète au format clish |
| `expert` | Passer en **mode expert** (bash), protégé par un mot de passe dédié (`set expert-password`) |
| `clish` | Revenir à clish depuis le mode expert |

## SmartConsole : objets et politique

Dans SmartConsole (connectée au serveur de management) :

1. Créer les **objets** (hôtes, réseaux, groupes, objets de passerelle).
2. Écrire les règles de la **couche d'accès** (*Access Control*, couches *Network* et *Applications & URL Filtering*) et de **Threat Prevention** (IPS, anti-bot, antivirus, Threat Emulation/Extraction).
3. **Publier** la session (les modifications deviennent visibles pour les autres administrateurs et figées dans une révision).
4. **Installer la politique** sur les passerelles cibles.

| Notion | Explication |
| --- | --- |
| Règle de nettoyage | Dernière règle « Any → Any : Drop » journalisée |
| Règle furtive (*stealth*) | Bloque tout accès direct à la passerelle, sauf l'administration autorisée plus haut |
| **NAT automatique** | Défini dans l'objet (onglet NAT : *Hide* ou *Static*) ; NAT manuel dans la table NAT pour les cas particuliers |
| Identity Awareness | Règles par utilisateurs/groupes AD (collecte AD Query, Identity Collector, portail captif) |
| Révisions | Historique des sessions publiées, retour à une révision précédente |

## VPN et ClusterXL

- **VPN site à site** : communautés *Star* ou *Meshed* regroupant les passerelles ; pairs tiers déclarés comme *Interoperable Device* ; VPN par domaines de chiffrement ou par routes (VTI).
- **Remote Access** : client **Harmony Endpoint / Endpoint Security VPN**, Mobile Access (portail SSL).
- **ClusterXL** : grappe de passerelles (mode *High Availability* ou *Load Sharing*), adresses virtuelles, synchronisation des états sur un lien dédié.

## API de management

L'API (web ou `mgmt_cli` en mode expert) permet d'automatiser objets et règles :

```bash
mgmt_cli login user admin > id.txt
mgmt_cli add host name SRV-WEB ip-address 10.0.30.10 -s id.txt
mgmt_cli add access-rule layer "Network" position top name "LAN vers web" source "NET-LAN" destination "SRV-WEB" service "https" action "Accept" track.type "Log" -s id.txt
mgmt_cli publish -s id.txt
mgmt_cli install-policy policy-package "Standard" targets.1 "FW-PARIS" -s id.txt
mgmt_cli logout -s id.txt
```

## Commandes de diagnostic (mode expert)

```bash
fw stat                                  # politique installée
cpstat fw                                # état et statistiques du pare-feu
cpview                                   # tableau de bord en mode texte (CPU, mémoire, connexions)
fw ctl zdebug + drop | grep 10.0.20.15   # paquets rejetés par le noyau et raison (à utiliser brièvement)
fw monitor -F "10.0.20.15,0,0,0,0"       # capture aux points d'inspection (i, I, o, O)
fw tab -t connections -s                 # taille de la table des connexions
fwaccel stat                             # état de l'accélération SecureXL
cphaprob state                           # état du cluster ClusterXL
cphaprob -a if                           # interfaces surveillées par le cluster
vpn tu                                   # utilitaire de gestion des tunnels (lister, supprimer des SA)
cplic print                              # licences
cpinfo                                   # collecte pour le support
```

Les journaux se consultent dans SmartConsole (*Logs & Monitor*), avec SmartEvent pour la corrélation.

## Sécurisation et problèmes fréquents

- [ ] Version Gaia et *Jumbo Hotfix Accumulator* à jour (CPUSE, *Software Updates* dans le Gaia Portal)
- [ ] Accès au Gaia Portal, SSH et SmartConsole restreints (*allowed clients*, règle furtive)
- [ ] Administrateurs nominatifs avec profils de droits, MFA
- [ ] Remote Access et Mobile Access à jour (vulnérabilités exploitées en 2024)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Modification sans effet | Session non publiée ou politique non installée | *Publish* puis *Install Policy* |
| Échec de communication passerelle/management | SIC rompue, horloges désynchronisées | Réinitialiser la SIC (`cpconfig`), NTP |
| Configuration Gaia perdue après redémarrage | `save config` oublié | Refaire et sauvegarder |
| Trafic rejeté sans règle visible | Anti-usurpation (*anti-spoofing*), IPS, SecureXL | `fw ctl zdebug + drop`, topologie des interfaces |
