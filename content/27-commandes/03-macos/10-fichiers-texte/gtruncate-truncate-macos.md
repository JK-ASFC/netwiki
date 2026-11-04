---
title: "gtruncate (truncate macOS)"
description: "macOS — gtruncate (truncate macOS) (Fichiers / Taille (= truncate)) : Fixe ou ajuste la taille d'un fichier. macOS n'a pas truncate de base : la version GNU s'installe avec Homebrew (coreutils) sous le nom préfixé gtruncate."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Taille (= truncate) |
| **Commande type** | `gtruncate -s 0 fichier` |

## Rôle

Fixe ou ajuste la taille d'un fichier. macOS n'a pas truncate de base : la version GNU s'installe avec Homebrew (coreutils) sous le nom préfixé gtruncate.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-s ‹taille›` | taille absolue, ou relative avec un préfixe |
| `-r ‹fichier›` | prend la taille de ce fichier |
| `-c` | ne crée pas un fichier absent |
| `-o` | taille en blocs d'E/S, pas en octets |
| `‹fichier›` | fichier(s) à modifier |
| `(préfixes) + - < > / %` | taille relative (version GNU) |
| `(unités) K=1024 KB=1000` | M et MB, G et GB... suivent la même règle |
| `(brew) brew install coreutils` | fournit gtruncate |
| `(BSD) truncate` | syntaxe de la version BSD, si elle existe |
| `(zsh) : > fichier` | vider sans attendre sur l'entrée |
| `(sans préfixe) gnubin dans le PATH` | appeler truncate sans le g |

> [!WARNING]
> Options à manier avec précaution : `-s ‹taille›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vider un fichier**

```zsh
gtruncate -s 0 app.log
```

**Fixer une taille de 10 Mio (fichier creux)**

```zsh
gtruncate -s 10M disque.img
```

**Réduire sans jamais agrandir ni créer**

```zsh
gtruncate -c -s '<100M' journal.log
```

*Mots-clés : gtruncate truncate taille vider tronquer fichier creux coreutils homebrew macos*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
