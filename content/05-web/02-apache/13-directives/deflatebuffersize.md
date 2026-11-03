---
title: "DeflateBufferSize"
description: "Directive Apache DeflateBufferSize (mod_deflate) — Taille du fragment que zlib devra compresser en une seule fois. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du fragment que zlib devra compresser en une seule fois |
| **Syntaxe** | `DeflateBufferSize valeur` |
| **Valeur par défaut** | `DeflateBufferSize 8096` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |

## Utilisation

La directive `DeflateBufferSize` permet de spécifier la taille en octets du fragment que zlib devra compresser en une seule fois. Si la taille de la réponse compressée est supérieure à celle spécifiée par cette directive, httpd passera à un mode d'encodage fragmenté (l'en-tête HTTP `Transfer-Encoding` prend la valeur `Chunked`), ceci ayant comme effet de bord de ne définir aucun en-tête HTTP `Content-Length`. Il est important de connaître ce comportement, particulièrement lorsque httpd travaille derrière des mandataires inverses avec mise en cache, ou lorsque httpd est configuré pour utiliser [[12-modules/mod_cache|mod_cache]] et [[12-modules/mod_cache_disk|mod_cache_disk]] car les réponses HTTP sans en-tête `Content-Length` peuvent ne pas être mises en cache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
