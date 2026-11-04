---
title: "Get-WindowsDriver"
description: "PowerShell — Get-WindowsDriver (Noyau & pilotes) : Liste les paquets de pilotes du magasin de pilotes Windows (ceux ajoutés, plus ceux de Windows avec -All), PAS les pilotes chargés en mémoire. Pour l'équivalent de lsmod, voir driverquery ou Win32_SystemDriver."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Noyau & pilotes |
| **Commande type** | `Get-WindowsDriver -Online` |

## Rôle

Liste les paquets de pilotes du magasin de pilotes Windows (ceux ajoutés, plus ceux de Windows avec -All), PAS les pilotes chargés en mémoire. Pour l'équivalent de lsmod, voir driverquery ou Win32_SystemDriver.

## Options

| Option | Rôle |
| --- | --- |
| `-Online` | cible le système EN COURS d'exécution (et non une image hors ligne) |
| `-All` | inclut les pilotes fournis avec Windows, pas seulement ceux ajoutés |
| `-Path ‹C:\image›` | cible une image Windows montée hors ligne |
| `\| Where-Object ClassName -eq 'Net'` | ne garde qu'une famille de pilotes (réseau, stockage…) |

## Exemples

**Pilotes ajoutés**

```powershell
Get-WindowsDriver -Online
```

**Tous les pilotes**

```powershell
Get-WindowsDriver -Online -All
```

**Pilotes réseau**

```powershell
Get-WindowsDriver -Online -All | Where-Object ClassName -eq 'Net'
```

*Mots-clés : pilote driver module noyau lsmod modprobe équivalent pnputil*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
