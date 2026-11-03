---
title: "SSLProxyProtocol"
description: "Directive Apache SSLProxyProtocol (mod_ssl) — Définit les protocoles SSL disponibles pour la fonction de mandataire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les protocoles SSL disponibles pour la fonction de mandataire |
| **Syntaxe** | `SSLProxyProtocol [+\|-]protocole ...` |
| **Valeur par défaut** | `SSLProxyProtocol all -SSLv3 (jusqu'à la version 2.4.16: all)` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir les protocoles SSL que mod\_ssl peut utiliser lors de l'élaboration de son environnement de serveur pour la fonction de mandataire. Il ne se connectera qu'aux serveurs utilisant un des protocoles spécifiés.

Veuillez vous reporter à la directive [[13-directives/sslprotocol|SSLProtocol]] pour plus d'informations.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
