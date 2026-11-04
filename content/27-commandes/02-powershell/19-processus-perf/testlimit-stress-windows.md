---
title: "Testlimit (stress Windows)"
description: "PowerShell — Testlimit (stress Windows) (Charge & épuisement de ressources) : Utilitaire Sysinternals qui simule une penurie de ressources : mémoire, handles, processus, threads. Le pendant Windows de stress pour tout ce qui n'est pas le processeur."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Charge & épuisement de ressources |
| **Commande type** | `Testlimit -d 512 -c 4` |

## Rôle

Utilitaire Sysinternals qui simule une penurie de ressources : mémoire, handles, processus, threads. Le pendant Windows de stress pour tout ce qui n'est pas le processeur.

## Options

| Option | Rôle |
| --- | --- |
| `-d ‹Mo›` | fuite mémoire AVEC écriture : consomme de la RAM physique |
| `-m ‹Mo›` | fuite mémoire sans y toucher : consomme la validation |
| `-r ‹Mo›` | réserve l'espace d'adressage sans le valider |
| `-s ‹Mo›` | fuite de mémoire partagée |
| `-v ‹Mo›` | verrouille la mémoire en RAM (VirtualLock) |
| `-a ‹Mo›` | fuite de mémoire AWE |
| `-l ‹Mo›` | alloue en grandes pages |
| `-p` | crée des processus jusqu'à épuisement |
| `-t` | crée des threads jusqu'à épuisement |
| `-n ‹Ko›` | avec -t : réserve de pile ; avec -p : jeu de travail minimal |
| `-h` | crée des handles ; ajouter -u pour aussi allouer des objets fichier |
| `-u` | crée des handles USER sur des menus |
| `-i` | epuise le tas de bureau USER |
| `-g ‹taille›` | handles GDI ; taille 0 pour épuiser les objets GDI |
| `-w` | remonte au maximum le minimum du jeu de travail |
| `-e ‹secondes›` | attente entre deux allocations |
| `-c ‹nombre›` | nombre d'objets à allouer ; DOIT être la dernière option |
| `(processeur) CPUSTRES` | Testlimit ne charge pas le CPU : voir CPUSTRES ou une boucle PowerShell |
| `(disque) DiskSpd` | charge en entrées-sorties : outil DiskSpd de Microsoft |

## Exemples

**Occuper 2 Go de mémoire**

```powershell
Testlimit -d 512 -c 4
```

**Fuite progressive**

```powershell
Testlimit -d 64 -e 1 -c 32
```

**Charge processeur sans outil tiers**

```powershell
1..4 | ForEach-Object { Start-Job { while ($true) {} } }
```

*Mots-clés : stress charge test résistance windows sysinternals testlimit mémoire fuite handles processus threads épuisement cpustres diskspd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
