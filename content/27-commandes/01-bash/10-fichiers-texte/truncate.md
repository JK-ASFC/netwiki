---
title: "truncate"
description: "Bash — truncate (Fichiers / Taille & troncature) : Fixe ou ajuste la taille d'un fichier : le vide, le réduit (les données en trop sont perdues) ou l'agrandit par un trou qui se lit comme des zéros."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Taille & troncature |
| **Commande type** | `truncate -s 0 fichier` |

## Rôle

Fixe ou ajuste la taille d'un fichier : le vide, le réduit (les données en trop sont perdues) ou l'agrandit par un trou qui se lit comme des zéros.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-s ‹taille›` | taille absolue, ou relative avec un préfixe |
| `-r ‹fichier›` | prend la taille de ce fichier |
| `-c` | ne crée pas un fichier absent |
| `-o` | taille en blocs d'E/S, pas en octets |
| `‹fichier›` | fichier(s) à modifier |
| `(préfixes) + - < > / %` | taille relative à la taille actuelle |
| `(unités) K=1024 KB=1000` | M et MB, G et GB... suivent la même règle |
| `(creux) ls -lh et du -h` | taille apparente et espace réel |
| `(vider) : > fichier` | autre façon de vider |
| `(réserver) fallocate -l 10M fichier` | alloue vraiment l'espace |
| `(journal ouvert) processus en écriture` | tronquer un fichier encore utilisé |

> [!WARNING]
> Options à manier avec précaution : `-s ‹taille›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vider un fichier**

```bash
truncate -s 0 app.log
```

**Fixer une taille de 10 Mio (fichier creux)**

```bash
truncate -s 10M disque.img
```

**Réduire sans jamais agrandir ni créer**

```bash
truncate -c -s '<100M' journal.log
```

*Mots-clés : truncate taille vider tronquer fichier creux sparse journal log coreutils ftruncate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
