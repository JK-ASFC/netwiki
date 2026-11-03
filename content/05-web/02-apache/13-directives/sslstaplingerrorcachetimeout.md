---
title: "SSLStaplingErrorCacheTimeout"
description: "Directive Apache SSLStaplingErrorCacheTimeout (mod_ssl) — Durée de vie des réponses invalides dans le cache pour agrafage OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de vie des réponses invalides dans le cache pour agrafage OCSP |
| **Syntaxe** | `SSLStaplingErrorCacheTimeout secondes` |
| **Valeur par défaut** | `SSLStaplingErrorCacheTimeout 600` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de définir la durée de vie des réponses *invalides* dans le cache pour agrafage OCSP configuré via la directive [[13-directives/sslstaplingcache|SSLStaplingCache]]. Pour définir la durée de vie des réponses valides, voir la directive [[13-directives/sslstaplingstandardcachetimeout|SSLStaplingStandardCacheTimeout]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
