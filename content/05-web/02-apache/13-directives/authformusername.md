---
title: "AuthFormUsername"
description: "Directive Apache AuthFormUsername (mod_auth_form) — Le nom du champ de formulaire qui contient le nom de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nom du champ de formulaire qui contient le nom de connexion |
| **Syntaxe** | `AuthFormUsername nom du champ` |
| **Valeur par défaut** | `AuthFormUsername httpd_username` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.3 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformusername|AuthFormUsername]] permet de spécifier le nom du champ HTML qui, s'il existe, contiendra le nom d'utilisateur qui sera utilisé pour la connexion.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
