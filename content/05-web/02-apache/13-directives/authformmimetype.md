---
title: "AuthFormMimetype"
description: "Directive Apache AuthFormMimetype (mod_auth_form) — Le nom du champ de formulaire contenant le type MIME du corps de la requête à effectuer en cas de connexion réussie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nom du champ de formulaire contenant le type MIME du corps de la requête à effectuer en cas de connexion réussie |
| **Syntaxe** | `AuthFormMimetype nom du champ` |
| **Valeur par défaut** | `AuthFormMimetype httpd_mimetype` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformmimetype|AuthFormMimetype]] spécifie le nom du champ HTML qui, s'il existe, contiendra le type MIME de la requête à effectuer en cas de connexion réussie.

En ajoutant au formulaire les champs décrits dans [[13-directives/authformmethod|AuthFormMethod]], [[13-directives/authformmimetype|AuthFormMimetype]] et [[13-directives/authformbody|AuthFormBody]], un site web sera en mesure de relancer une requête qui a été éventuellement interrompue par l'écran de connexion, ou par l'expiration d'un délai de session.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
