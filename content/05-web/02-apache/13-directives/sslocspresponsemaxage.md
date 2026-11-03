---
title: "SSLOCSPResponseMaxAge"
description: "Directive Apache SSLOCSPResponseMaxAge (mod_ssl) — Age maximum autorisé pour les réponses OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Age maximum autorisé pour les réponses OCSP |
| **Syntaxe** | `SSLOCSPResponseMaxAge secondes` |
| **Valeur par défaut** | `SSLOCSPResponseMaxAge -1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette option permet de définir l'âge maximum autorisé (la "fraicheur") des réponses OCSP. La valeur par défault (`-1`) signifie qu'aucun âge maximum n'est défini ; autrement dit, les réponses OCSP sont considérées comme valides tant que la valeur de leur champ `nextUpdate` se situe dans le futur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
