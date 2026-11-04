---
title: "Set-ItemProperty -Name Attributes"
description: "PowerShell — Set-ItemProperty -Name Attributes (Attributs de fichiers) : Pose les attributs d'un fichier Windows (lecture seule, caché, système) : le plus proche équivalent de chattr."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Attributs de fichiers |
| **Commande type** | `Set-ItemProperty -Path fichier.txt -Name Attributes -Value ReadOnly` |

## Rôle

Pose les attributs d'un fichier Windows (lecture seule, caché, système) : le plus proche équivalent de chattr.

## Options

| Option | Rôle |
| --- | --- |
| `-Value ReadOnly` | LECTURE SEULE : équivalent le plus proche de chattr +i (un administrateur peut toujours le retirer) |
| `-Value Hidden` | fichier CACHÉ : masqué dans l'explorateur et par dir |
| `-Value System` | fichier SYSTÈME : protégé et masqué par défaut |
| `-Value Normal` | retire tous les attributs spéciaux |
| `-Value 'ReadOnly,Hidden'` | combine plusieurs attributs, séparés par des virgules |

## Exemples

**Lecture seule**

```powershell
Set-ItemProperty -Path fichier.txt -Name Attributes -Value ReadOnly
```

**Lever**

```powershell
Set-ItemProperty -Path fichier.txt -Name Attributes -Value Normal
```

**Lire les attributs**

```powershell
Get-ItemProperty -Path fichier.txt -Name Attributes
```

*Mots-clés : attribut readonly hidden system chattr lsattr équivalent verrouiller fichier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
