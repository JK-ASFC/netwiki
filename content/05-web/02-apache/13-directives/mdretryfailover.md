---
title: "MDRetryFailover"
description: "Directive Apache MDRetryFailover (mod_md) — Le nombre d'erreurs avant de se tourner vers un autre CA. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nombre d'erreurs avant de se tourner vers un autre CA |
| **Syntaxe** | `MDRetryFailover number` |
| **Valeur par défaut** | `MDRetryFailover 13` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.54 du serveur HTTP Apache |

## Utilisation

Le nombre d'erreurs consécutives lors du renouvellement d'un certificat avant la sélection d'une autre CA. Ne s'applique qu'aux configurations pour lesquelles plusieurs [[13-directives/mdcertificateauthority|MDCertificateAuthority]] ont été spécifiées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
