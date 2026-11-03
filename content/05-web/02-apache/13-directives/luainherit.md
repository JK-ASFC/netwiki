---
title: "LuaInherit"
description: "Directive Apache LuaInherit (mod_lua) — Contrôle la manière dont les sections de configuration parentes sont fusionnées dans les enfants. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lua]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la manière dont les sections de configuration parentes sont fusionnées dans les enfants |
| **Syntaxe** | `LuaInherit none\|parent-first\|parent-last` |
| **Valeur par défaut** | `LuaInherit parent-first` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_lua\|mod_lua]] |
| **Compatibilité** | Versions 2.4.0 et supérieures |

## Utilisation

Par défaut, si des directives LuaHook\* se trouvent dans des sections de configuration Directory ou Location qui se chevauchent, les scripts définis dans les sections les plus spécifiques s'exécutent *après* ceux définis dans les sections plus génériques (LuaInherit parent-first). Vous pouvez inverser cet ordre, ou faire en sorte que le contexte parent ne s'applique pas du tout.

Jusqu'aux versions 2.3.x, le comportement par défaut consistait à ignorer les directives LuaHook\* situées dans les sections de configuration parentes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
