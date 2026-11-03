---
title: "SSLStaplingResponseTimeSkew"
description: "Directive Apache SSLStaplingResponseTimeSkew (mod_ssl) — Durée de vie maximale autorisée des réponses OCSP incluses dans la négociation TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de vie maximale autorisée des réponses OCSP incluses dans la négociation TLS |
| **Syntaxe** | `SSLStaplingResponseTimeSkew secondes` |
| **Valeur par défaut** | `SSLStaplingResponseTimeSkew 300` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de spécifier l'intervalle de temps maximum que mod\_ssl va calculer en faisant la différence entre les contenus des champs `nextUpdate` et `thisUpdate` des réponses OCSP incluses dans la négociation TLS. Pour pouvoir utiliser cette directive, [[13-directives/sslusestapling|SSLUseStapling]] doit être à "on".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
