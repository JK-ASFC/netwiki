---
title: "LuaHookCheckUserID"
description: "Directive Apache LuaHookCheckUserID (mod_lua) — Fournit un point d'entrée pour la phase check_user_id du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase check\_user\_id du traitement de la requête |
| **Syntaxe** | `LuaHookCheckUserID /chemin/vers/lua/script.lua hook_function_name [early\|late]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Le troisième argument optionnel est disponible depuis la version 2.3.15 du serveur HTTP Apache. |

## Utilisation

...

> [!NOTE]
> **Ordonnancement**
>
> Les arguments optionnels "early" ou "late" permettent de contrôler le moment auquel ce script s'exécute par rapport aux autres modules.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
