---
title: "egrep"
description: "macOS — egrep (Fichiers / Recherche) : Recherche par regex étendue (= grep -E)."
tags: [macos, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Recherche |
| **Contexte** | Fichiers / Recherche |
| **Commande type** | `egrep "err\|fail" app.log` |

## Rôle

Recherche par regex étendue (= grep -E).

## En détail

Variante de grep qui comprend les expressions régulières étendues (équivalent de grep -E). Pour des recherches de motifs plus elaborees.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | insensible à la casse |
| `-r` | récursif |
| `-c` | compte les correspondances |
| `-v` | inverse |

## Exemples

**Alternatives**

```zsh
egrep "err|fail" app.log
```

**Récursif**

```zsh
egrep -ri "TODO" src/
```

**Compter**

```zsh
egrep -c "GET " acces.log
```

## Dans les autres shells

- [[27-commandes/01-bash/20-recherche/egrep|egrep (Bash)]]

*Mots-clés : recherche regex étendue motif egrep*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
