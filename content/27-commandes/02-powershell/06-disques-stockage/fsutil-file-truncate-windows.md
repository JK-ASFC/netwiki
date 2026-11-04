---
title: "fsutil file (truncate Windows)"
description: "PowerShell — fsutil file (truncate Windows) (Systèmes de fichiers (= truncate)) : Fixe la fin d'un fichier NTFS, en crée un de taille donnée ou met une plage à zéro : le plus proche de truncate -s sous Windows. Exige un compte administrateur."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Systèmes de fichiers (= truncate) |
| **Commande type** | `fsutil file seteof C:\temp\app.log 0` |

## Rôle

Fixe la fin d'un fichier NTFS, en crée un de taille donnée ou met une plage à zéro : le plus proche de truncate -s sous Windows. Exige un compte administrateur.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `seteof ‹fichier› ‹taille›` | fixe la fin du fichier, en octets |
| `createnew ‹fichier› ‹taille›` | crée un fichier rempli de zéros |
| ⚠️ `setzerodata offset=‹décalage› length=‹longueur› ‹fichier›` | met une plage à zéro |
| `queryallocranges offset=‹décalage› length=‹longueur› ‹fichier›` | plages allouées, pour repérer les trous |
| `(administrateur) invite élevée` | obligatoire |
| `(vider) Clear-Content` | sans fsutil, en PowerShell |

> [!WARNING]
> Options à manier avec précaution : `seteof ‹fichier› ‹taille›`, `setzerodata offset=‹décalage› length=‹longueur› ‹fichier›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Fixer la fin d'un fichier**

```powershell
fsutil file seteof C:\testfile.txt 1000
```

**Créer un fichier de 1 Mio de zéros**

```powershell
fsutil file createnew C:\temp\test.dat 1048576
```

**Mettre une plage à zéro**

```powershell
fsutil file setzerodata offset=100 length=150 C:\temp\sample.txt
```

*Mots-clés : fsutil file seteof createnew setzerodata truncate taille fichier ntfs eof sparse creux windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
