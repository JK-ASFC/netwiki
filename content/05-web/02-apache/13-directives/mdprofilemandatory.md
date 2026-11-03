---
title: "MDProfileMandatory"
description: "Directive Apache MDProfileMandatory (mod_md) — Contrôler si un MDProfile est obligatoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôler si un MDProfile est obligatoire. |
| **Syntaxe** | `MDProfileMandatory on\|off` |
| **Valeur par défaut** | `MDProfileMandatory off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.64 du serveur HTTP Apache |

## Utilisation

Cette directive permet de contrôler si un [[13-directives/mdprofile|MDProfile]] que vous définissez est obligatoire ou non. S'il est obligatoire et si le CA ne propose pas de profile configuré, le renouvellement du certificat échouera.

S'il n'est pas obligatoire et si le CA ne propose pas de profile, les renouvellements seront effectués sans profile particulier et le CA délivrera les certificats avec les valeurs par défaut.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
