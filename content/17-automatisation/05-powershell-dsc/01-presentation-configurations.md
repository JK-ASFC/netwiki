---
title: Présentation, versions et configurations
description: PowerShell Desired State Configuration — principe déclaratif, trois générations (DSC 1.1 intégré à Windows PowerShell 5.1 avec LCM et MOF, PSDesiredStateConfiguration 2.x pour PowerShell 7, DSC v3 multiplateforme avec la commande dsc et des documents YAML/JSON), modules de ressources (PSGallery), écrire, compiler, appliquer et tester une configuration, données de configuration et identifiants.
tags: [powershell, dsc, lcm, mof, configuration, windows, dsc v3, ressources]
icon: info
---

**PowerShell DSC** décrit l'état voulu d'une machine (fonctionnalités, services, registre, fichiers, paramètres réseau) sous forme de **configuration** déclarative ; un moteur la **teste** puis la **corrige** de façon idempotente. C'est l'équivalent Windows natif de [[02-puppet/01-presentation-installation|Puppet]] ou des états [[03-salt/01-presentation-installation|Salt]].

## Trois générations

| Version | Moteur | Format | Statut |
| --- | --- | --- | --- |
| **DSC 1.1** | **LCM** (*Local Configuration Manager*) intégré à Windows PowerShell 5.1 | Configuration PowerShell compilée en **MOF** | Toujours présent dans Windows, plus d'évolutions ; serveur d'extraction (pull) Windows déprécié |
| **PSDesiredStateConfiguration 2.x** | Module pour PowerShell 7 | Ressources PowerShell, sans LCM | Base d'**Azure Machine Configuration** |
| **DSC v3** | Commande **`dsc`** autonome (Windows, Linux, macOS) | Documents **YAML/JSON** | Génération actuelle ; ressources en tout langage, adaptateur pour les ressources PowerShell existantes |

> [!TIP]
> Pour un parc sur site : DSC 1.1 (push) reste simple et disponible partout ; pour un usage moderne ou piloté par un outil (Ansible, Puppet, Azure, Machine Configuration), privilégiez **DSC v3** ou les ressources DSC appelées depuis cet outil (`ansible.windows.win_dsc`, modules Puppet `dsc-*`).

## Modules de ressources

```powershell
Find-Module -Tag DSCResourceKit | Select-Object Name, Version | Sort-Object Name
Install-Module ComputerManagementDsc, NetworkingDsc, ActiveDirectoryDsc, xDnsServer, SecurityPolicyDsc -Scope AllUsers
Get-DscResource -Module NetworkingDsc
Get-DscResource -Name DnsServerAddress -Syntax
```

| Module | Ressources typiques |
| --- | --- |
| `PSDesiredStateConfiguration` (intégré) | `WindowsFeature`, `Service`, `Registry`, `File`, `Script`, `User`, `Group`, `Environment` |
| `ComputerManagementDsc` | `Computer` (nom, domaine), `TimeZone`, `PowerPlan`, `ScheduledTask` |
| `NetworkingDsc` | `IPAddress`, `DnsServerAddress`, `NetAdapterName`, `Firewall`, `NetBios` |
| `ActiveDirectoryDsc` | Domaine, OU, utilisateurs, groupes |
| `DnsServerDsc` | Zones et enregistrements DNS |
| `SecurityPolicyDsc`, `AuditPolicyDsc` | Stratégies de sécurité et d'audit |

## Une configuration (DSC 1.1)

```powershell C:\DSC\SocleServeur.ps1
Configuration SocleServeur {
    param ([string[]] $NomNoeud = 'localhost')

    Import-DscResource -ModuleName PSDesiredStateConfiguration
    Import-DscResource -ModuleName NetworkingDsc
    Import-DscResource -ModuleName ComputerManagementDsc

    Node $NomNoeud {
        WindowsFeature SNMP {
            Name   = 'SNMP-Service'
            Ensure = 'Absent'
        }

        WindowsFeature SMB1 {
            Name   = 'FS-SMB1'
            Ensure = 'Absent'
        }

        Service W32Time {
            Name        = 'W32Time'
            StartupType = 'Automatic'
            State       = 'Running'
        }

        TimeZone Fuseau {
            IsSingleInstance = 'Yes'
            TimeZone         = 'Romance Standard Time'
        }

        DnsServerAddress DNS {
            InterfaceAlias = 'Ethernet'
            AddressFamily  = 'IPv4'
            Address        = '10.0.10.53', '10.0.10.54'
        }

        Registry DesactiverLLMNR {
            Key       = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient'
            ValueName = 'EnableMulticast'
            ValueData = '0'
            ValueType = 'Dword'
            Ensure    = 'Present'
        }
    }
}

SocleServeur -NomNoeud 'srv-app-01', 'srv-app-02' -OutputPath C:\DSC\MOF
```

```powershell
# Pousser (push) vers les nœuds — WinRM requis
Start-DscConfiguration -Path C:\DSC\MOF -ComputerName srv-app-01, srv-app-02 -Wait -Verbose
Test-DscConfiguration -ComputerName srv-app-01 -Detailed      # conforme ?
Get-DscConfiguration -CimSession srv-app-01                     # état actuel
Get-DscConfigurationStatus -CimSession srv-app-01               # dernière exécution
```

## Données de configuration et identifiants

```powershell
$Donnees = @{
    AllNodes = @(
        @{ NodeName = '*';          CertificateFile = 'C:\DSC\Certs\dsc-chiffrement.cer' }
        @{ NodeName = 'srv-app-01'; Role = 'Web' }
        @{ NodeName = 'srv-app-02'; Role = 'Batch' }
    )
}

Configuration Applis {
    param ([pscredential] $CompteService)
    Import-DscResource -ModuleName PSDesiredStateConfiguration
    Node $AllNodes.Where({ $_.Role -eq 'Web' }).NodeName {
        WindowsFeature IIS { Name = 'Web-Server'; Ensure = 'Present' }
    }
    Node $AllNodes.Where({ $_.Role -eq 'Batch' }).NodeName {
        Service Traitement {
            Name       = 'TraitementNuit'
            Credential = $CompteService
            State      = 'Running'
        }
    }
}
Applis -ConfigurationData $Donnees -CompteService (Get-Credential) -OutputPath C:\DSC\MOF
```

> [!WARNING]
> Les identifiants dans un MOF doivent être **chiffrés** par le certificat de chiffrement de chaque nœud (`CertificateFile`, certificat « Document Encryption » délivré par AD CS). `PSDscAllowPlainTextPassword = $true` laisse le mot de passe **en clair** dans le fichier : à proscrire hors laboratoire.

## DSC v3

```bash
winget install Microsoft.DSC            # Windows ; paquets et archives pour Linux/macOS
dsc resource list
dsc resource list --adapter Microsoft.Windows/WindowsPowerShell   # ressources PowerShell 5.1 existantes
```

```yaml socle.dsc.yaml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
resources:
  - name: Desactiver LLMNR
    type: Microsoft.Windows/Registry
    properties:
      keyPath: HKLM\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient
      valueName: EnableMulticast
      valueData:
        DWord: 0
  - name: Ressources PowerShell
    type: Microsoft.Windows/WindowsPowerShell
    properties:
      resources:
        - name: Service de temps
          type: PSDesiredStateConfiguration/Service
          properties:
            Name: W32Time
            StartupType: Automatic
            State: Running
```

```bash
dsc config test --file socle.dsc.yaml
dsc config set  --file socle.dsc.yaml
dsc config get  --file socle.dsc.yaml
```

DSC v3 n'a **pas** de LCM ni de planification propre : la périodicité est assurée par l'outil qui l'appelle (tâche planifiée, Ansible, Machine Configuration).

Suite : [[02-lcm-pull-exploitation|LCM, mode pull, Azure et exploitation]].
