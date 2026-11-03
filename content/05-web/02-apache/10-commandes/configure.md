---
title: "configure"
description: "Commande configure d’Apache HTTP Server — configure - Configure l'arborescence des sources : syntaxe, options et exemples."
tags: [apache, commande, configure]
icon: terminal
---

*configure - Configure l'arborescence des sources*

Le script [[10-commandes/configure|configure]] permet de configurer l'arborescence des sources afin de compiler et installer le serveur HTTP Apache sur votre plate-forme spécifique. De nombreuses options vous permettent de compiler un serveur correspondant à vos propres besoins.

Ce script, situé dans le répertoire racine de la distribution des sources, ne concerne que la compilation sur les systèmes Unix et apparentés. Pour les autres plates-formes, voir la [[11-guides/07-plates-formes/00-notes-specifiques-aux-differentes-plateformes|documentation spécifique]] de ces dernières.

## Résumé

Vous devez appeler le script [[10-commandes/configure|configure]] depuis le répertoire racine de la distribution.

`./configure [OPTION]... [VARIABLE=VALEUR]...`

Pour définir des variables d'environnement (par exemple `CC`,`CFLAGS`, etc...), utilisez la clause `VARIABLE=VALEUR`. Voir ci-dessous pour la description de quelques variables usuelles.

## Options

- Options de Configuration
- Répertoires d'installation
- Types de Systèmes
- Fonctionnalités optionnelles
- Options pour les programmes support

### Options de Configuration

Les options suivantes affectent le comportement du script [[10-commandes/configure|configure]].

**`-C`**

**`--config-cache`**

C'est un alias pour `--cache-file=config.cache`

**`--cache-file=FICHIER`**

Les résultats des tests seront mis en cache dans le fichier *FICHIER*. Cette option est désactivée par défaut.

**`-h`**

**`--help [short|recursive]`**

Affichage de l'aide et sortie du script. Avec l'argument `short`, seules les options spécifiques à ce paquet seront affichées. L'argument `recursive` permet d'afficher l'aide de tous les paquets inclus.

**`-n`**

**`--no-create`**

Le script [[10-commandes/configure|configure]] s'exécute normalement, mais ne crée pas les fichiers résultants. Ceci permet de vérifier les résultats des tests avant de générer les fichiers makefile pour la compilation.

**`-q`**

**`--quiet`**

Les messages `checking ...` ne sont pas affichés au cours du processus de configuration.

**`--srcdir=DIR`**

Définit le répertoire *DIR* comme répertoire des fichiers sources. Par défaut, c'est le répertoire où se situe le script [[10-commandes/configure|configure]], ou le répertoire parent.

**`--silent`**

Identique à `--quiet`

**-V**

**--version**

Affichage des informations de copyright et sortie du script.

### Répertoires d'installation

Ces options permettent de spécifier le répertoire d'installation. L'arborescence de l'installation dépend de l'organisation (layout) sélectionnée.

**`--prefix=PREFIX`**

Installe les fichiers indépendants de l'architecture dans *PREFIX*. Par défaut, le répertoire d'installation est `/usr/local/apache2`.

**`--exec-prefix=EPREFIX`**

Installe les fichiers dépendants de l'architecture dans *EPREFIX*. La valeur par défaut de cette option correspond à la valeur de la variable *PREFIX*.

Par défaut, `make install` va installer tous les fichiers dans `/usr/local/apache2/bin`, `/usr/local/apache2/lib`, etc... Vous pouvez cependant spécifier un préfixe d'installation autre que `/usr/local/apache2` en utilisant l'option `--prefix` (par exemple `--prefix=$HOME`).

#### Spécifier une organisation (layout) des répertoires

**`--enable-layout=LAYOUT`**

Configure le code source et les scripts de compilation de façon à ce que l'arborescence d'installation adopte l'organisation *LAYOUT*. Ceci vous permet de spécifier des chemins séparés pour chaque type de fichier de l'installation du serveur HTTP Apache. Le fichier `config.layout` contient de nombreux exemples de configurations, et vous pouvez créer vos propres configurations personnalisées en vous basant sur ces exemples. Les différentes organisations contenues dans ce fichier sont enregistrées sous forme de sections `<Layout FOO>...</Layout>` et référencées dans ce cas par le nom `FOO`. L'organisation par défaut est `Apache`.

#### Configuration avancée des répertoires d'installation

Pour une définition plus précise des répertoires d'installation, utilisez les options ci-dessous. Notez que les répertoires par défaut sont définis par `autoconf`, et que leurs valeurs sont écrasées par les valeurs correspondantes définies lors du choix de l'organisation des répertoires (layout).

**`--bindir=DIR`**

Installe les exécutables utilisateur dans *DIR*. Les exécutables utilisateur sont des programmes support comme [[10-commandes/htpasswd|htpasswd]], [[10-commandes/dbmmanage|dbmmanage]], etc..., et destinés aux administrateurs du site. Par défaut, *DIR* est défini à `EPREFIX/bin`.

**`--datadir=DIR`**

Installe les données non modifiables indépendantes de l'architecture dans *DIR*. Par défaut, `datadir` est défini à `PREFIX/share`. Cette option est fournie par autoconf et actuellement inutilisée.

**`--includedir=DIR`**

Installe les fichiers d'en-têtes C dans *DIR*. Par défaut, `includedir` est défini à `EPREFIX/include`.

**`--infodir=DIR`**

Installe la documentation info dans *DIR*. Par défaut, `infodir` est défini à `PREFIX/info`. Cette option est actuellement inutilisée.

**`--libdir=DIR`**

Installe les fichiers objet des bibliothèques dans *DIR*. Par défaut, `libdir` est défini à `EPREFIX/lib`.

**`--libexecdir=DIR`**

Installe les exécutables du programme (autrement dit les modules partagés) dans *DIR*. Par défaut, `libexecdir` est défini à `EPREFIX/modules`.

**`--localstatedir=DIR`**

Installe les données temporaires modifiables spécifiques à la machine dans *DIR*. Par défaut, `localstatedir` est défini à `PREFIX/var`. Cette option est fournie par `autoconf` et est actuellement inutilisée.

**`--mandir=DIR`**

Installe les pages de manuel dans *DIR*. Par défaut, `mandir` est défini à `EPREFIX/man`.

**`--oldincludedir=DIR`**

Installe les fichiers d'en-têtes C pour les programmes autres que gcc dans *DIR*. Par défaut, `oldincludedir` est défini à `/usr/include`. Cette option est fournie par `autoconf` et est actuellement inutilisée.

**`--sbindir=DIR`**

Installe les exécutables de l'administrateur système dans *DIR*. Ce sont les programmes du serveur comme [[10-commandes/httpd|httpd]], [[10-commandes/apachectl|apachectl]], [[10-commandes/suexec|suexec]], etc..., qui sont nécessaires à l'exécution du serveur HTTP Apache. Par défaut, `sbindir` est défini à `EPREFIX/bin` (comme `bindir`).

**`--sharedstatedir=DIR`**

Installe les données modifiables indépendantes de l'architecture dans *DIR*. Par défaut, `sharedstatedir` est défini à `PREFIX/com`. Cette option est fournie par `autoconf` et est actuellement inutilisée.

**`--sysconfdir=DIR`**

Installe les données non modifiables spécifiques à la machine comme les fichiers de configuration du serveur `httpd.conf`, `mime.types`, etc... dans *DIR*. Par défaut, `sysconfdir` est défini à `PREFIX/conf`.

### Types de systèmes

Ces options sont utilisées pour la cross-compilation du serveur HTTP Apache afin de pouvoir l'utiliser sur un autre système. Dans le cas général où la compilation et l'exécution du serveur ont lieu sur le même système, ces options ne sont pas utilisées.

**`--build=BUILD`**

Définit le type du système sur lequel les outils sont compilés. Par défaut, il s'agit de la chaîne renvoyée par le script `config.guess`.

**`--host=HOST`**

Définit le type du système sur lequel le serveur s'exécutera. Par défaut, *HOST* est identique à *BUILD*.

**`--target=TARGET`**

Configure pour construire des compilateurs pour le type de système *TARGET*. Par défaut, *TARGET* est identique à *HOST*. Cette option est fournie par `autoconf` et n'est pas requise par le serveur HTTP Apache.

### Fonctionnalités optionnelles

Ces options vous permettent de configurer avec précision les fonctionnalités de votre futur serveur HTTP.

#### Syntaxe générale

D'une manière générale, vous pouvez utiliser la syntaxe suivante pour activer ou désactiver une fonctionnalité :

**`--disable-FONCTIONNALITE`**

Désactive la fonctionnalité *FONCTIONNALITE*. Identique à `--enable-FONCTIONNALITE=no`.

**`--enable-FONCTIONNALITE[=ARG]`**

Active la fonctionnalité *FONCTIONNALITE*. La valeur par défaut de *ARG* est `yes`.

**`--enable-MODULE=shared`**

Le module spécifié sera compilé en tant que module DSO. Par défaut, les modules activés sont liés dynamiquement.

**`--enable-MODULE=static`**

Le module correspondant sera lié statiquement.

> [!NOTE]
> **Note**
>
> Si vous spécifiez `--enable-foo`, et si *foo* n'existe pas, [[10-commandes/configure|configure]] ne le signalera pas ; vous devez donc prendre soin de taper les options correctement.

#### Choix des modules à compiler

La plupart des modules sont compilés par défaut et ils doivent être désactivés de manière explicite ou via le mots-clé `few` (voir ci-dessous `--enable-modules`, `--enable-mods-shared` et `--enable-mods-static` pour une explication plus détaillée), ou `--enable-modules=none` pour les désactiver tous.

Par défaut, les autres modules ne sont pas compilés et doivent être activés explicitement, ou en utilisant les mots-clés `all` ou `reallyall` pour être disponibles.

Pour déterminer quels modules sont compilés par défaut, exécutez la commande `./configure -h` ou `./configure --help`, et consultez les `Optional Features`. Par exemple, supposons que vous soyez intéressé par les modules `mod_example1` et `mod_example2`, et que vous voyiez ceci :

```
Optional Features:
  ...
  --disable-example1     example module 1
  --enable-example2      example module 2
  ...
```

Le module `mod_example1` est ici activé par défaut, et vous devez spécifier `--disable-example1` si vous ne voulez pas le compiler. Par contre, le module `mod_example2` est désactivé par défaut, et vous devez spécifier `--enable-example2` si vous voulez le compiler.

#### Modules Multi-Processus

Les [[11-guides/01-generalites/modules-multi-processus-mpms|Modules Multi-Processus]], ou MPMs, constituent le coeur du serveur. Un seul MPM doit être actif pour que le serveur puisse fonctionner. Vous trouverez la liste des MPMs disponibles à module index page.

Les MPMs peuvent être compilés en tant que modules DSO pour un chargement dynamique, ou liés statiquement avec le serveur, et sont activés via les options suivantes :

**`--with-mpm=MPM`**

Sélectionne le MPM par défaut pour votre serveur. Si les MPMs sont compilés en tant que modules DSO (voir `--enable-mpms-shared`), cette option spécifie le MPM qui sera chargé par défaut selon le fichier de configuration. Dans le cas contraire, cette option spécifie le seul MPM disponible qui sera lié statiquement avec le serveur.

Si cette option est omise, c'est le [[11-guides/01-generalites/modules-multi-processus-mpms|MPM par défaut]] pour votre système d'exploitation qui sera utilisé.

**`--enable-mpms-shared=Liste de MPM`**

Définit une liste de MPMs à compiler en tant que modules dynamiquement partagés (DSO). Un de ces modules doit être chargé dynamiquement via la directive [[13-directives/loadmodule|LoadModule]].

*Liste de MPM* est une liste, entourée d'apostrophes, de noms de MPM séparés par des espaces. Par exemple :

```
--enable-mpms-shared='prefork worker'
```

Vous pouvez aussi utiliser le mot-clé `all`, ce qui aura pour effet de spécifier tous les MPMs qui supportent le chargement dynamique sur la plate-forme considérée, et de les compiler en tant que modules DSO. Par exemple :

```
--enable-mpms-shared=all
```

#### Modules tiers

Pour ajouter des modules tiers, utilisez les options suivantes :

**`--with-module=type-module:fichier-module[, type-module:fichier-module]`**

Ajoute un ou plusieurs modules tiers à la liste des modules liés statiquement. Le fichier source du module *fichier-module* sera recherché dans le sous-répertoire *type-module* de l'arborescence des sources de votre serveur HTTP Apache. S'il ne l'y trouve pas, [[10-commandes/configure|configure]] considèrera *fichier-module* comme un chemin de fichier absolu et essaiera de copier le fichier source dans le sous-répertoire *type-module*. Si ce sous-répertoire n'existe pas, il sera créé et un fichier `Makefile.in` standard y sera enregistré.

Cette option est conçue pour ajouter de petits modules externes ne comportant qu'un seul fichier source. Pour des modules plus complexes, vous devrez lire la documentation du fournisseur du module.

> [!NOTE]
> **Note**
>
> Si vous voulez compiler un module DSO (lié de manière dynamique au lieu de statique), utilisez le programme [[10-commandes/apxs|apxs]].

#### Options cumulatives et autres options

**`--enable-maintainer-mode`**

Active les avertissements de débogage et de compilation et charge tous les modules compilés.

**`--enable-mods-shared=LISTE-MODULES`**

Définit une liste de modules à activer et à compiler en tant que modules dynamiques partagés. Cela signifie que ces modules doivent être chargés dynamiquement en utilisant la directive [[13-directives/loadmodule|LoadModule]].

*LISTE-MODULES* est une liste, entourée d'apostrophes, de noms de modules séparés par des espaces. Les noms des modules sont spécifiés sans le préfixe `mod_`. Par exemple :

```
--enable-mods-shared='headers rewrite dav'
```

Vous pouvez aussi utiliser les mots-clés `reallyall`, `all`, `most` et `few`. Par exemple,

```
--enable-mods-shared=most
```

va compiler la plupart des modules en tant que modules DSO,

```
--enable-mods-shared=few
```

ne compilera qu'un jeu de modules de base.

Le jeu par défaut correspond au mot-clé `most`.

Les directives [[13-directives/loadmodule|LoadModule]] correspondant aux différents modules choisis sont automatiquement générées dans le fichier de configuration principal. Par défaut, toutes ces directives sont mises en commentaire, sauf pour les modules requis ou ceux explicitement sélectionnés par un argument `--enable-nom-module` du script configure. Vous pouvez modifier le jeu de modules chargé en activant ou désactivant les directives [[13-directives/loadmodule|LoadModule]] dans le fichier `httpd.conf`. En outre, les directives [[13-directives/loadmodule|LoadModule]] peuvent être activées pour tous les modules compilés via l'option `--enable-load-all-modules` du script configure.

**`--enable-mods-static=MODULE-LIST`**

Cette option produit le même effet que l'option `--enable-mods-shared`, à l'exception que les modules seront liés statiquement. Cela signifie que les modules spécifiés seront toujours disponibles au cours du fonctionnement de [[10-commandes/httpd|httpd]]. Ils n'ont pas besoin d'être chargés via la directive [[13-directives/loadmodule|LoadModule]].

**`--enable-modules=MODULE-LIST`**

Cette option se comporte comme `--enable-mods-shared`, et va aussi lier les modules concernés dynamiquement. Le mot-clé spécial `none` désactive la compilation de tous les modules.

**`--enable-v4-mapped`**

Permet aux sockets IPv6 de traiter les connexions IPv4.

**`--with-port=PORT`**

Permet de définir le port que le programme [[10-commandes/httpd|httpd]] va écouter. Ce numéro de port est utilisé lors de la génération du fichier de configuration `httpd.conf`. Sa valeur par défaut est 80.

**`--with-program-name`**

Permet de définir un nom d'exécutable alternatif. Le nom par défaut est `httpd`.

### Paquets optionnels

Ces options permettent de définir des paquets optionnels.

#### Syntaxe générale

D'une manière générale, vous pouvez utiliser la syntaxe suivante pour définir un paquet optionnel :

**`--with-PAQUET[=ARG]`**

Utilise le paquet *PAQUET*. La valeur par défaut de *ARG* est `yes`.

**`--without-PAQUET`**

N'utilise pas le paquet *PAQUET*. Cette option est identique à `--with-PAQUET=no`. Elle est fournie par `autoconf` mais n'est pas très utile pour le serveur HTTP Apache.

#### Paquets spécifiques

**`--with-apr=REP|FICHIER`**

La Bibliothèque pour la portabilité d'Apache ou Apache Portable Runtime (APR) fait partie de la distribution des sources de httpd et est compilée automatiquement avec le serveur HTTP. Si vous voulez utiliser une APR déjà installée à la place, vous devez indiquer à [[10-commandes/configure|configure]] le chemin du script `apr-config`. Vous pouvez spécifier le chemin absolu et le nom ou le répertoire d'installation de l'APR. `apr-config` doit se trouver dans ce répertoire ou dans le sous-repertoire `bin`.

**`--with-apr-util=REP|FICHIER`**

Les utilitaires pour la Bibliothèque pour la portabilité d'Apache ou Apache Portable Runtime Utilities (APU) font partie de la distribution des sources de httpd et sont compilés automatiquement avec le serveur HTTP. Si vous voulez utiliser des APU déjà installés à la place, vous devez indiquer à [[10-commandes/configure|configure]] le chemin du script `apu-config`. Vous pouvez spécifier le chemin absolu et le nom ou le répertoire d'installation des APU. `apu-config` doit se trouver dans ce répertoire ou dans le sous-repertoire `bin`.

**`--with-ssl=REP`**

Si [[12-modules/mod_ssl|mod_ssl]] a été activé, [[10-commandes/configure|configure]] recherche une installation d'OpenSSL. Vous pouvez définir le répertoire de la boîte à outils SSL/TLS à la place.

**`--with-z=REP`**

[[10-commandes/configure|configure]] recherche automatiquement une bibliothèque `zlib` installée si la configuration de vos sources en nécessite une (par exemple lorsque [[12-modules/mod_deflate|mod_deflate]] est activé). Vous pouvez définir le répertoire de la bibliothèque de compression à la place.

De nombreuses fonctionnalités du serveur HTTP Apache, y compris les directives [[13-directives/rewritemap|RewriteMap]] DBM de [[12-modules/mod_rewrite|mod_rewrite]] et [[12-modules/mod_authn_dbm|mod_authn_dbm]] utilisent une base de données simple de la forme clé/valeur pour une recherche rapide d'informations. SDBM, inclus dans les APU, est donc toujours disponible. Si vous souhaitez utiliser d'autres types de bases de données, utilisez les options suivantes afin de les activer :

**`--with-gdbm[=chemin]`**

Si aucun *chemin* n'est spécifié, [[10-commandes/configure|configure]] va rechercher les fichiers d'en-têtes et les bibliothèques d'une installation DBM GNU dans les chemins standards. Avec un *chemin* explicite, [[10-commandes/configure|configure]] recherchera les fichiers concernés dans `chemin/lib` et `chemin/include`. En fait, *chemin* permet de spécifier plusieurs chemins d'en-têtes et bibliothèques spécifiques en les séparant par des caractères ':'.

**`--with-ndbm[=chemin]`**

Identique à `--with-gdbm`, mais recherche une installation de New DBM.

**`--with-berkeley-db[=chemin]`**

Identique à `--with-gdbm`, mais recherche une installation de Berkeley DB.

> [!NOTE]
> **Note**
>
> Les options DBM sont fournies par les APU et passées en paramètres à son script de configuration. Elles sont inutiles lorsqu'on utilise des APU déjà installés définis par `--with-apr-util`.
>
> Vous pouvez utiliser plusieurs implémentations DBM avec votre serveur HTTP. Le type DBM approprié sera choisi au cours de la configuration de l'exécution à chaque démarrage.

### Options pour les programmes de support

**`--enable-static-support`**

Permet de compiler une version des binaires de support liés statiquement. En d'autres termes, la compilation produira un exécutable indépendant comportant toutes les bibliothèques nécessaires. Sans cette option, les binaires de supports sont liés dynamiquement.

**`--enable-suexec`**

Utilisez cette option pour activer la programme [[10-commandes/suexec|suexec]], qui vous permet de définir un uid et un gid pour les processus lancés. **N'utilisez cette option que si vous maîtrisez toutes les implications en matière de sécurité de l'exécution d'un binaire suid sur votre serveur.** D'autres options permettent de configurer [[10-commandes/suexec|suexec]] comme décrit ci-dessous.

Il est possible de lier statiquement le binaire d'un programme support particulier en utilisant les options suivantes :

**`--enable-static-ab`**

Compile une version liée statiquement du programme [[10-commandes/ab|ab]].

**`--enable-static-checkgid`**

\>Compile une version liée statiquement du programme `checkgid`.

**`--enable-static-htdbm`**

Compile une version liée statiquement du programme [[10-commandes/htdbm|htdbm]].

**`--enable-static-htdigest`**

Compile une version liée statiquement du programme [[10-commandes/htdigest|htdigest]].

**`--enable-static-htpasswd`**

Compile une version liée statiquement du programme [[10-commandes/htpasswd|htpasswd]].

**`--enable-static-logresolve`**

Compile une version liée statiquement du programme [[10-commandes/logresolve|logresolve]].

**`--enable-static-rotatelogs`**

Compile une version liée statiquement du programme [[10-commandes/rotatelogs|rotatelogs]].

#### Options de configuration de [[10-commandes/suexec|suexec]][[10-commandes/suexec|suexec]]

Les options suivantes permettent de définir avec précision le comportement du programme [[10-commandes/suexec|suexec]]. Voir [[10-commandes/suexec|Configurer et installer suEXEC]] pour plus de détails.

**`--with-suexec-bin`**

Définit le chemin du binaire [[10-commandes/suexec|suexec]]. La valeur par défaut est `--sbindir` (voir Définition précise des répertoires d'installation).

**`--with-suexec-caller`**

Définit l'utilisateur qui a l'autorisation d'appeler [[10-commandes/suexec|suexec]]. Il est en général souhaitable que ce soit le même que celui sous lequel [[10-commandes/httpd|httpd]] s'exécute.

**`--with-suexec-docroot`**

Définit l'arborescence des répertoires dans laquelle le lancement des exécutables via [[10-commandes/suexec|suexec]] est autorisé. La valeur par défaut est `--datadir/htdocs`.

**`--with-suexec-gidmin`**

Définit la valeur de GID la plus basse autorisée comme valeur cible pour [[10-commandes/suexec|suexec]]. La valeur par défaut est 100.

**`--with-suexec-logfile`**

Définit le nom du fichier journal de [[10-commandes/suexec|suexec]]. La valeur par défaut est `--logfiledir/suexec_log`.

**`--with-suexec-safepath`**

Définit la valeur de la variable d'environnement `PATH` pour les processus lancés par [[10-commandes/suexec|suexec]]. La valeur par défaut est `/usr/local/bin:/usr/bin:/bin`.

**`--with-suexec-userdir`**

Définit le sous-répertoire du répertoire utilisateur qui contient tous les exécutables pouvant être lancés par [[10-commandes/suexec|suexec]]. Cette option est nécessaire si vous souhaitez utiliser [[10-commandes/suexec|suexec]] avec des répertoires utilisateurs (définis via [[12-modules/mod_userdir|mod_userdir]]). La valeur par défaut est `public_html`.

**`--with-suexec-uidmin`**

Définit la valeur d'UID la plus basse autorisée comme valeur cible pour [[10-commandes/suexec|suexec]]. La valeur par défaut est 100.

**`--with-suexec-umask`**

Définit le masque de permissions `umask` pour les processus lancés par [[10-commandes/suexec|suexec]]. Il correspond par défaut au masque défini par la configuration de votre système.

## Variables d'environnement

Certaines variables d'environnement permettent de modifier les choix effectués par [[10-commandes/configure|configure]], ou d'aider ce dernier à trouver les bibliothèques et programmes possédant des noms et chemins non standards.

**`CC`**

Définit la commande du compilateur C à utiliser pour la compilation.

**`CFLAGS`**

Définit les paramètres du compilateur C que vous voulez utiliser pour la compilation.

**`CPP`**

Définit la commande du préprocesseur C à utiliser.

**`CPPFLAGS`**

Définit les paramètres du préprocesseur C/C++, par exemple `-Irépertoire-include`, si certains de vos fichiers d'en-têtes se trouvent dans le répertoire non standard *répertoire-include*.

**`LDFLAGS`**

Définit les paramètres de l'éditeur de liens, par exemple `-Lrépertoire-lib`, si certaines de vos bibliothèques se trouvent dans le répertoire non standard *répertoire-lib*.

## Voir aussi

- [[11-guides/01-generalites/compilation-et-installation|Compilation et installation]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
