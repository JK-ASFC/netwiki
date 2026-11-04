---
title: "Set-GPRegistryValue"
description: "PowerShell — Set-GPRegistryValue (Stratégie de groupe) : Écrit une valeur de registre appliquée par le GPO : c'est le cœur d'une stratégie."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `Set-GPRegistryValue -Name "Conf" -Key "HKLM\Software\Policies" -ValueName "X" -Type DWord -Value 1` |

## Rôle

Écrit une valeur de registre appliquée par le GPO : c'est le cœur d'une stratégie.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹GPO›` | le GPO cible |
| `-Key ‹HKLM\...›` | clé de registre |
| `-ValueName ‹nom›` | nom de la valeur |
| `-Type ‹DWord/String›` | type de donnée |
| `-Value ‹donnée›` | valeur à écrire |

## Exemples

**Définir une stratégie**

```powershell
Set-GPRegistryValue -Name "Conf" -Key "HKLM\Software\Policies\..." -ValueName "NoControlPanel" -Type DWord -Value 1
```

*Mots-clés : set-gpregistryvalue gpo registre valeur stratégie clé dword policy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
