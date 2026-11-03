---
title: "SSLStaplingResponderTimeout"
description: "Directive Apache SSLStaplingResponderTimeout (mod_ssl) — Temps d'attente maximum pour les requêtes vers les serveurs OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Temps d'attente maximum pour les requêtes vers les serveurs OCSP |
| **Syntaxe** | `SSLStaplingResponderTimeout secondes` |
| **Valeur par défaut** | `SSLStaplingResponderTimeout 10` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet de définir le temps d'attente maximum lorsque mod\_ssl envoie une requête vers un serveur OCSP afin d'obtenir une réponse destinée à être incluse dans les négociations TLS avec les clients ([[13-directives/sslusestapling|SSLUseStapling]] doit avoir été activée au préalable).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
