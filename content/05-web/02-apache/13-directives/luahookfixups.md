---
title: "LuaHookFixups"
description: "Directive Apache LuaHookFixups (mod_lua) — Fournit un point d'entrée pour la phase de correction du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase de correction du traitement de la requête |
| **Syntaxe** | `LuaHookFixups /chemin/vers/lua/script.lua hook_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Idem LuaHookTranslateName, mais s'exécute durant la phase de correction.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
