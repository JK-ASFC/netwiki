---
title: SNMP (Windows et Linux) — aide-mémoire des commandes
description: Commandes SNMP avec exemples — service SNMP Windows (fonctionnalité, communautés, gestionnaires autorisés, interruptions via le registre et PowerShell), agent Linux (snmpd, net-snmp, utilisateurs SNMPv3), outils net-snmp (snmpget, snmpwalk, snmpbulkwalk, snmptable, snmptranslate, snmptrap), OID utiles, tests depuis Windows et dépannage.
tags: [aide-mémoire, snmp, snmpwalk, snmpv3, windows, net-snmp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-service-snmp|SNMP sous Windows]].

## Service SNMP Windows

```powershell
Add-WindowsCapability -Online -Name "SNMP.Client~~~~0.0.1.0"       # Windows 10/11, Server 2019+
Install-WindowsFeature SNMP-Service -IncludeManagementTools           # Windows Server
# Communauté en lecture seule (4 = READ ONLY)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\ValidCommunities" -Name "Lecture-Supervision" -Value 4 -PropertyType DWord -Force
# Gestionnaires autorisés
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\PermittedManagers" -Name "1" -Value "10.0.98.10" -PropertyType String -Force
Remove-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\ValidCommunities" -Name "public" -ErrorAction SilentlyContinue
Restart-Service SNMP
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\ValidCommunities"
New-NetFirewallRule -DisplayName "SNMP supervision" -Direction Inbound -Protocol UDP -LocalPort 161 -RemoteAddress 10.0.98.10 -Action Allow
```

Le service SNMP de Windows ne gère que **SNMPv1/v2c** (pas de chiffrement) : préférez WMI/WinRM ou un agent (Zabbix, Checkmk, Prometheus windows_exporter) pour la supervision de Windows.

## Agent Linux (net-snmp)

```bash
sudo apt install snmpd snmp snmp-mibs-downloader
sudo sed -i 's/^mibs :/# mibs :/' /etc/snmp/snmp.conf            # activer la résolution des noms de MIB
sudo systemctl stop snmpd
sudo net-snmp-create-v3-user -ro -a SHA-256 -A 'AuthLongue2026!' -x AES -X 'PrivLongue2026!' supervision
sudo systemctl start snmpd
```

```text
# /etc/snmp/snmpd.conf
agentAddress udp:10.0.30.10:161
rouser supervision authpriv
sysLocation Paris, salle serveurs, baie 3
sysContact reseau@exemple.fr
```

## Outils net-snmp

```bash
snmpget -v2c -c Lecture-Supervision 10.0.99.10 SNMPv2-MIB::sysUpTime.0 SNMPv2-MIB::sysName.0
snmpwalk -v2c -c Lecture-Supervision 10.0.99.10 IF-MIB::ifDescr
snmpbulkwalk -v2c -c Lecture-Supervision -Cr50 10.0.99.10 IF-MIB::ifXTable
snmptable -v2c -c Lecture-Supervision -Cb 10.0.99.10 IF-MIB::ifTable | head
snmpwalk -v3 -l authPriv -u supervision -a SHA-256 -A 'AuthLongue2026!' -x AES -X 'PrivLongue2026!' 10.0.30.10 HOST-RESOURCES-MIB::hrStorageDescr
snmpwalk -v2c -c Lecture-Supervision -On 10.0.99.10 1.3.6.1.2.1.1          # OID numériques
snmptranslate -On IF-MIB::ifHCInOctets
snmptranslate -Td IF-MIB::ifOperStatus                                     # description
snmptrap -v2c -c Interruptions 10.0.98.10 '' SNMPv2-MIB::coldStart          # envoyer une interruption de test
```

## OID utiles

| OID / objet | Contenu |
| --- | --- |
| `SNMPv2-MIB::sysDescr.0`, `sysName.0`, `sysUpTime.0` | Description, nom, disponibilité |
| `IF-MIB::ifDescr`, `ifName`, `ifOperStatus`, `ifAdminStatus` | Interfaces et état |
| `IF-MIB::ifHCInOctets`, `ifHCOutOctets` | Compteurs 64 bits (débit) |
| `IF-MIB::ifInErrors`, `ifInDiscards` | Erreurs et rejets |
| `HOST-RESOURCES-MIB::hrProcessorLoad` | Charge CPU par cœur |
| `HOST-RESOURCES-MIB::hrStorageTable` | Disques et mémoire |
| `ENTITY-MIB::entPhysicalTable` | Matériel (modèle, numéro de série) |
| `IP-MIB::ipAddrTable`, `LLDP-MIB` | Adresses, voisins LLDP |

## Depuis Windows

```powershell
# Outils net-snmp pour Windows ou PowerShell avec le module SNMP communautaire
Install-Module SNMP -Scope CurrentUser
Get-SnmpData -IP 10.0.99.10 -OID 1.3.6.1.2.1.1.5.0 -Community Lecture-Supervision
```
