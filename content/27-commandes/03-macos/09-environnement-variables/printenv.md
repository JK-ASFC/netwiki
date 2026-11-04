---
title: "printenv"
description: "macOS — printenv (Environnement / Variables) : Affiche les variables d'environnement."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Variables |
| **Commande type** | `printenv PATH` |

## Rôle

Affiche les variables d'environnement.

## En détail

Affiche les variables d'environnement (ou juste une seule). Sert à vérifier un réglage comme le PATH ou un proxy.

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | toutes les variables |
| `VAR` | une seule |

## Exemples

**Une variable**

```zsh
printenv PATH
```

**Toutes**

```zsh
printenv
```

**Filtrer**

```zsh
printenv | grep -i proxy
```

## Dans les autres shells

- [[27-commandes/01-bash/09-environnement-variables/printenv|printenv (Bash)]]

*Mots-clés : variables environnement afficher printenv*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
