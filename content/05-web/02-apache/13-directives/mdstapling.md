---
title: "MDStapling"
description: "Directive Apache MDStapling (mod_md) — Active l'agrafage pour un ou plusieurs domaines. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'agrafage pour un ou plusieurs domaines. |
| **Syntaxe** | `MDStapling on\|off` |
| **Valeur par défaut** | `MDStapling off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

[[12-modules/mod_md|mod_md]] permet l'obtention des informations d'agrafage OCSP. Cette fonctionnalité est une alternative à celle fournie par [[12-modules/mod_ssl|mod_ssl]]. Elle est désactivée par défaut à des fins de compatibilité ascendante.

La fonctionnalité peut être activée pour tous les certificats du serveur ou pour un [[13-directives/mdomain|MDomain]] seulement, ce qui aura pour effet de remplacer toute configuration d'agrafage au niveau de [[12-modules/mod_ssl|mod_ssl]] pour ce(s) domaine(s). Lorsqu'elle est désactivée, l'agrafage de [[12-modules/mod_ssl|mod_ssl]] se chargera du travail (s'il a été lui-même activé, bien entendu). Ceci permet de basculer de manière graduée d'une implémentation à l'autre.

L'agrafage fonctionne aussi pour les domaines non gérés par [[12-modules/mod_md|mod_md]] (voir à ce sujet la directive [[13-directives/mdstapleothers|MDStapleOthers]]). En fait, l'agrafage OCSP peut très bien être utilisé en l'absence de tout certificat géré via le protocole ACME.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
