---
title: "BrotliAlterETag"
description: "Directive Apache BrotliAlterETag (mod_brotli) — Comment l'en-tête de réponse ETag doit être modifié au cours de la compression. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_brotli]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Comment l'en-tête de réponse ETag doit être modifié au cours de la compression |
| **Syntaxe** | `BrotliAlterETag AddSuffix\|NoChange\|Remove` |
| **Valeur par défaut** | `BrotliAlterETag AddSuffix` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_brotli\|mod_brotli]] |

## Utilisation

La directive `BrotliAlterETag` permet d'indiquer comment l'en-tête ETag doit être modifié lorsqu'une réponse est compressée.

**AddSuffix**

Ajoute la méthode de compression à la fin de l'en-tête ETag, ce qui implique que les représentations compressées et non compressées possèderont des en-têtes ETag uniques. C'est le comportement par défaut depuis la version 2.4.0 avec un autre module de compression dynamique, mod-deflate. Ce paramètre permet d'éviter l'envoi de messages "HTTP Not Modified" (304) en réponse aux requêtes conditionnelles pour des contenus compressés.

**NoChange**

Ne modifie pas l'en-tête ETag d'une réponse compressée. C'était le comportement par défaut avant la version 2.4.0 avec un autre module de compression dynamique, mod-deflate. Ce paramètre ne respecte pas la propriété HTTP/1.1 selon laquelle toutes les représentations d'une même ressource ont des en-têtes ETag uniques.

**Remove**

Supprime l'en-tête ETag des réponses compressées, ce qui rend impossibles certaines requêtes conditionnelles, mais évite les inconvénients des options précédentes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
