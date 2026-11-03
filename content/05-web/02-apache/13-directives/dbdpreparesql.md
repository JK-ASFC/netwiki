---
title: "DBDPrepareSQL"
description: "Directive Apache DBDPrepareSQL (mod_dbd) — Définit une requête SQL préparée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une requête SQL préparée |
| **Syntaxe** | `DBDPrepareSQL "requête SQL" étiquette` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Pour les modules tels que les modules d'authentification, qui utilisent de manière répétée la même requête SQL, on peut optimiser les performances en préparant la requête une fois pour toutes au démarrage, plutôt qu'à chaque utilisation. Cette directive permet de préparer une requête SQL et de lui assigner une étiquette.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
