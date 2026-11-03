---
title: "SSLOCSPResponseTimeSkew"
description: "Directive Apache SSLOCSPResponseTimeSkew (mod_ssl) — Dérive temporelle maximale autorisée pour la validation des réponses OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Dérive temporelle maximale autorisée pour la validation des réponses OCSP |
| **Syntaxe** | `SSLOCSPResponseTimeSkew secondes` |
| **Valeur par défaut** | `SSLOCSPResponseTimeSkew 300` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette option permet de définir la dérive temporelle maximale autorisée pour les réponses OCSP (lors de la vérification des champs `thisUpdate` et `nextUpdate`).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
