---
title: "readlink"
description: "Bash — readlink (Fichiers / Liens) : Résout la cible d'un lien symbolique."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
readlink -f /usr/bin/python
```

**Cible directe**

```bash
readlink /etc/alternatives/editor
```

**Via realpath**

```bash
realpath ./script.sh
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/readlink|readlink (macOS)]]

*Mots-clés : lien symbolique cible chemin absolu résoudre readlink*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
