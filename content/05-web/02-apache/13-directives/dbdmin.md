---
title: "DBDMin"
description: "Directive Apache DBDMin (mod_dbd) — Nombre minimum de connexions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre minimum de connexions |
| **Syntaxe** | `DBDMin nombre` |
| **Valeur par défaut** | `DBDMin 1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de définir le nombre minimum de connexions par processus (plates-formes threadées uniquement).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
