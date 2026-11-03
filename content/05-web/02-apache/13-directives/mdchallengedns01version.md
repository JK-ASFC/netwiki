---
title: "MDChallengeDns01Version"
description: "Directive Apache MDChallengeDns01Version (mod_md) — Définit le type des arguments avec lesquels appeler MDChallengeDns01. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le type des arguments avec lesquels appeler MDChallengeDns01 |
| **Syntaxe** | `MDChallengeDns01Version 1\|2` |
| **Valeur par défaut** | `MDChallengeDns01Version 1` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir de quelle manière est invoquée la commande [[13-directives/mdchallengedns01|MDChallengeDns01]], à savoir le nombre et le type de ses arguments. Voir [[13-directives/mdchallengedns01|MDChallengeDns01]] pour les différences. Cette définition est globale et ne peut pas s'appliquer différemment pour chaque domaine.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
