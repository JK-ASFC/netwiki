---
title: "mod_proxy_wstunnel"
description: "Module Apache mod_proxy_wstunnel — Module pour mod_proxy supportant les websockets. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_wstunnel]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module pour mod\_proxy supportant les websockets |
| **Statut** | Deprecated |
| **Identificateur** | `proxy_wstunnel_module` |
| **Fichier source** | `mod_proxy_wstunnel.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Sommaire

> [!WARNING]
> **Obsolescence**
>
> Depuis la version 2.4.47 du serveur HTTP Apache, la promotion de protocole (tunneling) peut être pris en charge de manière plus efficace par [[12-modules/mod_proxy_http|mod_proxy_http]].
>
> Voir [[12-modules/mod_proxy|Promotion de protocole]].

Pour utiliser ce module, [[12-modules/mod_proxy|mod_proxy]] doit être chargé. Il fournit le support du tunnelling pour les connexions websocket vers un serveur websockets d'arrière-plan. La connexion est automatiquement promue en connexion websocket :

**Réponse HTTP**

```apache
Upgrade: WebSocket
Connection: Upgrade
```

Le mandatement des requêtes vers un serveur websockets comme `echo.websocket.org` peut être configuré via la directive [[13-directives/proxypass|ProxyPass]] :

```apache
ProxyPass "/ws2/"  "ws://echo.websocket.org/"
ProxyPass "/wss2/" "wss://echo.websocket.org/"
```

Il est possible de mandater les websockets et HTTP en même temps, avec un jeu spécifique d'URLs pour les websockets, en définissant la directive [[13-directives/proxypass|ProxyPass]] concernant les websockets avant celle concernant HTTP :

```apache
ProxyPassMatch ^/(myApp/ws)$  ws://backend.example.com:9080/$1
ProxyPass / http://backend.example.com:9080/
```

Il est possible de mandater les websockets et HTTP en même temps, lorsque les URLs websockets ne concernent pas uniquement les websockets ou ne sont pas connues à l'avance, en utilisant la directive [[13-directives/rewriterule|RewriteRule]] pour configurer le mandatement des websockets :

```apache
ProxyPass / http://example.com:9080/
RewriteEngine on
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?(.*) "ws://example.com:9080/$1" [P,L]
```

La répartition de charge entre plusieurs serveurs d'arrière-plan peut être configurée via le module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]].

Ce module peut aussi être utilisé pour la promotion vers des protocoles autres que WebSocket en définissant le paramètre *[[12-modules/mod_proxy|upgrade]]* de la directive [[13-directives/proxypass|ProxyPass]] avec un nom de protocole particulier. Les valeurs spéciales `upgrade=NONE` et `upgrade=ANY` peuvent être utilisées pour tester ou forcer la promotion de protocole mais leur utilisation **n'est pas recommandée** en production pour des raisons de sécurité. `NONE` signifie que la vérification de l'en-tête est omise mais que la promotion (tunneling) vers WebSocket s'effectuera quand-même. `ANY` signifie que la promotion (tunneling) s'effectuera en utilisant tout protocole demandé par le client.

## Directives

- [[13-directives/proxywebsocketfallbacktoproxyhttp|ProxyWebsocketFallbackToProxyHttp]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
