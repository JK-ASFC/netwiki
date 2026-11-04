---
title: "readlink"
description: "macOS — readlink (Fichiers / Liens) : Résout la cible d'un lien symbolique."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Liens |
| **Commande type** | `readlink -f /usr/bin/python` |

## Rôle

Résout la cible d'un lien symbolique.

## En détail

Révèle la cible d'un lien symbolique : vers quel vrai fichier pointe ce raccourci. Avec -f, donne le chemin absolu résolu.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | chemin absolu résolu |
| `(sans -f)` | cible directe |

## Exemples

**Cible réelle**

```zsh
readlink -f /usr/bin/python
```

**Cible directe**

```zsh
readlink /etc/alternatives/editor
```

**Via realpath**

```zsh
realpath ./script.sh
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/readlink|readlink (Bash)]]

*Mots-clés : lien symbolique cible chemin absolu résoudre readlink*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
