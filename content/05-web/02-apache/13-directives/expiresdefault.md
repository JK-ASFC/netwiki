---
title: "ExpiresDefault"
description: "Directive Apache ExpiresDefault (mod_expires) — Mode de calcul par défaut de la date d'expiration. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_expires]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Mode de calcul par défaut de la date d'expiration |
| **Syntaxe** | `ExpiresDefault <code>secondes` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_expires\|mod_expires]] |

## Utilisation

Cette directive permet de définir le mode de calcul par défaut de la date d'expiration pour tous les documents du domaine considéré. Elle peut être annulée pour certains types de documents par la directive [[13-directives/expiresbytype|ExpiresByType]]. Voir la description de cette dernière directive pour plus de détails à propos de la syntaxe de l'argument, ainsi que la description de la syntaxe alternative.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
