---
title: "DBDInitSQL"
description: "Directive Apache DBDInitSQL (mod_dbd) — Exécute une instruction SQL après connexion à une base de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Exécute une instruction SQL après connexion à une base de données |
| **Syntaxe** | `DBDInitSQL "instruction SQL"` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Les modules qui le souhaitent peuvent exécuter une ou plusieurs instructions SQL après connexion à une base de données. Par exemple initialiser certaines valeurs, ou ajouter une entrée dans le journal lors d'une nouvelle connexion à la base de données.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
