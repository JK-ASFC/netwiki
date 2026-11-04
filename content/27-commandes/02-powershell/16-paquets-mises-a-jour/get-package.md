---
title: "Get-Package"
description: "PowerShell — Get-Package (PackageManagement) : Cmdlets PackageManagement (OneGet) : interface unifiée pour lister, installer et supprimer des paquets via plusieurs fournisseurs (NuGet, Chocolatey, MSI)."
tags: [powershell, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | PackageManagement |
| **Commande type** | `Get-Package` |

## Rôle

Cmdlets PackageManagement (OneGet) : interface unifiée pour lister, installer et supprimer des paquets via plusieurs fournisseurs (NuGet, Chocolatey, MSI).

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | liste les paquets installés |
| `Find-Package` | cherche dans les dépôts configurés |
| `Install-Package` | installe un paquet |
| `Uninstall-Package` | désinstalle |
| `-Name ‹nom›` | filtre par nom |
| `-Provider ‹fournisseur›` | NuGet, Chocolatey, msi… |

## Exemples

**Lister l'installé**

```powershell
Get-Package
```

**Chercher puis installer**

```powershell
Find-Package -Name 7zip | Install-Package
```

**Filtrer par nom**

```powershell
Get-Package -Name *Visual*
```

*Mots-clés : get-package install-package find-package packagemanagement oneget paquet powershell installer fournisseur nuget*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
