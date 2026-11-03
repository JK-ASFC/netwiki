---
title: "AuthFormLoginRequiredLocation"
description: "Directive Apache AuthFormLoginRequiredLocation (mod_auth_form) — L'URL de la page vers laquelle on doit être redirigé si une authentification est requise. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'URL de la page vers laquelle on doit être redirigé si une authentification est requise |
| **Syntaxe** | `AuthFormLoginRequiredLocation url` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache. L'interprétation des expressions rationnelles est supportée depuis la version 2.4.4. |

## Utilisation

La directive [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]] spécifie l'URL vers laquelle l'utilisateur devra être redirigé s'il n'est pas autorisé à accéder à une page. Sa valeur est interprétée via l'interpréteur [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] avant d'être envoyée au client. Par défaut, si un utilisateur n'est pas autorisé à accéder à une page, le code de réponse HTTP `HTTP_UNAUTHORIZED` est renvoyé avec la page spécifiée par la directive [[13-directives/errordocument|ErrorDocument]]. La directive [[13-directives/authformloginrequiredlocation|AuthFormLoginRequiredLocation]] permet de remplacer cette valeur par défaut.

Vous pouvez utiliser cette directive si vous voulez présenter une page de connexion personnalisée à vos utilisateurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
