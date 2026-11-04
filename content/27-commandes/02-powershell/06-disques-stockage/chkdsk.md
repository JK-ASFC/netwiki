---
title: "chkdsk"
description: "PowerShell — chkdsk (Maintenance corrective) : Vérifie/répare un système de fichiers."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Maintenance corrective |
| **Commande type** | `chkdsk C: /f` |

## Rôle

Vérifie/répare un système de fichiers.

## Options

| Option | Rôle |
| --- | --- |
| `/f` | répare |
| `/r` | secteurs défectueux |
| `/scan` | analyse en ligne |

## Exemples

**Réparer un volume**

```powershell
chkdsk C: /f
```

*Mots-clés : disque erreur réparer système de fichiers chkdsk*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
