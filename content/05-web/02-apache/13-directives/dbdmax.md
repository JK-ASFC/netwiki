---
title: "DBDMax"
description: "Directive Apache DBDMax (mod_dbd) — Nombre maximum de connexions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de connexions |
| **Syntaxe** | `DBDMax nombre` |
| **Valeur par défaut** | `DBDMax 10` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de définir le nombre maximum effectif de connexions par processus (plates-formes threadées uniquement).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
