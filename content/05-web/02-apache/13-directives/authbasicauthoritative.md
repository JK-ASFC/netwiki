---
title: "AuthBasicAuthoritative"
description: "Directive Apache AuthBasicAuthoritative (mod_auth_basic) — Définit si les processus d'autorisation et d'authentification peuvent être confiés à des modules de plus bas niveau. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_basic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si les processus d'autorisation et d'authentification peuvent être confiés à des modules de plus bas niveau |
| **Syntaxe** | `AuthBasicAuthoritative On\|Off` |
| **Valeur par défaut** | `AuthBasicAuthoritative On` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_basic\|mod_auth_basic]] |

## Utilisation

Normalement, chaque module d'autorisation énuméré dans la directive [[13-directives/authbasicprovider|AuthBasicProvider]] va tenter de vérifier l'utilisateur, et si ce dernier n'est trouvé dans aucun des fournisseurs, l'accès sera refusé. Définir explicitement la directive `AuthBasicAuthoritative` à `Off` permet de confier l'autorisation et l'authentification à d'autres modules non basés sur les fournisseurs si **aucun identifiant utilisateur** ou aucune **règle** ne correspondent à l'identifiant utilisateur spécifié. Ceci ne peut s'avérer nécessaire que lorsque [[12-modules/mod_auth_basic|mod_auth_basic]] est combiné avec des modules tiers qui n'ont pas été configurés à l'aide de la directive [[13-directives/authbasicprovider|AuthBasicProvider]]. Lorsqu'on utilise de tels modules, l'ordre dans lequel s'effectue le traitement est défini dans le code source des modules et n'est pas configurable.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
