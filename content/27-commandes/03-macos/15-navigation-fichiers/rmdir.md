---
title: "rmdir"
description: "macOS — rmdir (Fichiers / Répertoires) : Supprime uniquement des répertoires vides."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Répertoires |
| **Commande type** | `rmdir dossier_vide` |

## Rôle

Supprime uniquement des répertoires vides.

## En détail

Supprime un dossier, mais seulement s'il est déjà vidé. Pour un dossier plein, on utilise rm -r.

## Options

| Option | Rôle |
| --- | --- |
| `-p` | supprime aussi les parents vides |
| `(arg)` | doit être vidé |

## Exemples

**Un dossier vide**

```zsh
rmdir build
```

**Parents vides**

```zsh
rmdir -p a/b/c
```

**Si non vidé**

```zsh
rm -r dossier/
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/rmdir|rmdir (Bash)]]

*Mots-clés : supprimer répertoire vide rmdir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
