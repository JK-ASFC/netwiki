---
title: "AddAlt"
description: "Directive Apache AddAlt (mod_autoindex) — Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son nom. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Texte optionnel à afficher à la place d'un icône pour un fichier en fonction de son nom |
| **Syntaxe** | `AddAlt texte fichier [fichier] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `AddAlt` permet d'afficher un texte optionnel pour un fichier, à la place d'un icône, dans le cas d'un affichage `FancyIndexing`. *fichier* est une extension de fichier, un nom de fichier partiel, une expression avec caractères génériques ou un nom de fichier complet permettant de caractériser le(s) fichier(s) concerné(s). Si *texte* contient des espaces, vous devez l'entourer de guillemets ou d'apostrophes (`"` ou `'`). Ce texte optionnel sera affiché si le client ne peut pas afficher d'images, si le chargement d'images est désactivé ou si l'icône ne peut pas être trouvé.

```apache
AddAlt "PDF file" *.pdf
AddAlt Compressed *.gz *.zip *.Z
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
