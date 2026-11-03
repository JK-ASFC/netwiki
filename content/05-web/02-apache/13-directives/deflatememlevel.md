---
title: "DeflateMemLevel"
description: "Directive Apache DeflateMemLevel (mod_deflate) — La quantité de mémoire utilisable par zlib pour la compression. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La quantité de mémoire utilisable par zlib pour la compression |
| **Syntaxe** | `DeflateMemLevel valeur` |
| **Valeur par défaut** | `DeflateMemLevel 9` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |

## Utilisation

La directive `DeflateMemLevel` permet de spécifier la quantité de mémoire utilisable par zlib pour la compression (une valeur comprise entre 1 et 9).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
