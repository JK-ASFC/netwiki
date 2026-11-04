---
title: "basename"
description: "macOS — basename (Manipuler les chemins) : Extrait le nom de fichier d'un chemin (et peut retirer une extension)."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Manipuler les chemins |
| **Commande type** | `basename /chemin/fichier.txt` |

## Rôle

Extrait le nom de fichier d'un chemin (et peut retirer une extension).

## Options

| Option | Rôle |
| --- | --- |
| `-s ‹.ext›` | retire un suffixe (ex. .txt) |
| `-a` | traite plusieurs arguments |

## Exemples

**Nom seul**

```zsh
basename /var/log/syslog
```

**Sans extension**

```zsh
basename rapport.pdf .pdf
```

**Plusieurs**

```zsh
basename -a /a/b.txt /c/d.log
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/basename|basename (Bash)]]

*Mots-clés : basename chemin nom fichier extension path script suffixe*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
