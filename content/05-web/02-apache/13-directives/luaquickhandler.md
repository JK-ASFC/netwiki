---
title: "LuaQuickHandler"
description: "Directive Apache LuaQuickHandler (mod_lua) — Fournit un point d'entrée pour la gestion rapide du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la gestion rapide du traitement de la requête |
| **Syntaxe** | `LuaQuickHandler /path/to/script.lua hook_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette phase s'exécute juste après l'attribution de la requête à un serveur virtuel, et permet d'effectuer certains traitements avant le déroulement des autres phases, ou de servir une requête sans avoir à la traduire, l'associer à un espace de stockage, etc... Comme cette phase s'exécute avant toute autre, les directives telles que [[13-directives/location|<Location>]] ou [[13-directives/directory|<Directory>]] ne sont pas encore prises en compte, car Les URI n'ont pas encore été entièrement interprétés.

> [!NOTE]
> **Contexte**
>
> Cette directive ne peut être utilisée ni à l'intérieur d'une section [[13-directives/directory|<Directory>]] ou [[13-directives/files|<Files>]], ni dans un fichier htaccess.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
