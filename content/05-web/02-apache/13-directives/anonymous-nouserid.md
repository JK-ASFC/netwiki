---
title: "Anonymous_NoUserID"
description: "Directive Apache Anonymous_NoUserID (mod_authn_anon) — Détermine si le champ identifiant peut être vide. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_anon]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le champ identifiant peut être vide |
| **Syntaxe** | `Anonymous_NoUserID On\|Off` |
| **Valeur par défaut** | `Anonymous_NoUserID Off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_anon\|mod_authn_anon]] |

## Utilisation

Lorsque cette directive est définie à `On`, les utilisateurs peuvent laisser le champ identifiant vide (et peut-être aussi le champ mot de passe selon la définition de la directive [[13-directives/anonymous-mustgiveemail|Anonymous_MustGiveEmail]]). Ceci peut s'avérer très utile pour les utilisateurs de MS-Explorer qui n'ont pour seule possibilité que d'appuyer sur Entrée ou de cliquer directement sur le bouton OK, ce qui semble être une réaction naturelle.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
