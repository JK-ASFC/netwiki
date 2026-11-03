---
title: "Hébergement virtuel de masse configuré dynamiquement"
description: "Apache HTTP Server — Hébergement virtuel de masse configuré dynamiquement. Ce document propose une méthode performante pour servir un nombre quelconque d'hôtes virtuels avec le serveur HTTP Apache. Un document séparé décrit comment utiliser mod_rewrite pour gérer l'hébergement virtuel de masse dynamique."
tags: [apache, guide]
icon: book-open
---

Ce document propose une méthode performante pour servir un nombre quelconque d'hôtes virtuels avec le serveur HTTP Apache. Un [[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|document séparé]] décrit comment utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour gérer l'hébergement virtuel de masse dynamique.

## A qui ce document est-il destiné ?

Les techniques décrites ici vous concernent si votre `httpd.conf` contient de nombreuses sections `<VirtualHost>` très semblables, dans le style :

```apache
<VirtualHost 111.22.33.44>
    ServerName                 customer-1.example.com
    DocumentRoot        "/www/hosts/customer-1.example.com/docs"
    ScriptAlias  "/cgi-bin/" "/www/hosts/customer-1.example.com/cgi-bin"
</VirtualHost>

<VirtualHost 111.22.33.44>
    ServerName                 customer-2.example.com
    DocumentRoot        "/www/hosts/customer-2.example.com/docs"
    ScriptAlias  "/cgi-bin/" "/www/hosts/customer-2.example.com/cgi-bin"
</VirtualHost>

<VirtualHost 111.22.33.44>
    ServerName                 customer-N.example.com
    DocumentRoot        "/www/hosts/customer-N.example.com/docs"
    ScriptAlias  "/cgi-bin/" "/www/hosts/customer-N.example.com/cgi-bin"
</VirtualHost>
```

Nous voulons remplacer toutes les configurations `<VirtualHost>` par un mécanisme qui les génère dynamiquement. Ceci présente certains avantages :

1. Votre fichier de configuration est plus petit, ainsi Apache démarre plus rapidement et consomme moins de mémoire. Et ce qui est peut-être le plus important, le fichier de configuration plus petit est plus facile à maintenir, et le risque d'erreurs en est diminué d'autant.
2. Pour ajouter des serveurs virtuels, il suffit de créer les répertoires appropriés dans le système de fichiers et les entrées dans le DNS - il n'est plus nécessaire de reconfigurer ou de redémarrer Apache.

Le principal désavantage réside dans le fait que vous ne pouvez pas définir un fichier journal différent pour chaque serveur virtuel. De toute façon, ce serait une mauvaise idée si vous avez de nombreux serveurs virtuels, car cela nécessiterait un [[11-guides/03-serveurs-virtuels/limites-des-descripteurs-de-fichiers|nombre important de descripteurs de fichier]]. Il est préférable de rediriger [[11-guides/01-generalites/fichiers-journaux|les journaux via un pipe ou une file fifo]] vers un programme, et faire en sorte que ce dernier éclate les journaux en un journal par serveur virtuel. L'utilitaire [[10-commandes/split-logfile|split-logfile]] constitue un exemple de ce traitement.

## Vue d'ensemble

Un serveur virtuel peut être défini par deux informations : son adresse IP, et le contenu de l'en-tête `Host:` de la requête HTTP. La technique d'hébergement virtuel dynamique de masse utilisée ici consiste à insérer automatiquement ces informations dans le chemin du fichier à utiliser pour répondre à la requête. On peut y parvenir assez facilement en utilisant [[12-modules/mod_vhost_alias|mod_vhost_alias]] avec Apache httpd, mais on peut aussi [[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|utiliser mod_rewrite]].

Par défaut, ces deux modules sont désactivés ; vous devez activer l'un d'eux lors de la compilation et de la configuration d'Apache httpd si vous voulez utiliser cette technique.

Certains paramètres doivent être extraits de la requête pour que le serveur dynamique se présente comme un serveur dynamique normal. Le plus important est le nom du serveur, que le serveur utilise pour générer des URLs d'auto-référencement, etc... Il est défini via la directive `ServerName`, et les CGIs peuvent s'y référer via la variable d'environnement `SERVER_NAME`. Sa véritable valeur utilisée à l'exécution est contrôlée par la définition de la directive [[13-directives/usecanonicalname|UseCanonicalName]]. Avec `UseCanonicalName Off`, le nom du serveur correspond au contenu de l'en-tête `Host:` de la requête. Avec `UseCanonicalName DNS`, il est extrait d'une recherche DNS inverse sur l'adresse IP du serveur virtuel. La première configuration est utilisée pour l'hébergement virtuel dynamique par nom, et la deuxième pour l'hébergement virtuel dynamique par IP. Si httpd ne peut pas déterminer le nom du serveur, soit parce qu'il n'y a pas d'en-tête `Host:`, soit parce que la recherche DNS a échoué, il prend en compte la valeur définie par la directive `ServerName`.

L'autre paramètre à extraire est la racine des documents (définie via la directive `DocumentRoot` et disponible pour les scripts CGI via la variable d'environnement `DOCUMENT_ROOT`). Dans une configuration classique, il est utilisé par le module core pour faire correspondre les URIs aux noms de fichiers, mais lorsque la configuration du serveur comporte des serveurs virtuels, ce traitement doit être pris en charge par un autre module (soit [[12-modules/mod_vhost_alias|mod_vhost_alias]], soit [[12-modules/mod_rewrite|mod_rewrite]]), qui utilise un méthode de correspondance différente. Aucun de ces modules ne se chargeant de définir la variable d'environnement `DOCUMENT_ROOT`, si des CGIs ou des documents SSI doivent en faire usage, ils obtiendront une valeur erronée.

## Hébergement virtuel dynamique avec mod\_vhost\_alias

Cet extrait de fichier `httpd.conf` implémente l'hébergement virtuel décrit dans la section À qui ce document est-il destiné ? ci-dessus en utilisant [[12-modules/mod_vhost_alias|mod_vhost_alias]].

```apache
# extrait le nom du serveur de l'en-tête Host:
UseCanonicalName Off

# ce format de journal peut être éclaté en journaux par serveur virtuel
# à l'aide du premier champ via l'utilitaire split-logfile
LogFormat "%V %h %l %u %t \"%r\" %s %b" vcommon
CustomLog "logs/access_log" vcommon

# inclut le nom du serveur dans les noms de fichiers ressources
# nécessaires aux traitements des requêtes
VirtualDocumentRoot "/www/hosts/%0/docs"
VirtualScriptAlias  "/www/hosts/%0/cgi-bin"
```

Pour changer cette configuration en solution de serveur virtuel par IP, il suffit de remplacer `UseCanonicalName Off` par `UseCanonicalName DNS`. Le nom du serveur inséré dans le nom de fichier sera alors déduit de l'adresse IP du serveur virtuel. La variable `%0` fait référence au nom de serveur de la requête, tel qu'il est indiqué dans l'en-tête `Host:`.

Voir la documentation du module [[12-modules/mod_vhost_alias|mod_vhost_alias]] pour d'avantages d'exemples d'utilisation.

## Système de serveurs virtuels dynamiques simplifié

Il s'agit d'une adaptation du système ci-dessus, ajusté pour un serveur d'hébergement web de FAI. Grâce à la variable `%2`, on peut extraire des sous-chaînes de caractères du nom du serveur pour les utiliser dans le nom de fichier afin, par exemple, de définir `/home/user/www` comme emplacement des documents pour `www.user.example.com`. Un seul répertoire `cgi-bin` suffit pour l'ensemble des serveurs virtuels.

```apache
UseCanonicalName Off

LogFormat "%V %h %l %u %t \"%r\" %s %b" vcommon
CustomLog "logs/access_log" vcommon

# insertion d'une partie du nom du serveur dans les noms de fichiers
VirtualDocumentRoot "/home/%2/www"

# répertoire cgi-bin unique
ScriptAlias  "/cgi-bin/"  "/www/std-cgi/"
```

Vous trouverez des exemples plus élaborés d'utilisation de la directive `VirtualDocumentRoot` dans la documentation du module [[12-modules/mod_vhost_alias|mod_vhost_alias]].

## Utiliser plusieurs systèmes d'hébergement virtuel sur le même serveur

Moyennant une configuration un peu plus compliquée, vous pouvez contrôler la portée des différentes configurations d'hébergement virtuel à l'aide des directives `<VirtualHost>` normales de httpd. Par exemple, on peut associer une adresse IP pour les pages d'accueil des clients en général, et une autre pour les clients commerciaux avec la configuration suivante. Cette configuration peut être combinée avec les sections `<VirtualHost>` conventionnelles, comme indiqué plus loin.

```apache
UseCanonicalName Off

LogFormat "%V %h %l %u %t \"%r\" %s %b" vcommon

<Directory "/www/commercial">
    Options FollowSymLinks
    AllowOverride All
</Directory>

<Directory "/www/homepages">
    Options FollowSymLinks
    AllowOverride None
</Directory>

<VirtualHost 111.22.33.44>
    ServerName www.commercial.example.com

    CustomLog "logs/access_log.commercial" vcommon

    VirtualDocumentRoot "/www/commercial/%0/docs"
    VirtualScriptAlias  "/www/commercial/%0/cgi-bin"
</VirtualHost>

<VirtualHost 111.22.33.45>
    ServerName www.homepages.example.com

    CustomLog "logs/access_log.homepages" vcommon

    VirtualDocumentRoot "/www/homepages/%0/docs"
    ScriptAlias         "/cgi-bin/" "/www/std-cgi/"
</VirtualHost>
```

> [!NOTE]
> **Note**
>
> Si le premier bloc VirtualHost ne comporte *pas* de directive [[13-directives/servername|ServerName]], c'est le nom issu d'une recherche DNS inverse à partir de l'adresse IP du serveur virtuel qui sera utilisé. Si ce nom ne correspond pas à celui que vous voulez utiliser, vous pouvez ajouter une entrée de remplacement (par exemple `ServerName none.example.com`) pour éviter ce comportement.

## Pour un hébergement virtuel par IP plus efficace

Les changements de configuration suggérés pour transformer le premier exemple en hébergement virtuel par IP conduisent à une configuration peu efficace. Chaque requête nécessite une nouvelle recherche DNS. Pour éviter cette surcharge de travail, le système de fichiers peut être organisé pour correspondre aux adresses IP, plutôt qu'aux noms de serveurs, supprimant par la-même la nécessité d'une recherche DNS. La journalisation doit aussi être adaptée pour fonctionner sur un tel système.

```apache
# obtention du nom du serveur par recherche DNS inverse
# sur l'adresse IP
UseCanonicalName DNS

# insertion de l'adresse IP dans les journaux afin de pouvoir les
# éclater
LogFormat "%A %h %l %u %t \"%r\" %s %b" vcommon
CustomLog "logs/access_log" vcommon

# insertion de l'adresse IP dans les noms de fichiers
VirtualDocumentRootIP "/www/hosts/%0/docs"
VirtualScriptAliasIP  "/www/hosts/%0/cgi-bin"
```

## Hébergement virtuel de masse avec mod\_rewrite

L'hébergement virtuel de masse peut aussi être effectué en utilisant [[12-modules/mod_rewrite|mod_rewrite]], soit à l'aide de simples directives [[13-directives/rewriterule|RewriteRule]], soit en utilisant des techniques plus compliquées comme le stockage externe des définitions des serveurs virtuels, ces dernières étant accessibles via des directives [[13-directives/rewritemap|RewriteMap]]. Ces techniques sont décrites dans la [[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|documentation sur la réécriture]].

## Hébergement virtuel en masse avec mod\_macro

Une autre option pour générer dynamiquement des serveurs virtuels : mod\_macro ; ce module permet de créer un modèle de serveur virtuel que vous pourrez invoquer pour des noms d'hôtes multiples. La section **Usage** de la documentation du module présente un exemple qui illustre cette méthode.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
