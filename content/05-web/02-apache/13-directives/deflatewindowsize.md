---
title: "DeflateWindowSize"
description: "Directive Apache DeflateWindowSize (mod_deflate) — Taille de la fenêtre de compression zlib. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille de la fenêtre de compression zlib |
| **Syntaxe** | `DeflateWindowSize valeur` |
| **Valeur par défaut** | `DeflateWindowSize 15` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |

## Utilisation

La directive `DeflateWindowSize` permet de spécifier la fenêtre de compression zlib (une valeur comprise entre 1 et 15). En général, plus grande sera la taille de la fenêtre, plus grand sera le taux de compression auquel on pourra s'attendre.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
