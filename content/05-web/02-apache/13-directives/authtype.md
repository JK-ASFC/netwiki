---
title: "AuthType"
description: "Directive Apache AuthType (mod_authn_core) — Type d'authentification utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Type d'authentification utilisateur |
| **Syntaxe** | `AuthType None\|Basic\|Digest\|Form` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authn_core\|mod_authn_core]] |

## Utilisation

Cette directive permet de définir le type d'authentification utilisateur pour un répertoire. Les types d'authentification disponibles sont `None`, `Basic` (implémenté par [[12-modules/mod_auth_basic|mod_auth_basic]]), `Digest` (implémenté par [[12-modules/mod_auth_digest|mod_auth_digest]]), et `Form` (implémenté par [[12-modules/mod_auth_form|mod_auth_form]]).

Pour mettre en oeuvre l'authentification, vous devez aussi utiliser les directives [[13-directives/authname|AuthName]] et [[13-directives/require|Require]]. De plus, le serveur doit pouvoir disposer d'un module fournisseur d'authentification comme [[12-modules/mod_authn_file|mod_authn_file]] et d'un module d'autorisation comme [[12-modules/mod_authz_user|mod_authz_user]].

Le type d'authentification `None` désactive l'authentification. Lorsqu'une authentification est définie, elle est en général héritée par chacune des [[11-guides/01-generalites/sections-de-configuration|sections de configuration]] qui suivent, à moins qu'un autre type d'authentification ne soit spécifié. Si l'on ne souhaite pas mettre en oeuvre d'authentification pour une sous-section d'une section authentifiée, on doit utiliser le type d'authentification `None` ; dans l'exemple suivant, les clients peuvent accéder au répertoire `/www/docs/public` sans devoir s'authentifier :

```apache
<Directory "/www/docs">
    AuthType Basic
    AuthName Documents
    AuthBasicProvider file
    AuthUserFile "/usr/local/apache/passwd/passwords"
    Require valid-user
</Directory>

<Directory "/www/docs/public">
    AuthType None
    Require all granted
</Directory>
```

A partir de la version 2.4.55, il est possible de définir cette directive en utilisant la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]] pour spécifier le type d'authentification de manière dynamique.

> [!NOTE]
> Veuillez noter que, lorsque l'authentification n'est pas activée, les clients qui se sont déjà authentifiés pour une autre zone de l'arborescence du site continueront en général à envoyer des en-tête d'authentification HTTP ou des cookies avec chaque requête, sans se préoccuper de savoir si le serveur nécessite vraiment une authentification pour chaque ressource.

## Voir aussi

- [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, autorisation et contrôle d'accès]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
