---
title: "basename"
description: "Bash — basename (Manipuler les chemins) : Extrait le nom de fichier d'un chemin (et peut retirer une extension)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
basename /var/log/syslog
```

**Sans extension**

```bash
basename rapport.pdf .pdf
```

**Plusieurs**

```bash
basename -a /a/b.txt /c/d.log
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/basename|basename (macOS)]]

*Mots-clés : basename chemin nom fichier extension path script suffixe*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
