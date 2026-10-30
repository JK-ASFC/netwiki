---
title: Agents, découverte, règles et SNMP
description: Déployer les agents Checkmk (Linux, Windows) et l'Agent Controller (enregistrement TLS, mode push), créer les hôtes par dossiers et étiquettes, découvrir les services, ajuster les seuils par règles, superviser les équipements réseau en SNMP (v2c/v3, découverte des interfaces, contrôles spécifiques), contrôles actifs, et synchronisation avec l'inventaire.
tags: [checkmk, agent, agent controller, découverte, règles, snmp, étiquettes, wato]
icon: settings-2
---

## Agent Linux

```bash
# Paquet de l'agent téléchargé depuis le site (Setup → Agents → Linux)
wget http://checkmk.corp.exemple.fr/prod/check_mk/agents/check-mk-agent_2.4.0p10-1_all.deb
sudo apt install ./check-mk-agent_2.4.0p10-1_all.deb
# Enregistrement TLS auprès du site (l'hôte doit exister dans Checkmk)
sudo cmk-agent-ctl register --hostname srv-web-01 --server checkmk.corp.exemple.fr --site prod --user agent_registration
sudo cmk-agent-ctl status
```

| Mode | Fonctionnement |
| --- | --- |
| *Pull* (défaut) | Le site se connecte à l'agent (TCP **6556**), flux chiffré après enregistrement |
| *Push* (éditions commerciales) | L'agent envoie ses données au site (hôtes derrière un NAT, cloud) |

L'agent s'étend par des **greffons** (`/usr/lib/check_mk_agent/plugins/` : MySQL, Docker, sauvegardes…) et des **contrôles locaux** (`local/`) : un script qui affiche `0 "Sauvegarde" age=12 OK - dernière sauvegarde il y a 12 h` crée un service.

## Agent Windows

```powershell
msiexec /i check_mk_agent.msi /qn
& "C:\Program Files (x86)\checkmk\service\cmk-agent-ctl.exe" register --hostname srv-ad-01 `
  --server checkmk.corp.exemple.fr --site prod --user agent_registration --password '…' --trust-cert
```

Configuration : `C:\ProgramData\checkmk\agent\check_mk.user.yml`. Les éditions commerciales fournissent l'**Agent Bakery** (MSI préconfigurés par règles, mises à jour automatiques des agents).

## Hôtes, dossiers et étiquettes

| Élément | Usage |
| --- | --- |
| **Dossiers** | Arborescence (site, type) ; les attributs (site de supervision, réseau, SNMP) sont hérités |
| **Étiquettes d'hôte** (*host tags*) | Critères (criticité, environnement, type d'agent) utilisés par les règles |
| Étiquettes (*labels*) | Clé/valeur dynamiques (fournies par les agents, Kubernetes, imports) |
| Contacts / groupes | Qui voit et qui est notifié |

Création en masse : import CSV, **API REST** (`/check_mk/api/1.0/domain-types/host_config/collections/all`), ou greffons de synchronisation (NetBox, vSphere, cloud).

## Découverte de services

*Setup → Hosts → (hôte) → Run service discovery* : Checkmk propose les services trouvés ; on les **accepte** (*Accept all*). Une **règle de découverte périodique** ajoute automatiquement les nouveaux services (nouveau disque, nouvelle interface) et signale ceux qui disparaissent.

```bash
# En ligne de commande (utilisateur du site)
cmk -I srv-web-01        # découvrir
cmk -II srv-web-01       # redécouvrir complètement
cmk -O                   # activer les changements (Nagios : cmk -R)
cmk -d srv-web-01        # afficher la sortie brute de l'agent
cmk -nv srv-web-01       # exécuter les contrôles sans enregistrer (diagnostic)
```

Toute modification de configuration doit être **activée** (*Activate pending changes*).

## Règles

| Exemple de règle | Effet |
| --- | --- |
| *Filesystems (used space and growth)* | Seuils 85/95 % pour les serveurs de production, 90/98 % ailleurs |
| *Network interfaces and switch ports* | Alerter sur le débit > 80 % et les erreurs ; ignorer les interfaces sans description |
| *Disabled services* | Retirer des services inutiles (interfaces de test) |
| *Host check command* | Ping, TCP, ou état d'un hôte parent |

Les règles s'appliquent par dossier, étiquettes, noms (expressions) : la première règle correspondante gagne (ordre affiché).

## SNMP

Pour un équipement réseau : attribut *Checkmk agent / API integrations* = **No API integrations, no Checkmk agent** et *SNMP* = **SNMP v2 or v3**, avec les identifiants par règle *SNMP credentials of monitored hosts* (v3 : `authPriv`, SHA-256/AES).

Checkmk reconnaît la plupart des constructeurs (Cisco, Juniper, Arista, HPE/Aruba, Fortinet, Palo Alto, F5, onduleurs, imprimantes) : interfaces, CPU, mémoire, environnement, état BGP/OSPF, tunnels VPN, alimentations.

```bash
cmk --snmpwalk sw-coeur-01          # capture de référence (support, diagnostic)
cmk -d sw-coeur-01                  # données SNMP traitées
```

Réglages utiles : règle *Bulk walk* (SNMPv2/v3), *SNMP timing* pour les équipements lents, et **Inline SNMP** (par défaut).

## Contrôles actifs

*Setup → Services → HTTP, TCP, Email, …* : `check_http`/`check_httpv2`, certificats, DNS, ping, SMTP… exécutés depuis le site sans agent.
