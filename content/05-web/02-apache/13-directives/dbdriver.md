---
title: "DBDriver"
description: "Directive Apache DBDriver (mod_dbd) — Spécifie un pilote SQL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie un pilote SQL |
| **Syntaxe** | `DBDriver nom` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de spécifier un pilote apr\_dbd par son nom. Le pilote doit être installé sur votre système (sur la plupart des systèmes, il s'agit d'un objet partagé ou d'une dll). Par exemple, `DBDriver mysql` va sélectionner le pilote MySQL dans la bibliothèque apr\_dbd\_mysql.so.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
