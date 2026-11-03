---
title: "AuthFormFakeBasicAuth"
description: "Directive Apache AuthFormFakeBasicAuth (mod_auth_form) — Simule une en-tête d'authentification de base. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Simule une en-tête d'authentification de base |
| **Syntaxe** | `AuthFormFakeBasicAuth On\|Off` |
| **Valeur par défaut** | `AuthFormFakeBasicAuth Off` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

Le drapeau [[13-directives/authformfakebasicauth|AuthFormFakeBasicAuth]] détermine si une en-tête d'`Authentification de base` sera ajoutée aux en-têtes de la requête. On peut utiliser cette méthode pour présenter le nom d'utilisateur et le mot de passe à l'application sous-jacente, sans que cette dernière ait besoin de connaître la manière dont le processus de connexion a été mené à bien.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
