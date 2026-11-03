---
title: "MDContactEmail"
description: "Directive Apache MDContactEmail (mod_md) — Adresse Email pour l'enregistrement du compte. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Adresse Email pour l'enregistrement du compte |
| **Syntaxe** | `MDContactEmail address` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Lors de votre inscription, vous devez fournir une url de contact pour le protocole ACME. Actuellement, Let's Encrypt exige une adresse Email qu'il utilisera pour vous informer des renouvellements de certificats ou de toute modification des conditions d'utilisation. Pour obtenir cette adresse, [[12-modules/mod_md|mod_md]] utilise l'email spécifiée par la directive `MDContactEmail` dans votre configuration de httpd ; veillez par conséquent à bien spécifier une adresse correcte à ce niveau. Si la directive `MDContactEmail` n'est pas définie, [[12-modules/mod_md|mod_md]] utilisera l'email spécifiée via la directive [[13-directives/serveradmin|ServerAdmin]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
