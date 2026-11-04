---
title: "Get-Counter"
description: "PowerShell — Get-Counter (Compteurs de perf (= vmstat/free)) : Lit les compteurs de performance Windows : CPU, mémoire, disque, réseau. Complément de free/top."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Compteurs de perf (= vmstat/free) |
| **Commande type** | `Get-Counter '\Memory\Available MBytes'` |

## Rôle

Lit les compteurs de performance Windows : CPU, mémoire, disque, réseau. Complément de free/top.

## Options

| Option | Rôle |
| --- | --- |
| `'\Memory\Available MBytes'` | mémoire disponible (= free) |
| `'\Processor(_Total)\% Processor Time'` | charge CPU globale |
| `-Continuous` | relève en continu |
| `-SampleInterval ‹N›` | intervalle entre relevés |
| `-MaxSamples ‹N›` | nombre de relevés |

## Exemples

**Mémoire dispo**

```powershell
Get-Counter '\Memory\Available MBytes'
```

**CPU en continu**

```powershell
Get-Counter '\Processor(_Total)\% Processor Time' -Continuous
```

**Mémoire via CIM**

```powershell
Get-CimInstance Win32_OperatingSystem | Select FreePhysicalMemory,TotalVisibleMemorySize
```

## Dans les autres shells

- [[27-commandes/02-powershell/26-systeme/get-counter|Get-Counter (PowerShell)]]

*Mots-clés : performance compteurs cpu mémoire get-counter perfmon surveillance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
