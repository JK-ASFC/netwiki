---
title: "robocopy"
description: "PowerShell — robocopy (Copie robuste (= rsync)) : Copie et synchronise des dossiers de façon robuste (reprise, miroir). L'équivalent Windows de rsync."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Copie robuste (= rsync) |
| **Commande type** | `robocopy source dest /MIR` |

## Rôle

Copie et synchronise des dossiers de façon robuste (reprise, miroir). L'équivalent Windows de rsync.

## Options

| Option | Rôle |
| --- | --- |
| `/MIR` | miroir exact (copie + supprime ce qui n'existe plus à la source) |
| `/E` | copie les sous-dossiers, y compris vides |
| `/Z` | mode redémarrable (reprend un transfert interrompu) |
| `/XF ‹motif›` | exclut des fichiers |
| `/R:‹N›` | nombre de tentatives sur erreur |
| `/LOG:‹fichier›` | journalise l'opération |

## Exemples

**Miroir de dossier**

```powershell
robocopy C:\src D:\backup /MIR
```

**Copie robuste**

```powershell
robocopy \\srv\part C:\local /E /Z /R:3
```

**Avec journal**

```powershell
robocopy A B /MIR /LOG:copie.txt
```

*Mots-clés : rsync robocopy copie synchronisation miroir sauvegarde reprise dossier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
