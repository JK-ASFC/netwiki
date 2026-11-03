---
title: "Exemples d'utilisations de VirtualHost"
description: "Apache HTTP Server — Exemples d'utilisations de VirtualHost. Le but de ce document est d'essayer de répondre aux questions les plus répandues sur la configuration des serveurs virtuels. Les scénarios présentés ici se rencontrent quand plusieurs serveurs Webs doivent tourner sur une seule et même mach"
tags: [apache, guide]
icon: book-open
---

Le but de ce document est d'essayer de répondre aux questions les plus répandues sur la configuration des [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|serveurs virtuels]]. Les scénarios présentés ici se rencontrent quand plusieurs serveurs Webs doivent tourner sur une seule et même machine au moyen de serveurs virtuels [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|par nom]] ou [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-ip|par IP]].

## Fonctionnement de plusieurs serveurs virtuels par nom sur une seule adresse IP.

Votre serveur possède plusieurs noms d'hôte qui correspondent à une seule adresse IP, et vous souhaitez des réponses différentes si on demande `www.example.com` ou `www.example.org`.

> [!NOTE]
> **Note :**
>
> La configuration de serveurs virtuels sous Apache ne provoque pas leur apparition magique dans la configuration du DNS. Il *faut* que leurs noms soient définis dans le DNS, et qu'ils y soient résolus sur l'adresse IP du serveur, faute de quoi personne ne pourra visiter votre site Web. Il est possible d'ajouter des entrées dans le fichier `hosts` pour tests locaux, mais qui ne fonctionneront que sur la machine possédant ces entrées.

```apache
# Apache doit écouter sur le port 80
Listen 80
<VirtualHost *:80>
    DocumentRoot "/www/example1"
    ServerName www.example.com

    # Autres directives ici
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "/www/example2"
    ServerName www.example.org

    # Autres directives ici
</VirtualHost>
```

Les astérisques correspondent à toutes les adresses, si bien que le serveur principal ne répondra jamais à aucune requête. Comme le serveur virtuel `ServerName www.example.com` se trouve en premier dans le fichier de configuration, il a la plus grande priorité et peut être vu comme serveur *par défaut* ou *primaire* ; ce qui signifie que toute requête reçue ne correspondant à aucune des directives [[13-directives/servername|ServerName]] sera servie par ce premier [[13-directives/virtualhost|<VirtualHost>]].

La configuration ci-dessus correspond à ce que l'on souhaite pour la plupart des serveurs virtuels à base de nom. Il faudra cependant utiliser une configuration différente si vous souhaitez servir un contenu différent en fonction de l'adresse IP ou du port.

> [!NOTE]
> **Note :**
>
> Vous pouvez remplacer `*` par une adresse IP du système. Le serveur virtuel concerné ne sera alors sélectionné que pour les requêtes HTTP vers cette adresse IP.
>
> En général, il est commode d'utiliser `*` sur les systèmes dont l'adresse IP n'est pas constante - par exemple, pour des serveurs dont l'adresse IP est attribuée dynamiquement par le FAI, et où le DNS est géré au moyen d'un DNS dynamique quelconque. Comme `*` signifie *n'importe quelle adresse*, cette configuration fonctionne sans devoir être modifiée quand l'adresse IP du système est modifiée.

## Serveurs virtuels par nom sur plus d'une seule adresse IP.

> [!NOTE]
> **Note :**
>
> Toutes les techniques présentées ici peuvent être étendues à un plus grand nombre d'adresses IP.

Le serveur a deux adresses IP. Sur l'une (`172.20.30.40`), le serveur "principal" `server.example.com` doit répondre, et sur l'autre (`172.20.30.50`), deux serveurs virtuels (ou plus) répondront.

```apache
Listen 80

# Serveur "principal" sur 172.20.30.40
ServerName server.example.com
DocumentRoot "/www/mainserver"

<VirtualHost 172.20.30.50>
    DocumentRoot "/www/example1"
    ServerName www.example.com

    # D'autres directives ici ...
</VirtualHost>

<VirtualHost 172.20.30.50>
    DocumentRoot "/www/example2"
    ServerName www.example.org

    # D'autres directives ici ...
</VirtualHost>
```

Toute requête arrivant sur une autre adresse que `172.20.30.50` sera servie par le serveur principal. Les requêtes vers `172.20.30.50` avec un nom de serveur inconnu, ou sans en-tête `Host:`, seront servies par `www.example.com`.

## Servir le même contenu sur des adresses IP différentes (telle qu'une adresse interne et une externe).

La machine serveur dispose de deux adresses IP (`192.168.1.1` et `172.20.30.40`). Cette machine est placée à la fois sur le réseau interne (l'Intranet) et le réseau externe (Internet). Sur Internet, le nom `server.example.com` pointe vers l'adresse externe (`172.20.30.40`), mais sur le réseau interne, ce même nom pointe vers l'adresse interne (`192.168.1.1`).

Le serveur peut être configuré pour répondre de la même manière aux requêtes internes et externes, au moyen d'une seule section [[13-directives/virtualhost|<VirtualHost>]].

```apache
<VirtualHost 192.168.1.1 172.20.30.40>
    DocumentRoot "/www/server1"
    ServerName server.example.com
    ServerAlias server
</VirtualHost>
```

Ainsi, les requêtes en provenance de chacun des deux réseaux seront servies par le même [[13-directives/virtualhost|<VirtualHost>]].

> [!NOTE]
> **Note :**
>
> Sur le réseau interne, il est possible d'utiliser le nom raccourci `server` au lieu du nom complet `server.example.com`.
>
> Notez également que dans l'exemple précédent, vous pouvez remplacer la liste des adresses IP par des `*` afin que le serveur réponde de la même manière sur toutes ses adresses.

## Servir différents sites sur différents ports.

Vous disposez de plusieurs domaines pointant sur la même adresse IP et vous voulez également servir de multiples ports. L'exemple suivant montre que la sélection en fonction du nom intervient après la sélection de la meilleure correspondance du point de vue adresse IP/port.

```apache
Listen 80
Listen 8080

<VirtualHost 172.20.30.40:80>
    ServerName www.example.com
    DocumentRoot "/www/domain-80"
</VirtualHost>

<VirtualHost 172.20.30.40:8080>
    ServerName www.example.com
    DocumentRoot "/www/domain-8080"
</VirtualHost>

<VirtualHost 172.20.30.40:80>
    ServerName www.example.org
    DocumentRoot "/www/otherdomain-80"
</VirtualHost>

<VirtualHost 172.20.30.40:8080>
    ServerName www.example.org
    DocumentRoot "/www/otherdomain-8080"
</VirtualHost>
```

## Hébergement virtuel basé sur IP

Le serveur dispose de deux adresses IP (`172.20.30.40` et `172.20.30.50`) correspondant respectivement aux noms `www.example.com` et `www.example.org`.

```apache
Listen 80

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/example1"
    ServerName www.example.com
</VirtualHost>

<VirtualHost 172.20.30.50>
    DocumentRoot "/www/example2"
    ServerName www.example.org
</VirtualHost>
```

Les requêtes provenant d'adresses non spécifiées dans l'une des directives `<VirtualHost>` (comme pour `localhost` par exemple) seront dirigées vers le serveur principal, s'il en existe un.

## Hébergements virtuels mixtes basés sur les ports et sur les IP

Le serveur dispose de deux adresses IP (`172.20.30.40` et `172.20.30.50`) correspondant respectivement aux noms `www.example.com` et `www.example.org`. Pour chacun d'eux, nous voulons un hébergement sur les ports 80 et 8080.

```apache
Listen 172.20.30.40:80
Listen 172.20.30.40:8080
Listen 172.20.30.50:80
Listen 172.20.30.50:8080

<VirtualHost 172.20.30.40:80>
    DocumentRoot "/www/example1-80"
    ServerName www.example.com
</VirtualHost>

<VirtualHost 172.20.30.40:8080>
    DocumentRoot "/www/example1-8080"
    ServerName www.example.com
</VirtualHost>

<VirtualHost 172.20.30.50:80>
    DocumentRoot "/www/example2-80"
    ServerName www.example.org
</VirtualHost>

<VirtualHost 172.20.30.50:8080>
    DocumentRoot "/www/example2-8080"
    ServerName www.example.org
</VirtualHost>
```

## Hébergements virtuels mixtes basé sur les noms et sur IP

Toute adresse indiquée comme argument d'une section VirtualHost et n'apparaissant dans aucun autre serveur virtuel, fait de cette section un serveur virtuel sélectionnable uniquement en fonction de son adresse IP.

```apache
Listen 80
<VirtualHost 172.20.30.40>
    DocumentRoot "/www/example1"
    ServerName www.example.com
</VirtualHost>

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/example2"
    ServerName www.example.org
</VirtualHost>

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/example3"
    ServerName www.example.net
</VirtualHost>

# IP-based
<VirtualHost 172.20.30.50>
    DocumentRoot "/www/example4"
    ServerName www.example.edu
</VirtualHost>

<VirtualHost 172.20.30.60>
    DocumentRoot "/www/example5"
    ServerName www.example.gov
</VirtualHost>
```

## Utilisation simultanée de `Virtual_host` et de mod\_proxy

L'exemple suivant montre comment une machine peut mandater un serveur virtuel fonctionnant sur le serveur d'une autre machine. Dans cet exemple, un serveur virtuel de même nom est configuré sur une machine à l'adresse `192.168.111.2`. La directive `ProxyPreserveHost On` est employée pour permette au nom de domaine d'être préservé lors du transfert, au cas où plusieurs noms de domaines cohabitent sur une même machine.

```apache
<VirtualHost *:*>
    ProxyPreserveHost On
    ProxyPass        "/" "http://192.168.111.2/"
    ProxyPassReverse "/" "http://192.168.111.2/"
    ServerName hostname.example.com
</VirtualHost>
```

## Utilisation de serveurs virtuels `_default_`

### Serveurs virtuels `_default_` pour tous les ports

Exemple de capture de *toutes* les requêtes émanant d'adresses IP ou de ports non connus, *c'est-à-dire*, d'un couple adresse/port non traité par aucun autre serveur virtuel.

```apache
<VirtualHost _default_:*>
    DocumentRoot "/www/default"
</VirtualHost>
```

L'utilisation d'un tel serveur virtuel avec un joker pour le port empêche de manière efficace qu'une requête n'atteigne le serveur principal.

Un serveur virtuel par défaut ne servira jamais une requête qui est envoyée vers un couple adresse/port utilisée par un serveur virtuel par nom. Si la requête contient un en-tête `Host:` inconnu, ou si celui-ci est absent, elle sera toujours servie par le serveur virtuel primaire par nom (celui correspondant à ce couple adresse/port trouvé en premier dans le fichier de configuration).

Vous pouvez utiliser une directive [[13-directives/aliasmatch|AliasMatch]] ou [[13-directives/rewriterule|RewriteRule]] afin de réécrire une requête pour une unique page d'information (ou pour un script).

### Serveurs virtuels `_default_` pour des ports différents

La configuration est similaire à l'exemple précédent, mais le serveur écoute sur plusieurs ports et un second serveur virtuel `_default_` pour le port 80 est ajouté.

```apache
<VirtualHost _default_:80>
    DocumentRoot "/www/default80"
    # ...
</VirtualHost>

<VirtualHost _default_:*>
    DocumentRoot "/www/default"
    # ...
</VirtualHost>
```

Le serveur virtuel par défaut défini pour le port 80 (il doit impérativement être placé avant un autre serveur virtuel par défaut traitant tous les ports grâce au joker \*) capture toutes les requêtes envoyées sur une adresse IP non spécifiée. Le serveur principal n'est jamais utilisé pour servir une requête.

### Serveurs virtuels `_default_` pour un seul port

Nous voulons créer un serveur virtuel par défaut seulement pour le port 80.

```apache
<VirtualHost _default_:80>
    DocumentRoot "/www/default"
...
</VirtualHost>
```

Une requête vers une adresse non spécifiée sur le port 80 sera servie par le serveur virtuel par défaut, et toute autre requête vers une adresse et un port non spécifiés sera servie par le serveur principal.

L'utilisation du caractère générique `*` dans la déclaration d'un serveur virtuel l'emporte sur `_default_`.

## Migration d'un serveur virtuel par nom en un serveur virtuel par IP

Le serveur virtuel par nom avec le nom de domaine `www.example.org` (de notre exemple par nom) devrait obtenir sa propre adresse IP. Pendant la phase de migration, il est possible d'éviter les problèmes avec les noms de serveurs et autres serveurs mandataires qui mémorisent les vielles adresses IP pour les serveurs virtuels par nom.
La solution est simple, car il suffit d'ajouter la nouvelle adresse IP (`172.20.30.50`) dans la directive `VirtualHost`.

```apache
Listen 80
ServerName www.example.com
DocumentRoot "/www/example1"

<VirtualHost 172.20.30.40 172.20.30.50>
    DocumentRoot "/www/example2"
    ServerName www.example.org
    # ...
</VirtualHost>

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/example3"
    ServerName www.example.net
    ServerAlias *.example.net
    # ...
</VirtualHost>
```

Le serveur virtuel peut maintenant être joint par la nouvelle adresse (comme un serveur virtuel par IP) et par l'ancienne adresse (comme un serveur virtuel par nom).

## Utilisation de la directive `ServerPath`

Dans le cas où vous disposez de deux serveurs virtuels par nom, le client doit transmettre un en-tête `Host:` correct pour déterminer le serveur concerné. Les vieux clients HTTP/1.0 n'envoient pas un tel en-tête et Apache n'a aucun indice pour connaître le serveur virtuel devant être joint (il sert la requête à partir d'un serveur virtuel primaire). Dans un soucis de préserver la compatibilité descendante, il suffit de créer un serveur virtuel primaire chargé de retourner une page contenant des liens dont les URLs auront un préfixe identifiant les serveurs virtuels par nom.

```apache
<VirtualHost 172.20.30.40>
    # serveur virtuel primaire
    DocumentRoot "/www/subdomain"
    RewriteEngine On
    RewriteRule "." "/www/subdomain/index.html"
    # ...
</VirtualHost>

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/subdomain/sub1"
    ServerName www.sub1.domain.tld
    ServerPath "/sub1/"
    RewriteEngine On
    RewriteRule "^(/sub1/.*)" "/www/subdomain$1
    # ...
</VirtualHost>

<VirtualHost 172.20.30.40>
    DocumentRoot "/www/subdomain/sub2"
    ServerName www.sub2.domain.tld
    ServerPath "/sub2/"
    RewriteEngine On
    RewriteRule "^(/sub2/.*)" "/www/subdomain$1"
    # ...
</VirtualHost>
```

À cause de la directive [[13-directives/serverpath|ServerPath]], une requête sur une URL `http://www.sub1.domain.tld/sub1/` est *toujours* servie par le serveur sub1-vhost.
Une requête sur une URL `http://www.sub1.domain.tld/` n'est servie par le serveur sub1-vhost que si le client envoie un en-tête `Host:` correct. Si aucun en-tête `Host:` n'est transmis, le serveur primaire sera utilisé.

Notez qu'il y a une singularité : une requête sur `http://www.sub2.domain.tld/sub1/` est également servie par le serveur sub1-vhost si le client n'envoie pas d'en-tête `Host:`.

Les directives [[13-directives/rewriterule|RewriteRule]] sont employées pour s'assurer que le client qui envoie un en-tête `Host:` correct puisse utiliser d'autres variantes d'URLs, *c'est-à-dire* avec ou sans préfixe d'URL.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
