---
title: "ZipFile (.NET)"
description: "PowerShell — ZipFile (.NET) (Archivage / .NET) : API .NET pour zipper/dézipper, plus souple que Compress-Archive (entrées individuelles, mise à jour)."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / .NET |
| **Commande type** | `[System.IO.Compression.ZipFile]::CreateFromDirectory(‹dossier›, ‹archive.zip›)` |

## Rôle

API .NET pour zipper/dézipper, plus souple que Compress-Archive (entrées individuelles, mise à jour).

## Options

| Option | Rôle |
| --- | --- |
| `::CreateFromDirectory(src, zip)` | zippe un dossier |
| `::ExtractToDirectory(zip, dest)` | extrait une archive |
| `[IO.Compression.ZipFile]` | classe à utiliser (Add-Type si besoin) |
| `Optimal / Fastest / NoCompression` | niveau (3e argument) |

## Exemples

**Zipper un dossier**

```powershell
[IO.Compression.ZipFile]::CreateFromDirectory("C:\site","C:\site.zip")
```

**Dézipper**

```powershell
[IO.Compression.ZipFile]::ExtractToDirectory("C:\site.zip","C:\out")
```

**Charger l'assembly**

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
```

*Mots-clés : zip net dotnet ziparchive compression createfromdirectory extracttodirectory windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
