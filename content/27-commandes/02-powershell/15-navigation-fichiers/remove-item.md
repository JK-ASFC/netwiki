---
title: "Remove-Item"
description: "PowerShell — Remove-Item (Fichiers / Suppression) : Supprime fichiers et dossiers (alias rm, del)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Suppression |
| **Commande type** | `Remove-Item ancien.log` |

## Rôle

Supprime fichiers et dossiers (alias rm, del).

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-Recurse` | récursif (dossiers) |
| ⚠️ `-Force` | force (caches, lecture seule) |
| `-WhatIf` | simulation |
| `-Confirm` | demande confirmation |

> [!WARNING]
> Options à manier avec précaution : `-Recurse`, `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Un fichier**

```powershell
Remove-Item ancien.log
```

**Un dossier**

```powershell
Remove-Item -Recurse -Force ancien_projet
```

**Simuler**

```powershell
Remove-Item *.tmp -WhatIf
```

*Mots-clés : supprimer effacer fichier dossier danger remove-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
