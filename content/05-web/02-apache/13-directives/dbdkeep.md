---
title: "DBDKeep"
description: "Directive Apache DBDKeep (mod_dbd) — Nombre maximum de connexions maintenues. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum de connexions maintenues |
| **Syntaxe** | `DBDKeep nombre` |
| **Valeur par défaut** | `DBDKeep 2` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de définir le nombre maximum de connexions à maintenir par processus, en dehors de celles servant à gérer les pics de demandes (plates-formes threadées uniquement).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
