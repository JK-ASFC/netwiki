---
title: "Compress-Archive"
description: "PowerShell — Compress-Archive (Sauvegarde & restauration) : Crée/extrait des archives ZIP natives."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde & restauration |
| **Commande type** | `Compress-Archive -Path logs\* -DestinationPath logs.zip` |

## Rôle

Crée/extrait des archives ZIP natives.

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹source›` | source |
| `-DestinationPath ‹archive.zip›` | zip cible |
| `-Update` | ajoute |
| `Expand-Archive` | extrait |

## Exemples

**Zipper des logs**

```powershell
Compress-Archive -Path logs\* -DestinationPath logs.zip
```

**Extraire**

```powershell
Expand-Archive logs.zip -DestinationPath .\out
```

*Mots-clés : archive zip compression sauvegarde extraire compress-archive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
