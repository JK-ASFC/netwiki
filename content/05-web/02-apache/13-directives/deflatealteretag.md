---
title: "DeflateAlterETag"
description: "Directive Apache DeflateAlterETag (mod_deflate) — Comment l'en-tête sortant ETag doit être modifié au cours de la compression. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Comment l'en-tête sortant ETag doit être modifié au cours de la compression |
| **Syntaxe** | `DeflateAlterETag AddSuffix\|NoChange\|Remove` |
| **Valeur par défaut** | `DeflateAlterETag AddSuffix` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

La directive `DeflateAlterETag` permet de spécifier comment l'en-tête ETag doit être modifié lorsqu'une réponse est compressée.

**AddSuffix**

Ajoute la méthode de compression à la fin de l'en-tête, ce qui a pour effet d'attribuer un en-tête ETag unique aux représentations compressées et non compressées. C'est l'option par défaut depuis la version 2.4.0, mais empêche de servir des codes d'état "HTTP Not Modified" (304) en réponse aux requêtes pour un contenu compressé.

**NoChange**

Ne modifie pas l'en-tête ETag dans une réponse compressée. C'était l'option par défaut avant la version 2.4.0, mais cela ne respectait pas la préconisation HTTP/1.1 selon laquelle chaque représentation de la même ressource doit posséder un en-tête ETag unique.

**Remove**

Supprime l'en-tête ETag dans les réponses compressées, ce qui a pour effet de rendre impossibles certaines requêtes conditionnelles, mais permet d'éviter les inconvénients des options précédentes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
