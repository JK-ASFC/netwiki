---
title: "SSIUndefinedEcho"
description: "Directive Apache SSIUndefinedEcho (mod_include) — Chaîne à afficher lorsqu'on tente d'extraire le contenu d'une variable non définie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chaîne à afficher lorsqu'on tente d'extraire le contenu d'une variable non définie |
| **Syntaxe** | `SSIUndefinedEcho chaîne` |
| **Valeur par défaut** | `SSIUndefinedEcho "(none)"` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

Cette directive permet de modifier la chaîne affichée par [[12-modules/mod_include|mod_include]] lorsqu'on tente d'extraire le contenu d'une variable non définie.

```apache
SSIUndefinedEcho "<!-- nondef -->"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
