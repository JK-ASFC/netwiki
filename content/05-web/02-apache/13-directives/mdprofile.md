---
title: "MDProfile"
description: "Directive Apache MDProfile (mod_md) — Utiliser un profile ACME spécifique depuis le CA. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utiliser un profile ACME spécifique depuis le CA |
| **Syntaxe** | `MDProfile name` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.64 du serveur HTTP Apache |

## Utilisation

Il s'agit d'une extension non standard d'ACME par Let's Encrypt.

Let’s Encrypt prend en charge les profiles de certificat dans leurs CA. Cette fonctionnalité, entre autres détails, vous permet de définir la durée de validité des certificats que vous recevez. Le profile par défaut « classic » conserve la valeur de 90 jours, le profile « tlsserver » conserve aussi la valeur de 90 jours avec au maximum 25 noms alternatifs pour Subject. Le profile « shortlived » délivre des certificats dont la durée de validité est de 6 jours seulement.

Si vous ne modifiez pas la configuration de votre module [[12-modules/mod_md|mod_md]], vous continuerez à recevoir des certificats d'une durée de validité de 90 jours. Si vous pensez qu'une durée de validité plus courte convient mieux à votre situation (et acceptez le risque que le temps de renouvellement soit beaucoup plus court), vous pouvez définir le profile à utiliser à l'aide de « MDProfile shortlived ».

Les noms de profile sont définis par le CA. Si vous tentez de définie un profile non valable, aucun profile ne sera utilisé, et le certificat sera délivré avec les valeurs par défaut du CA.

Voir la directive [[13-directives/mdprofilemandatory|MDProfileMandatory]] pour la manière de désactiver les valeurs par défaut pour les profiles.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
