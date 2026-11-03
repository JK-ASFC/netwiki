---
title: "MaxSpareServers"
description: "Directive Apache MaxSpareServers (prefork) — Nombre maximum de processus serveurs enfants inactifs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, prefork]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de processus serveurs enfants inactifs |
| **Syntaxe** | `MaxSpareServers nombre` |
| **Valeur par défaut** | `MaxSpareServers 10` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/prefork\|prefork]] |

## Utilisation

La directive `MaxSpareServers` permet de définir le nombre maximum souhaité de processus serveurs enfants *inactifs*. Un processus inactif est un processus qui ne traite pas de requête. S'il y a plus de `MaxSpareServers` processus inactifs, le processus parent arrêtera les processus excédentaires.

La modification de ce paramètre n'est nécessaire que dans le cas de sites très sollicités. Définir ce paramètre à une valeur très grande est cependant dans la plupart des cas une mauvaise idée. Si vous essayez d'affecter à ce paramètre une valeur égale ou inférieure à la valeur de [[13-directives/minspareservers|MinSpareServers]], le serveur HTTP Apache l'ajustera automatiquement à la valeur de `MinSpareServers``+ 1`.

## Voir aussi

- [[13-directives/minspareservers|MinSpareServers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
