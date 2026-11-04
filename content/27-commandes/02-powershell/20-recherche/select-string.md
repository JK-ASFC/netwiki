---
title: "Select-String"
description: "PowerShell — Select-String (Analyse de logs) : Cherche un motif/regex : l'équivalent de grep."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Analyse de logs |
| **Commande type** | `Select-String -Path *.log -Pattern "error"` |

## Rôle

Cherche un motif/regex : l'équivalent de grep.

## Options

| Option | Rôle |
| --- | --- |
| `-Pattern ‹motif›` | motif/regex |
| `-Path ‹fichier›` | fichiers |
| `-Context ‹N›` | lignes autour |
| `-List` | 1er/fichier |
| `-NotMatch` | inverse |

## Exemples

**Grep récursif**

```powershell
Get-ChildItem -Recurse *.log | Select-String "timeout"
```

**Avec contexte**

```powershell
Select-String -Pattern "fail" -Path app.log -Context 2
```

*Mots-clés : chercher texte motif grep fichier regex filtrer select-string*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
