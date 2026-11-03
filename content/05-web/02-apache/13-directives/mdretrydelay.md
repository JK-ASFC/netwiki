---
title: "MDRetryDelay"
description: "Directive Apache MDRetryDelay (mod_md) — Temps d'attente avant de réessayer, doublé à chaque erreur consécutive. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Temps d'attente avant de réessayer, doublé à chaque erreur consécutive |
| **Syntaxe** | `MDRetryDelay duration` |
| **Valeur par défaut** | `MDRetryDelay 30s` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.54 du serveur HTTP Apache |

## Utilisation

Le temps d'attente après une erreur avant de tenter à nouveau le renouvellement d'un certificat. Ce temps est doublé après chaque erreur consécutive avec un maximum de 24 heures.

Ce temps d'attente est spécifique à chaque renouvellement de certificat. Autrement dit, une erreur sur un MDomain ne retarde pas les renouvellements des autres domaines.

Avec la version 2.6.1 de mod\_md, le temps d'attente a été augmenté de 5 à 30 secondes.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
