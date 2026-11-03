---
title: "ThreadStackSize"
description: "Directive Apache ThreadStackSize (mpm_common) — La taille en octets de la pile qu'utilisent les threads qui traitent les connexions clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La taille en octets de la pile qu'utilisent les threads qui traitent les connexions clients |
| **Syntaxe** | `ThreadStackSize taille` |
| **Valeur par défaut** | `65536 sous NetWare; varie en fonction des autres systèmes d'exploitation` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | Disponible dans les versions 2.1 et supérieures du serveur HTTP Apache |

## Utilisation

La directive `ThreadStackSize` permet de définir la taille de la pile (pour les données propres) qu'utilisent les threads qui traitent les connexions clients en faisant appel à des modules. Dans la plupart des cas, la valeur par défaut de la taille de la pile du système d'exploitation convient, mais il existe certaines situations où il peut s'avérer nécessaire de l'ajuster :

- Sur les plates-formes qui possèdent une valeur par défaut de taille de la pile relativement petite (par exemple HP-UX), Apache httpd peut se crasher si l'on utilise certains modules tiers qui possèdent un quantité de données propres stockées relativement importante. Il se peut que ces mêmes modules fonctionnent correctement sur d'autres plate-formes où la valeur par défaut de la taille de la pile est supérieure. Ce type de crash peut être evité en définissant `ThreadStackSize` à une valeur supérieure à la valeur par défaut du système d'exploitation. Ce type d'ajustement n'est nécessaire que si le fournisseur du module tiers en fait mention, ou si le diagnostic d'un crash d'Apache httpd indique que la taille de la pile était trop petite.
- Sur les plates-formes où la taille par défaut de la pile des threads est sensiblement supérieure à la taille nécessaire pour la configuration du serveur web, il est possible de disposer d'un plus grand nombre de threads par processus enfant si la directive `ThreadStackSize` est définie à une valeur inférieure à la valeur par défaut du système d'exploitation. Cependant, ce type d'ajustement ne doit être effectué que dans un environnement de test permettant de qualifier le serveur web au maximum de ses possibilités, car il peut arriver, dans de rares cas, que des requêtes nécessitent une taille de pile supérieure pour pouvoir être traitées. La taille minimale requise pour la pile dépend fortement des modules utilisés, mais toute modification dans la configuration du serveur web peut invalider la définition courante de la directive `ThreadStackSize`.
- Sous Linux, cette directive ne peut être utilisée que pour augmenter la valeur par defaut de la taille de la pile, car l'appel système sous-jacent utilise cette valeur comme taille de pile *minimale*. C'est la limite logicielle (souvent élevée) pour `ulimit -s` (8Mo si aucune limite) qui est utilisée comme taille de pile par défaut.

> [!NOTE]
> Il est recommandé de ne pas réduire `ThreadStackSize`, à moins qu'un grand nombre de threads par processus enfant ne soit nécessaire. Sur certaines plates-formes (y compris Linux), une valeur de 128000 est déjà trop basse et provoque des crashes avec certains modules courants.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
