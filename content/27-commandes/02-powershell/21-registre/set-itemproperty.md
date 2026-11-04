---
title: "Set-ItemProperty"
description: "PowerShell — Set-ItemProperty (Registre & configuration) : Écrit une valeur de Registre (durcissement, réglages)."
tags: [powershell, commande, registre]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Registre |
| **Contexte** | Registre & configuration |
| **Commande type** | `Set-ItemProperty "HKCU:\Path" -Name Hidden -Value 1` |

## Rôle

Écrit une valeur de Registre (durcissement, réglages).

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹chemin›` | clé |
| `-Name ‹propriété›` | valeur |
| `-Value ‹valeur›` | donnée |
| `-Type ‹type›` | type (DWord) |

## Exemples

**Afficher fichiers caches**

```powershell
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name Hidden -Value 1
```

*Mots-clés : registre écrire clé valeur durcissement set-itemproperty*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
