---
title: "nproc"
description: "Bash — nproc (Environnement / Matériel) : Affiche le nombre de coeurs CPU disponibles."
tags: [bash, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Matériel |
| **Commande type** | `nproc` |

## Rôle

Affiche le nombre de coeurs CPU disponibles.

## En détail

Indique le nombre de coeurs du processeur. Utile pour répartir un traitement sur le bon nombre de tâches en parallèle.

## Options

| Option | Rôle |
| --- | --- |
| `--all` | tous les coeurs |
| `(sans arg)` | coeurs utilisables |
| `make -j` | usage typique |
| `getconf` | alternative |

## Exemples

**Compter**

```bash
nproc
```

**Tous les coeurs**

```bash
nproc --all
```

**Compiler en parallèle**

```bash
make -j"$(nproc)"
```

*Mots-clés : coeurs cpu processeurs parallélisme nproc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
