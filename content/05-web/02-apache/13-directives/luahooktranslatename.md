---
title: "LuaHookTranslateName"
description: "Directive Apache LuaHookTranslateName (mod_lua) — Fournit un point d'entrée à la phase du nom de traduction du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée à la phase du nom de traduction du traitement de la requête |
| **Syntaxe** | `LuaHookTranslateName /chemin/vers/lua/script.lua nom_fonction_hook [early\|late]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Le troisième argument optionnel est disponible depuis la version 2.3.15 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'ajouter un point d'entrée (à APR\_HOOK\_MIDDLE) à la phase du nom de traduction du traitement de la requête. La fonction hook accepte un seul argument, le request\_rec, et doit renvoyer un code d'état qui est soit un code d'erreur HTTP, ou une constante définie dans le module apache2 : apache2.OK, apache2.DECLINED, ou apache2.DONE.

Pour ceux qui ne sont pas familiers avec les points d'entrée (hook), en gros, chaque hook sera invoqué jusqu'à ce que l'un d'entre eux renvoie apache2.OK. Si un hook n'effectuer pas la traduction, il doit juste renvoyer apache2.DECLINED. Si le traitement de la requête doit être interrompu, la valeur renvoyée doit être apache2.DONE.

Exemple :

```apache
# httpd.conf
LuaHookTranslateName "/scripts/conf/hooks.lua" silly_mapper
```

```lua
-- /scripts/conf/hooks.lua --
require "apache2"
function silly_mapper(r)
    if r.uri == "/" then
        r.filename = "/var/www/home.lua"
        return apache2.OK
    else
        return apache2.DECLINED
    end
end
```

> [!NOTE]
> **Contexte**
>
> Cette directive ne peut être utilisée ni à l'intérieur d'une section [[13-directives/directory|<Directory>]] ou [[13-directives/files|<Files>]], ni dans un fichier htaccess.

> [!NOTE]
> **Ordonnancement**
>
> Les arguments optionnels "early" ou "late" permettent de contrôler le moment auquel ce script s'exécute par rapport aux autres modules.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
