---
title: "FilterProtocol"
description: "Directive Apache FilterProtocol (mod_filter) — Vérifie le respect du protocole HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vérifie le respect du protocole HTTP |
| **Syntaxe** | `FilterProtocol nom_filtre [nom_fournisseur] drapeaux_protocole` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |

## Utilisation

Cette directive permet à [[12-modules/mod_filter|mod_filter]] de s'assurer qu'un filtre ne s'exécutera pas s'il ne doit pas le faire, et que les en-têtes de la réponse HTTP sont définis correctement en tenant compte des effets du filtre.

Cette directive se présente sous deux formes. Avec trois arguments, elle s'applique de manière spécifique à un *nom filtre* et un *nom fournisseur* pour ce filtre. Avec deux arguments, elle s'applique à un *nom filtre* pour *tout* fournisseur qu'il actionne.

Les drapeaux spécifiés sont fusionnés avec les drapeaux que les fournisseurs sous-jacents ont éventuellement enregistrés avec [[12-modules/mod_filter|mod_filter]]. Par exemple, un filtre peut avoir spécifié en interne un drapeau équivalent à `change=yes`, mais une configuration particulière du module peut le surcharger en spécifiant `change=no`.

*drapeaux\_protocole* peut contenir un ou plusieurs drapeaux parmi les suivants :

**`change=yes|no`**

Indique si le filtre doit modifier le contenu, y compris éventuellement sa taille

**`change=1:1`**

Le filtre modifie le contenu, mais pas sa taille

**`byteranges=no`**

Le filtre ne peut pas traiter de réponses à des sous-requêtes et nécessite des réponses complètes en entrée

**`proxy=no`**

Le filtre ne doit pas s'exécuter dans un contexte de mandataire

**`proxy=transform`**

Le filtre transforme la réponse de manière incompatible avec l'en-tête HTTP `Cache-Control: no-transform`

**`cache=no`**

Le filtre fait en sorte que la sortie ne puisse pas être mise en cache (par exemple en introduisant des modifications de contenu aléatoires)

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
