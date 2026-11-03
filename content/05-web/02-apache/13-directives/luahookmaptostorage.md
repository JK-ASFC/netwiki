---
title: "LuaHookMapToStorage"
description: "Directive Apache LuaHookMapToStorage (mod_lua) — Fournit un point d'entrée pour la phase map_to_storage du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase map\_to\_storage du traitement de la requête |
| **Syntaxe** | `LuaHookMapToStorage /chemin/vers/lua/script.lua hook_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Identique à la directive `LuaHookTranslateName`, mais s'exécute à la phase map-to-storage du traitement de la requête. Les modules comme [[12-modules/mod_cache|mod_cache]] agissent pendant cette phase, ce qui permet de présenter un exemple intéressant de ce que l'on peut faire ici :

```apache
LuaHookMapToStorage "/path/to/lua/script.lua" check_cache
```

```lua
require"apache2"
cached_files = {}

function read_file(filename)
    local input = io.open(filename, "r")
    if input then
        local data = input:read("*a")
        cached_files[filename] = data
        file = cached_files[filename]
        input:close()
    end
    return cached_files[filename]
end

function check_cache(r)
    if r.filename:match("%.png$") then -- Ne concerne que les fichiers PNG
        local file = cached_files[r.filename] -- Vérifie les entrées du cache
        if not file then
            file = read_file(r.filename)  -- Lit le fichier vers le cache
        end
        if file then -- Si le fichier existe, on l'envoie
            r.status = 200
            r:write(file)
            r:info(("%s a été envoyé au client depuis le cache"):format(r.filename))
            return apache2.DONE -- cout-circuite le gestionnaire par défaut des fichiers PNG
        end
    end
    return apache2.DECLINED -- Si nous n'avons rien eu à faire, nous laissons les autres s'en charger
end
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
