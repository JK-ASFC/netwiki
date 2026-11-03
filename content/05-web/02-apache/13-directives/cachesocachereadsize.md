---
title: "CacheSocacheReadSize"
description: "Directive Apache CacheSocacheReadSize (mod_cache_socache) — La quantité minimale de données du document à lire et mettre en cache avant envoi au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La quantité minimale de données du document à lire et mettre en cache avant envoi au client |
| **Syntaxe** | `CacheSocacheReadSize octets` |
| **Valeur par défaut** | `CacheSocacheReadSize 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocacheReadSize` définit la quantité minimale de données, en octets, à lire depuis l'arrière-plan avant envoi au client. Avec la valeur par défaut 0, les données sont transmises au client dès leur arrivée et quelle que soit leur taille. Si la valeur définie est non nulle, le cache disque va mettre en tampon au moins la quantité de données correspondante avant envoi au client. Ceci peut améliorer les performances en cas de mise en cache de contenu en provenance d'un mandataire inverse lent.

Cette directive n'a d'effet qu'au moment où les données sont stockées dans le cache, et non lorsqu'elles sont servies depuis le cache.

```apache
CacheSocacheReadSize 102400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
