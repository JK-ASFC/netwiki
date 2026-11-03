---
title: "ServerTokens"
description: "Directive Apache ServerTokens (core) — Configure l'en-tête Server de la réponse HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure l'en-tête `Server` de la réponse HTTP |
| **Syntaxe** | `ServerTokens Major\|Minor\|Min[imal]\|Prod[uctOnly]\|OS\|Full` |
| **Valeur par défaut** | `ServerTokens Full` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet de contrôler le contenu de l'en-tête `Server` inclus dans la réponse envoyée au client : cet en-tête peut contenir le type de système d'exploitation du serveur, ainsi que des informations à propos des modules compilés avec le serveur.

**`ServerTokens Full` (ou non spécifié)**

Le serveur envoie par exemple : `Server: Apache/2.4.2 (Unix) PHP/4.2.2 MyMod/1.2`

**`ServerTokens Prod[uctOnly]`**

Le serveur renvoie (*par exemple*): `Server: Apache`

**`ServerTokens Major`**

Le serveur renvoie (*par exemple*): `Server: Apache/2`

**`ServerTokens Minor`**

Le serveur renvoie (*par exemple*): `Server: Apache/2.4`

**`ServerTokens Min[imal]`**

Le serveur renvoie (*par exemple*): `Server: Apache/2.4.2`

**`ServerTokens OS`**

Le serveur renvoie (*par exemple*): `Server: Apache/2.4.2 (Unix)`

Cette définition s'applique à l'ensemble du serveur et ne peut être activée ou désactivée pour tel ou tel serveur virtuel.

Cette directive contrôle aussi les informations fournies par la directive [[13-directives/serversignature|ServerSignature]].

> [!NOTE]
> Définir `ServerTokens` à une valeur inférieure à `minimal` n'est pas recommandé car le débogage des problèmes interopérationnels n'en sera alors que plus difficile. Notez aussi que la désactivation de l'en-tête Server: n'améliore en rien la sécurité de votre serveur ; le concept de "sécurité par l'obscurité" est un mythe et conduit à une mauvaise perception de ce qu'est la sécurité.

## Voir aussi

- [[13-directives/serversignature|ServerSignature]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
