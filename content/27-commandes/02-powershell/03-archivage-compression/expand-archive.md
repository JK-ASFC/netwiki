---
title: "Expand-Archive"
description: "PowerShell — Expand-Archive (Fichiers / Compression) : Décompresse une archive .zip (inverse de Compress-Archive)."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Compression |
| **Commande type** | `Expand-Archive logs.zip -DestinationPath C:\Logs` |

## Rôle

Décompresse une archive .zip (inverse de Compress-Archive).

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹archive.zip›` | archive source |
| `-DestinationPath ‹dossier›` | dossier cible |
| `-Force` | écrase l'existant |
| `Compress-Archive` | pour compresser |

## Exemples

**Extraire**

```powershell
Expand-Archive logs.zip -DestinationPath C:\Logs
```

**Forcer**

```powershell
Expand-Archive data.zip -DestinationPath . -Force
```

**Compresser (inverse)**

```powershell
Compress-Archive *.log -DestinationPath logs.zip
```

*Mots-clés : décompresser extraire archive zip expand-archive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
