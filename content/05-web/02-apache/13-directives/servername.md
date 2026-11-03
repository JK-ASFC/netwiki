---
title: "ServerName"
description: "Directive Apache ServerName (core) — Nom d'hôte et port que le serveur utilise pour s'authentifier lui-même. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom d'hôte et port que le serveur utilise pour s'authentifier lui-même |
| **Syntaxe** | `ServerName [protocole://]nom-de-domaine\|adresse-ip[:port]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerName` permet de définir les protocole, nom d'hôte et port d'une requête que le serveur utilise pour s'authentifier lui-même.

La directive `ServerName` permet (éventuellement en conjonction avec la directive [[13-directives/serveralias|ServerAlias]]) d'identifier de manière unique un serveur virtuel, lorsqu'elle est utilisée dans un contexte de [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de noms]].

Cette directive est aussi utilisée lors de la création d'URLs de redirection relatives quand la directive [[13-directives/usecanonicalname|UseCanonicalName]] est définie à `On`. Si `UseCanonicalName` est définie à `DNS`, une recherche DNS inverse est effectuée

Par exemple, si le nom de la machine hébergeant le serveur web est `simple.example.com`, la machine possède l'alias DNS `www.example.com`, et si vous voulez que le serveur web s'identifie avec cet alias, vous devez utilisez la définition suivante :

```apache
ServerName www.example.com
```

La directive `ServerName` peut apparaître à toutes les étapes de la définition du serveur. Toute occurrence annule cependant la précédente (pour ce serveur).

Si la directive `ServerName` n'est pas définie, le serveur tente de déterminer le nom d'hôte visible du point de vue du client en demandant tout d'abord au système d'exploitation le nom d'hôte système, et en cas d'échec, en effectuant une recherche DNS inverse sur une adresse IP présente sur le système.

Si la directive `ServerName` ne précise pas de port, le serveur utilisera celui de la requête entrante. Il est recommandé de spécifier un nom d'hôte et un port spécifiques à l'aide de la directive `ServerName` pour une fiabilité optimale et à titre préventif.

Si vous définissez des [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de nom]], une directive `ServerName` située à l'intérieur d'une section [[13-directives/virtualhost|<VirtualHost>]] spécifiera quel nom d'hôte doit apparaître dans l'en-tête de requête `Host:` pour pouvoir atteindre ce serveur virtuel.

Parfois, le serveur s'exécute en amont d'un dispositif qui implémente SSL, comme un mandataire inverse, un répartiteur de charge ou un boîtier dédié SSL. Dans ce cas, spécifiez le protocole `https://` et le port auquel les clients se connectent dans la directive `ServerName`, afin de s'assurer que le serveur génère correctement ses URLs d'auto-identification.

Voir la description des directives [[13-directives/usecanonicalname|UseCanonicalName]] et [[13-directives/usecanonicalphysicalport|UseCanonicalPhysicalPort]] pour les définitions qui permettent de déterminer si les URLs auto-identifiantes (par exemple via le module [[12-modules/mod_dir|mod_dir]]) vont faire référence au port spécifié, ou au port indiqué dans la requête du client.

> [!WARNING]
> Si la valeur de la directive `ServerName` ne peut pas être résolue en adresse IP, le démarrage du serveur provoquera un avertissement. `httpd` va alors utiliser le résultat de la commande système `hostname` pour déterminer le nom du serveur, ce qui ne correspondra pratiquement jamais au nom de serveur que vous souhaitez réellement.
>
> ```
> httpd: Could not reliably determine the server's fully qualified domain name, using rocinante.local for ServerName
> ```

> [!WARNING]
> Les adresses IPv6 ne sont actuellement pas prises en charge par la directive `ServerName` et produisent une erreur au démarrage du serveur, même si elles sont entourées de crochets. Il s’agit d’un [problème connu](https://bz.apache.org/bugzilla/show_bug.cgi?id=52178).

## Voir aussi

- [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|Problèmes concernant le DNS et le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
