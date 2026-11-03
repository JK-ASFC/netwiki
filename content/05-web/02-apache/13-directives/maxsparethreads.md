---
title: "MaxSpareThreads"
description: "Directive Apache MaxSpareThreads (mpm_common) — Nombre maximum de threads inactifs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de threads inactifs |
| **Syntaxe** | `MaxSpareThreads nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

C'est le nombre maximum de threads inactifs. Les MPMs utilisent cette directive de différentes manières.

Pour [[12-modules/worker|worker]] et [[12-modules/event|event]], la définition par défaut est `MaxSpareThreads 250`. Ce MPM gère les threads inactifs au niveau du serveur. Si le serveur possède trop de threads inactifs, des processus enfants seront arrêtés jusqu'à ce que le nombre de threads inactifs repasse en dessous de cette limite. Des processus/threads supplémentaires sont susceptibles d'être créés si [[13-directives/listencoresbucketsratio|ListenCoresBucketsRatio]] est activée.

Pour [[12-modules/mpm_netware|mpm_netware]], la définition par défaut est `MaxSpareThreads 100`. Comme ce MPM n'exécute qu'un seul processus, le nombre de processus inactifs est surveillé au niveau du serveur.

[[12-modules/mpmt_os2|mpmt_os2]] fonctionne de manière similaire à [[12-modules/mpm_netware|mpm_netware]]. Pour [[12-modules/mpmt_os2|mpmt_os2]], la valeur par défaut est `10`.

> [!NOTE]
> **Contraintes**
>
> La gamme de valeurs pour `MaxSpareThreads` est limitée. Apache httpd corrigera automatiquement cette valeur selon les règles suivantes :
>
> - Avec [[12-modules/mpm_netware|mpm_netware]], `MaxSpareThreads` doit être supérieure à [[13-directives/minsparethreads|MinSpareThreads]].
> - Avec [[12-modules/worker|worker]] et [[12-modules/event|event]], `MaxSpareThreads` doit être supérieure ou égale à la somme de [[13-directives/minsparethreads|MinSpareThreads]] et [[13-directives/threadsperchild|ThreadsPerChild]].

## Voir aussi

- [[13-directives/minsparethreads|MinSpareThreads]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
