---
title: Service SNMP de Windows
description: Agent SNMP intégré à Windows Server et Windows 11 — statut (déprécié mais disponible, SNMP v1/v2c uniquement), installation (fonctionnalité ou capacité), communautés et droits, gestionnaires autorisés, interruptions (traps) et evntwin, MIB disponibles (MIB-II, Host Resources, LanMan), configuration par registre et GPO, sécurité, supervision avec Zabbix, Centreon ou PRTG et alternatives (WMI, WinRM, agents, SNMP v3 tiers).
tags: [snmp, windows server, supervision, communauté, traps, mib, sécurité]
icon: radio-tower
---

Le **service SNMP** de Windows expose les informations du système (interfaces, CPU, mémoire, disques, processus, logiciels installés) en **SNMP v1/v2c** sur le port **161/UDP**, et peut envoyer des **interruptions** (*traps*, 162/UDP). Il reste utile pour une supervision réseau homogène (même outil que les commutateurs et routeurs).

> [!NOTE]
> **Statut.** Microsoft considère SNMP comme **déprécié** depuis Windows Server 2012 : la fonctionnalité est toujours disponible (Windows Server 2025, Windows 11 en *capacité facultative*), mais n'évolue plus et **ne gère pas SNMP v3**. Pour une supervision riche ou sécurisée, préférez les **agents** de votre outil (Zabbix, Centreon/NSClient++, Checkmk, PRTG, Telegraf) ou WMI/WinRM — voir [[04-zabbix/01-presentation-installation|Zabbix]], [[01-centreon/01-presentation|Centreon]], [[11-prtg/01-presentation-installation|PRTG]].

## Installation

```powershell
# Windows Server
Install-WindowsFeature SNMP-Service, SNMP-WMI-Provider -IncludeManagementTools
# Windows 10/11 (capacité facultative)
Add-WindowsCapability -Online -Name "SNMP.Client~~~~0.0.1.0"
Get-Service SNMP, SNMPTRAP
```

## Configuration

*services.msc → Service SNMP → Propriétés* :

| Onglet | Réglage |
| --- | --- |
| **Sécurité** | Communauté (ex. `supervision-Ro9!x2`) en **LECTURE SEULE** ; « Accepter les paquets SNMP provenant de ces hôtes » : uniquement les serveurs de supervision |
| Interruptions | Communauté et destinations des traps (serveur de supervision) |
| Agent | Contact, emplacement (`sysContact`, `sysLocation`), services exposés |

Équivalent par registre (déploiement par GPO *Préférences → Registre*, ou script) :

```powershell
$base = "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters"
# Communauté en lecture seule (4 = READ ONLY, 8 = READ WRITE)
New-ItemProperty -Path "$base\ValidCommunities" -Name "supervision-Ro9!x2" -Value 4 -PropertyType DWord -Force
# Gestionnaires autorisés (supprimer « localhost » seul si non utile, garder la liste explicite)
New-ItemProperty -Path "$base\PermittedManagers" -Name "1" -Value "10.0.98.10" -PropertyType String -Force
New-ItemProperty -Path "$base\PermittedManagers" -Name "2" -Value "10.0.98.11" -PropertyType String -Force
# Contact et emplacement
Set-ItemProperty -Path "$base\RFC1156Agent" -Name sysContact -Value "exploitation@corp.exemple.fr"
Set-ItemProperty -Path "$base\RFC1156Agent" -Name sysLocation -Value "Paris - Salle serveurs B - Baie 4"
Restart-Service SNMP
```

Des modèles d'administration permettent aussi de définir communautés, gestionnaires et destinations des interruptions par GPO (*Configuration ordinateur → Modèles d'administration → Réseau → Paramètres SNMP*).

## MIB disponibles

| MIB | Contenu |
| --- | --- |
| **MIB-II** (RFC 1213) | Système, interfaces (débits, erreurs), IP, TCP, UDP |
| **HOST-RESOURCES-MIB** (RFC 2790) | CPU (`hrProcessorLoad`), mémoire et disques (`hrStorage`), processus, logiciels installés |
| LanMan (LAN Manager MIB-II) | Services, partages, sessions, utilisateurs |
| DHCP, WINS | Statistiques des serveurs DHCP/WINS (si rôles installés) |

```bash
# Tests depuis le serveur de supervision
snmpwalk -v2c -c 'supervision-Ro9!x2' srv-app-01 1.3.6.1.2.1.1          # system
snmpwalk -v2c -c 'supervision-Ro9!x2' srv-app-01 1.3.6.1.2.1.25.2.3.1    # hrStorage (disques, mémoire)
snmpwalk -v2c -c 'supervision-Ro9!x2' srv-app-01 1.3.6.1.2.1.25.3.3.1.2  # hrProcessorLoad
```

## Interruptions et événements

L'outil **`evntwin.exe`** (traducteur événement → interruption) convertit des événements du journal Windows en traps SNMP envoyées aux destinations configurées. Il est peu utilisé aujourd'hui : préférez la collecte des journaux ([[08-windows-event-collector/01-presentation-configuration|collecteur d'événements]]) ou les alertes de l'agent de supervision.

## Sécurité

- [ ] **Lecture seule** uniquement ; jamais de communauté en écriture
- [ ] Communauté **longue et unique** (pas `public`), différente de celle des équipements réseau
- [ ] **Gestionnaires autorisés** explicitement listés + pare-feu Windows limitant 161/UDP aux serveurs de supervision ([[10-pare-feu-windows/01-profils-regles|pare-feu Windows]])
- [ ] SNMP v2c circule **en clair** : réseau de supervision dédié ou filtré ; pour du SNMP v3, agents tiers (SNMP Informant, Net-SNMP pour Windows) ou agents de supervision chiffrés
- [ ] Désinstaller le service là où il n'est pas utilisé

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Délai dépassé (`Timeout`) | Pare-feu Windows, gestionnaire non autorisé, communauté erronée | Règle 161/UDP, `PermittedManagers`, communauté exacte (sensible à la casse) |
| Seuls quelques OID répondent | Version SNMP, MIB non chargée (WMI provider) | `-v2c`, installer `SNMP-WMI-Provider`, redémarrer le service |
| Disques ou mémoire faux au-delà de 2 To | Compteurs 32 bits de `hrStorage` (unités × taille) | Calculer avec `hrStorageAllocationUnits`, ou utiliser l'agent de l'outil |
| Communauté perdue après mise à jour | Paramètres réinitialisés | Déployer la configuration par GPO |
| Interfaces avec des noms illisibles | `ifDescr` des cartes virtuelles | Utiliser `ifAlias`/`ifName` ou l'agent de supervision |
