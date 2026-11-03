---
title: "DBDExptime"
description: "Directive Apache DBDExptime (mod_dbd) — Durée de vie des connexions inactives. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de vie des connexions inactives |
| **Syntaxe** | `DBDExptime durée en secondes` |
| **Valeur par défaut** | `DBDExptime 300` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de définir la durée de vie des connexions inactives lorsque le nombre de connexions spécifié par la directive DBDKeep a été dépassé (plates-formes threadées uniquement).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
