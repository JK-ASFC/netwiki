---
title: "DeflateInflateRatioBurst"
description: "Directive Apache DeflateInflateRatioBurst (mod_deflate) — Nombre maximal de fois que le ratio de décompression d'un corps de requête peut être dépassé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal de fois que le ratio de décompression d'un corps de requête peut être dépassé |
| **Syntaxe** | `DeflateInflateRatioBurst value` |
| **Valeur par défaut** | `DeflateInflateRatioBurst 3` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |
| **Compatibilité** | Disponible à partir de la version 2.4.10 du serveur HTTP Apache |

## Utilisation

La directive `DeflateInflateRatioBurst` permet de spécifier le nombre maximal de fois que la valeur de la directive [[13-directives/deflateinflateratiolimit|DeflateInflateRatioLimit]] peut être dépassé avant l'arrêt du traitement de la requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
