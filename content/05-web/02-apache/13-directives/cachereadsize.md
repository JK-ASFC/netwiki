---
title: "CacheReadSize"
description: "Directive Apache CacheReadSize (mod_cache_disk) — La quantité minimale (en octets) de données à lire et à mettre en cache avant de les envoyer au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La quantité minimale (en octets) de données à lire et à mettre en cache avant de les envoyer au client |
| **Syntaxe** | `CacheReadSize octets` |
| **Valeur par défaut** | `CacheReadSize 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheReadSize` permet de définir la quantité minimale de données, en octets, à lire depuis le serveur d'arrière-plan avant de les envoyer au client. Avec la valeur par défaut zéro, toute donnée de toutes tailles est envoyée au client dès qu'elle est disponible. Avec une valeur non nulle, le cache disque met en tampon au moins la quantité de données correspondante avant d'envoyer la réponse au client. Les performances peuvent s'en trouver améliorées lorsqu'on met en cache du contenu en provenance d'un mandataire inverse.

Cette directive ne prend effet que lorsque les données sont enregistrées dans le cache, et non lorsque les données sont servies à partir du cache.

```apache
CacheReadSize 102400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
