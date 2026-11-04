---
title: "Get-ItemProperty"
description: "PowerShell — Get-ItemProperty (Registre & configuration) : Lit des clés/valeurs du Registre."
tags: [powershell, commande, registre]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Registre |
| **Contexte** | Registre & configuration |
| **Commande type** | `Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"` |

## Rôle

Lit des clés/valeurs du Registre.

## Options

| Option | Rôle |
| --- | --- |
| `HKLM:/HKCU:` | ruches |
| `-Name ‹propriété›` | une valeur |
| `Set-ItemProperty` | écrit |
| `New-ItemProperty` | crée |

## Exemples

**Version de Windows**

```powershell
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" | Select ProductName,DisplayVersion
```

*Mots-clés : registre clé valeur configuration regedit get-itemproperty*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
