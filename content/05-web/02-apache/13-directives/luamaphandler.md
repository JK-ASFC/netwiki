---
title: "LuaMapHandler"
description: "Directive Apache LuaMapHandler (mod_lua) — Met en correspondance un chemin avec un gestionnaire lua. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Met en correspondance un chemin avec un gestionnaire lua |
| **Syntaxe** | `LuaMapHandler modele-uri /chemin/vers/lua/script.lua [nom-fonction]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet de faire correspondre un modèle d'uri avec une fonction de gestionnaire située dans un fichier spécifique. Elle utilise les expressions rationnelles PCRE pour mettre en correspondance l'uri, et supporte les groupes de correspondance d'interpolation dans le chemin du fichier et le nom de la fonction. Prenez garde aux problèmes de sécurité en écrivant vos expressions rationnelles.

**Exemples :**

```apache
LuaMapHandler "/(\w+)/(\w+)" "/scripts/$1.lua" "handle_$2"
```

Cette directive va faire correspondre des uri comme /photos/show?id=9 au fichier /scripts/photos.lua, et invoquera la fonction de gestionnaire handle\_show au niveau de la vm lua après chargement de ce fichier.

```apache
LuaMapHandler "/bingo" "/scripts/wombat.lua"
```

Cette directive invoquera la fonction "handle" qui est la valeur par défaut si aucun nom de fonction spécifique n'est spécifié.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
