---
title: "ServerLimit"
description: "Directive Apache ServerLimit (mpm_common) — Limite supérieure de la définition du nombre de processus. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite supérieure de la définition du nombre de processus |
| **Syntaxe** | `ServerLimit nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Avec le MPM [[12-modules/prefork|prefork]], cette directive définit le nombre maximum que l'on peut affecter à la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]], et ceci pour la durée de vie du processus Apache httpd. Avec les MPMs [[12-modules/worker|worker]] et [[12-modules/event|event]], cette directive, en combinaison avec [[13-directives/threadlimit|ThreadLimit]], définit le nombre maximum que l'on peut affecter à [[13-directives/maxrequestworkers|MaxRequestWorkers]], et ceci pour la durée de vie du processus Apache httpd. Avec le MPM [[12-modules/event|event]], cette directive permet aussi de définir le nombre de processus anciens du serveur pouvant continuer à s'exécuter pour terminer le traitement des connexions ouvertes. Au cours d'un redémarrage, vous pouvez modifier la valeur de la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]], alors que toute tentative de modification de la valeur de la directive [[13-directives/serverlimit|ServerLimit]] sera ignorée.

Cette directive doit être utilisée avec précaution. Si `ServerLimit` est définie à une valeur beaucoup plus grande que nécessaire, de la mémoire partagée supplémentaire sera inutilement allouée. Si à la fois `ServerLimit` et [[13-directives/maxrequestworkers|MaxRequestWorkers]] possèdent des valeurs supérieures à ce que le système peut supporter, ce dernier peut devenir instable ou Apache httpd peut tout simplement refuser de démarrer.

Avec les MPMs [[12-modules/prefork|prefork]] et [[12-modules/event|event]], n'utilisez cette directive que si vous devez définir [[13-directives/maxrequestworkers|MaxRequestWorkers]] à une valeur supérieure à 256 (valeur par défaut). N'affectez pas à la directive [[13-directives/serverlimit|ServerLimit]] une valeur supérieure à celle que vous avez prévu d'affecter à la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]].

Avec [[12-modules/worker|worker]], n'utilisez cette directive que si la définition de vos directives [[13-directives/maxrequestworkers|MaxRequestWorkers]] et [[13-directives/threadsperchild|ThreadsPerChild]] nécessitent plus de 16 processus serveurs (valeur par défaut). N'affectez pas à la directive [[13-directives/serverlimit|ServerLimit]] une valeur supérieure au nombre de processus requis pour la définition des directives [[13-directives/maxrequestworkers|MaxRequestWorkers]] et [[13-directives/threadsperchild|ThreadsPerChild]].

> [!NOTE]
> **Note**
>
> Il existe une limite de `ServerLimit 20000` codée en dur dans le serveur (200000 pour le MPM [[12-modules/prefork|prefork]]). Ceci est censé éviter les effets désastreux que pourrait provoquer une faute de frappe. Pour dépasser cette limite, vous devez modifier la valeur de MAX\_SERVER\_LIMIT dans le fichier source du mpm et recompiler le serveur.

La valeur de la directive `ServerLimit` doit être supérieure ou égale à 1. Une valeur inférieure à 1 sera automatiquement augmentée à 1 et un avertissement sera journalisé.

## Voir aussi

- [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêter et redémarrer le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
