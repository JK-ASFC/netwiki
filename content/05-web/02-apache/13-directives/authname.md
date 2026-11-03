---
title: "AuthName"
description: "Directive Apache AuthName (mod_authn_core) — L'identifiant de l'autorisation à utiliser avec l'authentification HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'identifiant de l'autorisation à utiliser avec l'authentification HTTP |
| **Syntaxe** | `AuthName domaine d'autorisation` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_core\|mod_authn_core]] |

## Utilisation

Cette directive permet de définir l'identifiant d'autorisation pour un répertoire. Cet identifiant est fourni au client de façon à ce qu'il sache quels nom d'utilisateur et mot de passe envoyer. `AuthName` accepte un seul argument ; s'il contient des espaces, il doit être entouré de guillemets. Pour pouvoir fonctionner, la directive `AuthName` doit être utilisée en combinaison avec les directives [[13-directives/authtype|AuthType]] et [[13-directives/require|Require]], ainsi que des directives comme [[13-directives/authuserfile|AuthUserFile]] et [[13-directives/authgroupfile|AuthGroupFile]].

Par exemple :

```apache
AuthName "Top Secret"
```

La chaîne fournie comme argument à `AuthName` était historiquement affichée dans la boîte de dialogue de mot de passe fournie par les navigateurs. La plupart des navigateurs modernes n’affiche plus la chaîne de realm, car elle pourrait être utilisée pour du phishing. La directive est toujours nécessaire pour que l’authentification HTTP fonctionne et la valeur du realm est toujours utilisée pour définir la portée des informations d'identification.

A partir de la version 2.4.55 du serveur HTTP Apache, il est possible de définir cette directive en utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]] pour spécifier l'identifiant d'autorisation de manière dynamique.

Exemple :

```apache
AuthName "%{HTTP_HOST}"
```

## Voir aussi

- [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, autorisation et contrôle d'accès]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
