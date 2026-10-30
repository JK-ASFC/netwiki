---
title: OPNsense
description: OPNsense, fork libre de pfSense (Deciso) — différences avec pfSense, installation et console, interface web (interfaces et VLAN, alias, règles et règles flottantes, NAT, Unbound, Kea), plugins (os-crowdsec, Zenarmor, WireGuard, HAProxy, ACME, FRR), IDS/IPS Suricata intégré, VPN, haute disponibilité CARP, API et outils en ligne de commande (configctl, opnsense-update), sauvegarde, sécurité et dépannage.
tags: [opnsense, pare-feu, freebsd, plugins, suricata, api, configctl]
icon: shield
---

**OPNsense** (Deciso, licence BSD) est un fork de pfSense (2015) basé sur **FreeBSD** (HardenedBSD jusqu'en 2023). Il se distingue par une interface web modernisée, des mises à jour fréquentes et prévisibles (deux versions majeures par an, correctifs réguliers), une **API REST** complète et un écosystème de **plugins**. Une édition **Business** (abonnement) ajoute des fonctions et un dépôt plus conservateur.

## Différences principales avec pfSense

| Sujet | OPNsense | pfSense |
| --- | --- | --- |
| Licence | BSD, tout libre (+ édition Business) | CE libre, Plus commercial |
| Cycle | Versions 25.1, 25.7…, correctifs fréquents | Plus espacé (CE) |
| API | REST complète et documentée | Limitée (paquets tiers) |
| IDS/IPS | **Suricata intégré** (*Services → Intrusion Detection*) | Paquet Suricata/Snort |
| Interface | Menus réorganisés, règles **flottantes** et automatiques visibles | Classique |

Les concepts ([[01-pfsense|pfSense]]) s'appliquent : alias, règles par interface en entrée, NAT sortant automatique, CARP/pfsync, `config.xml` (`/conf/config.xml`).

## Installation et console

Image d'installation (ZFS recommandé). Menu console : affectation des interfaces, adresses, réinitialisation du mot de passe root, retour à une configuration précédente, mise à jour, shell. Interface web : `https://192.168.1.1`, compte `root` (mot de passe `opnsense` à l'installation, à changer).

## Interface web

| Menu | Contenu |
| --- | --- |
| *Interfaces → Assignments / Other Types → VLAN* | Interfaces, VLAN, ponts, agrégats (LAGG) |
| *Firewall → Aliases* | Hôtes, réseaux, ports, URL, GeoIP, listes externes |
| *Firewall → Rules* | Règles **flottantes** (toutes interfaces, priorité), par groupe, par interface |
| *Firewall → NAT* | Redirections, sortant, 1:1, NPTv6 |
| *Services* | **Unbound DNS**, Kea/ISC DHCP, NTP, Intrusion Detection, Captive Portal |
| *VPN* | IPsec (connexions « Swanctl » dans les versions récentes), OpenVPN, WireGuard |
| *System → High Availability* | CARP, pfsync, synchronisation de configuration |
| *System → Firmware → Plugins* | Plugins |

## Plugins utiles

| Plugin | Usage |
| --- | --- |
| **os-crowdsec** | Blocage collaboratif ([[02-crowdsec/01-presentation-installation\|CrowdSec]]) |
| Zenarmor (Sensei) | Filtrage applicatif/NGFW (offres gratuite et payantes) |
| os-haproxy, os-acme-client | Publication web et certificats Let's Encrypt |
| os-frr | OSPF, BGP |
| os-zabbix-agent, os-telegraf | Supervision |
| os-wireguard (intégré dans les versions récentes) | VPN WireGuard |

## API et ligne de commande

```bash
# API REST : clé et secret créés pour un utilisateur (System → Access → Users → API keys)
curl -s -k -u "CLE:SECRET" https://10.0.99.1/api/core/firmware/status | jq .
curl -s -k -u "CLE:SECRET" https://10.0.99.1/api/firewall/alias/searchItem | jq '.rows[].name'
curl -s -k -u "CLE:SECRET" -X POST https://10.0.99.1/api/firewall/alias_util/add/LISTE_BLOCAGE -d '{"address":"198.51.100.66"}' -H "Content-Type: application/json"
```

```sh
configctl service reload all         # recharger les services
configctl filter reload              # recharger les règles
opnsense-update -c                   # vérifier les mises à jour
opnsense-version
pfctl -sr ; pfctl -ss | grep 10.0.20.15
```

Collection Ansible et fournisseurs Terraform communautaires reposent sur l'API.

## Sauvegarde, sécurité, dépannage

- Sauvegarde : *System → Configuration → Backups* (téléchargement chiffré, historique, sauvegarde vers Google Drive/Nextcloud par plugin) ; `config.xml` contient toute la configuration (et des secrets).
- Sécurité : administration limitée au réseau d'administration (*System → Settings → Administration* : interfaces d'écoute), MFA TOTP intégrée, comptes nominatifs, mises à jour suivies.
- Dépannage : *Firewall → Log Files → Live View* (filtres par interface, action, règle), *Interfaces → Diagnostics* (capture, ping, traceroute, états, ARP), *Reporting → Insight* (NetFlow intégré).

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Règle sans effet | Règle flottante prioritaire, mauvaise interface ou direction | *Live View* : identifiant de la règle appliquée |
| Plugin incompatible après mise à jour | Version majeure | Mettre à jour les plugins, notes de version |
| Interface web inaccessible | Interfaces d'écoute restreintes | Console : réinitialiser, ou modifier depuis le LAN |
