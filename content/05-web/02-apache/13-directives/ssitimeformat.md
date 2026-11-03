---
title: "SSITimeFormat"
description: "Directive Apache SSITimeFormat (mod_include) — Configuration du format d'affichage des dates. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration du format d'affichage des dates |
| **Syntaxe** | `SSITimeFormat chaîne de formatage` |
| **Valeur par défaut** | `SSITimeFormat "%A, %d-%b-%Y %H:%M:%S %Z"` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |

## Utilisation

Cette directive permet de modifier le format d'affichage des variables d'environnement `DATE`. La *chaîne de formatage* est identique à celle de la fonction `strftime(3)` de la bibliothèque C standard.

Cette directive a le même effet que l'élément `<!--#config timefmt=chaîne de formatage -->`.

```apache
SSITimeFormat "%R, %B %d, %Y"
```

Avec l'exemple ci-dessus, les dates seront affichées dans le style "22:26, June 14, 2002".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
