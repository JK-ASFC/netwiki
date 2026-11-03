---
title: "CookieExpires"
description: "Directive Apache CookieExpires (mod_usertrack) — Durée avant expiration du cookie traceur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée avant expiration du cookie traceur |
| **Syntaxe** | `CookieExpires durée` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |

## Utilisation

Lorsqu'elle est utilisée, cette directive définit une durée avant l'expiration du cookie généré par le module usertrack. La *durée* peut être spécifiée sous la forme d'un nombre de secondes, ou sous une forme du style "2 weeks 3 days 7 hours". les termes valides sont : years, months, weeks, days, hours, minutes et seconds. Si la durée est spécifiée dans un format autre qu'un nombre de secondes, elle doit être entourée de guillemets.

Si cette directive est absente, la durée de vie des cookies est limitée à la session actuelle du navigateur.

```apache
CookieExpires "3 weeks"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
