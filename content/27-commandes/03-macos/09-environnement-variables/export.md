---
title: "export"
description: "macOS — export (Environnement / Variables) : Exporte une variable vers les processus enfants."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Variables |
| **Commande type** | `export EDITOR=vim` |

## Rôle

Exporte une variable vers les processus enfants.

## En détail

Rend une variable disponible pour les programmes lancés ensuite. Sans export, la variable reste limitée au shell courant.

## Options

| Option | Rôle |
| --- | --- |
| `VAR=valeur` | définit et exporte |
| `-p` | liste les variables exportées |
| `-n` | retire l'export |
| `(rendre persistant)` | ajouter la ligne à ~/.bashrc (session) ou /etc/profile.d/ (système) |

## Exemples

**Définir**

```zsh
export EDITOR=vim
```

**Lister**

```zsh
export -p
```

**Composer un PATH**

```zsh
export PATH="$HOME/bin:$PATH"
```

## Dans les autres shells

- [[27-commandes/01-bash/09-environnement-variables/export|export (Bash)]]

*Mots-clés : exporter variable environnement persistance export*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
