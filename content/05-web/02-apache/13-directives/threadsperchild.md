---
title: "ThreadsPerChild"
description: "Directive Apache ThreadsPerChild (mpm_common) — Nombre de threads créés par chaque processus enfant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de threads créés par chaque processus enfant |
| **Syntaxe** | `ThreadsPerChild nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Cette directive permet de définir le nombre de threads que va créer chaque processus enfant. Un processus enfant crée ces threads au démarrage et n'en crée plus d'autres par la suite. Si l'on utilise un MPM comme [[12-modules/mpm_winnt|mpm_winnt]] qui ne lance qu'un processus enfant, ce nombre doit être suffisamment grand pour supporter la charge du serveur. Avec un MPM comme [[12-modules/worker|worker]] qui lance plusieurs processus enfants, c'est le nombre *total* de threads qui doit être suffisamment grand pour supporter la charge du serveur.

La valeur par défaut de la directive `ThreadsPerChild` est `64` avec [[12-modules/mpm_winnt|mpm_winnt]], et `25` avec les autres MPMs.

La valeur de la directive `ThreadsPerChild` ne peut pas dépasser la valeur de la directive [[13-directives/threadlimit|ThreadLimit]]. Si on spécifie une valeur supérieure, elle sera automatiquement réduite au démarrage du serveur et un avertissement sera enregistré dans le journal. La relation entre ces deux directives est expliquée dans la `documentation de la directive ThreadLimit`.

La valeur de la directive `ThreadsPerChild` doit être supérieure ou égale à 1. Une valeur inférieure à 1 sera automatiquement augmentée à 1 et un avertissement sera journalisé.

La valeur de la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] doit être un multiple entier de celle de la directive `ThreadsPerChild`. Voir la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] pour les détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
