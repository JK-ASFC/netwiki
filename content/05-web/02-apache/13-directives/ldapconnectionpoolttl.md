---
title: "LDAPConnectionPoolTTL"
description: "Directive Apache LDAPConnectionPoolTTL (mod_ldap) — Désactive les connexions d'arrière-plan qui sont restées inactives trop longtemps au sein du jeu de connexions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Désactive les connexions d'arrière-plan qui sont restées inactives trop longtemps au sein du jeu de connexions. |
| **Syntaxe** | `LDAPConnectionPoolTTL n` |
| **Valeur par défaut** | `LDAPConnectionPoolTTL -1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |
| **Compatibilité** | Disponible à partir de la version 2.3.12 du serveur HTTP Apache |

## Utilisation

Cette directive permet de spécifier la durée maximale, en secondes, pendant laquelle une connexion LDAP du jeu de connexions peut demeurer inactive, mais rester quand-même disponible pour une utilisation éventuelle. Le jeu de connexions est nettoyé au fur et à mesure des besoins, de manière non asynchrone.

Si cette directive est définie à 0, les connexions ne sont jamais sauvegardées dans le jeu de connexions d'arrière-plan. Avec la valeur par défaut -1, ou toute autre valeur négative, les connexions peuvent être réutilisées sans limite de durée.

Dans le but d'améliorer les performances, le temps de référence qu'utilise cette directive correspond au moment où la connexion LDAP est enregistrée ou remise dans le jeu de connexions, et non au moment du dernier échange réussi avec le serveur LDAP.

La version 2.4.10 a introduit de nouvelles mesures permettant d'éviter une augmentation excessive du temps de référence due à des correspondances positives dans le cache ou des requêtes lentes. A cet effet, le temps de référence n'est pas réactualisé si aucune connexion LDAP d'arrière-plan n'est requise ; d'autre part, le temps de référence se base sur le moment où la requête HTTP est reçue, et non sur le moment où la requête a été traitée.

> [!NOTE]
> Cette durée de vie s'exprime par défaut en secondes, mais il est possible d'utiliser d'autres unités en ajoutant un suffixe : millisecondes (ms), minutes (min), ou heures (h).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
