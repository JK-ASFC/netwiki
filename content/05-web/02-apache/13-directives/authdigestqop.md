---
title: "AuthDigestQop"
description: "Directive Apache AuthDigestQop (mod_auth_digest) — Détermine le niveau de protection fourni par l'authentification à base de condensé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine le niveau de protection fourni par l'authentification à base de condensé |
| **Syntaxe** | `AuthDigestQop none\|auth\|auth-int [auth\|auth-int]` |
| **Valeur par défaut** | `AuthDigestQop auth` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestQop` permet de définir le *niveau de protection* fourni. `auth` ne fournit que l'authentification (nom utilisateur/mot de passe) ; `auth-int` fournit l'authentification plus un contrôle d'intégrité (un condensé MD5 de l'entité est aussi calculé et vérifié) ; avec `none`, le module va utiliser l'ancien algorithme de condensés RFC-2069 (qui n'effectue pas de contrôle d'intégrité). On peut spécifier à la fois `auth` et `auth-int`, auquel cas c'est le navigateur qui va choisir lequel des deux utiliser. `none` ne doit être utilisé que dans le cas où le navigateur ne serait pas à même (pour une raison ou pour une autre) de relever le défit qu'il recevrait si un autre niveau de protection était défini.

> [!NOTE]
> `auth-int` n'est pas encore implémenté.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
