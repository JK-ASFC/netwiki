---
title: Antivirus Microsoft Defender — configuration
description: Microsoft Defender Antivirus sur Windows Server et Windows 11 — fonctionnement (protection en temps réel, protection cloud, mises à jour de renseignements de sécurité), gestion par GPO, Intune ou PowerShell, protection contre la falsification, exclusions recommandées par rôle (AD, DNS, DHCP, Hyper-V, SQL, Exchange), analyses planifiées, règles de réduction de la surface d'attaque (ASR), accès contrôlé aux dossiers, protection réseau et protection contre les applications potentiellement indésirables.
tags: [microsoft defender, antivirus, windows server, asr, exclusions, tamper protection, gpo, powershell]
icon: shield-half
---

**Microsoft Defender Antivirus** est intégré à Windows 10/11 et Windows Server 2016 et suivants. Sur un serveur, il est actif par défaut (sauf si un autre antivirus est installé). Associé à **Defender for Endpoint** (EDR), il forme la solution de protection des terminaux de Microsoft.

## Fonctionnement

| Composant | Rôle |
| --- | --- |
| Protection en temps réel | Analyse à l'accès des fichiers et processus, surveillance des comportements |
| **Protection cloud** (MAPS) | Verdicts en quelques secondes pour les fichiers inconnus, blocage à la première vue |
| Renseignements de sécurité | Mises à jour plusieurs fois par jour (Windows Update, WSUS, partage UNC, Microsoft Update) |
| Moteur et plateforme | Mises à jour mensuelles |

```powershell
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, IsTamperProtected, AntivirusSignatureLastUpdated, AMProductVersion
Update-MpSignature
Start-MpScan -ScanType QuickScan
Get-MpThreatDetection | Select-Object -First 10 ThreatID, InitialDetectionTime, Resources
```

Sur Windows Server, Defender passe automatiquement en **mode passif** si un autre antivirus est installé et que le serveur est intégré à Defender for Endpoint ; sinon il faut le désactiver explicitement (registre `ForceDefenderPassiveMode`). Ne faites pas cohabiter deux antivirus actifs.

## Gestion

| Outil | Usage |
| --- | --- |
| **GPO** | *Configuration ordinateur → Modèles d'administration → Composants Windows → Antivirus Microsoft Defender* |
| **Intune** / Configuration Manager | Stratégies de sécurité des points de terminaison |
| Defender for Endpoint (gestion des paramètres de sécurité) | Serveurs non gérés par Intune |
| PowerShell (`Set-MpPreference`) | Serveurs isolés, scripts, vérifications |

```powershell
Set-MpPreference -MAPSReporting Advanced -SubmitSamplesConsent SendSafeSamples -CloudBlockLevel High -CloudExtendedTimeout 50
Set-MpPreference -PUAProtection Enabled -EnableNetworkProtection Enabled
Set-MpPreference -ScanScheduleDay Everyday -ScanScheduleQuickScanTime 12:00 -RemediationScheduleDay Everyday
Set-MpPreference -SignatureUpdateInterval 4 -SignatureFallbackOrder "MicrosoftUpdateServer|MMPC"
Get-MpPreference | Select-Object MAPSReporting, CloudBlockLevel, PUAProtection, EnableNetworkProtection, ExclusionPath, ExclusionProcess
```

## Protection contre la falsification

La **protection contre la falsification** (*Tamper Protection*) empêche un attaquant (même administrateur local) de désactiver la protection en temps réel, cloud ou de modifier les exclusions par registre/PowerShell. Elle s'active depuis le portail **Defender for Endpoint** / Intune (ou l'application Sécurité Windows sur un poste). Avec elle, les exclusions gérées localement peuvent être ignorées : gérez-les par la stratégie centrale.

## Exclusions

Windows Server ajoute **automatiquement** les exclusions des rôles installés (AD DS, DNS, DHCP, Hyper-V, serveur de fichiers, IIS…). Ajoutez uniquement celles des **applications** (selon la documentation de l'éditeur) et gardez-les minimales :

| Charge | Exclusions typiques |
| --- | --- |
| SQL Server | Fichiers `.mdf`, `.ldf`, `.ndf`, sauvegardes `.bak`/`.trn`, processus `sqlservr.exe` (selon la documentation Microsoft) |
| Exchange | Liste officielle (bases, journaux, processus) |
| Hyper-V (automatique) | `.vhdx`, `.avhdx`, `.vmrs`, `.vmgs`, dossiers des VM, `vmms.exe`, `vmwp.exe` |
| Sauvegarde | Dépôts de sauvegarde, processus de l'agent (selon l'éditeur) |

```powershell
Add-MpPreference -ExclusionPath "E:\SQLData", "F:\SQLLogs"
Add-MpPreference -ExclusionProcess "C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Binn\sqlservr.exe"
```

> [!WARNING]
> Les attaquants cherchent les **dossiers exclus** pour y déposer leurs outils. N'excluez jamais `C:\Temp`, `C:\Users\*\Downloads` ou des lecteurs entiers ; masquez les exclusions aux utilisateurs locaux (*HideExclusionsFromLocalAdmins*).

## Réduction de la surface d'attaque (ASR)

Les **règles ASR** bloquent des comportements typiques des attaques. Déployez-les en **audit**, analysez, puis passez en **blocage** :

| Règle (extraits) | GUID |
| --- | --- |
| Bloquer le vol d'identifiants depuis LSASS | `9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2` |
| Bloquer la création de processus enfants par les applications Office | `d4f940ab-401b-4efc-aadc-ad5f3c50688a` |
| Bloquer le contenu exécutable des clients de messagerie et webmail | `be9ba2d9-53ea-4cdc-84e5-9b1eeee46550` |
| Bloquer l'exécution de scripts potentiellement obscurcis | `5beb7efe-fd9a-4556-801d-275e5ffc04cc` |
| Bloquer les créations de processus issues de PSExec et WMI | `d1e49aac-8f56-4280-b9ba-993a6d77406c` |
| Protection avancée contre les rançongiciels | `c1db55ab-c21a-4637-bb3f-a12568109d35` |
| Bloquer l'abus de pilotes signés vulnérables | `56a863a9-875e-4185-98a7-b882c64b5ce5` |

```powershell
# 2 = audit, 1 = blocage, 6 = avertissement, 0 = désactivé
Add-MpPreference -AttackSurfaceReductionRules_Ids 9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2 -AttackSurfaceReductionRules_Actions 1
Add-MpPreference -AttackSurfaceReductionRules_Ids d1e49aac-8f56-4280-b9ba-993a6d77406c -AttackSurfaceReductionRules_Actions 2
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Ids
```

La règle PSExec/WMI peut gêner des outils d'administration (ConfigMgr) : audit d'abord. Les événements ASR sont dans *Microsoft-Windows-Windows Defender/Operational* (**1121** blocage, **1122** audit).

## Autres protections

| Fonction | Usage |
| --- | --- |
| **Accès contrôlé aux dossiers** | Seules les applications approuvées peuvent modifier les dossiers protégés (Documents, partages) — utile sur les postes, à tester sur les serveurs de fichiers |
| **Protection réseau** | Bloque les connexions vers des domaines/IP malveillants (et indicateurs personnalisés avec MDE) |
| Protection contre les PUA | Bloque les applications potentiellement indésirables |

Suite : [[02-endpoint-exploitation|Defender for Endpoint et exploitation]].
