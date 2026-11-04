---
title: "Get-Counter"
description: "PowerShell — Get-Counter (Performance) : Relève les compteurs de performance Windows : l'équivalent de iostat/pidstat/vmstat."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Performance |
| **Commande type** | `Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 2 -MaxSamples 5` |

## Rôle

Relève les compteurs de performance Windows : l'équivalent de iostat/pidstat/vmstat.

## Options

| Option | Rôle |
| --- | --- |
| `-Counter ‹'\chemin\compteur'›` | chemin du compteur à relever (ex : '\LogicalDisk(*)\Disk Reads/sec') |
| `-SampleInterval ‹secondes›` | intervalle de rafraîchissement en secondes (équivalent du 2 de iostat) |
| `-MaxSamples ‹nombre›` | nombre de relevés avant de s'arrêter (sans lui : un seul relevé) |
| `-Continuous` | relève EN CONTINU jusqu'à interruption (Ctrl+C) |
| `-ListSet *` | liste tous les jeux de compteurs disponibles sur la machine |

## Exemples

**CPU toutes les 2 s**

```powershell
Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 2 -MaxSamples 5
```

**Disque**

```powershell
Get-Counter '\LogicalDisk(*)\Disk Bytes/sec' -SampleInterval 2
```

**Lister les compteurs**

```powershell
Get-Counter -ListSet * | Select-Object CounterSetName
```

## Dans les autres shells

- [[27-commandes/02-powershell/19-processus-perf/get-counter|Get-Counter (PowerShell)]]

*Mots-clés : performance compteur cpu disque mémoire iostat pidstat équivalent surveillance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
