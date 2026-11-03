---
title: "ExtendedStatus"
description: "Directive Apache ExtendedStatus (core) — Extrait des informations d'état étendues pour chaque requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extrait des informations d'état étendues pour chaque requête |
| **Syntaxe** | `ExtendedStatus On\|Off` |
| **Valeur par défaut** | `ExtendedStatus Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette option permet d'extraire des données supplémentaires concernant la requête en cours de traitement pour un processus donné, et crée un résumé d'utilisation ; vous pouvez accéder à ces variables pendant l'exécution en configurant [[12-modules/mod_status|mod_status]]. Notez que d'autres modules sont susceptibles de s'appuyer sur ce tableau de bord.

Cette directive s'applique au serveur dans son ensemble, et ne peut pas être activée/désactivée pour un serveur virtuel particulier. Notez que l'extraction des informations d'état étendues peut ralentir le serveur. Notez aussi que cette définition ne peut pas être modifiée au cours d'un redémarrage graceful.

> [!NOTE]
> Notez que le chargement de [[12-modules/mod_status|mod_status]] définit automatiquement ExtendedStatus à On, et que d'autres modules tiers sont susceptibles d'en faire de même. De tels modules ont besoin d'informations détaillées à propos de l'état de tous les processus. Depuis la version 2.3.6, [[12-modules/mod_status|mod_status]] a définit la valeur par défaut à On, alors qu'elle était à Off dans les versions antérieures.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
