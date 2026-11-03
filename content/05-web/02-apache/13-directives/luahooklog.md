---
title: "LuaHookLog"
description: "Directive Apache LuaHookLog (mod_lua) — Permet une insertion dans la phase de journalisation du traitement d'une requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet une insertion dans la phase de journalisation du traitement d'une requête |
| **Syntaxe** | `LuaHookLog /path/to/lua/script.lua log_function_name` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |

## Utilisation

Ce dispositif d'insertion simple permet d'exécuter une fonction lorsque httpd entre dans la phase de journalisation du traitement d'une requête. Vous pouvez ainsi ajouter des données à vos propres entrées de journalisation, manipuler les entrées du journal standard avant leur enregistrement ou empêcher l'enregistrement d'une entrée dans le journal. Pour empêcher l'enregistrement normal des entrées du journal, renvoyez simplement `apache2.DONE` dans votre gestionnaire de journalisation, ou au contraire, renvoyez `apache2.OK` pour que httpd effectue une journalisation normale.

Exemple :

```apache
LuaHookLog "/path/to/script.lua" logger
```

```lua
-- /path/to/script.lua --
function logger(r)
    -- on joue à pile ou face :
    -- Si on obtient 1, on écrit dans notre propre journal Lua et on dit
    -- à httpd de ne pas enregistrer d'entrée dans le journal standard..
    -- Si on obtient 2, on nettoie un peu les données avant que httpd ne
    -- les enregistre dans le journal standard.

    if math.random(1,2) == 1 then
        -- On effectue notre propre journalisation et le journal
    -- standard n'est pas alimenté
        local f = io.open("/foo/secret.log", "a")
        if f then
            f:write("Quelque chose de secret est arrivé à " .. r.uri .. "\n")
            f:close()
        end
        return apache2.DONE -- On dit à httpd de ne rien enregistrer
                --dans le journal standard
    else
        r.uri = r.uri:gsub("somesecretstuff", "") -- nettoie les données
        return apache2.OK -- et httpd doit alors les enregistrer.
    end
end
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
