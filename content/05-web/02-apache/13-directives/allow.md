---
title: "Allow"
description: "Directive Apache Allow (mod_access_compat) — Spécifie quels hôtes peuvent accéder à une certaine zone du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_access_compat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie quels hôtes peuvent accéder à une certaine zone du serveur |
| **Syntaxe** | `Allow from all\|hôte\|env=[!]variable d'environnement [hôte\|env=[!]variable d'environnement] ...` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | Limit |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_access_compat\|mod_access_compat]] |

## Utilisation

La directive `Allow` permet de définir quels hôtes ont le droit d'accéder à une certaine partie du serveur. On peut contrôler l'accès par nom d'hôte, adresse IP, intervalle d'adresses IP, ou toute autre caractéristique de la requête client enregistrée dans les variables d'environnement.

Le premier argument de cette directive est toujours `from`. Les arguments suivants peuvent prendre trois formes différentes. Si `Allow from all` est spécifié, tout hôte se voit accordé l'accès, en tenant compte des directives [[13-directives/deny|Deny]] et [[13-directives/order|Order]] comme décrit plus loin. Pour ne permettre l'accès au serveur qu'à un hôte ou un groupe d'hôtes particuliers, on peut spécifier un *nom d'hôte* sous une des formes suivantes :

**Un nom de domaine (partiel)**

```apache
Allow from example.org
Allow from .net example.edu
```

Les hôtes dont les noms correspondent ou se terminent par la chaîne spécifiée ont l'autorisation d'accès. Seules les composantes entières du nom d'hôte doivent correspondre ; ainsi, dans l'exemple ci-dessus, `foo.example.org` correspondra, mais `fooexample.org` ne conviendra pas. Avec cette configuration, Apache httpd va effectuer une double recherche DNS sur l'adresse IP du client, sans tenir compte de la définition de la directive [[13-directives/hostnamelookups|HostnameLookups]]. Tout d'abord, une recherche DNS inverse sur l'adresse IP est effectuée pour déterminer le nom d'hôte associé, puis une recherche directe sur le nom d'hôte est effectuée afin de s'assurer qu'il correspond bien à l'adresse IP originale. L'accès ne sera accordé que si le nom d'hôte correspond et si les recherches DNS inverse et directe concordent.

**Une adresse IP complète**

```apache
Allow from 10.1.2.3
Allow from 192.168.1.104 192.168.1.205
```

L'adresse IP d'un hôte auquel on a accordé l'accès

**Une adresse IP partielle**

```apache
Allow from 10.1
Allow from 10 172.20 192.168.2
```

De un à trois des premiers octets d'une adresse IP, afin de restreindre l'accès à un sous-réseau.

**Une paire réseau/masque de sous-réseau**

```apache
Allow from 10.1.0.0/255.255.0.0
```

Un réseau a.b.c.d, et un masque de sous-réseau w.x.y.z, pour une définition plus précise de la restriction d'accès imposée à un sous-réseau.

**Une spécification CIDR réseau/nnn**

```apache
Allow from 10.1.0.0/16
```

Identique au cas précédent, mis à part que le masque est constitué des nnn bits de poids fort.

Notez que les trois derniers exemples désignent le même ensemble d'hôtes.

On peut spécifier des adresses et sous-réseaux IPv6 de la manière suivante :

```apache
Allow from 2001:db8::a00:20ff:fea7:ccea
Allow from 2001:db8::a00:20ff:fea7:ccea/10
```

Le troisième format d'argument de la directive `Allow` permet de contrôler l'accès au serveur en fonction de l'existence d'une [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]]. Lorsque `Allow from env=variable d'environnement` est spécifié, la requête est autorisée si la variable d'environnement *variable d'environnement* existe. En revanche, lorsque `Allow from env=!env-variable` est spécifié, la requête est autorisée si la variable d'environnement *variable d'environnement* n'existe pas. Le serveur permet de définir avec souplesse des variables d'environnement en se basant sur les caractéristiques de la requête client et en utilisant les directives fournies par le module [[12-modules/mod_setenvif|mod_setenvif]]. Ainsi, on peut utiliser la directive `Allow` pour permettre l'accès en fonction de paramètres comme le `User-Agent` (type de navigateur) des clients, le `Referer`, ou d'autres champs d'en-tête de la requête HTTP.

```apache
SetEnvIf User-Agent ^KnockKnock/2\.0 let_me_in
<Directory "/docroot">
    Order Deny,Allow
    Deny from all
    Allow from env=let_me_in
</Directory>
```

Dans cet exemple, les navigateurs dont la chaîne user-agent commence par `KnockKnock/2.0` se verront accorder l'accès, alors que tous les autres seront rejetés.

> [!NOTE]
> **Fusion des sections de configuration**
>
> Lorsqu'une directive fournie par ce module est utilisée dans une nouvelle section de configuration, cette dernière n'hérite d'aucune directive définie dans une section précédente.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
