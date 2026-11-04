---
title: "dirname"
description: "Bash — dirname (Manipuler les chemins) : Extrait le dossier parent d'un chemin (l'inverse de basename)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Manipuler les chemins |
| **Commande type** | `dirname /chemin/fichier.txt` |

## Rôle

Extrait le dossier parent d'un chemin (l'inverse de basename).

## Options

| Option | Rôle |
| --- | --- |
| `("$(dirname "$0")")` | dossier du script courant, motif classique |

## Exemples

**Dossier parent**

```bash
dirname /var/log/syslog
```

**Se placer dans le dossier du script**

```bash
cd "$(dirname "$0")"
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/dirname|dirname (macOS)]]

*Mots-clés : dirname chemin dossier parent répertoire path script*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
