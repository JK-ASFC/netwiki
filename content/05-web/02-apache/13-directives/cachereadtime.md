---
title: "CacheReadTime"
description: "Directive Apache CacheReadTime (mod_cache_disk) — Le temps minimum (en millisecondes) qui doit s'écouler avant d'envoyer les données au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_disk]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le temps minimum (en millisecondes) qui doit s'écouler avant d'envoyer les données au client |
| **Syntaxe** | `CacheReadTime millisecondes` |
| **Valeur par défaut** | `CacheReadTime 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_disk\|mod_cache_disk]] |

## Utilisation

La directive `CacheReadTime` permet de définir le temps minimum qui doit s'écouler avant d'essayer d'envoyer des données au client. Pendant ce temps, les données sont mises en tampon avant de pouvoir être envoyées au client. Les performances peuvent s'en trouver améliorées lorsqu'on met en cache du contenu en provenance d'un mandataire inverse.

La valeur par défaut zéro désactive cette option.

Cette directive ne prend effet que lorsque les données sont enregistrées dans le cache, et non lorsque les données sont servies à partir du cache. Il est recommandé d'harmoniser l'utilisation de cette directive avec celle de la directive [[13-directives/cachereadsize|CacheReadSize]], afin de s'assurer que le serveur n'effectue pas une mise en tampon excessive au cas où les données arriveraient plus vite que prévu.

```apache
CacheReadTime 1000
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
