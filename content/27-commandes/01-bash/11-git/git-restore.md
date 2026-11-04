---
title: "git restore"
description: "Bash — git restore (Git / Annulation) : Annule les modifications d'un fichier non indexé."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Git / Annulation |
| **Commande type** | `git restore app.py` |

## Rôle

Annule les modifications d'un fichier non indexé.

## En détail

Annule les modifications d'un fichier pour revenir à la dernière version enregistrée, ou le retire de la zone d'index.

## Options

| Option | Rôle |
| --- | --- |
| `--staged` | retire de l'index |
| `--source` | depuis un commit précis |
| `.` | tout le dossier |
| `(fichier)` | depuis le dernier commit |

## Exemples

**Annuler les modifs**

```bash
git restore app.py
```

**Désindexer**

```bash
git restore --staged app.py
```

**Depuis un commit**

```bash
git restore --source HEAD~1 app.py
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-restore|git restore (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-restore|git restore (macOS)]]

*Mots-clés : restaurer annuler modifications fichier git restore*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
