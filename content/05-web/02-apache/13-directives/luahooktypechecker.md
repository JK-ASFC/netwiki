---
title: "LuaHookTypeChecker"
description: "Directive Apache LuaHookTypeChecker (mod_lua) — Fournit un point d'entrée pour la phase type_checker du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase type\_checker du traitement de la requête |
| **Syntaxe** | `LuaHookTypeChecker /chemin/vers/lua/script.lua hook_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Cette directive fournit un point d'entrée pour la phase type\_checker du traitement de la requête. Cette phase correspond au moment où la requête se voit assigner un type et un gestionnaire de contenu, et peut donc être utilisée pour modifier le type et le gestionnaire en fonction de l'entrée :

```apache
LuaHookTypeChecker "/path/to/lua/script.lua" type_checker
```

```lua
function type_checker(r)
    if r.uri:match("%.to_gif$") then -- foo.png.to_gif convient
        r.content_type = "image/gif" -- affectation du type image/gif
        r.handler = "gifWizard"      -- force le traitement de la requête par le module gifWizard
        r.filename = r.uri:gsub("%.to_gif$", "") -- corrige le nom du fichier demandé
        return apache2.OK
    end

    return apache2.DECLINED
end
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
