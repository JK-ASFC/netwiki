---
title: "egrep"
description: "Bash — egrep (Fichiers / Recherche) : Recherche par regex étendue (= grep -E)."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
egrep "err|fail" app.log
```

**Récursif**

```bash
egrep -ri "TODO" src/
```

**Compter**

```bash
egrep -c "GET " acces.log
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/egrep|egrep (macOS)]]

*Mots-clés : recherche regex étendue motif egrep*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
