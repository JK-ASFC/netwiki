---
title: "StartServers"
description: "Directive Apache StartServers (mpm_common) — Nombre de processus enfants du serveur créés au démarrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de processus enfants du serveur créés au démarrage |
| **Syntaxe** | `StartServers nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

La directive `StartServers` permet de définir le nombre de processus enfants du serveur créés au démarrage. Comme le nombre de processus est contrôlé dynamiquement en fonction de la charge (voir [[13-directives/minsparethreads|MinSpareThreads]], [[13-directives/maxsparethreads|MaxSpareThreads]], [[13-directives/minspareservers|MinSpareServers]], [[13-directives/maxspareservers|MaxSpareServers]]), il n'est en général pas nécessaire d'ajuster ce paramètre.

La valeur par défaut diffère d'un MPM à l'autre. Pour [[12-modules/worker|worker]] et [[12-modules/event|event]], la définition par défaut est `StartServers 3` ; la valeur par défaut est `5` pour [[12-modules/prefork|prefork]] et `2` pour [[12-modules/mpmt_os2|mpmt_os2]].

La valeur de la directive `StartServers` doit être supérieure ou égale à 1. Une valeur inférieure à 1 sera automatiquement augmentée à 1 et un avertissement sera journalisé. Pour le module [[12-modules/mpmt_os2|mpmt_os2]], la valeur 0 est aussi acceptée ; les valeurs inférieures à 0 sont automatiquement augmentées à 1.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
