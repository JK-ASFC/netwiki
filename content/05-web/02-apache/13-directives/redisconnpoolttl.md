---
title: "RedisConnPoolTTL"
description: "Directive Apache RedisConnPoolTTL (mod_socache_redis) — Durée de vie du jeu de connexions avec le(s) serveur(s) Redis. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_socache_redis]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de vie du jeu de connexions avec le(s) serveur(s) Redis. |
| **Syntaxe** | `RedisConnPoolTTL num[units]` |
| **Valeur par défaut** | `RedisConnPoolTTL 15s` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_socache_redis\|mod_socache_redis]] |
| **Compatibilité** | Disponible à partir de la version 2.4.39 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir la durée pendant laquelle les connexions inactives avec le(s) serveur(s) Redis seront conservées (plateformes threadées seulement).

Les valeurs valides pour `RedisConnPoolTTL` sont des durées limitées à 1 heure. 0 signifie aucune limite.

> [!NOTE]
> Par défaut, l'unité de ces valeurs est la seconde, mais on peut spécifier via un suffixe des valeurs en millisecondes (ms), en secondes (s), en minutes (min) ou en heures (h).

```apache
# Définit une durée de vie de 10 minutes
RedisConnPoolTTL 10min
# Définit une durée de vie de 60 secondes
RedisConnPoolTTL 60
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
