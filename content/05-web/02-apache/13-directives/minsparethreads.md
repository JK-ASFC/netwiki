---
title: "MinSpareThreads"
description: "Directive Apache MinSpareThreads (mpm_common) — Nombre minimum de threads inactifs qui seront disponibles pour pouvoir traiter les pics de requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre minimum de threads inactifs qui seront disponibles pour pouvoir traiter les pics de requêtes |
| **Syntaxe** | `MinSpareThreads nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

C'est le nombre minimum de threads inactifs pour être en mesure de traiter les pics de requêtes. Les MPMs utilisent cette directive de différentes manières.

Avec [[12-modules/worker|worker]] et [[12-modules/event|event]], la définition par défaut est `MinSpareThreads 75`, et le nombre de threads inactifs est surveillé au niveau du serveur. Si le serveur ne possède pas assez de threads inactifs, des processus enfants sont créés jusqu'à ce que le nombre de threads inactifs repasse au dessus de *nombre*. Des processus/threads supplémentaires peuvent être créés si [[13-directives/listencoresbucketsratio|ListenCoresBucketsRatio]] est activée.

Avec [[12-modules/mpm_netware|mpm_netware]], la définition par défaut est `MinSpareThreads 10` et, comme ce MPM n'exécute qu'un seul processus, le nombre de threads est surveillé au niveau général du serveur.

[[12-modules/mpmt_os2|mpmt_os2]] fonctionne de manière similaire à [[12-modules/mpm_netware|mpm_netware]]. Pour [[12-modules/mpmt_os2|mpmt_os2]], la valeur par défaut est `5`.

La valeur de la directive `MinSpareThreads` doit être supérieure ou égale à 1. Une valeur inférieure à 1 sera automatiquement augmentée à 1 et un avertissement sera journalisé.

## Voir aussi

- [[13-directives/maxsparethreads|MaxSpareThreads]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
