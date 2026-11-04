---
title: "git clean"
description: "macOS — git clean (Git / Nettoyage) : Supprime les fichiers non suivis du répertoire de travail."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Git / Nettoyage |
| **Commande type** | `git clean -fd` |

## Rôle

Supprime les fichiers non suivis du répertoire de travail.

## En détail

Supprime les fichiers non suivis (non versionnés) du dossier de travail. Pratique pour répartir propre, mais irréversible : simuler avec -n d'abord.

## Options

| Option | Rôle |
| --- | --- |
| `-n` | simulation (montre sans supprimer) |
| ⚠️ `-f` | force la suppression |
| `-d` | inclut les dossiers |
| `-x` | inclut les fichiers ignorés |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Simuler d'abord**

```zsh
git clean -nd
```

**Supprimer**

```zsh
git clean -fd
```

**Avec les ignorés**

```zsh
git clean -fdx
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-clean|git clean (Bash)]]
- [[27-commandes/02-powershell/10-git/git-clean|git clean (PowerShell)]]

*Mots-clés : nettoyer supprimer fichiers non suivis danger git clean*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
