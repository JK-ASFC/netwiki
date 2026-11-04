---
title: "findstr"
description: "PowerShell — findstr (Recherche / classique) : Chercheur de chaînes classique de Windows (cmd), utile même sans PowerShell."
tags: [powershell, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Recherche |
| **Contexte** | Recherche / classique |
| **Commande type** | `findstr /S /I /N "error" *.log` |

## Rôle

Chercheur de chaînes classique de Windows (cmd), utile même sans PowerShell.

## Options

| Option | Rôle |
| --- | --- |
| `/S` | récursif (sous-dossiers) |
| `/I` | insensible à la casse |
| `/N` | affiche le numéro de ligne |
| `/R` | le motif est une regex |
| `/V` | lignes qui NE contiennent PAS le motif |
| `/M` | affiche seulement les noms de fichiers |
| `/C:‹chaine›` | chaîne littérale (espaces autorisés) |

## Exemples

**Chercher récursivement**

```powershell
findstr /S /I "timeout" *.log
```

**Avec une regex**

```powershell
findstr /R "^ERROR" journal.txt
```

**Noms de fichiers seulement**

```powershell
findstr /M /S "TODO" *.ps1
```

*Mots-clés : findstr chercher texte motif grep classique cmd windows recherche filtrer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
