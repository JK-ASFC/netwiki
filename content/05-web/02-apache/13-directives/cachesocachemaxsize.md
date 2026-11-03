---
title: "CacheSocacheMaxSize"
description: "Directive Apache CacheSocacheMaxSize (mod_cache_socache) — La taille maximale d'une entrée pouvant être placée dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La taille maximale d'une entrée pouvant être placée dans le cache |
| **Syntaxe** | `CacheSocacheMaxSize octets` |
| **Valeur par défaut** | `CacheSocacheMaxSize 102400` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocacheMaxSize` définit la taille maximale, en octets, de la somme des en-têtes et du corps d'un document pouvant être stocké dans le cache. La valeur minimale est 1024 octets. Bien entendu, plus la taille des en-têtes sera grande, plus la taille maximale du corps du document s'en trouvera réduite.

Le module [[12-modules/mod_cache_socache|mod_cache_socache]] ne tentera de mettre en cache que des réponses qui possèdent une taille de contenu explicite, ou dont la taille est suffisamment petite pour qu'elles soient écrites en une seule passe. Ceci permet au module [[12-modules/mod_cache_disk|mod_cache_disk]] de mettre en cache des réponses dont la taille est trop importante pour pouvoir être mises en cache par [[12-modules/mod_cache_socache|mod_cache_socache]].

```apache
CacheSocacheMaxSize 102400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
