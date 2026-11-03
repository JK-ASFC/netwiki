---
title: "AuthFormSize"
description: "Directive Apache AuthFormSize (mod_auth_form) — La taille maximale en octets du formulaire dont seront extraites les informations de connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La taille maximale en octets du formulaire dont seront extraites les informations de connexion |
| **Syntaxe** | `AuthFormSize taille` |
| **Valeur par défaut** | `AuthFormSize 8192` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformsize|AuthFormSize]] spécifie la taille maximale du corps de la requête qui sera utilisée pour trouver le formulaire de connexion.

Si une requête de connexion entrante possède une taille supérieure à cette valeur, elle sera rejetée avec le code de réponse HTTP `HTTP_REQUEST_TOO_LARGE`.

Si vous avez ajouté au formulaire des champs décrits dans [[13-directives/authformmethod|AuthFormMethod]], [[13-directives/authformmimetype|AuthFormMimetype]] et [[13-directives/authformbody|AuthFormBody]], il est recommandé de définir cette directive à une valeur similaire à celle de la directive [[13-directives/keptbodysize|KeptBodySize]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
