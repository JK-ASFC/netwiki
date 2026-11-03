---
title: "Prise en charge des objets dynamiques partagés (DSO)"
description: "Apache HTTP Server — Prise en charge des objets dynamiques partagés (DSO). La conception modulaire du serveur HTTP Apache permet à l'administrateur de choisir les fonctionnalités à inclure dans le serveur en sélectionnant un certain nombre de modules. Les modules seront compilés en tant qu'Objets Dynamiques Partag"
tags: [apache, guide]
icon: book-open
---

La conception modulaire du serveur HTTP Apache permet à l'administrateur de choisir les fonctionnalités à inclure dans le serveur en sélectionnant un certain nombre de modules. Les modules seront compilés en tant qu'Objets Dynamiques Partagés (Dynamic Shared Objects ou DSOs) qui mènent une existence séparée du fichier binaire principal [[10-commandes/httpd|httpd]]. Les modules DSO peuvent être compilés en même temps que le serveur, ou compilés et ajoutés ultérieurement via l'Outil des Extensions à Apache (Apache Extension Tool ou [[10-commandes/apxs|apxs]]).

Les modules peuvent aussi être intégrés statiquement dans le binaire [[10-commandes/httpd|httpd]] lors de la compilation de ce dernier.

Ce document décrit l'utilisation des modules DSO ainsi que les dessous de leur fonctionnement.

## Implémentation

- [[12-modules/mod_so|mod_so]]
- [[13-directives/loadmodule|LoadModule]]

La prise en charge de DSO pour le chargement de modules individuels d'Apache httpd est assuré par un module nommé [[12-modules/mod_so|mod_so]] qui doit être compilé statiquement dans le coeur d'Apache httpd. Il s'agit du seul module avec le module [[12-modules/core|core]] à ne pas pouvoir être compilé en tant que module DSO lui-même. Pratiquement tous les autres modules d'Apache httpd distribués seront alors compilés en tant que modules DSO. Une fois compilé en tant que module DSO nommé `mod_foo.so`, un module peut être chargé en mémoire au démarrage ou redémarrage du serveur à l'aide de la directive [[13-directives/loadmodule|LoadModule]] du module [[12-modules/mod_so|mod_so]] placée dans votre fichier `httpd.conf`.

La compilation en mode DSO peut être désactivée pour certains modules via l'option `--enable-mods-static` du script [[10-commandes/configure|configure]], comme expliqué dans la [[11-guides/01-generalites/compilation-et-installation|Documentation sur l'installation]].

Un utilitaire permet de simplifier la création de fichiers DSO pour les modules d'Apache httpd (particulièrement pour les modules tiers) ; il s'agit du programme nommé [[10-commandes/apxs|apxs]] (*APache eXtenSion*). On peut l'utiliser pour construire des modules de type DSO *en dehors* de l'arborescence des sources d'Apache httpd. L'idée est simple : à l'installation du serveur HTTP Apache, la procédure `make install` du script [[10-commandes/configure|configure]] installe les fichiers d'en-têtes d'Apache httpd et positionne, pour la plateforme de compilation, les drapeaux du compilateur et de l'éditeur de liens à l'intérieur du programme [[10-commandes/apxs|apxs]] qui sera utilisé pour la construction de fichiers DSO. Il est ainsi possible d'utiliser le programme [[10-commandes/apxs|apxs]] pour compiler ses sources de modules Apache httpd sans avoir besoin de l'arborescence des sources de la distribution d'Apache, et sans avoir à régler les drapeaux du compilateur et de l'éditeur de liens pour la prise en charge de DSO.

## Mode d'emploi succinct

Afin que vous puissiez vous faire une idée des fonctionnalités DSO du serveur HTTP Apache 2.x, en voici un résumé court et concis :

1. Construire et installer un module Apache httpd *faisant partie de la distribution*, par exemple `mod_foo.c`, en tant que module DSO `mod_foo.so` :

   ```bash
   $ ./configure --prefix=/path/to/install --enable-foo
   $ make install
   ```
2. Configurer le serveur HTTP Apache avec tous les modules activés. Seul un jeu de modules de base sera chargé au démarrage du serveur. Vous pouvez modifier ce jeu de modules chargés au démarrage en activant ou désactivant les directives [[13-directives/loadmodule|LoadModule]] correspondantes dans le fichier `httpd.conf`.

   ```bash
   $ ./configure --enable-mods-shared=all
   $ make install
   ```

   L'argument `most` de l'option `--enable-modules` indique que tous les modules non-expérimentaux ou qui ne sont pas là à titre d'exemple seront compilés.
3. Certains modules ne sont utilisés que par les développeurs et ne seront pas compilés. Si vous voulez les utiliser, spécifiez l'option *all*. Pour compiler tous les modules disponibles, y compris les modules de développeurs, spécifiez l'option *reallyall*. En outre, la directive [[13-directives/loadmodule|LoadModule]] peut être activée pour tous les modules compilés via l'option du script configure `--enable-load-all-modules`.

   ```bash
   $ ./configure --enable-mods-shared=reallyall --enable-load-all-modules
   $ make install
   ```
4. Construire et installer un module Apache httpd *tiers*, par exemple `mod_foo.c`, en tant que module DSO `mod_foo.so` *en dehors* de l'arborescence des sources d'Apache httpd à l'aide du programme [[10-commandes/apxs|apxs]] :

   ```bash
   $ cd /path/to/3rdparty
   $ apxs -cia mod_foo.c
   ```

Dans tous les cas, une fois le module partagé compilé, vous devez ajouter une directive [[13-directives/loadmodule|LoadModule]] dans le fichier `httpd.conf` pour qu'Apache httpd active le module.

Voir la [[10-commandes/apxs|documentation sur apxs]] pour plus de détails.

## Les dessous du fonctionnement des DSO

Les clones modernes d'UNIX proposent un mécanisme appelé édition de liens et chargement dynamiques d' *Objets Dynamiques Partagés* (DSO), qui permet de construire un morceau de programme dans un format spécial pour le rendre chargeable à l'exécution dans l'espace d'adressage d'un programme exécutable.

Ce chargement peut s'effectuer de deux manières : automatiquement par un programme système appelé `ld.so` quand un programme exécutable est démarré, ou manuellement à partir du programme en cours d'exécution à l'aide de sa propre interface système vers le chargeur Unix à l'aide des appels système `dlopen()/dlsym()`.

Dans la première méthode, les DSO sont en général appelés *bibliothèques partagées* ou encore *bibliothèques DSO*, et possèdent des noms du style `libfoo.so` ou `libfoo.so.1.2`. Ils résident dans un répertoire système (en général `/usr/lib`) et le lien avec le programme exécutable est établi à la compilation en ajoutant `-lfoo` à la commande de l'éditeur de liens. Les références à la bibliothèque sont ainsi codées en dur dans le fichier du programme exécutable de façon qu'au démarrage du programme, le chargeur Unix soit capable de localiser `libfoo.so` dans `/usr/lib`, dans des chemins codés en dur à l'aide d'options de l'éditeur de liens comme `-R` ou dans des chemins définis par la variable d'environnement `LD_LIBRARY_PATH`. Le chargeur peut dès lors résoudre tous les symboles (jusque là non encore résolus) du DSO dans le programme exécutable.

Les symboles du programme exécutable ne sont en général pas référencés par le DSO (car c'est une bibliothèque de code à usage général et réutilisable), et ainsi aucune résolution supplémentaire n'est nécessaire. De son côté, le programme exécutable ne doit accomplir aucune action particulière pour utiliser les symboles du DSO car toutes les résolutions sont effectuées par le chargeur Unix. En fait, le code permettant d'invoquer `ld.so` fait partie du code de démarrage pour l'exécution qui est lié dans tout programme exécutable non statiquement lié. L'avantage du chargement dynamique du code d'une bibliothèque partagée est évident : le code de la bibliothèque ne doit être stocké qu'une seule fois dans une bibliothèque système telle que `libc.so`, ce qui permet d'économiser de l'espace disque pour les autres programmes.

Dans la seconde méthode, les DSO sont en général appelés *objets partagés* ou *fichiers DSO*, et peuvent être nommés avec l'extension de son choix (bien que le nom conseillé soit du style `foo.so`). Ces fichiers résident en général dans un répertoire spécifique à un programme, et aucun lien n'est automatiquement établi avec le programme exécutable dans lequel ils sont utilisés. Le programme exécutable charge manuellement le DSO à l'exécution dans son espace d'adressage à l'aide de l'appel système `dlopen()`. A ce moment, aucune résolution de symboles du DSO n'est effectuée pour le programme exécutable. Par contre le chargeur Unix résoud automatiquement tout symbole du DSO (non encore résolu) faisant partie de l'ensemble de symboles exporté par le programme exécutable et ses bibliothèques DSO déjà chargées (et en particulier tous les symboles de la bibliothèque à tout faire `libc.so`). De cette façon, le DSO prend connaissance de l'ensemble de symboles du programme exécutable comme s'il avait été lié statiquement avec lui auparavant.

Finalement, pour tirer profit de l'API des DSO, le programme exécutable doit résoudre certains symboles du DSO à l'aide de l'appel système `dlsym()` pour une utilisation ultérieure dans les tables de distribution, *etc.* En d'autres termes, le programme exécutable doit résoudre manuellement tous les symboles dont il a besoin pour pouvoir les utiliser. Avantage d'un tel mécanisme : les modules optionnels du programme n'ont pas besoin d'être chargés (et ne gaspillent donc pas de ressources mémoire) tant qu'il ne sont pas nécessaires au programme en question. Si nécessaire, ces modules peuvent être chargés dynamiquement afin d'étendre les fonctionnalités de base du programme.

Bien que ce mécanisme DSO paraisse évident, il comporte au moins une étape difficile : la résolution des symboles depuis le programme exécutable pour le DSO lorsqu'on utilise un DSO pour étendre les fonctionnalités d'un programme (la seconde méthode). Pourquoi ? Parce que la « résolution inverse » des symboles DSO à partir du jeu de symboles du programme exécutable dépend de la conception de la bibliothèque (la bibliothèque n'a aucune information sur le programme qui l'utilise) et n'est ni standardisée ni disponible sur toutes les plateformes. En pratique, les symboles globaux du programme exécutable ne sont en général pas réexportés et donc indisponibles pour l'utilisation dans un DSO. Trouver une méthode pour forcer l'éditeur de liens à exporter tous les symboles globaux est le principal problème que l'on doit résoudre lorsqu'on utilise un DSO pour étendre les fonctionnalités d'un programme au moment de son exécution.

L'approche des bibliothèques partagées est la plus courante, parce que c'est dans cette optique que le mécanisme DSO a été conçu ; c'est cette approche qui est ainsi utilisée par pratiquement tous les types de bibliothèques que fournit le système d'exploitation.

## Avantages et inconvénients

Les fonctionnalités ci-dessus basées sur les DSO présentent les avantages suivants :

- Le paquetage du serveur est plus flexible à l'exécution car le processus serveur peut être assemblé à l'exécution via la directive [[13-directives/loadmodule|LoadModule]] du fichier de configuration `httpd.conf` plutôt que par des options du script [[10-commandes/configure|configure]] à la compilation. Par exemple, on peut ainsi exécuter différentes instances du serveur (standard et version SSL, version minimale et version dynamique \[mod\_perl, mod\_php\], *etc.*) à partir d'une seule installation d'Apache httpd.
- Le paquetage du serveur peut être facilement étendu avec des modules tiers, même après l'installation. Ceci présente un gros avantage pour les mainteneurs de paquetages destinés aux distributions, car ils peuvent créer un paquetage Apache httpd de base, et des paquetages additionnels contenant des extensions telles que PHP, mod\_perl, mod\_fastcgi, *etc.*
- Une facilité de prototypage des modules Apache httpd, car la paire DSO/[[10-commandes/apxs|apxs]] vous permet d'une part de travailler en dehors de l'arborescence des sources d'Apache httpd, et d'autre part de n'avoir besoin que de la commande `apxs -i` suivie d'un `apachectl restart` pour introduire une nouvelle version de votre module fraîchement développé dans le serveur HTTP Apache en cours d'exécution.

Inconvénients des DSO :

- Le serveur est environ 20 % plus lent au démarrage à cause des résolutions de symboles supplémentaires que le chargeur Unix doit effectuer.
- Le serveur est environ 5 % plus lent à l'exécution sur certaines plates-formes, car le code indépendant de la position (PIC) nécessite parfois des manipulations compliquées en assembleur pour l'adressage relatif qui ne sont pas toujours aussi rapides que celles que permet l'adressage absolu.
- Comme les modules DSO ne peuvent pas être liés avec d'autres bibliothèques basées sur DSO (`ld -lfoo`) sur toutes les plates-formes (par exemple, les plates-formes basées sur a.out ne fournissent en général pas cette fonctionnalité alors que les plates-formes basées sur ELF le font), vous ne pouvez pas utiliser le mécanisme DSO pour tous les types de modules. Ou en d'autres termes, les modules compilés comme fichiers DSO sont contraints de n'utiliser que les symboles du coeur d'Apache httpd, de la bibliothèque C (`libc`) et toutes autres bibliothèques statiques ou dynamiques utilisées par le coeur d'Apache httpd, ou d'archives statiques (`libfoo.a`) contenant du code indépendant de la position (PIC). Il y a deux solutions pour utiliser un autre type de code : soit le coeur d'Apache httpd contient déjà lui-même une référence au code, soit vous chargez le code vous-même à l'aide de `dlopen()`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
