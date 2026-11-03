---
title: "SSLOCSPResponderTimeout"
description: "Directive Apache SSLOCSPResponderTimeout (mod_ssl) — Délai d'attente pour les requêtes OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Délai d'attente pour les requêtes OCSP |
| **Syntaxe** | `SSLOCSPResponderTimeout secondes` |
| **Valeur par défaut** | `SSLOCSPResponderTimeout 10` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette option permet de définir le délai d'attente pour les requêtes à destination des répondeurs OCSP, lorsque la directive [[13-directives/sslocspenable|SSLOCSPEnable]] est à on.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
