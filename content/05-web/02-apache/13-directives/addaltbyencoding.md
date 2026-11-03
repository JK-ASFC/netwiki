---
title: "AddAltByEncoding"
description: "Directive Apache AddAltByEncoding (mod_autoindex) — Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son codage MIME. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son codage MIME |
| **Syntaxe** | `AddAltByEncoding texte codage MIME [codage MIME] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `AddAltByEncoding` permet d'afficher un texte optionnel à la place d'un icône pour un fichier dans le cas d'un affichage `FancyIndexing`. *codage MIME* doit être un type valide, comme `x-compress`. Si *texte* contient des espaces, vous devez l'entourer de guillemets ou d'apostrophes (`"` ou `'`). Ce texte optionnel sera affiché si le client ne peut pas afficher d'images, si le chargement d'images est désactivé ou si l'icône ne peut pas être trouvé.

```apache
AddAltByEncoding gzip x-gzip
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
