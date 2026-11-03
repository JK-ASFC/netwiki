---
title: "AuthFormLoginSuccessLocation"
description: "Directive Apache AuthFormLoginSuccessLocation (mod_auth_form) — L'URL de la page vers laquelle on doit être redirigé en cas de connexion réussie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'URL de la page vers laquelle on doit être redirigé en cas de connexion réussie |
| **Syntaxe** | `AuthFormLoginSuccessLocation url` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache. L'interprétation des expressions rationnelles est supportée depuis la version 2.4.4. |

## Utilisation

La directive [[13-directives/authformloginsuccesslocation|AuthFormLoginSuccessLocation]] spécifie l'URL vers laquelle l'utilisateur doit être redirigé en cas de connexion réussie. Sa valeur est interprétée via l'interpréteur [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] avant d'être envoyée au client. L'effet de cette directive peut être annulé si l'on a défini un champ de formulaire contenant une autre URL à l'aide de la directive [[13-directives/authformlocation|AuthFormLocation]].

Vous pouvez utiliser cette directive si vous possédez une URL de connexion personnalisée, et si vous n'avez pas intégré la page de destination dans le formulaire de connexion.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
