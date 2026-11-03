---
title: "StartThreads"
description: "Directive Apache StartThreads (mpm_common) — Nombre de threads créés au démarrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de threads créés au démarrage |
| **Syntaxe** | `StartThreads nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

C'est le nombre de threads créés au démarrage du serveur. Comme le nombre de threads est contrôlé dynamiquement en fonction de la charge (voir [[13-directives/minsparethreads|MinSpareThreads]], [[13-directives/maxsparethreads|MaxSpareThreads]], [[13-directives/minspareservers|MinSpareServers]], [[13-directives/maxspareservers|MaxSpareServers]]), il n'est en général pas nécessaire d'ajuster ce paramètre.

Pour [[12-modules/mpm_netware|mpm_netware]], la définition par défaut est `StartThreads 50` et, comme il n'y a qu'un processus, il s'agit du nombre total de threads créés au démarrage pour servir les requêtes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
