---
title: "AuthFormPassword"
description: "Directive Apache AuthFormPassword (mod_auth_form) — Le nom du champ de formulaire qui contient le mot de passe de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nom du champ de formulaire qui contient le mot de passe de connexion |
| **Syntaxe** | `AuthFormPassword nom du champ` |
| **Valeur par défaut** | `AuthFormPassword httpd_password` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformpassword|AuthFormPassword]] permet de spécifier le nom du champ HTML qui, s'il existe, contiendra le mot de passe qui sera utilisé pour la connexion.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
