---
title: "AuthzDBDLoginToReferer"
description: "Directive Apache AuthzDBDLoginToReferer (mod_authz_dbd) — Définit si le client doit être redirigé vers la page d'origine en cas de connexion ou de déconnexion réussie si un en-tête de requête Referer est présent. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si le client doit être redirigé vers la page d'origine en cas de connexion ou de déconnexion réussie si un en-tête de requête `Referer` est présent |
| **Syntaxe** | `AuthzDBDLoginToReferer On\|Off` |
| **Valeur par défaut** | `AuthzDBDLoginToReferer Off` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authz_dbd\|mod_authz_dbd]] |

## Utilisation

Utilisée en conjonction avec `Require dbd-login` ou `Require dbd-logout`, cette directive permet de rediriger le client vers la page d'origine (l'URL contenue dans l'en-tête de requête HTTP `Referer`, s'il est présent). En l'absence d'en-tête `Referer`, la définition `AuthzDBDLoginToReferer On` sera ignorée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
