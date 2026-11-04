---
title: "lynis update"
description: "macOS — lynis update (Audit / Mise à jour) : Vérifie si une version plus récente de Lynis existe et renseigne sur la version installée. Lynis ne se met pas à jour tout seul."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Mise à jour |
| **Commande type** | `lynis update info` |

## Rôle

Vérifie si une version plus récente de Lynis existe et renseigne sur la version installée. Lynis ne se met pas à jour tout seul.

## Options

| Option | Rôle |
| --- | --- |
| `check` | une version plus récente existe-t-elle |
| `info` | détails sur la version et les mises à jour |
| `(DNS) enregistrement TXT` | comment la vérification se fait |
| `(brew) brew upgrade lynis` | mise à jour par Homebrew |
| `(Git) git pull` | mise à jour d'un clone |

## Exemples

**Contrôler les mises à jour**

```zsh
lynis update check
```

**Détails de version**

```zsh
lynis update info
```

**Version installée**

```zsh
lynis show version
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis-update|lynis update (Bash)]]

*Mots-clés : lynis update check info version mise à jour obsolète*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
