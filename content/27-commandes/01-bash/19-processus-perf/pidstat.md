---
title: "pidstat"
description: "Bash — pidstat (Performance) : Statistiques PAR PROCESSUS : CPU, mémoire, entrées/sorties disque et changements de contexte."
tags: [bash, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Processus & perf |
| **Contexte** | Performance |
| **Commande type** | `pidstat 2` |

## Rôle

Statistiques PAR PROCESSUS : CPU, mémoire, entrées/sorties disque et changements de contexte.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | utilisation CPU par processus (comportement par défaut) |
| `-r` | MÉMOIRE : taille virtuelle (VSZ), résidente (RSS) et défauts de page |
| `-d` | ENTRÉES/SORTIES disque par processus : lecture et écriture en Ko/s |
| `-w` | changements de contexte volontaires et forcés (révèle la contention) |
| `-h` | tout sur UNE seule ligne par relevé : bien plus facile à filtrer avec grep |
| `-p ‹PID ou ALL›` | cible un processus précis par son PID, ou ALL pour tous les processus |
| `-C ‹motif›` | ne suit que les processus dont le nom correspond au motif (ex : -C nginx) |
| `-t` | détaille les THREADS de chaque processus |
| `-l` | affiche la ligne de commande complète au lieu du seul nom |
| `‹intervalle en s› ‹nb de relevés›` | rafraîchissement : intervalle en secondes puis nombre de relevés (laisser vide = en continu) |

## Exemples

**Toutes les 2 s**

```bash
pidstat 2
```

**E/S disque, 5 relevés**

```bash
pidstat -d 1 5
```

**Un processus**

```bash
pidstat -p 1234 -u 2
```

**Par nom, une ligne**

```bash
pidstat -h -C nginx 2
```

*Mots-clés : processus performance cpu mémoire io statistiques pid sysstat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
