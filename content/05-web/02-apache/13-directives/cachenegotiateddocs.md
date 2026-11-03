---
title: "CacheNegotiatedDocs"
description: "Directive Apache CacheNegotiatedDocs (mod_negotiation) — Permet la mise en cache au niveau des serveurs mandataires des documents dont le contenu a été négocié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_negotiation]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet la mise en cache au niveau des serveurs mandataires des documents dont le contenu a été négocié |
| **Syntaxe** | `CacheNegotiatedDocs On\|Off` |
| **Valeur par défaut** | `CacheNegotiatedDocs Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_negotiation\|mod_negotiation]] |

## Utilisation

Si elle est définie à "on", cette directive permet la mise en cache au niveau des serveurs mandataires des documents dont le contenu a été négocié. Le processus de mise en cache sera alors plus efficace, mais des clients se trouvant derrière le mandataire seront alors susceptibles de se voir servir des versions de documents qui ne correspondent pas forcément à leurs attentes.

Cette directive ne s'applique qu'aux requêtes en provenance de navigateurs HTTP/1.0. HTTP/1.1 fournit un bien meilleur contrôle de la mise en cache des documents au contenu négocié, et cette directive n'a aucun effet sur les réponses aux requêtes HTTP/1.1.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
