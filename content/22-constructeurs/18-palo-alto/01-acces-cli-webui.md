---
title: Accès, CLI PAN-OS et interface web
description: Pare-feu Palo Alto Networks (PA-400 à PA-7000, VM-Series, CN-Series) sous PAN-OS — accès (port de gestion MGT, 192.168.1.1, console 9600), interface web et principe de la configuration candidate validée par commit, CLI (modes opérationnel et configuration, set/delete/show, formats set et XML), configuration initiale sécurisée (profil de gestion, administrateurs, DNS, NTP, mises à jour de contenu), interfaces (couche 3, sous-interfaces, zones), routeur virtuel, sauvegarde et mises à jour.
tags: [palo alto, pan-os, ngfw, cli, commit, webui, zones, interfaces]
icon: terminal
---

**Palo Alto Networks** a popularisé le pare-feu **nouvelle génération** : identification des **applications** (App-ID) et des **utilisateurs** (User-ID) indépendamment des ports, inspection des menaces, filtrage d'URL. Le système **PAN-OS** se gère par l'**interface web**, la **CLI**, l'**API XML/REST**, ou centralement par **Panorama** / **Strata Cloud Manager**.

## Accès

| Accès | Paramètres |
| --- | --- |
| Port **MGT** (plan de gestion séparé) | `https://192.168.1.1` par défaut ; compte `admin` (changement du mot de passe imposé) |
| Console | **9600 bauds, 8N1** |
| SSH | Sur l'interface de gestion |

## Configuration candidate et commit

Toutes les modifications (web ou CLI) s'appliquent à une configuration **candidate** ; rien n'est actif tant qu'on n'a pas fait **`commit`**. Cela permet de préparer et relire un ensemble cohérent de changements, puis de revenir en arrière (*Revert*, configurations précédentes enregistrées).

## CLI

```panos
admin@PA-PARIS> show system info                      # mode opérationnel (>)
admin@PA-PARIS> configure
admin@PA-PARIS# set deviceconfig system hostname PA-PARIS
admin@PA-PARIS# show deviceconfig system
admin@PA-PARIS# commit description "Nom du pare-feu"
admin@PA-PARIS# exit
admin@PA-PARIS> set cli config-output-format set       # afficher la configuration en commandes « set »
admin@PA-PARIS> configure
admin@PA-PARIS# show network interface
```

| Commande | Effet |
| --- | --- |
| `configure` / `exit` | Entrer / quitter le mode configuration (`#`) |
| `set …` / `delete …` | Ajouter / supprimer |
| `show …` (mode configuration) | Configuration candidate |
| `run <commande>` | Commande opérationnelle depuis le mode configuration |
| `commit` / `validate full` | Appliquer / vérifier sans appliquer |
| `revert config` (récent) / `load config last-saved` | Annuler les changements non validés |
| `show config diff` | Différences candidate / active |
| `find command keyword <mot>` | Trouver une commande |
| `set cli pager off` | Désactiver la pagination |

## Configuration initiale

```panos
configure
set deviceconfig system ip-address 10.0.99.5 netmask 255.255.255.0 default-gateway 10.0.99.1
set deviceconfig system dns-setting servers primary 10.0.10.53 secondary 10.0.10.54
set deviceconfig system ntp-servers primary-ntp-server ntp-server-address 10.0.10.123
set deviceconfig system timezone Europe/Paris
# sources autorisées sur MGT
set deviceconfig system permitted-ip 10.0.99.0/24
set deviceconfig system service disable-telnet yes disable-http yes
set deviceconfig system login-banner "Accès réservé"
set mgt-config users jdupont permissions role-based superuser yes
set mgt-config users jdupont password
commit
```

Comptes nominatifs avec **rôles** (superuser, lecture, rôles personnalisés), authentification RADIUS/TACACS+/SAML pour les administrateurs, MFA.

## Interfaces, zones, routeur virtuel

```panos
set network interface ethernet ethernet1/1 layer3 ip 203.0.113.2/29
set network interface ethernet ethernet1/1 layer3 interface-management-profile PING-SEUL
set network interface ethernet ethernet1/2 layer3 units ethernet1/2.20 tag 20 ip 10.0.20.254/24
set network profiles interface-management-profile PING-SEUL ping yes
set zone UNTRUST network layer3 ethernet1/1
set zone TRUST network layer3 ethernet1/2.20
set network virtual-router default interface [ ethernet1/1 ethernet1/2.20 ]
set network virtual-router default routing-table ip static-route DEFAUT destination 0.0.0.0/0 nexthop ip-address 203.0.113.1
commit
```

| Notion | Description |
| --- | --- |
| Types d'interfaces | Couche 3 (routée), couche 2, *virtual wire* (transparent entre deux ports), *tap* (écoute) |
| **Zones** | Chaque interface appartient à une zone ; les règles portent sur des zones source/destination |
| **Routeur virtuel** / *logical router* | Table de routage (statique, OSPF, BGP) ; moteur *Advanced Routing* sur les versions récentes |
| Profil de gestion d'interface | Services d'administration autorisés sur une interface de données (ping, SSH, HTTPS, User-ID…) — jamais HTTPS/SSH sur l'interface Internet |

Interface web : *Network → Interfaces / Zones / Virtual Routers*.

## Mises à jour

| Élément | Où |
| --- | --- |
| **Contenu dynamique** (applications et menaces, antivirus, WildFire, URL) | *Device → Dynamic Updates* : planification (ex. toutes les heures pour WildFire, quotidienne pour les menaces) |
| **PAN-OS** | *Device → Software* : télécharger, installer, redémarrer ; respecter le chemin de mise à jour (versions de base intermédiaires) et privilégier les versions « préférées » |
| Licences | *Device → Licenses* |

```panos
request system software check
request system software download version 11.1.6-h3
request system software install version 11.1.6-h3
request restart system
request content upgrade check
request content upgrade install version latest
```

## Sauvegarde

```panos
# enregistre une copie nommée sur l'équipement
save config to sauvegarde-2026-10-29.xml
scp export configuration from running-config.xml to sauvegarde@10.0.98.30:/configs/
```

Interface web : *Device → Setup → Operations* (enregistrer, exporter, importer, charger une configuration). Les **instantanés de configuration** permettent de revenir à une version validée précédente.

Suite : [[02-politiques-nat-globalprotect|politiques, App-ID, NAT et GlobalProtect]].
