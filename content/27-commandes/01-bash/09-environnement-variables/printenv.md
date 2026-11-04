---
title: "printenv"
description: "Bash — printenv (Environnement / Variables) : Affiche les variables d'environnement."
tags: [bash, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
printenv PATH
```

**Toutes**

```bash
printenv
```

**Filtrer**

```bash
printenv | grep -i proxy
```

## Dans les autres shells

- [[27-commandes/03-macos/09-environnement-variables/printenv|printenv (macOS)]]

*Mots-clés : variables environnement afficher printenv*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
