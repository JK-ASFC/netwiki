---
title: "CheckCaseOnly"
description: "Directive Apache CheckCaseOnly (mod_speling) — Limite l'action du module aux corrections de majuscules. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_speling]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite l'action du module aux corrections de majuscules |
| **Syntaxe** | `CheckCaseOnly on\|off` |
| **Valeur par défaut** | `CheckCaseOnly Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_speling\|mod_speling]] |

## Utilisation

Lorsqu'elle est définie à "on", cette directive permet de limiter l'action du module aux inversions majuscule/minuscule. Les autres corrections éventuelles ne seront effectuées que si la directive [[13-directives/checkbasenamematch|CheckBasenameMatch]] est elle aussi définie.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
