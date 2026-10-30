---
title: PowerShell DSC — aide-mémoire des commandes
description: Commandes PowerShell DSC avec exemples — DSC v1.1 (compilation de configurations en MOF, Start-DscConfiguration, Test-DscConfiguration, Get-DscConfiguration, LCM : Get/Set-DscLocalConfigurationManager, mode pull, ressources et modules), DSC v3 (commande dsc, documents YAML, dsc config get/test/set, ressources), Azure Machine Configuration, dépannage (journaux).
tags: [aide-mémoire, powershell dsc, dsc v3, lcm, mof, configuration]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configurations|PowerShell DSC]].

## DSC v1.1 (Windows PowerShell 5.1)

```powershell
Configuration ServeurWeb {
    Import-DscResource -ModuleName PSDesiredStateConfiguration
    Node "srv-web01" {
        WindowsFeature IIS { Name = "Web-Server"; Ensure = "Present" }
        File Site { DestinationPath = "C:\inetpub\wwwroot\index.html"; Contents = "<h1>OK</h1>"; Ensure = "Present"; DependsOn = "[WindowsFeature]IIS" }
        Service W3SVC { Name = "W3SVC"; State = "Running"; StartupType = "Automatic"; DependsOn = "[WindowsFeature]IIS" }
    }
}
ServeurWeb -OutputPath C:\DSC\ServeurWeb                         # compile en MOF
Start-DscConfiguration -Path C:\DSC\ServeurWeb -Wait -Verbose -Force
Test-DscConfiguration -ComputerName srv-web01 -Detailed
Get-DscConfiguration -CimSession srv-web01
Get-DscConfigurationStatus -All | Select-Object -First 5 Status, StartDate, Type
Remove-DscConfigurationDocument -Stage Current, Pending, Previous -Force
```

## LCM (gestionnaire de configuration local)

```powershell
[DSCLocalConfigurationManager()]
Configuration LCM {
    Node "srv-web01" {
        Settings { ConfigurationMode = "ApplyAndAutoCorrect"; ConfigurationModeFrequencyMins = 30; RebootNodeIfNeeded = $false; RefreshMode = "Push" }
    }
}
LCM -OutputPath C:\DSC\LCM
Set-DscLocalConfigurationManager -Path C:\DSC\LCM -Verbose
Get-DscLocalConfigurationManager -CimSession srv-web01 | Select-Object ConfigurationMode, RefreshMode, LCMState
Update-DscConfiguration -Wait -Verbose                           # mode pull : récupérer maintenant
```

## Ressources

```powershell
Get-DscResource | Select-Object Name, ModuleName, Version
Get-DscResource -Name File -Syntax
Install-Module ComputerManagementDsc, NetworkingDsc -Scope AllUsers
Find-Module -Tag DSCResourceKit | Select-Object -First 10 Name
```

## DSC v3 (multi-plateforme)

```powershell
winget install --id Microsoft.DSC -e         # ou archive GitHub (Linux, macOS)
dsc --version
dsc resource list
dsc resource get --resource Microsoft.Windows/Registry --input '{"keyPath":"HKCU\\Software\\NetWiki","valueName":"Theme"}'
dsc config test --file .\poste.dsc.yaml
dsc config set --file .\poste.dsc.yaml
dsc config get --file .\poste.dsc.yaml
```

```yaml
# poste.dsc.yaml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
resources:
  - name: Clé de registre
    type: Microsoft.Windows/Registry
    properties:
      keyPath: HKCU\Software\NetWiki
      valueName: Theme
      valueData:
        String: sombre
```

## Dépannage

```powershell
Get-WinEvent -LogName "Microsoft-Windows-DSC/Operational" -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
Get-ChildItem C:\Windows\System32\Configuration          # documents MOF courants, en attente, précédents
```
