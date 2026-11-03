---
title: "LuaHookPreTranslate"
description: "Directive Apache LuaHookPreTranslate (mod_lua) — Fournit un point d'entrée pour la phase de pré-traduction du traitement d'une requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase de pré-traduction du traitement d'une requête |
| **Syntaxe** | `LuaHookPreTranslate /path/to/lua/script.lua hook_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Identique à LuaHookTranslateName, mais s'exécute au cours de la phase de pré-traduction où les pourcentages du chemin de l'URI ne sont pas encore décodés.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
