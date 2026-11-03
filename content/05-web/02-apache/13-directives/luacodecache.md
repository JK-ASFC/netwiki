---
title: "LuaCodeCache"
description: "Directive Apache LuaCodeCache (mod_lua) — Configure le cache de code compilé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure le cache de code compilé. |
| **Syntaxe** | `LuaCodeCache stat\|forever\|never` |
| **Valeur par défaut** | `LuaCodeCache stat` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet de définir le comportement du cache de code en mémoire. La valeur par défaut est stat ; dans ce cas, le script du niveau le plus haut (et pas les scripts inclus) est vérifié à chaque fois que ce fichier est nécessaire, et est rechargé si la date de modification est plus récente que celle du script déjà chargé. Les autres valeurs permettent respectivement de garder le fichier en cache perpétuellement (forever - jamais vérifié ni remplacé), ou de ne jamais le mettre en cache (never).

En général, les valeurs stat et forever sont utilisées pour un serveur en production, et les valeurs stat ou never pour un serveur en développement.

**Exemples :**

```apache
LuaCodeCache stat
LuaCodeCache forever
LuaCodeCache never
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
