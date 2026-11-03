---
title: "mod_authz_host"
description: "Module Apache mod_authz_host — Autorisations de groupe basées sur l'hôte (nom ou adresse IP). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_host]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisations de groupe basées sur l'hôte (nom ou adresse IP) |
| **Statut** | Base |
| **Identificateur** | `authz_host_module` |
| **Fichier source** | `mod_authz_host.c` |
| **Compatibilité** | Le fournisseur `forward-dns` est disponible à partir de la version 2.4.19 du serveur HTTP Apache |

## Sommaire

Les fournisseurs d'autorisation implémentés par le module [[12-modules/mod_authz_host|mod_authz_host]] sont enregistrés à l'aide de la directive [[13-directives/require|Require]]. On peut utiliser cette directive à l'intérieur de sections [[13-directives/directory|<Directory>]], [[13-directives/files|<Files>]], ou [[13-directives/location|<Location>]] ou de fichiers `.htaccess` pour contrôler l'accès à certaines zones du serveur. Le contrôle d'accès peut être effectué en fonction du nom d'hôte ou de l'adresse IP.

En général, les directives de restriction d'accès s'appliquent à toutes les méthodes d'accès (`GET`, `PUT`, `POST`, etc...). C'est d'ailleurs ce que l'on souhaite dans la plupart des cas. Il est cependant possible de ne restreindre l'accès que pour certaines méthodes, tout en laissant les autres méthodes sans protection, en plaçant les directives dans une section [[13-directives/limit|<Limit>]].

## Les directives Require

La directive Apache [[13-directives/require|Require]] est utilisée au cours de la phase d'autorisation pour vérifier si un utilisateur se voit accorder ou refuser l'accès à une ressource. mod\_authz\_host fournit les types d'autorisation `ip`, `host`, `forward-dns` et `local`. D'autres types d'autorisation sont aussi disponibles, mais nécessitent le chargement des modules d'autorisation appropriés.

Ces fournisseurs d'autorisation permettent de déterminer quels hôtes peuvent accéder à une zone du serveur. On peut contrôler l'accès en fonction du nom d'hôte, de l'adresse IP, ou d'un intervalle d'adresses IP.

A partir de la version 2.4.8, les directives require host supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require ip

Le fournisseur `ip` permet de contrôler l'accès au serveur en fonction de l'adresse IP du client distant. Lorsque `Require ip adresse-ip` est spécifié, la requête est autorisée si l'adresse IP du client distant correspond à

Une adresse IP complète :

```apache
Require ip 10.1.2.3
Require ip 192.168.1.104 192.168.1.205
```

L'adresse IP d'un hôte pour qui l'accès est accordé

Une adresse IP partielle :

```apache
Require ip 10.1
Require ip 10 172.20 192.168.2
```

Les 1 à 3 premiers octets d'une adresse IP, pour une restriction à un sous-réseau.

Une paire réseau/masque de sous-réseau :

```apache
Require ip 10.1.0.0/255.255.0.0
```

Un réseau a.b.c.d, et un masque de sous-réseau w.x.y.z. pour une restriction de sous-réseau plus fine.

Une spécification CIDR réseau/nnn :

```apache
Require ip 10.1.0.0/16
```

Identique au cas précédent, excepté que le masque de sous-réseau représente les nnn premiers bits de poids fort.

Notez que les trois derniers exemples correspondent exectement au même ensemble d'hôtes.

On peut spécifier des adresses et des sous-réseaux IPv6 comme suit :

```apache
Require ip 2001:db8::a00:20ff:fea7:ccea
Require ip 2001:db8:1:1::a
Require ip 2001:db8:2:1::/64
Require ip 2001:db8:3::/48
```

Note: comme les adresses IP sont lues au démarrage, les expressions ne sont pas évaluées au moment de la requête.

### Require host

Le fournisseur `host` permet de contrôler l'accès au serveur en fonction du nom d'hôte du client distant. Lorsque `Require host nom-hôte` est spécifié, la requête est autorisée si le nom d'hôte correspond à

Un nom de domaine (éventuellement partiel)

```apache
Require host example.org
Require host .net example.edu
```

Les hôtes dont les noms correspondent ou se terminent par la chaîne spécifiée se voient accorder l'accès. Seuls les élément de nom de domaine complets sont mis en correspondance ; ainsi, l'exemple ci-dessus correspondra à `foo.example.org`, mais ne correspondra pas à `fooexample.org`. Avec cette configuration, Apache va effectuer une double recherche DNS sur l'adresse IP du client, sans tenir compte de la définition de la directive [[13-directives/hostnamelookups|HostnameLookups]]. Il va effectuer une recherche DNS inverse sur l'adresse IP pour trouver le nom d'hôte associé, puis une recherche DNS directe sur le nom d'hôte pour vérifier qu'il correspond bien à l'adresse IP originale. L'accès ne sera accordé que si le nom d'hôte correspond et si les recherches DNS inverse et directe sont cohérentes.

### Require forward-dns

Le fournisseur `forward-dns` permet d'accéder au serveur sécurisé en fonction de simples noms d'hôte. Lorsque `Require forward-dns host-name` est spécifié, toute adresse IP correspondant à `host-name` se voit autoriser l'accès.

A la différence du fournisseur `host`, ce fournisseur n'effectue pas de recherche DNS inverse : il effectue simplement une requête DNS directe pour le nom d'hôte spécifié et donne accès au client si son adresse IP correspond. Il ne fonctionnera donc qu'avec des noms d'hôte complets qui peuvent être résolus par le DNS, et non avec des noms de domaine partiels. Par contre, comme le DNS inverse n'est pas sollicité, et comme les recherches DNS interviennent au moment du traitement de la requête (et non au démarrage), il fonctionnera avec des clients qui utilisent un service de DNS dynamique.

```apache
Require forward-dns dynamic.example.org
```

Un client dont l'adresse IP correspond au nom d'hôte `dynamic.example.org` se verra autoriser l'accès.

### Require local

Le fournisseur `local` autorise l'accès au serveur si l'une au moins de ces conditions est satisfaite :

- l'adresse IP du client correspond à 127.0.0.0/8
- l'adresse IP du client est ::1
- les adresses IP du client et du serveur sont identiques

L'exemple suivant montre une méthode simple pour sélectionner les connexions en provenance de l'hôte local :

```apache
Require local
```

### Note concernant la sécurité

Si le contenu de votre serveur est mandaté, vous devez garder à l'esprit que l'adresse client correspondra à l'adresse de votre serveur mandataire et non à l'adresse du client, et l'utilisation de la directive `Require` dans ce contexte ne provoquera pas forcément l'effet désiré. Voir [[12-modules/mod_remoteip|mod_remoteip]] pour une solution possible à ce problème.

## Voir aussi

- [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, autorisation et contrôle d'accès]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
