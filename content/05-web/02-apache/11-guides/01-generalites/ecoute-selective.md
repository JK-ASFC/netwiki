---
title: "Ecoute sélective"
description: "Apache HTTP Server — Ecoute sélective. Configuration du serveur HTTP Apache pour l'écoute sur un port et une adresse IP spécifiques."
tags: [apache, guide]
icon: book-open
---

Configuration du serveur HTTP Apache pour l'écoute sur un port et une adresse IP spécifiques.

## Vue d'ensemble

- [[12-modules/core|core]]
- [[12-modules/mpm_common|mpm_common]]
- [[13-directives/virtualhost|<VirtualHost>]]
- [[13-directives/listen|Listen]]

Au démarrage de httpd, un port et une adresse lui sont associés sur l'hôte local et le serveur se met en attente de l'arrivée d'une requête. Par défaut, le serveur écoute toutes les adresses de l'hôte local. Cependant, on peut lui préciser des ports et des adresses spécifiques à écouter, ou une combinaison des deux. Tout ceci est souvent associé avec la fonctionnalité des [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|serveurs virtuels]] qui détermine la manière dont `httpd` répond aux différents ports, noms d'hôtes et adresses IP.

La directive [[13-directives/listen|Listen]] permet d'indiquer au serveur qu'il ne doit accepter des requêtes que sur le(s) port(s) spécifiés ou une combinaison adresse/port. Si seul un numéro de port est spécifié dans la directive [[13-directives/listen|Listen]], le serveur se met à l'écoute sur ce port et sur toutes les interfaces réseau. Si une adresse IP est spécifiée en plus du port, le serveur va écouter sur ce port et uniquement sur l'interface réseau correspondante. On peut utiliser plusieurs directives [[13-directives/listen|Listen]] pour spécifier plusieurs adresses et ports à écouter. Le serveur répondra alors aux requêtes sur tous les ports et adresses spécifiés.

Par exemple, pour faire en sorte que le serveur accepte des connexions sur les ports 80 et 8000 et sur toutes les interfaces, utilisez :

```apache
Listen 80
Listen 8000
```

Pour faire en sorte que le serveur accepte des connexions sur le port 80 pour une interface, et sur le port 8000 pour une autre interface, utilisez :

```apache
Listen 192.0.2.1:80
Listen 192.0.2.5:8000
```

Les adresses IPv6 doivent être mises entre crochets, comme dans l'exemple suivant :

```apache
Listen [2001:db8::a00:20ff:fea7:ccea]:80
```

> [!WARNING]
> Des directives [[13-directives/listen|Listen]] imbriquées provoqueront une erreur fatale qui empêchera le serveur de démarrer.
>
> ```
> (48)Address already in use: make_sock: could not bind to address [::]:80
> ```
>
> Voir [cette discussion dans le wiki](https://cwiki.apache.org/confluence/display/httpd/CouldNotBindToAddress) pour plus de détails à propos de la résolution de ce problème.

## Changer la configuration de l'écoute au redémarrage

Lorsque httpd est redémarré, certaines remarques sont à prendre en compte quant aux modifications apportées aux directives [[13-directives/listen|Listen]]. Au cours du redémarrage, httpd conserve la liaison avec les ports de la configuration précédente afin d'éviter l'obtention d'un message d'erreur "Connection refused" lors d'une tentative ultérieure de connexion au serveur. Si les modifications apportées au jeu de directives [[13-directives/listen|Listen]] utilisé entrent en conflit avec ce dernier, le serveur refusera de redémarrer.

Par exemple, modifier la configuration suivante :

```apache
Listen 127.0.0.1:80
```

pour utiliser la suivante pourra échouer car écouter le port 80 sur toutes les adresses IP entre en conflit avec une écoute sélective du port 80 sur la seule adresse IP 127.0.0.1.

```apache
Listen 80
```

Pour qu'une telle modification de configuration soit prise en compte avec succès, il est nécessaire d'arrêter, puis de démarrer le serveur.

## Remarques spécifiques à IPv6

Un nombre croissant de plateformes implémentent IPv6, et APR supporte IPv6 sur la plupart d'entre elles, ce qui permet à httpd d'allouer des points de connexion (sockets) IPv6 et de traiter des requêtes envoyées sur IPv6.

Les administrateurs de httpd doivent se préoccuper de la possibilité pour un point de connexion IPv6 de traiter à la fois des connexions IPv4 et des connexions IPv6. Le traitement de connexions IPv4 avec un point de connexion IPv6 utilise des adresses IPv6 traduites en IPv4 qui sont autorisées par défaut sur la plupart des plateformes, mais sont interdites par défaut sous FreeBSD, NetBSD, et OpenBSD, afin de respecter la politique de sécurité du système sur ces plateformes. Sur les systèmes où ces adresses sont interdites par défaut, un paramètre spécial du script [[10-commandes/configure|configure]] permet de modifier ce comportement pour httpd.

En revanche, sur certaines plateformes comme Linux et Tru64, la **seule** manière de gérer à la fois IPv6 et IPv4 passe par l'utilisation d'adresses traduites. Si vous voulez que `httpd` gère des connexions IPv4 et IPv6 avec un minimum de points de connexion, ce qui nécessite l'utilisation d'adresses IPv6 traduites en IPv4, utilisez l'option `--enable-v4-mapped` du script [[10-commandes/configure|configure]].

L'option `--enable-v4-mapped` est utilisée par défaut sur toutes les plateformes sauf FreeBSD, NetBSD, et OpenBSD ; votre httpd a donc probablement été construit avec cette option.

Si vous souhaitez que httpd ne gère que des connexions IPv4, sans se soucier de ce que votre plateforme et APR supportent, spécifiez une adresse IPv4 dans toutes les directives [[13-directives/listen|Listen]], comme dans l'exemple suivant :

```apache
Listen 0.0.0.0:80
Listen 192.0.2.1:80
```

Si votre plateforme le supporte et si vous souhaitez que httpd gère des connexions IPv4 et IPv6 sur des points de connexion séparés (c'est à dire désactiver la traduction des adresses IPv6 au format IPv4), utilisez l'option `--disable-v4-mapped` du script [[10-commandes/configure|configure]]. `--disable-v4-mapped` est utilisée par défaut sur FreeBSD, NetBSD, et OpenBSD.

## Spécification du protocole avec Listen

Dans la plupart des configurations, le second paramètre optionnel *protocol* de la directive [[13-directives/listen|Listen]] n'est pas obligatoire. S'il n'est pas spécifié, les protocoles par défaut sont `https` pour le port 443, et `http` pour tous les autres ports. Le protocole sert à déterminer quel module doit traiter une requête, et à appliquer les optimisations spécifiques au protocole à l'aide de la directive [[13-directives/acceptfilter|AcceptFilter]].

Vous ne devez définir le protocole que si vous travaillez avec des ports non standards. Par exemple, pour travailler en `https` sur le port 8443 :

```apache
Listen 192.170.2.1:8443 https
```

## Qu'en est-il avec les serveurs virtuels

La directive [[13-directives/listen|Listen]] n'implémente pas les serveurs virtuels. Elle indique simplement au serveur principal sur quels adresses et ports il doit écouter. Si aucune directive [[13-directives/virtualhost|<VirtualHost>]] n'est présente, le serveur se comportera de la même façon pour toutes les requêtes acceptées. En revanche, la directive [[13-directives/virtualhost|<VirtualHost>]] peut être utilisée pour provoquer une réaction différente du serveur pour un ou plusieurs adresses ou ports. Pour implémenter un serveur virtuel, on doit d'abord indiquer au serveur sur quels adresses et ports il doit écouter. Ensuite, une section [[13-directives/virtualhost|<VirtualHost>]] doit être créée pour le couple adresse+port spécifié afin de définir le comportement de cet hôte virtuel. Notez que si la directive [[13-directives/virtualhost|<VirtualHost>]] est définie pour une adresse et un port sur lesquels le serveur n'est pas censé écouter, cet hôte virtuel ne sera pas accessible.

## Voir aussi

- [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Serveurs virtuels]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
