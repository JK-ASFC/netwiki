---
title: "ThreadLimit"
description: "Directive Apache ThreadLimit (mpm_common) — Le nombre de threads maximum que l'on peut définir par processus enfant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nombre de threads maximum que l'on peut définir par processus enfant |
| **Syntaxe** | `ThreadLimit nombre` |
| **Valeur par défaut** | `Voir ci-dessous pour plus de détails` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Cette directive permet de définir le nombre maximum que l'on peut affecter à la directive [[13-directives/threadsperchild|ThreadsPerChild]] pour la durée de vie du processus Apache httpd. La directive [[13-directives/threadsperchild|ThreadsPerChild]] peut être modifiée au cours d'un redémarrage jusqu'à la valeur de la directive [[13-directives/threadlimit|ThreadLimit]], mais toute tentative de modification de la directive [[13-directives/threadlimit|ThreadLimit]] au cours d'un redémarrage sera ignorée.

L'utilisation de cette directive doit faire l'objet de précautions particulières. Si `ThreadLimit` est définie à une valeur très supérieure à la directive [[13-directives/threadsperchild|ThreadsPerChild]], de la mémoire partagée supplémentaire sera inutilement allouée. Si les directives `ThreadLimit` et [[13-directives/threadsperchild|ThreadsPerChild]] sont définies à des valeurs supérieures à ce que le système peut supporter, ce dernier peut devenir instable, ou Apache httpd peut tout simplement refuser de démarrer. Ne définissez pas cette directive à une valeur supérieure à la valeur maximale que vous pensez affecter à la directive [[13-directives/threadsperchild|ThreadsPerChild]] pour le processus Apache httpd en cours d'exécution.

La valeur par défaut de la directive `ThreadLimit` est `1920` avec [[12-modules/mpm_winnt|mpm_winnt]], et `64` avec les autres MPMs.

> [!NOTE]
> **Note**
>
> Il existe une limite de `ThreadLimit 20000` (ou `ThreadLimit 100000` avec [[12-modules/event|event]], `ThreadLimit 15000` avec [[12-modules/mpm_winnt|mpm_winnt]]) codée en dur dans le serveur. Ceci est censé éviter les effets désastreux que pourrait provoquer une faute de frappe. Pour dépasser cette limite, vous devez modifier la valeur de MAX\_THREAD\_LIMIT dans le fichier source du mpm et recompiler le serveur.

La valeur de la directive `ThreadLimit` doit être supérieure ou égale à 1. Une valeur inférieure à 1 sera automatiquement augmentée à 1 et un avertissement sera journalisé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
