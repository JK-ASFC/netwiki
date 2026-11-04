---
title: "git init"
description: "Bash — git init (Git / Démarrage) : Initialise un nouveau dépôt Git dans le dossier courant."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Git / Démarrage |
| **Commande type** | `git init` |

## Rôle

Initialise un nouveau dépôt Git dans le dossier courant.

## En détail

Transforme un dossier ordinaire en dépôt Git, pour commencer à suivre l'historique d'un nouveau projet.

## Options

| Option | Rôle |
| --- | --- |
| `-b ‹branche›` | nomme la branche initiale |
| `--bare` | dépôt nu (serveur) |
| `(sans arg)` | dépôt dans le dossier courant |
| `(dossier)` | crée puis init |

## Exemples

**Initialiser**

```bash
git init
```

**Branche main**

```bash
git init -b main
```

**Dépôt serveur**

```bash
git init --bare projet.git
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-init|git init (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-init|git init (macOS)]]

*Mots-clés : initialiser dépôt créer git init*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
