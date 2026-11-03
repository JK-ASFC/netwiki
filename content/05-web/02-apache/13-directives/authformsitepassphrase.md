---
title: "AuthFormSitePassphrase"
description: "Directive Apache AuthFormSitePassphrase (mod_auth_form) — Court-circuite l'authentification pour les sites à fort trafic. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Court-circuite l'authentification pour les sites à fort trafic |
| **Syntaxe** | `AuthFormSitePassphrase secret` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |
| **Compatibilité** | Disponible depuis la version 2.3.0 du serveur HTTP Apache |

## Utilisation

La directive [[13-directives/authformsitepassphrase|AuthFormSitePassphrase]] spécifie un mot de passe qui, s'il est présent dans la session utilisateur, indique à Apache httpd de court-circuiter l'authentification pour l'URL considérée. On peut l'utiliser dans le cas de sites web à fort trafic afin de réduire la charge induite sur l'infrastructure d'authentification.

On peut insérer le mot de passe dans une session utilisateur en ajoutant cette directive à la configuration concernant le gestionnaire *form-login-handler*. Le gestionnaire *form-login-handler*, quant à lui, effectuera toujours les vérifications d'authentification, qu'un mot de passe soit spécifié ou non.

> [!WARNING]
> **Avertissement**
>
> Si la session est présentée à l'utilisateur à l'aide du module [[12-modules/mod_session_cookie|mod_session_cookie]], et si la session n'est pas protégée par le module [[12-modules/mod_session_crypto|mod_session_crypto]], le mot de passe peut faire l'objet d'une attaque de type dictionnaire. Quelle que soit la configuration de la session, assurez-vous que cette directive n'est pas utilisée dans un espace d'URLs contenant des données privées, ou à partir desquelles des transactions sensibles pourraient être menées. En tout état de cause, vous devez être conscient des risques encourus avant de l'utiliser.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
