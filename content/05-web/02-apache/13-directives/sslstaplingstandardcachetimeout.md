---
title: "SSLStaplingStandardCacheTimeout"
description: "Directive Apache SSLStaplingStandardCacheTimeout (mod_ssl) — Durée de vie des réponses OCSP dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de vie des réponses OCSP dans le cache |
| **Syntaxe** | `SSLStaplingStandardCacheTimeout secondes` |
| **Valeur par défaut** | `SSLStaplingStandardCacheTimeout 3600` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de définir la durée de vie des réponses OCSP dans le cache configuré via la directive [[13-directives/sslstaplingcache|SSLStaplingCache]]. Elle ne s'applique qu'aux réponse *valides*, alors que la directive [[13-directives/sslstaplingerrorcachetimeout|SSLStaplingErrorCacheTimeout]] s'applique aux réponses invalides ou non disponibles.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
