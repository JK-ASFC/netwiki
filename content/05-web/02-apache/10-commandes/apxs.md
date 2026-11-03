---
title: "apxs"
description: "Commande apxs d’Apache HTTP Server — apxs - Utilitaire pour les extensions d'Apache : syntaxe, options et exemples."
tags: [apache, commande, apxs]
icon: terminal
---

*apxs - Utilitaire pour les extensions d'Apache*

[[10-commandes/apxs|apxs]] est un utilitaire permettant de compiler et d'installer des modules en tant qu'extensions du serveur HTTP Apache. A cet effet, un objet dynamique partagé (DSO) est compilé à partir d'un ou plusieurs *fichiers* sources ou objets et peut être chargé pendant l'exécution du serveur Apache via la directive [[13-directives/loadmodule|LoadModule]] du module [[12-modules/mod_so|mod_so]].

Pour pouvoir utiliser ce mécanisme d'extensions, votre plate-forme doit supporter la fonctionnalité DSO, et votre binaire [[10-commandes/httpd|httpd]] Apache doit être compilé avec le module [[12-modules/mod_so|mod_so]]. Si ce n'est pas le cas, l'utilitaire [[10-commandes/apxs|apxs]] vous le signalera. Vous pouvez aussi vérifier vous-même ces prérequis en exécutant manuellement la commande :

```bash
$ httpd -l
```

Le module [[12-modules/mod_so|mod_so]] doit faire partie de la liste des modules affichée. Si ces prérequis sont présents, vous pouvez facilement étendre les fonctionnalités de votre serveur Apache en installant vos propres modules à l'aide de l'utilitaire [[10-commandes/apxs|apxs]], via le mécanisme DSO :

```bash
$ apxs -i -a -c mod_foo.c
gcc -fpic -DSHARED_MODULE -I/path/to/apache/include -c mod_foo.c
ld -Bshareable -o mod_foo.so mod_foo.o
cp mod_foo.so /path/to/apache/modules/mod_foo.so
chmod 755 /path/to/apache/modules/mod_foo.so
[activating module `foo' in /path/to/apache/etc/httpd.conf]
$ apachectl restart
/path/to/apache/sbin/apachectl restart: httpd not running, trying to start
[Tue Mar 31 11:27:55 1998] [debug] mod_so.c(303): loaded module foo_module
/path/to/apache/sbin/apachectl restart: httpd started
$ _
```

Les arguments *fichiers* peuvent correspondre à un fichier source C (.c), un fichier objet (.o) ou même une archive de bibliothèques (.a). L'utilitaire [[10-commandes/apxs|apxs]] reconnaît automatiquement ces extensions et utilise automatiquement les fichiers source C pour la compilation, et les fichiers objets et archives pour l'édition de liens. Cependant, si vous utilisez des fichiers objets précompilés, assurez-vous que leur code soit indépendant de la position (PIC), afin de pouvoir les utiliser avec un objet partagé chargé dynamiquement. Avec GCC, par exemple, il vous suffit de toujours utiliser l'option de compilation `-fpic`. Pour les autres compilateurs C, consultez leur page de manuel, ou vérifiez les drapeaux qu'[[10-commandes/apxs|apxs]] utilise pour compiler les fichiers objets.

Pour plus de détails à propos du support DSO dans Apache, lire la documentation du module [[12-modules/mod_so|mod_so]], ou même, consultez le fichier source `src/modules/standard/mod_so.c`.

## Syntaxe

`apxs -g [ -S nom=valeur ] -n nom-module`

`apxs -q [ -v ] [ -S nom=valeur ] requête ...`

`apxs -c [ -S nom=valeur ] [ -o fichier-dso ] [ -I répertoire-inc ] [ -D nom=valeur ] [ -L répertoire-lib ] [ -l nom-bibliothèque ] [ -Wc,options-compilation ] [ -Wl,options-edition-liens ] fichiers ...`

`apxs -i [ -S nom=valeur ] [ -n nom-module ] [ -a ] [ -A ] fichier-dso ...`

`apxs -e [ -S nom=valeur ] [ -n nom-module ] [ -a ] [ -A ] fichier-dso ...`

## Options

### Options courantes

**`-n nom-module`**

Définit explicitement le nom du module pour les options `-i` (install) et `-g` (génération de modèles). Utilisez cette option pour spécifier de manière explicite le nom du module. Pour l'option `-g`, cette option est nécessaire ; pour l'option `-i`, l'utilitaire [[10-commandes/apxs|apxs]] tente de déterminer le nom du module à partir des sources, ou (à défaut) en le déduisant du nom de fichier.

### Options de requête

**`-q`**

Effectue une requête à propos des variables et de l'environnement utilisés pour compiler `httpd`. Lorsqu'elle est invoquée sans paramètre *requête*, cette option affiche toutes les variables connues, ainsi que leurs valeurs. Le paramètre optionnel `-v` formate la liste affichée.

Utilisez cette option pour déterminer manuellement les options utilisées pour compiler le binaire `httpd` qui chargera votre module. Ajoutez par exemple

```bash
INC=-I`apxs -q INCLUDEDIR`
```

dans vos propres Makefiles si vous devez accéder manuellement aux fichiers d'en-têtes C d'Apache.

### Options de configuration

**`-S nom=valeur`**

Cette option permet de modifier la configuration d'apxs décrite ci-dessus.

### Option de génération des modèles

**`-g`**

Cette option permet de générer un sous-répertoire *nom* (voir option `-n`) contenant deux fichiers : le premier fichier est un exemple de fichier source de module nommé `mod_nom.c` que l'on peut utiliser comme modèle pour créer ses propres modules, ou comme point de départ pour se familiariser avec le mécanisme apxs ; le second fichier est le `Makefile` correspondant facilitant la compilation et l'installation de ce module.

### Options de compilation DSO

**`-c`**

Cette option indique une opération de compilation. Tout d'abord, les fichiers sources (.c) spécifiés par *fichiers* sont compilés en fichiers objets correspondants (.o), puis un objet dynamiquement partagé *fichier-dso* est compilé via une édition de liens de ces fichiers objets avec les autres fichiers objets (.o and .a) spécifiés par *fichiers*. Si l'option `-o` n'est pas spécifiée, le nom du fichier résultant est déduit du premier nom de fichier spécifié par *fichiers*, et ainsi prend en général pour valeur par défaut `mod_nom.so`.

**`-o fichier-dso`**

Spécifie de manière explicite le nom de fichier de l'objet partagé dynamiquement créé. Sans cette option, et si le nom ne peut pas être déduit de la liste *fichiers*, c'est le nom par défaut `mod_unknown.so` qui sera utilisé.

**`-D nom=valeur`**

Cette option est transmise directement à la commande de compilation. Vous pouvez l'utiliser pour ajouter vos propres définitions au processus de compilation.

**`-I répertoire-inc`**

Cette option est transmise directement à la commande de compilation. Vous pouvez l'utiliser pour ajouter vos propres chemins de recherche des répertoires `include` au processus de compilation.

**`-L répertoire-lib`**

Cette option est transmise directement à la commande d'édition de liens. Vous pouvez l'utiliser pour ajouter vos propres chemins de recherche des répertoires de bibliothèques au processus de compilation.

**`-l nom-bibliothèque`**

Cette option est transmise directement à la commande d'édition de liens. Vous pouvez l'utiliser pour ajouter vos propres bibliothèques à rechercher au processus de compilation.

**`-Wc,options-compilation`**

Cette option transmet les *options-compilation* en tant qu'options supplémentaires à la commande `libtool --mode=compile`. Vous pouvez l'utiliser pour ajouter des options locales spécifiques au compilateur.

**`-Wl,options-edition-liens`**

Cette option transmet les *options-edition-liens* en tant qu'options supplémentaires à la commande `libtool --mode=link`. Vous pouvez l'utiliser pour ajouter des options locales spécifiques à l'éditeur de liens.

**`-p`**

Avec cette option, apxs effectue l'édition de liens avec les bibliothèques apr/apr-util. Elle permet de compiler les programmes helper qui utilisent les bibliothèques apr/apr-util.

### Options d'installation et de configuration DSO

**`-i`**

Cette option indique une opération d'installation et installe un ou plusieurs objets dynamiquement partagés dans le répertoire *modules* du serveur.

**`-a`**

Cette option active le module en ajoutant automatiquement une directive [[13-directives/loadmodule|LoadModule]] correspondante au fichier de configuration d'Apache `httpd.conf`, ou en l'activant s'il existe déjà.

**`-A`**

Identique à l'option `-a`, à la différence que la directive [[13-directives/loadmodule|LoadModule]] créée est préfixée par un caractère dièse (`#`) ; le module est ainsi préparé pour une activation ultérieure, mais est désactivé dans un premier temps.

**`-e`**

Cette option indique une opération d'édition de liens et peut être utilisée avec les options `-a` et `-A` de la même manière qu'au cours de l'opération d'installation pour éditer le fichier de configuration d'Apache `httpd.conf`, sans toutefois installer le module.

## Exemples

Supposons que vous disposiez d'un module Apache nommé `mod_foo.c` et destiné à étendre les fonctionnalités du serveur. Pour ce faire, vous devez tout d'abord compiler le fichier source C en un objet partagé pouvant être chargé dans le serveur Apache à l'exécution, via la commande suivante :

```bash
$ apxs -c mod_foo.c
/path/to/libtool --mode=compile gcc ... -c mod_foo.c
/path/to/libtool --mode=link gcc ... -o mod_foo.la mod_foo.slo
$ _
```

Vous devez ensuite vérifier la configuration d'Apache en vous assurant qu'une directive [[13-directives/loadmodule|LoadModule]] est bien présente pour charger cet objet partagé. Pour simplifier cette étape, [[10-commandes/apxs|apxs]] propose une méthode automatique d'installation de l'objet partagé dans son répertoire "modules", et de mise à jour du fichier `httpd.conf` en conséquence. Pour bénéficier de cette automatisation, utilisez la commande suivante :

```bash
$ apxs -i -a mod_foo.la
/path/to/instdso.sh mod_foo.la /path/to/apache/modules
/path/to/libtool --mode=install cp mod_foo.la /path/to/apache/modules
...
chmod 755 /path/to/apache/modules/mod_foo.so
[activating module `foo' in /path/to/apache/conf/httpd.conf]
$ _
```

Une ligne contenant

```apache
LoadModule foo_module modules/mod_foo.so
```

est alors ajoutée au fichier de configuration si ce n'est pas déjà fait. Si vous voulez que le module soit désactivé par défaut, utilisez l'option `-A` comme suit :

```bash
$ apxs -i -A mod_foo.c
```

Pour un test rapide du mécanisme apxs, vous pouvez créer un exemple de modèle de module Apache, ainsi que le Makefile correspondant via :

```bash
$ apxs -g -n foo
Creating [DIR]  foo
Creating [FILE] foo/Makefile
Creating [FILE] foo/modules.mk
Creating [FILE] foo/mod_foo.c
Creating [FILE] foo/.deps
$ _
```

Vous pouvez ensuite compiler immédiatement ce module exemple en objet partagé et le charger dans le serveur Apache :

```bash
$ cd foo
$ make all reload
apxs -c mod_foo.c
/path/to/libtool --mode=compile gcc ... -c mod_foo.c
/path/to/libtool --mode=link gcc ... -o mod_foo.la mod_foo.slo
apxs -i -a -n "foo" mod_foo.la
/path/to/instdso.sh mod_foo.la /path/to/apache/modules
/path/to/libtool --mode=install cp mod_foo.la /path/to/apache/modules
...
chmod 755 /path/to/apache/modules/mod_foo.so
[activating module `foo' in /path/to/apache/conf/httpd.conf]
apachectl restart
/path/to/apache/sbin/apachectl restart: httpd not running, trying to start
[Tue Mar 31 11:27:55 1998] [debug] mod_so.c(303): loaded module foo_module
/path/to/apache/sbin/apachectl restart: httpd started
$ _
```

## Voir aussi

- [[10-commandes/apachectl|apachectl]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
