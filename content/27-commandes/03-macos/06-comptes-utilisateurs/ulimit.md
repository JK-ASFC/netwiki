---
title: "ulimit"
description: "macOS — ulimit (Limites de session) : Affiche ou règle les limites de ressources du shell zsh courant."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Limites de session |
| **Commande type** | `ulimit -a` |

## Rôle

Affiche ou règle les limites de ressources du shell zsh courant.

## En détail

Affiche ou fixe les limites de ressources d'une session (nombre de fichiers ouverts, mémoire). Sert à éviter qu'un processus ne sature la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | toutes les limites |
| `-n ‹N›` | nombre max de descripteurs de fichiers |
| `-u ‹N›` | nombre max de processus |
| `-f ‹N›` | taille max d'un fichier créé |
| `-s ‹N›` | taille max de la pile |
| `-c ‹N›` | taille max d'un core dump |

## Exemples

**Tout voir**

```zsh
ulimit -a
```

**Descripteurs ouverts**

```zsh
ulimit -n 10240
```

## Dans les autres shells

- [[27-commandes/01-bash/06-comptes-utilisateurs/ulimit|ulimit (Bash)]]

*Mots-clés : limites ressources ulimit descripteurs fichiers session*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
