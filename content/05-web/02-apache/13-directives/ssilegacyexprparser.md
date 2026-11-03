---
title: "SSILegacyExprParser"
description: "Directive Apache SSILegacyExprParser (mod_include) — Active le mode de compatibilité pour les expressions conditionnelles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le mode de compatibilité pour les expressions conditionnelles. |
| **Syntaxe** | `SSILegacyExprParser on\|off` |
| **Valeur par défaut** | `SSILegacyExprParser off` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |
| **Compatibilité** | Disponible à partir de la version 2.3.13. |

## Utilisation

Depuis la version 2.3.13, [[12-modules/mod_include|mod_include]] a adopté la nouvelle syntaxe [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] pour ses expressions conditionnelles dans les éléments de contrôle de flux `#if`. Cette directive permet de réactiver l'ancienne syntaxe qui est compatible avec les versions 2.2.x et antérieures d'Apache HTTPD.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
