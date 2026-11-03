---
title: "Anonymous_VerifyEmail"
description: "Directive Apache Anonymous_VerifyEmail (mod_authn_anon) — Détermine s'il faut vérifier que le format de l'adresse email fournie comme mot de passe est correct. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_anon]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine s'il faut vérifier que le format de l'adresse email fournie comme mot de passe est correct |
| **Syntaxe** | `Anonymous_VerifyEmail On\|Off` |
| **Valeur par défaut** | `Anonymous_VerifyEmail Off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_anon\|mod_authn_anon]] |

## Utilisation

Lorsque cette directive est définie à `On`, Apache vérifie que le 'mot de passe' entré contient au moins un '@' et un '.' afin d'inciter les utilisateurs à fournir des adresses email valides (voir ci-dessus la directive [[13-directives/anonymous-logemail|Anonymous_LogEmail]]).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
