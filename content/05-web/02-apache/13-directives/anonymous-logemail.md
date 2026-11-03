---
title: "Anonymous_LogEmail"
description: "Directive Apache Anonymous_LogEmail (mod_authn_anon) — Détermine si le mot de passe fourni sera enregistré dans le journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_anon]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le mot de passe fourni sera enregistré dans le journal des erreurs |
| **Syntaxe** | `Anonymous_LogEmail On\|Off` |
| **Valeur par défaut** | `Anonymous_LogEmail On` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_anon\|mod_authn_anon]] |

## Utilisation

Lorsque cette directive est définie à `On`, valeur par défaut, le 'mot de passe' fourni (censé contenir une adresse email valide) est enregistré dans le journal des erreurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
