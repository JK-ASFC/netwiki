---
title: "MDStapleOthers"
description: "Directive Apache MDStapleOthers (mod_md) — Active l'agrafage pour les certificats non gérés par mod_md. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'agrafage pour les certificats non gérés par mod\_md. |
| **Syntaxe** | `MDStapleOthers on\|off` |
| **Valeur par défaut** | `MDStapleOthers on` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Cette directive n'a d'effet que si [[13-directives/mdstapling|MDStapling]] est activée. Elle permet de contrôler si [[12-modules/mod_md|mod_md]] doit aussi fournir les informations d'agrafage pour les certificats qu'il ne gère pas directement (autrement dit pour les certificats non renouvelés via le protocole ACME).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
