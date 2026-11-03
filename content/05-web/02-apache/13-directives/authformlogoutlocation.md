---
title: "AuthFormLogoutLocation"
description: "Directive Apache AuthFormLogoutLocation (mod_auth_form) — L'URL vers laquelle un utilisateur devra être redirigé après s'être déconnecté. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'URL vers laquelle un utilisateur devra être redirigé après s'être déconnecté |
| **Syntaxe** | `AuthFormLogoutLocation uri` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache. L'interprétation des expressions rationnelles est supportée depuis la version 2.4.4. |

## Utilisation

La directive [[13-directives/authformlogoutlocation|AuthFormLogoutLocation]] spécifie l'URL de la page du serveur vers laquelle l'utilisateur devra être redirigé s'il se déconnecte. Sa valeur est interprétée via l'interpréteur [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]] avant d'être envoyée au client.

Lorsqu'un accès est tenté sur un URI traité par le gestionnaire `form-logout-handler`, la page spécifiée par cette directive sera présentée à l'utilisateur final. Par exemple :

**Exemple**

```apache
<Location "/logout">
    SetHandler form-logout-handler
    AuthFormLogoutLocation "http://example.com/loggedout.html"
    Session on
    #...
</Location>
```

Si un utilisateur tente d'accéder à l'URI */logout/*, il sera déconnecté, et la page */loggedout.html* lui sera présentée. Assurez-vous que la page *loggedout.html* n'est pas protégée par mot de passe, car dans le cas contraire, elle ne serait pas affichée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
