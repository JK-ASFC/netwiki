---
title: "RedisTimeout"
description: "Directive Apache RedisTimeout (mod_socache_redis) — Durée maximale de lecture/écriture sur la connexion avec le(s) serveur(s) Redis. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_socache_redis]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée maximale de lecture/écriture sur la connexion avec le(s) serveur(s) Redis. |
| **Syntaxe** | `RedisTimeout num[units]` |
| **Valeur par défaut** | `RedisTimeout 5s` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_socache_redis\|mod_socache_redis]] |
| **Compatibilité** | Disponible à partir de la version 2.4.39 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir la durée maximale de lecture/écriture sur la connexion avec le(s) serveur(s) Redis.

Les valeurs valides pour `RedisTimeout` sont des durées limitées à 1 heure. 0 signifie aucune limite.

> [!NOTE]
> Par défaut, l'unité de ces valeurs est la seconde, mais on peut spécifier via un suffixe des valeurs en millisecondes (ms), en secondes (s), en minutes (min) ou en heures (h).

```apache
# Définit une durée de 10 minutes
RedisTimeout 10min
# Définit une durée de 60 secondes
RedisTimeout 60
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
