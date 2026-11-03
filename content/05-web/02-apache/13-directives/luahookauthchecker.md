---
title: "LuaHookAuthChecker"
description: "Directive Apache LuaHookAuthChecker (mod_lua) — Fournit un point d'entrée pour la phase auth_checker du traitement de la requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un point d'entrée pour la phase auth\_checker du traitement de la requête |
| **Syntaxe** | `LuaHookAuthChecker /chemin/vers/lua/script.lua hook_function_name [early\|late]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Le troisième argument optionnel est disponible depuis la version 2.3.15 du serveur HTTP Apache. |

## Utilisation

Invoque une fonction lua au cours de la phase auth\_checker du traitement de la requête. Cette directive peut s'utiliser pour implémenter une vérification arbitraire de l'authentification et de l'autorisation. Voici un exemple très simple :

```lua
require 'apache2'

-- fonction d'accroche authcheck fictive
-- Si la requête ne contient aucune donnée d'authentification, l'en-tête
-- de la réponse est défini et un code 401 est renvoyé afin de demander au
-- navigateur d'effectuer une authentification basique. Si la requête
-- comporte des données d'authentification, elles ne sont pas vraiment
-- consultées, mais on admet la prise en compte de l'utilisateur 'foo' et
-- on la valide. On vérifie ensuite si l'utilisateur est bien 'foo' et on
-- accepte la requête.
function authcheck_hook(r)

   -- recherche des informations d'authentification
   auth = r.headers_in['Authorization']
   if auth ~= nil then
     -- définition d'un utilisateur par défaut
     r.user = 'foo'
   end

   if r.user == nil then
      r:debug("authcheck: user is nil, returning 401")
      r.err_headers_out['WWW-Authenticate'] = 'Basic realm="WallyWorld"'
      return 401
   elseif r.user == "foo" then
      r:debug('user foo: OK')
   else
      r:debug("authcheck: user='" .. r.user .. "'")
      r.err_headers_out['WWW-Authenticate'] = 'Basic realm="WallyWorld"'
      return 401
   end
   return apache2.OK
end
```

> [!NOTE]
> **Ordonnancement**
>
> Les arguments optionnels "early" ou "late" permettent de contrôler le moment auquel ce script s'exécute par rapport aux autres modules.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
