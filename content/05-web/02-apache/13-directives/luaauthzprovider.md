---
title: "LuaAuthzProvider"
description: "Directive Apache LuaAuthzProvider (mod_lua) — Branche une fonction fournisseur d'autorisation dans mod_authz_core. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Branche une fonction fournisseur d'autorisation dans [[12-modules/mod_authz_core\|mod_authz_core]] |
| **Syntaxe** | `LuaAuthzProvider provider_name /path/to/lua/script.lua function_name` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Disponible depuis la version 2.4.3 du serveur HTTP Apache |

## Utilisation

Lorsqu'une fonction lua a été enregistrée en tant que fournisseur d'autorisation, elle peut être appelée via la directive [[13-directives/require|Require]] :

```apache
LuaRoot "/usr/local/apache2/lua"
LuaAuthzProvider foo authz.lua authz_check_foo
<Location "/">
  Require foo johndoe
</Location>
```

```lua
require "apache2"
function authz_check_foo(r, who)
    if r.user ~= who then return apache2.AUTHZ_DENIED
    return apache2.AUTHZ_GRANTED
end
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
