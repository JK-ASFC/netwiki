---
title: "MaxConnectionsPerChild"
description: "Directive Apache MaxConnectionsPerChild (mpm_common) — Limite le nombre de connexions qu'un processus enfant va traiter au cours de son fonctionnement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite le nombre de connexions qu'un processus enfant va traiter au cours de son fonctionnement |
| **Syntaxe** | `MaxConnectionsPerChild number` |
| **Valeur par défaut** | `MaxConnectionsPerChild 0` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 du serveur HTTP Apache. L'ancien nom `MaxRequestsPerChild` est encore supporté. |

## Utilisation

La directive `MaxConnectionsPerChild` permet de définir le nombre maximum de connexions qu'un processus enfant va pouvoir traiter au cours de son fonctionnement. Lorsqu'il a traité `MaxConnectionsPerChild` connexions, le processus enfant est arrêté. Si `MaxConnectionsPerChild` est définie à `0`, il n'y a plus aucune limite sur le nombre de connexions que le processus pourra traiter.

Définir `MaxConnectionsPerChild` à une valeur non nulle limite la quantité de mémoire qu'un processus peut consommer à cause de fuites (accidentelles) de mémoire.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
