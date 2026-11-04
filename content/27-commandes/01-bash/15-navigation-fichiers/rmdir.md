---
title: "rmdir"
description: "Bash — rmdir (Fichiers / Répertoires) : Supprime uniquement des répertoires vides."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
rmdir build
```

**Parents vides**

```bash
rmdir -p a/b/c
```

**Si non vidé**

```bash
rm -r dossier/
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/rmdir|rmdir (macOS)]]

*Mots-clés : supprimer répertoire vide rmdir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
