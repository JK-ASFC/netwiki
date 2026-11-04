---
title: "ulimit"
description: "Bash — ulimit (Comptes / Limites) : Affiche ou règle les limites de ressources du shell."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Limites |
| **Commande type** | `ulimit -a` |

## Rôle

Affiche ou règle les limites de ressources du shell.

## En détail

Affiche ou fixe les limites de ressources d'une session (nombre de fichiers ouverts, mémoire). Sert à éviter qu'un processus ne sature la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | affiche toutes les limites (lecture) |
| `-H` | cible le plafond DUR (hard) : maximum absolu, seul root peut l'augmenter |
| `-S` | cible la limite SOUPLE (soft) : valeur appliquée, ajustable jusqu'au plafond dur |
| `-n ‹N›` | nombre max de descripteurs de fichiers ouverts (le réglage le plus courant) |
| `-u ‹N›` | nombre max de processus de l'utilisateur |
| `-f ‹N›` | taille max d'un fichier créé (blocs de 512 o) |
| `-c ‹N›` | taille max d'un fichier core dump |
| `-s ‹N›` | taille max de la pile, stack (Kio) |
| `-v ‹N›` | mémoire virtuelle max (Kio) |
| `-l ‹N›` | mémoire verrouillable en RAM max (Kio) |
| `-t ‹N›` | temps CPU max (secondes) |

## Exemples

**Tout voir**

```bash
ulimit -a
```

**Descripteurs ouverts (soft)**

```bash
ulimit -Sn 65535
```

**Plafond dur des descripteurs**

```bash
ulimit -Hn 65535
```

**Processus max**

```bash
ulimit -u 4096
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/ulimit|ulimit (macOS)]]

*Mots-clés : limites ressources descripteurs fichiers ulimit*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
