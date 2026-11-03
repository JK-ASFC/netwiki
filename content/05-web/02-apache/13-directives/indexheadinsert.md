---
title: "IndexHeadInsert"
description: "Directive Apache IndexHeadInsert (mod_autoindex) — Insère du texte dans la section HEAD de la page d'index. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Insère du texte dans la section HEAD de la page d'index. |
| **Syntaxe** | `IndexHeadInsert "marque ..."` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `IndexHeadInsert` permet de spécifier une chaîne de caractères à insérer dans la section *\<head\>* du code HTML généré pour la page d'index.

```apache
IndexHeadInsert "<link rel=\"sitemap\" href=\"/sitemap.html\">"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
