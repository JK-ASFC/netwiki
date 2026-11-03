---
title: "LuaScope"
description: "Directive Apache LuaScope (mod_lua) — Une valeur parmi once, request, conn, thread -- la valeur par défaut est once. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Une valeur parmi once, request, conn, thread -- la valeur par défaut est once |
| **Syntaxe** | `LuaScope once\|request\|conn\|thread\|server [min] [max]` |
| **Valeur par défaut** | `LuaScope once` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet de spécifier la durée de vie de l'interpréteur Lua qui sera utilisé dans ce "répertoire". La valeur par défaut est "once".

**once:**

utilise l'interpréteur une fois.

**request:**

utilise l'interpréteur pour traiter tout ce qui est basé sur le même fichier dans la requête, et qui se trouve aussi dans la portée de la requête.

**conn:**

idem request, mais attaché à connection\_rec

**thread:**

Utilise l'interpréteur pendant toute la durée de vie du thread qui traite la requête (disponible seulement avec les MPMs threadés).

**server:**

Le comportement est ici différent, car la portée du serveur présente une durée de vie assez longue, et plusieurs threads vont partager le même server\_rec. Pour gérer tout ceci, les états lua du serveur sont stockés dans une liste de ressources apr. Les arguments `min` et `max` permettent de spécifier les nombres minimaux et maximaux d'états lua à stocker dans la liste.

En général, les portées `thread` et `server` sont 2 à 3 fois plus rapides que les autres, car elles n'ont pas besoin de régénérer de nouveaux états Lua à chaque requête (comme c'est le cas avec le MPM event, où même les connexions persistantes utilisent un nouveau thread pour chaque requête). Si vous pensez que vos scripts n'auront pas de problème s'il réutilisent un état, alors les portées `thread` ou `server` doivent être utilisées car elles présenteront de meilleures performances. Alors que la portée `thread` fournira les réponses les plus rapides, la portée `server` utilisera moins de mémoire car les états sont rassemblés dans des jeux, permettant par exemple à 1000 threads de partager 100 états Lua, ne nécessitant ainsi que 10% de la mémoire requise par la portée `thread`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
