---
title: "AuthFormAuthoritative"
description: "Directive Apache AuthFormAuthoritative (mod_auth_form) — Détermine si l'autorisation et l'authentification sont confiés à des modules de plus bas niveau. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si l'autorisation et l'authentification sont confiés à des modules de plus bas niveau |
| **Syntaxe** | `AuthFormAuthoritative On\|Off` |
| **Valeur par défaut** | `AuthFormAuthoritative On` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |

## Utilisation

Normalement, chacun des modules d'autorisation spécifiés par la directive [[13-directives/authformprovider|AuthFormProvider]] va tenter de vérifier l'identité de l'utilisateur, et si ce dernier n'est trouvé dans aucun fournisseur, l'accès sera refusé. En définissant explicitement la directive `AuthFormAuthoritative` à `Off` on confie les processus d'authentification et d'autorisation à des modules ne s'appuyant pas sur des fournisseurs, si **aucun identifiant utilisateur** ou aucune **règle** ne correspond à l'identifiant utilisateur fourni. Ceci ne peut s'avérer nécessaire que si l'on combine [[12-modules/mod_auth_form|mod_auth_form]] avec des modules tiers qui ne se configurent pas avec la directive [[13-directives/authformprovider|AuthFormProvider]]. Lorsqu'on utilise de tels modules, la chronologie du processus est déterminée dans leur code source, et n'est pas configurable.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
