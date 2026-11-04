---
title: "Get-VM"
description: "PowerShell — Get-VM (Virtualisation / Hyper-V) : Liste les machines virtuelles Hyper-V et leur état."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Hyper-V |
| **Commande type** | `Get-VM` |

## Rôle

Liste les machines virtuelles Hyper-V et leur état.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | filtre par nom (jokers acceptés) |
| `-VMName ‹nom›` | idem, par nom |
| `-ComputerName ‹hôte›` | interroge un hôte Hyper-V distant |

## Exemples

**Tout lister**

```powershell
Get-VM
```

**Une VM**

```powershell
Get-VM -Name SRV01
```

**Les VM actives**

```powershell
Get-VM | Where-Object State -eq Running
```

*Mots-clés : hyper-v hyperv vm lister get-vm état statut machine virtuelle windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
