---
title: "Move-Item"
description: "PowerShell — Move-Item (Fichiers / Déplacement) : Déplace ou renomme fichiers et dossiers (alias mv, move)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Déplacement |
| **Commande type** | `Move-Item rapport.pdf C:\Archive` |

## Rôle

Déplace ou renomme fichiers et dossiers (alias mv, move).

## Options

| Option | Rôle |
| --- | --- |
| `-Destination ‹cible›` | cible |
| `-Force` | remplace |
| `-Include ‹motif›` | filtre |
| `(meme dossier)` | renomme |

## Exemples

**Déplacer**

```powershell
Move-Item rapport.pdf C:\Archive
```

**Plusieurs**

```powershell
Move-Item *.log C:\Logs
```

**Forcer**

```powershell
Move-Item -Force a.txt b.txt
```

*Mots-clés : déplacer renommer fichier dossier move-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
