---
title: "MDCheckInterval"
description: "Directive Apache MDCheckInterval (mod_md) — Détermine la périodicité de la vérification des certificats. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine la périodicité de la vérification des certificats |
| **Syntaxe** | `MDCheckInterval duration` |
| **Valeur par défaut** | `MDCheckInterval 12h` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.60 du serveur HTTP Apache |

## Utilisation

Cette option permet de définir l'intervalle entre deux vérifications de certificat. Par défaut, la validité et le besoin de renouvellement sont vérifiés deux fois par jour. Cet intervalle n'est cependant pas appliqué avec précision. En effet, le module lui applique une plage de variation aléatoire de +/- 50%. Avec l'intervalle par défaut de 12 heures, cela signifie que l'intervalle réel entre deux vérifications varie entre 6 et 18 heures, la variation s'appliquant à nouveau à chaque vérification. Cela permet d'atténuer les pics de trafic sur les serveurs ACME.

La valeur minimale pouvant être définie pour l'intervalle est de 1 seconde. Il est cependant déconseillé de définir un intervalle aussi court sur un serveur en production.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
