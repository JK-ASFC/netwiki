---
title: "LuaPackageCPath"
description: "Directive Apache LuaPackageCPath (mod_lua) — Ajoute un répertoire au package.cpath de lua. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un répertoire au package.cpath de lua |
| **Syntaxe** | `LuaPackageCPath /chemin/vers/include/?.soa` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet d'ajouter un chemin à la liste des chemins de recherche des bibliothèques partagées de lua. Ceci modifie le package.cpath dans les vms lua.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
