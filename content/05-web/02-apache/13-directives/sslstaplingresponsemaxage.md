---
title: "SSLStaplingResponseMaxAge"
description: "Directive Apache SSLStaplingResponseMaxAge (mod_ssl) — Age maximum autorisé des réponses OCSP incluses dans la négociation TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Age maximum autorisé des réponses OCSP incluses dans la négociation TLS |
| **Syntaxe** | `SSLStaplingResponseMaxAge secondes` |
| **Valeur par défaut** | `SSLStaplingResponseMaxAge -1` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de définir l'âge maximum autorisé ("fraîcheur") des réponses OCSP incluses dans la négociation TLS ([[13-directives/sslusestapling|SSLUseStapling]] doit avoir été activée au préalable). La valeur par défaut (`-1`) ne définit aucun âge maximum, ce qui signifie que les réponses OCSP sont considérées comme valides à partir du moment où le contenu de leur champ `nextUpdate` se trouve dans le futur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
