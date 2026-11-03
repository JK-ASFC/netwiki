---
title: "LuaRoot"
description: "Directive Apache LuaRoot (mod_lua) — Spécifie le chemin de base pour la résolution des chemins relatifs dans les directives de mod_lua. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le chemin de base pour la résolution des chemins relatifs dans les directives de [[12-modules/mod_lua\|mod_lua]] |
| **Syntaxe** | `LuaRoot /chemin/vers/un/répertoire` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive permet de spécifier le chemin de base qui sera utilisé pour évaluer tous les chemins relatifs dans [[12-modules/mod_lua|mod_lua]]. En l'absence de cette directive, les chemins relatifs sont résolus par rapport au répertoire de travail courant, ce qui ne sera pas toujours approprié pour un serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
