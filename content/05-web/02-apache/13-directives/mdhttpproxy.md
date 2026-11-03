---
title: "MDHttpProxy"
description: "Directive Apache MDHttpProxy (mod_md) — Spécifie un serveur mandataire pour les connexions sortantes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie un serveur mandataire pour les connexions sortantes. |
| **Syntaxe** | `MDHttpProxy url` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | À partir de la version 2.4.69, un mandataire peut être configuré séparément pour chaque MDomain. |

## Utilisation

Utiliser l’URL du serveur http mandataire direct donné pour se connecter à l'autorité de certification spécifiée via [[13-directives/mdcertificateauthority|MDCertificateAuthority]]. Vous devez la définir si votre serveur web ne peut atteindre internet que via un mandataire direct.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
