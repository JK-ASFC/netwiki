---
title: "WatchdogInterval"
description: "Directive Apache WatchdogInterval (mod_watchdog) — Intervalle Watchdog en secondes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_watchdog]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Intervalle Watchdog en secondes |
| **Syntaxe** | `WatchdogInterval time-interval[s]` |
| **Valeur par défaut** | `WatchdogInterval 1` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_watchdog\|mod_watchdog]] |

## Utilisation

Cette directive permet de définir l'intervalle entre chaque exécution du branchement watchdog. La valeur par défaut est de 1 seconde.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
