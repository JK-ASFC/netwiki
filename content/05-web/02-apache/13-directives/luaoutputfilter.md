---
title: "LuaOutputFilter"
description: "Directive Apache LuaOutputFilter (mod_lua) — Fournit une fonction Lua pour le filtrage de contenu en sortie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit une fonction Lua pour le filtrage de contenu en sortie |
| **Syntaxe** | `LuaOutputFilter filter_name /path/to/lua/script.lua function_name` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

\>Cette directive permet d'ajouter un filtre en sortie sous la forme d'une fonction Lua. A l'instar des filtres en sorties, les filtres en entrée fonctionnent comme des sous-routines, intervenant dans un premier temps avant l'envoi du contenu des tampons, puis chaque fois qu'un paquet de données doit être transmis à la chaîne, et éventuellement produisant toute donnée à ajouter aux données en sortie. La variable globale `bucket` contient les paquets de données tels qu'ils sont transmis au script Lua :

```apache
LuaOutputFilter myOutputFilter "/www/filter.lua" output_filter
<Files "*.lua">
  SetOutputFilter myOutputFilter
</Files>
```

```lua
--[[
    Exemple de filtre en sortie qui échappe toutes les entités HTML en
    sortie
]]--
function output_filter(r)
    coroutine.yield("(Handled by myOutputFilter)<br/>\n") -- Ajoute des données au début de la sortie,
                                                                -- puis attend des paquets de données à traiter
    while bucket do -- Pour chaque paquet, faire ...
        local output = r:escape_html(bucket) -- Echappe les données en sortie
        coroutine.yield(output) -- Envoie les données traitées à la chaîne
    end
    -- plus aucune donnée à traiter.
end
```

Comme les filres en entrée, le filtre en sortie peut interdire ou sauter un filtre s'il est considéré comme indésirable :

```lua
function output_filter(r)
    if not r.content_type:match("text/html") then
        return -- Empêche tout simplement le filtrage et transmet le contenu original
    end
    coroutine.yield() -- attend des paquets de données
    ...               -- insert les filtres ici
end
```

> [!NOTE]
> **Les filtres Lua avec [[12-modules/mod_filter|mod_filter]]**
>
> Lorsqu'on utilise un filtre Lua comme fournisseur sous-jacent via la directive [[13-directives/filterprovider|FilterProvider]], le filtrage ne fonctionnera que si *filter-name* est identique à *provider-name*.

Voir "Modification de contenu avec les filtres Lua" pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
