---
title: "DeflateInflateRatioLimit"
description: "Directive Apache DeflateInflateRatioLimit (mod_deflate) — Ratio de décompression maximum pour les corps de requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ratio de décompression maximum pour les corps de requêtes |
| **Syntaxe** | `DeflateInflateRatioLimit value` |
| **Valeur par défaut** | `DeflateInflateRatioLimit 200` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |
| **Compatibilité** | Disponible à partir de la version 2.4.10 du serveur HTTP Apache |

## Utilisation

La directive `DeflateInflateRatioLimit` permet de définir le ratio maximum entre la taille d'un corps de requête compressé et sa taille décompressée. Ce ratio est vérifié au fur et à mesure de l'arrivée du corps de requête, et s'il est dépassé plus de [[13-directives/deflateinflateratioburst|DeflateInflateRatioBurst]] fois, le traitement de la requête est interrompu.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
