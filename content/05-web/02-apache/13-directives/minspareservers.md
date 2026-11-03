---
title: "MinSpareServers"
description: "Directive Apache MinSpareServers (prefork) — Nombre minimum de processus serveurs enfants inactifs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, prefork]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre minimum de processus serveurs enfants inactifs |
| **Syntaxe** | `MinSpareServers nombre` |
| **Valeur par défaut** | `MinSpareServers 5` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/prefork\|prefork]] |

## Utilisation

La directive `MinSpareServers` permet de définir le nombre minimum désiré de processus serveurs enfants *inactifs*. Un processus inactif est un processus qui ne traite pas de requête. S'il y a moins de `MinSpareServers` processus inactifs, le processus parent va créer de nouveaux enfants de la manière suivante : il en crée un, attend une seconde, il en crée deux, attend une seconde, il en crée quatre, puis continue ainsi exponentiellement jusu'à ce que son taux de création de processus enfants soit de 32 par seconde. Il ne s'arrête que lorsque le nombre de processus enfants correspond à la définition de la directive `MinSpareServers`.

La modification de ce paramètre n'est nécessaire que dans le cas de sites très sollicités. Définir ce paramètre à une valeur très grande est dans la plupart des cas une mauvaise idée.

## Voir aussi

- [[13-directives/maxspareservers|MaxSpareServers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
