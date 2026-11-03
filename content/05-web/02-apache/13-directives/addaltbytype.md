---
title: "AddAltByType"
description: "Directive Apache AddAltByType (mod_autoindex) — Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son type MIME. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son type MIME |
| **Syntaxe** | `AddAltByType texte type MIME [type MIME] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `AddAltByType` permet d'afficher un texte optionnel à la place d'un icône pour un fichier dans le cas d'un affichage `FancyIndexing`. *type MIME* doit être un type MIME valide, comme `text/html`. Si *texte* contient des espaces, vous devez l'entourer de guillemets ou d'apostrophes (`"` ou `'`). Ce texte optionnel sera affiché si le client ne peut pas afficher d'images, si le chargement d'images est désactivé ou si l'icône ne peut pas être trouvé.

```apache
AddAltByType 'Fichier texte' text/plain
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
