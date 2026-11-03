---
title: "Anonymous_MustGiveEmail"
description: "Directive Apache Anonymous_MustGiveEmail (mod_authn_anon) — Détermine si l'abscence de mot de passe est autorisée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_anon]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si l'abscence de mot de passe est autorisée |
| **Syntaxe** | `Anonymous_MustGiveEmail On\|Off` |
| **Valeur par défaut** | `Anonymous_MustGiveEmail On` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_anon\|mod_authn_anon]] |

## Utilisation

Détermine si l'utilisateur doit spécifier une adresse email comme mot de passe. Lorsque cette directive est définie à `On`, l'abscence de mot de passe est interdite.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
