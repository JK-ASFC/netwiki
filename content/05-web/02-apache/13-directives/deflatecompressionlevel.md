---
title: "DeflateCompressionLevel"
description: "Directive Apache DeflateCompressionLevel (mod_deflate) — Le niveau de compression que nous appliquons à la sortie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le niveau de compression que nous appliquons à la sortie |
| **Syntaxe** | `DeflateCompressionLevel valeur` |
| **Valeur par défaut** | `La valeur par défaut de zlib` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |

## Utilisation

La directive `DeflateCompressionLevel` permet de spécifier le niveau de compression à utiliser ; plus grande est la valeur, meilleure sera la compression, mais plus grand sera aussi le temps CPU nécessaire pour effectuer le traitement.

La valeur doit être comprise entre 1 (compression minimale) et 9 (compression maximale).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
