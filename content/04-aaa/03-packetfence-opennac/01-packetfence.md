---
title: PacketFence
description: PacketFence — solution NAC open source (Inverse/Akamai, GPL) : 802.1X filaire et Wi-Fi, authentification MAC (MAB), portail captif et enregistrement des invités et des BYOD, attribution dynamique de VLAN ou de rôles, isolation des postes non conformes, intégration Active Directory, commutateurs et contrôleurs Wi-Fi pris en charge, installation (ZEN, Debian, RHEL), assistant de configuration, déploiement inline ou hors bande, haute disponibilité et dépannage.
tags: [packetfence, nac, 802.1x, mab, portail captif, vlan dynamique, radius]
icon: shield-check
---

**PacketFence** (GPL, Inverse, groupe Akamai) contrôle **qui et quoi** se connecte au réseau : il intègre un serveur [[01-freeradius/01-presentation|FreeRADIUS]], une base des terminaux (*nodes*), un **portail captif**, la détection d'empreintes (Fingerbank), et pilote les commutateurs et contrôleurs Wi-Fi pour placer chaque terminal dans le bon **VLAN** ou **rôle**.

| Mode | Principe |
| --- | --- |
| **802.1X** | Le terminal s'authentifie (identifiants AD, certificat) ; RADIUS renvoie le VLAN/rôle |
| **MAB** (*MAC Authentication Bypass*) | Imprimantes, téléphones IP, IoT : autorisation selon l'adresse MAC et l'empreinte |
| **Portail captif** | Invités, BYOD : enregistrement puis bascule dans le VLAN de production |
| **Isolation** | Terminal non conforme ou infecté (alerte Suricata, agent) → VLAN d'isolation |
| Déploiement **hors bande** (*out-of-band*) | Le contrôle passe par RADIUS/SNMP, PacketFence n'est pas sur le chemin des données — mode courant |
| **Inline** | PacketFence route le trafic (petits sites, équipements non gérables) |

## Installation

- **ZEN** : appliance virtuelle (OVA) prête pour VMware/Proxmox, la plus simple.
- **Debian 12** ou **RHEL/Rocky 8** : dépôt officiel PacketFence (`packetfence.org/download`), paquet `packetfence`, sur un serveur dédié (8 Go de RAM et plus).

Configuration initiale : `https://<ip>:1443/configurator` — interfaces (gestion, VLAN d'enregistrement, VLAN d'isolation), base de données, nom de domaine, mot de passe administrateur, licence Fingerbank (gratuite).

## Configuration

1. **Sources d'authentification** : *Configuration → Policies and Access Control → Authentication Sources* → **Active Directory** (serveur, base, compte de liaison) ; règles d'attribution de **rôle** selon le groupe (ex. `memberOf` = `GG-Compta` → rôle `compta`).
2. **Rôles** : `default`, `compta`, `invite`, `voip`, `isolation`.
3. **Équipements réseau** (*Switches*) : type (Cisco Catalyst, Aruba, HPE, Juniper, Ubiquiti…), secret RADIUS, SNMP, correspondance **rôle → VLAN** (ou rôle → ACL/rôle utilisateur sur Aruba/Cisco).
4. **Profils de connexion** : filtre (SSID, port, type de connexion), sources, portail associé.
5. **Commutateurs** : configuration 802.1X/MAB pointant vers PacketFence (voir [[04-cisco-commutateurs/02-securite-acces-8021x|802.1X sur Catalyst]] et la page du constructeur).

```text Catalyst (extrait)
aaa new-model
radius server PACKETFENCE
 address ipv4 10.0.99.20 auth-port 1812 acct-port 1813
 key SecretRadiusPartage
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa server radius dynamic-author
 client 10.0.99.20 server-key SecretRadiusPartage
dot1x system-auth-control
interface GigabitEthernet1/0/5
 switchport mode access
 authentication port-control auto
 mab
 dot1x pae authenticator
```

## Exploitation

- **Nodes** : terminaux connus (MAC, empreinte, propriétaire, rôle, statut enregistré/non enregistré), réévaluation et changement de rôle à chaud (CoA RADIUS).
- **Audit RADIUS** : chaque demande avec la raison de la décision.
- Haute disponibilité : cluster actif/passif ou actif/actif (Galera), adresse virtuelle.
- Journaux : `/usr/local/pf/logs/packetfence.log`, `radius.log`.

Interface : [[03-interface-graphique|interface d'administration]] · commandes : [[90-aide-memoire|aide-mémoire]].
