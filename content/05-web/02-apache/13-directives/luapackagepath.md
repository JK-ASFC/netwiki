---
title: "LuaPackagePath"
description: "Directive Apache LuaPackagePath (mod_lua) — Ajoute un répertoire au package.path de lua. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un répertoire au package.path de lua |
| **Syntaxe** | `LuaPackagePath /chemin/vers/include/?.lua` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet d'ajouter un chemin à la liste des chemins de recherche du module lua. Elle suit les mêmes conventions que lua. Ceci modifie le package.path dans les vms lua.

**Exemples :**

```apache
LuaPackagePath "/scripts/lib/?.lua"
LuaPackagePath "/scripts/lib/?/init.lua"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
