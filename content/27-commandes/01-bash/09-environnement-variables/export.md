---
title: "export"
description: "Bash — export (Environnement / Variables) : Exporte une variable vers les processus enfants."
tags: [bash, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
export EDITOR=vim
```

**Lister**

```bash
export -p
```

**Composer un PATH**

```bash
export PATH="$HOME/bin:$PATH"
```

## Dans les autres shells

- [[27-commandes/03-macos/09-environnement-variables/export|export (macOS)]]

*Mots-clés : exporter variable environnement persistance export*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
