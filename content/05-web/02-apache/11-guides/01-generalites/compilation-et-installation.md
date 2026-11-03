---
title: "Compilation et installation"
description: "Apache HTTP Server — Compilation et installation. Le serveur HTTP Apache est distribué sous forme de code source. Ce document décrit la construction et l’installation du serveur à partir des sources sous Unix et les systèmes de la famille d’Unix. Pour Windows, voir Utiliser le serveur HTTP"
tags: [apache, guide]
icon: book-open
---

Le serveur HTTP Apache est distribué sous forme de code source. Ce document décrit la construction et l’installation du serveur à partir des sources sous Unix et les systèmes de la famille d’Unix. Pour Windows, voir [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|Utiliser le serveur HTTP Apache avec Microsoft Windows]] et [[11-guides/07-plates-formes/compiler-apache-httpd-pour-microsoft-windows|Compilation de httpd sous Microsoft Windows]]. Pour les autres plateformes, se référer à la documentation par [[11-guides/07-plates-formes/00-notes-specifiques-aux-differentes-plateformes|plateforme]].

Si vous installez httpd depuis un paquet de distribution (RPM, DEB, etc.), l’organisation de la configuration et les valeurs par défaut peuvent être différentes de ce qui est décrit ici. Voir paquets tiers ci-après et consultez la documentation de votre distribution pour les détails spécifiques à la plateforme.

Si vous effectuez une mise à jour depuis une version mineure vers la suivante (par exemple, 2.4.66 à 2.4.67), veuillez passer à la section mise à jour.

## Aperçu pour les plus pressés

|   |   |
| --- | --- |
| Téléchargement | Téléchargez la dernière version depuis [https://httpd.apache.org/download.cgi](https://httpd.apache.org/download.cgi#apache24) |
| Extraction | ```bash $ tar xzf httpd-NN.tar.gz $ cd httpd-NN ``` |
| Configuration | `$ ./configure --prefix=PREFIX` |
| Compilation | `$ make` |
| Installation | `$ make install` |
| Personnalisation | `$ vi PREFIX/conf/httpd.conf` |
| Test | `$ PREFIX/bin/apachectl -k start` |

*NN* doit être remplacé par le numéro de version courant, et *PREFIX* par le chemin du répertoire d'installation. Si *PREFIX* n'est pas spécifié, le chemin du répertoire d'installation prendra sa valeur par défaut, à savoir `/usr/local/apache2`.

Chaque étape du processus de compilation et d'installation est décrite plus en détails ci-dessous, à commencer par les prérequis pour compiler et installer httpd.

## Prérequis

Les prérequis pour la construction et l’exécution de httpd sont les suivants:

**APR et APR-Util**

APR et APR-Util doivent être déjà installés sur votre système. Si ce n'est pas le cas, ou si vous préférez ne pas utiliser les versions fournies par le système, téléchargez les dernières versions d'APR et APR-Util depuis [Apache APR](https://apr.apache.org/), décompressez-les respectivement dans `/racine_sources_httpd/srclib/apr` et `/racine_sources_httpd/srclib/apr-util` (les noms des répertoires ne doivent pas comporter de numéros de versions ; par exemple, la distribution d'APR doit se trouver dans /racine\_sources\_httpd/srclib/apr/), et utilisez l'option `--with-included-apr` du script `./configure`. Sur certaines plateformes, vous devrez peut-être installer les paquets `-dev` correspondants pour permettre la compilation de httpd avec les versions installées d'APR et APR-Util.

**Bibliothèque d'expressions rationnelles compatibles Perl (PCRE2)**

Cette bibliothèque est nécessaire mais n'est pas fournie avec la distribution de httpd. Téléchargez le code source depuis [https://github.com/PCRE2Project/pcre2](https://github.com/PCRE2Project/pcre2) ou installez le avec le gestionnaire de paquets de votre système. Si votre système de construction ne trouve pas le script `pcre2-config` installé par la construction de PCRE2, pointez vers lui en utilisant l’option `--with-pcre`. Sur certaines plateformes, vous devrez peut-être installer le paquet `-dev` correspondant (par exemple `libpcre2-dev` ou `pcre2-devel`) pour permettre la construction de httpd avec votre version installée de PCRE2.

**Espace disque**

Assurez-vous d'avoir au moins 200 Mo d'espace disque disponible temporaire. Après l'installation le serveur occupe approximativement 50 Mo d'espace disque. L'espace disque réellement nécessaire va varier considérablement en fonction de vos options de configuration, de la présence éventuelle de modules tiers, et bien entendu de la taille de votre site web et des sites que vous hébergez sur votre serveur.

**Compilateur ANSI-C et système de construction**

Vous devez disposer d'un compilateur ANSI-C. Le compilateur [GNU C (GCC)](https://gcc.gnu.org/) de la [Free Software Foundation (FSF)](https://www.gnu.org/) est recommandé. Si vous ne possédez pas GCC, assurez-vous au moins que votre compilateur soit compatible ANSI. En outre, votre `PATH` doit contenir les outils de construction de base tels que `make`.

**Connaissance de l'heure exacte**

Les entêtes du protocole HTTP utilisent un horodatage ; l’horloge de votre système doit donc être précise. La plupart des distributions de Linux activent `systemd-timesyncd` ou `chrony` par défaut. Vérifiez que la synchronisation du temps est active sur votre système avant d’exploiter un serveur en production.

**[Perl 5](https://www.perl.org/) \[OPTIONNEL\]**

L'interpréteur Perl 5 est nécessaire pour l'exécution de certains scripts comme [[10-commandes/apxs|apxs]] ou [[10-commandes/dbmmanage|dbmmanage]] (qui sont écrits en Perl). Si le script [[10-commandes/configure|configure]] ne trouve pas d'interpréteur Perl 5, vous ne pourrez pas utiliser les scripts qui en ont besoin. Bien entendu, vous pourrez tout de même construire et utiliser httpd.

## Téléchargement

Téléchargez l’archive tar du code source depuis le [site de téléchargement du serveur HTTP Apache](https://httpd.apache.org/download.cgi).

Après le téléchargement, il est important de vérifier que vous disposez d'une version complète et non modifiée du serveur HTTP Apache. Vous pouvez le faire en testant l'archive téléchargée à l'aide de la signature PGP. Vous trouverez les détails de cette opération sur la [page de vérification](https://httpd.apache.org/dev/verification.html).

## Extraction

Extraire les sources depuis l'archive du serveur HTTP Apache :

```bash
$ tar xzf httpd-NN.tar.gz
```

Ceci créera, dans le répertoire courant, un nouveau répertoire contenant le code source de la distribution. Vous devrez vous positionner dans ce répertoire avant de procéder à la compilation du serveur.

## Configuration de l'arborescence des sources

L'étape suivante consiste à configurer l'arborescence des sources de httpd en fonction de votre plateforme et de vos besoins personnels. Le script [[10-commandes/configure|configure]], situé à la racine du répertoire de la distribution, a été conçu à cet effet (Les développeurs qui téléchargent une version non officielle de l'arborescence des sources de httpd devront disposer de `autoconf` et `libtool` et exécuter `buildconf` avant de passer à l'étape suivante, ce qui n'est pas nécessaire pour les versions officielles).

Pour configurer l'arborescence des sources avec les valeurs par défaut pour toutes les options, saisissez `./configure`. Pour modifier les valeurs des options, [[10-commandes/configure|configure]] accepte toute une variété de variables et d'options de ligne de commande.

L'option la plus importante `--prefix` est le chemin du répertoire d'installation de httpd, car httpd doit être configuré en fonction de ce chemin pour pouvoir fonctionner correctement. Il est possible de définir plus finement le chemin d'installation des fichiers à l'aide d'[[10-commandes/configure|options supplémentaires de configure]].

À ce niveau, vous pouvez aussi spécifier de quelles [[10-commandes/configure|fonctionnalités]] vous voulez disposer dans httpd en activant ou désactivant des modules. httpd est fourni avec un grand nombre de modules inclus par défaut. Ils seront compilés en tant qu'[[11-guides/01-generalites/prise-en-charge-des-objets-dynamiques-partages-dso|objets partagés (DSOs)]] qui pourront être chargés ou déchargés à l'exécution. Vous pouvez aussi choisir de compiler les modules statiquement via l'option `--enable-module=static`.

Des modules supplémentaires peuvent être activés à l'aide de l'option `--enable-module`, où *module* est le nom du module sans la chaîne `mod_` et où tout caractère de soulignement est converti en tiret. D'une manière similaire, vous pouvez désactiver des modules à l'aide de l'option `--disable-module`. Faites très attention en utilisant ces options, car [[10-commandes/configure|configure]] n'est pas en mesure de vous avertir si le module que vous avez spécifié n'existe pas ; il ignorera l'option.

En outre, vous devrez peut-être fournir au script [[10-commandes/configure|configure]] des informations supplémentaires sur le chemin de votre compilateur, de vos bibliothèques, ou de vos fichiers d'en-têtes. A cet effet, vous pouvez passer des options de ligne de commande ou des variables d'environnement au script [[10-commandes/configure|configure]]. Pour plus d'informations, voir la page de manuel de [[10-commandes/configure|configure]], ou lancez le script [[10-commandes/configure|configure]] avec l'option `--help`.

Pour vous faire une idée des possibilités qui s'offrent à vous, voici un exemple typique de compilation de Apache httpd avec le répertoire d'installation `/sw/pkg/apache`, un compilateur et des drapeaux particuliers et les deux modules additionnels [[12-modules/mod_ldap|mod_ldap]] et [[12-modules/mod_lua|mod_lua]] :

```bash
$ CC="pgcc" CFLAGS="-O2" \
  ./configure --prefix=/sw/pkg/apache \
  --enable-ldap=shared \
  --enable-lua=shared
```

Plusieurs minutes peuvent être nécessaires à [[10-commandes/configure|configure]] pour tester la disponibilité des fonctionnalités au sein de votre système, et construire les Makefiles qui seront utilisés par la suite pour compiler le serveur.

Vous trouverez une description détaillée des options de [[10-commandes/configure|configure]] dans sa page de manuel.

## Construction

Vous pouvez maintenant construire les différents éléments qui composent le paquet Apache httpd en lançant :

```bash
$ make
```

Vous devez être patient, car il faut plusieurs minutes pour compiler une configuration de base, et cette durée peut varier considérablement en fonction de votre matériel et du nombre de modules que vous avez activés.

## Installation

Il est temps maintenant d'installer le paquet dans le répertoire d'installation défini par *PREFIX* (voir plus haut l'option `--prefix`) en lançant:

```bash
$ make install
```

Cette étape nécessite habituellement les privilèges de root, car *PREFIX* est en général un répertoire possèdant des droits en écriture restreints.

Si vous effectuez une mise à jour, l'installation n'écrasera pas vos fichiers de configuration ou autres documents.

## Personnalisation

Ensuite, vous pourrez personnaliser votre Serveur HTTP Apache en éditant les [[11-guides/01-generalites/fichiers-de-configuration|fichiers de configuration]] situés dans `PREFIX/conf/`.

```bash
$ vi PREFIX/conf/httpd.conf
```

Consultez le manuel de httpd situé dans `PREFIX/docs/manual/` ou [https://httpd.apache.org/docs/2.4/](https://httpd.apache.org/docs/2.4/) pour la version la plus récente de ce manuel et la liste complète des directives de configuration disponibles.

## Test

Vous pouvez maintenant [[11-guides/01-generalites/demarrage-d-apache|démarrer]] votre Serveur HTTP Apache en lançant :

```bash
$ PREFIX/bin/apachectl -k start
```

Vous devriez alors pouvoir requérir votre premier document à l'aide de l'URL `http://localhost/`. La page web que vous voyez est située dans le répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]], qui est généralement `PREFIX/htdocs/`. Pour [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|arrêter]] le serveur, lancez:

```bash
$ PREFIX/bin/apachectl -k stop
```

## Mise à jour

La première étape d'une mise à jour consiste à lire l'annonce de la sortie de la nouvelle version et le fichier `CHANGES` dans la distribution des sources afin de déceler toutes les modifications qui pourraient affecter votre site. Lors d'un changement majeur de version (par exemple de 2.4 à 2.6), il y aura certainement des différences importantes quant à la configuration de la compilation et de l'exécution qui nécessiteront des ajustements manuels. Tous les modules devront aussi être mis à jour pour qu'ils s'adaptent aux changements de l'API des modules.

La mise à jour d'une version mineure à la suivante (par exemple, de 2.4.66 à 2.4.67) est plus aisée. Le processus `make install` n'écrasera aucun de vos documents existants, fichiers de log, ou fichiers de configuration. De plus, les développeurs font tout leur possible pour éviter les changements entraînant une incompatibilité dans les options de [[10-commandes/configure|configure]], la configuration de l'exécution, ou l'API des modules d'une version mineure à l'autre. Dans la plupart des cas, vous pourrez utiliser une ligne de commande [[10-commandes/configure|configure]] identique, le même fichier de configuration, et tous vos modules continueront de fonctionner.

Pour effectuer une mise à jour entre deux versions mineures, commencez par trouver le fichier `config.nice` dans le répertoire de `construction` de votre serveur installé ou à la racine de l'arborescence des sources de votre ancienne installation. Il contient la reproduction exacte de la ligne de commande [[10-commandes/configure|configure]] que vous avez utilisée pour configurer l'arborescence des sources. Ensuite, pour mettre à jour l'ancienne version vers la nouvelle, il vous suffit de copier le fichier `config.nice` dans l'arborescence des sources de la nouvelle version, de l'éditer pour effectuer toute modification souhaitée, et de lancer :

```bash
$ ./config.nice
$ make
$ make install
$ PREFIX/bin/apachectl -k graceful-stop
$ PREFIX/bin/apachectl -k start
```

> [!WARNING]
> Vous devez toujours effectuer un test de la nouvelle version dans votre environnement avant de la mettre en production. Par exemple, vous pouvez installer et exécuter la nouvelle version en parallèle avec l'ancienne en utilisant une option `--prefix` et un port différents (en ajustant la directive [[13-directives/listen|Listen]]) afin de déceler toute incompatibilité avant d'effectuer la mise à jour définitive.

Vous pouvez ajouter des arguments supplémentaires à `config.nice` ; ils seront alors ajoutés aux options de votre script [[10-commandes/configure|configure]] original :

```bash
$ ./config.nice --prefix=/home/test/apache --with-port=90
```

## Paquets tiers

De nombreux systèmes d’exploitation fournissent des paquets Apache httpd préconstruits. Ces paquets permettent de démarrer rapidement, mais ils diffèrent souvent d’une construction à partir des sources quant à l’organisation du fichier de configuration, aux modules intégrés et aux chemins par défaut. La documentation sur ce site décrit la construction du serveur à partir des sources ; si vous utilisez un paquet de plateforme, consultez la documentation de votre distribution pour les détails spécifiques à la plateforme.

Quelques exemples courants :

**Fedora / CentOS / Red Hat Enterprise Linux**

```bash
sudo dnf install httpd
sudo systemctl start httpd
```

Voir [la documentation du projet Fedora](https://docs.fedoraproject.org/en-US/quick-docs/getting-started-with-apache-http-server/index.html) pour l’organisation de la configuration et des notes spécifiques à la plateforme.

**Ubuntu / Debian**

```bash
sudo apt install apache2
sudo systemctl start apache2
```

Voir [documentation d’Ubuntu](https://ubuntu.com/tutorials/install-and-configure-apache) pour l’organisation de la configuration et des notes spécifiques à la plateforme.

Notre licence logicielle non seulement permet, mais aussi encourage ce genre de distribution tierce. Cependant, cela conduit à une situation ou l'organisation de la configuration et les valeurs par défaut de votre installation du serveur peuvent ne pas correspondre à ce qui est écrit dans la documentation. Une [description de ces distributions tierces](https://cwiki.apache.org/confluence/display/httpd/DistrosDefaultLayout) est disponible dans le wiki du serveur HTTP.

> [!WARNING]
> Votre plateforme favorite n’est pas mentionnée ici ? [Voilà une bonne occasion pour vous d’améliorer cette documentation.](https://httpd.apache.org/docs-project/)

## Voir aussi

- [[10-commandes/configure|Configuration de l'arborescence des sources]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
