---
title: "Install-ADDSForest"
description: "PowerShell — Install-ADDSForest (Active Directory (déploiement)) : Promeut le serveur en premier contrôleur de domaine d'une nouvelle forêt AD (l'équivalent moderne de dcpromo)."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Active Directory (déploiement) |
| **Commande type** | `Install-ADDSForest -DomainName "dexterslab.lan" -InstallDns` |

## Rôle

Promeut le serveur en premier contrôleur de domaine d'une nouvelle forêt AD (l'équivalent moderne de dcpromo).

## Options

| Option | Rôle |
| --- | --- |
| `-DomainName ‹domaine›` | nom DNS du domaine (ex. dexterslab.lan) |
| `-DomainNetbiosName ‹NETBIOS›` | nom NetBIOS |
| `-InstallDns` | installe aussi le rôle DNS |
| `-Force` | sans confirmations |

## Exemples

**Nouvelle forêt**

```powershell
Install-ADDSForest -DomainName "dexterslab.lan" -InstallDns
```

**Prérequis**

```powershell
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
```

*Mots-clés : install-addsforest foret domaine contrôleur active directory promouvoir dcpromo dc 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
