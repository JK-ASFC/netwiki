---
title: "mod_usertrack"
description: "Module Apache mod_usertrack — Journalisation Clickstream des liens parcourus par un utilisateur sur un site. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_usertrack]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation Clickstream des liens parcourus par un utilisateur sur un site |
| **Statut** | Extension |
| **Identificateur** | `usertrack_module` |
| **Fichier source** | `mod_usertrack.c` |

## Sommaire

Ce module permet de suivre le parcours d'un utilisateur à travers votre site web en faisant appel aux cookies de navigateur.

## Journalisation

[[12-modules/mod_usertrack|mod_usertrack]] définit un cookie qui peut être journalisé via les formats configurables du module [[12-modules/mod_log_config|mod_log_config]] :

```apache
LogFormat "%{Apache}n %r %t" usertrack
CustomLog "logs/clickstream.log" usertrack
```

## Directives

- [[13-directives/cookiedomain|CookieDomain]]
- [[13-directives/cookieexpires|CookieExpires]]
- [[13-directives/cookiename|CookieName]]
- [[13-directives/cookiestyle|CookieStyle]]
- [[13-directives/cookietracking|CookieTracking]]
- [[13-directives/cookiesecure|CookieSecure]]
- [[13-directives/cookiehttponly|CookieHTTPOnly]]
- [[13-directives/cookiesamesite|CookieSameSite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
