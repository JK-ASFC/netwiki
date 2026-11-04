---
title: "Install-WindowsFeature"
description: "PowerShell — Install-WindowsFeature (Rôles & fonctionnalités) : Installe un rôle ou une fonctionnalité Windows Server (DNS, DHCP, AD DS, Hyper-V...). Alias historique : Add-WindowsFeature."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Rôles & fonctionnalités |
| **Commande type** | `Install-WindowsFeature -Name DNS -IncludeManagementTools` |

## Rôle

Installe un rôle ou une fonctionnalité Windows Server (DNS, DHCP, AD DS, Hyper-V...). Alias historique : Add-WindowsFeature.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹rôle›` | nom du rôle (ex. AD-Domain-Services) |
| `-IncludeManagementTools` | ajoute les outils d'administration |
| `-IncludeAllSubFeature` | toutes les sous-fonctionnalités |
| `-Restart` | redémarre si nécessaire |

## Exemples

**DNS**

```powershell
Install-WindowsFeature -Name DNS -IncludeManagementTools
```

**Contrôleur de domaine**

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

**Hyper-V**

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```

*Mots-clés : install-windowsfeature rôle fonctionnalité serveur dns dhcp ad hyper-v add-windowsfeature 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
