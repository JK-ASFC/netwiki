---
title: "mod_session_cookie"
description: "Module Apache mod_session_cookie — Support des sessions basé sur les cookies. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_session_cookie]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support des sessions basé sur les cookies |
| **Statut** | Extension |
| **Identificateur** | `session_cookie_module` |
| **Fichier source** | `mod_session_cookie.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> Les modules de session font usage des cookies HTTP, et peuvent à ce titre être victimes d'attaques de type Cross Site Scripting, ou divulguer des informations à caractère privé aux clients. Veuillez vous assurer que les risques ainsi encourus ont été pris en compte avant d'activer le support des sessions sur votre serveur.

Ce sous-module du module [[12-modules/mod_session|mod_session]] fournit le support du stockage des sessions utilisateur au niveau du navigateur distant dans des cookies HTTP.

L'utilisation de cookies pour stocker les sessions décharge le serveur ou le groupe de serveurs de la nécessité de stocker les sessions localement, ou de collaborer pour partager les sessions, et peut être utile dans les environnements à fort trafic où le stockage des sessions sur le serveur pourrait s'avérer trop consommateur de ressources.

Si la confidentialité de la session doit être préservée, le contenu de cette dernière peut être chiffré avant d'être enregistré au niveau du client à l'aide du module [[12-modules/mod_session_crypto|mod_session_crypto]].

Pour plus de détails à propos de l'interface des sessions, voir la documentation du module [[12-modules/mod_session|mod_session]].

## Exemples simples

Pour créer une session et la stocker dans un cookie nommé *session*, configurez-la comme suit :

**Session stockée au niveau du navigateur**

```apache
Session On
SessionCookieName session path=/
```

Pour plus d'exemples sur la manière dont une session doit être configurée pour qu'une application CGI puisse l'utiliser, voir la section exemples de la documentation du module [[12-modules/mod_session|mod_session]].

Pour des détails sur la manière dont une session peut être utilisée pour stocker des informations de type nom d'utilisateur/mot de passe, voir la documentation du module [[12-modules/mod_auth_form|mod_auth_form]].

## Directives

- [[13-directives/sessioncookiename|SessionCookieName]]
- [[13-directives/sessioncookiename2|SessionCookieName2]]
- [[13-directives/sessioncookieremove|SessionCookieRemove]]

## Voir aussi

- [[12-modules/mod_session|mod_session]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
