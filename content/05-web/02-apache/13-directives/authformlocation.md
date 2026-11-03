---
title: "AuthFormLocation"
description: "Directive Apache AuthFormLocation (mod_auth_form) — Le nom du champ de formulaire qui contiendra l'URL vers laquelle l'utilisateur sera redirigé en cas de connexion réussie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nom du champ de formulaire qui contiendra l'URL vers laquelle l'utilisateur sera redirigé en cas de connexion réussie |
| **Syntaxe** | `AuthFormLocation nom du champ` |
| **Valeur par défaut** | `AuthFormLocation httpd_location` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformlocation|AuthFormLocation]] spécifie le nom du champ HTML qui, s'il existe, contiendra l'URL vers laquelle rediriger le navigateur en cas de connexion réussie.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
