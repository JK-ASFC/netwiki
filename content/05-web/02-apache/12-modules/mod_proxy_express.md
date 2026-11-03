---
title: "mod_proxy_express"
description: "Module Apache mod_proxy_express — Extension à mod_proxy pour le mandatement dynamique inverse de masse. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_express]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extension à mod\_proxy pour le mandatement dynamique inverse de masse |
| **Statut** | Extension |
| **Identificateur** | `proxy_express_module` |
| **Fichier source** | `mod_proxy_express.c` |
| **Compatibilité** | Disponible à partir de la version 2.3.13 du serveur HTTP Apache |

## Sommaire

Ce module crée dynamiquement en masse des mandataires inverses en faisant correspondre l'en-tête `Host:` de la requête HTTP à un nom de serveur et une URL d'arrière-plan stockés dans un fichier DBM. Il est ainsi plus aisé d'utiliser un grand nombre de mandataires inverses sans avoir à modifier la configuration. Il est loin de posséder autant de fonctionnalités que [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] qui propose aussi la croissance dynamique, mais il est conçu pour gérer un nombre beaucoup plus important de serveurs d'arrière-plan. Il convient parfaitement pour créer un commutateur HTTP frontal et pour les architectures Microservices.

Pour pouvoir être utilisé, ce module nécessite le chargement de [[12-modules/mod_proxy|mod_proxy]].

> [!WARNING]
> **Avertissement**
>
> N'activez le mandatement que si vous avez [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux pour votre réseau, et dans une plus large mesure pour Internet.

> [!NOTE]
> **Limitations**
>
> - Ce module n'est pas conçu pour remplacer les fonctionnalités dynamiques de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]]. Par contre, il peut constituer une alternative légère et rapide à [[12-modules/mod_rewrite|mod_rewrite]] lorsque ce dernier utilise la directive [[13-directives/rewritemap|RewriteMap]] et le drapeau `[P]` pour le mandatement inverse à partir d'une table de correspondances.
> - Il ne supporte pas les mises en correspondance basées sur les expressions rationnelles ou les modèles.
> - Il émule :
>
>   ```apache
>   <VirtualHost *:80>
>      ServerName front.end.server
>      ProxyPass "/" "back.end.server:port"
>      ProxyPassReverse "/" "back.end.server:port"
>   </VirtualHost>
>   ```
>
>   En d'autres termes, l'URL dans son ensemble est ajoutée à l'URL d'arrière-plan correspondante, tout ceci dans le but de proposer un commutateur mandataire inverse simple mais rapide.

## Directives

- [[13-directives/proxyexpressenable|ProxyExpressEnable]]
- [[13-directives/proxyexpressdbmfile|ProxyExpressDBMFile]]
- [[13-directives/proxyexpressdbmtype|ProxyExpressDBMType]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
