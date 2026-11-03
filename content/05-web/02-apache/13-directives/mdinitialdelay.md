---
title: "MDInitialDelay"
description: "Directive Apache MDInitialDelay (mod_md) — Le délai avant la première vérification de certificat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le délai avant la première vérification de certificat. |
| **Syntaxe** | `MDInitialDelay duration` |
| **Valeur par défaut** | `MDInitialDelay 0s` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.66 du serveur HTTP Apache |

## Utilisation

Le temps d'attente, après le démarrage du serveur, avant de vérifier si des certificats doivent être renouvelés. Par défaut, cette vérification est immédiate.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
