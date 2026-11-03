---
title: "LuaInputFilter"
description: "Directive Apache LuaInputFilter (mod_lua) — Fournit une fonction Lua pour le filtrage en entrée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit une fonction Lua pour le filtrage en entrée |
| **Syntaxe** | `LuaInputFilter filter_name /path/to/lua/script.lua function_name` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Disponible depuis la version 2.4.5 du serveur HTTP Apache |

## Utilisation

Cette directive permet d'ajouter un filtre en entrée sous la forme d'une fonction Lua. A l'instar des filtres en sorties, les filtres en entrée fonctionnent comme des sous-routines, intervenant dans un premier temps avant l'envoi du contenu des tampons, puis chaque fois qu'un paquet de données doit être transmis à la chaîne, et éventuellement produisant toute donnée à ajouter aux données en entrée. La variable globale `bucket` contient les paquets de données tels qu'ils sont transmis au script Lua :

```apache
LuaInputFilter myInputFilter "/www/filter.lua" input_filter
<Files "*.lua">
  SetInputFilter myInputFilter
</Files>
```

```lua
--[[
    Exemple de filtre en entrée qui convertit toutes les données POST en
    majuscules.
]]--
function input_filter(r)
    print("luaInputFilter called") -- pour débogage
    coroutine.yield() -- attend des paquets de données
    while bucket do -- Pour chaque paquet, faire ...
        local output = string.upper(bucket) -- Convertit toutes les données POST en majuscules
        coroutine.yield(output) -- Envoie les données traitées à la chaîne de filtrage
    end
    -- plus aucune donnée à traiter.
    coroutine.yield("&filterSignature=1234") -- Ajoute une signature à la fin
end
```

Le filtre en entrée peut interdire ou sauter un filtre s'il est considéré comme indésirable :

```lua
function input_filter(r)
    if not good then
        return -- Empêche tout simplement le filtrage et transmet le contenu original
    end
    coroutine.yield() -- attend des paquets de données
    ...               -- insert les filtres ici
end
```

Voir "Modification de contenu avec les filtres Lua" pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
