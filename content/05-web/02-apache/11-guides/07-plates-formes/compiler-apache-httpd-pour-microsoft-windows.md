---
title: "Compiler Apache httpd pour Microsoft Windows"
description: "Apache HTTP Server — Compiler Apache httpd pour Microsoft Windows. Il y a de nombreux points importants à connaître avant de compiler Le serveur HTTP Apache pour Microsoft Windows. Avant de commencer, lisez le document Utiliser le serveur HTTP Apache avec Microsoft Windows. httpd peut être compilé sous Win"
tags: [apache, guide]
icon: book-open
---

Il y a de nombreux points importants à connaître avant de compiler Le serveur HTTP Apache pour Microsoft Windows. Avant de commencer, lisez le document [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|Utiliser le serveur HTTP Apache avec Microsoft Windows]].

httpd peut être compilé sous Windows en utilisant une chaîne de compilation basée sur cmake, ou à partir de fichiers projet Visual Studio maintenus par les développeurs de httpd. La chaîne de compilation basée sur cmake supporte directement davantage de versions de Visual Studio, mais possède actuellement des fonctionnalités très limitées.

## Prérequis

Pour compiler Apache, l'environnement doit satisfaire aux conditions suivantes :

- Espace disque

  Assurez-vous de disposer d'un minimum de 200 Mo d'espace disque disponible. Après l'installation, Apache occupe environ 80 Mo d'espace disque, plus l'espace réservé aux journaux et au cache, la taille de ces derniers pouvant augmenter rapidement. Les besoins réels en espace disque dépendent étroitement de la configuration choisie et des bibliothèques ou modules tiers installés, en particulier lorsqu'OpenSSL est mis en oeuvre. Comme de nombreux fichiers sont au format texte et donc facilement compressibles, l'utilisation de la compression du système de fichiers NTFS divise ces besoins par deux.
- Correctifs requis

  Le binaire httpd est compilé à l'aide de nombreux correctifs appliqués aux paquets tiers, ce qui permet de s'assurer que le code fourni est bien compilable et déboguable. Ces correctifs sont disponibles à [http://www.apache.org/dist/httpd/binaries/win32/patches\_applied/](http://www.apache.org/dist/httpd/binaries/win32/patches_applied/), et il est recommandé de les appliquer afin d'obtenir un résultat identique aux binaires "officiels" distribués par l'ASF.
- Microsoft Visual C++ 6.0 (Visual Studio 97) ou supérieur.

  Apache peut être compilé en utilisant l'outil ligne de commande, ou depuis l'espace de travail IDE Visual Studio. Pour la compilation depuis la ligne de commandes, l'environnement doit comporter les variables the `PATH`, `INCLUDE`, `LIB`, ainsi que d'autres variables qui peuvent être définies via le script `vcvars32.bat` :

  > [!NOTE]
  > Vous pouvez vous procurer le paquet du Processeur Visual Studio pour votre ancienne version de Visual Studio, ou une version complète (et non Express) d'une édition plus récente de Visual Studio pour l'assembleur ml.exe. Ceci vous permettra, si vous le souhaitez, de compiler OpenSSL en utilisant une implémentation du code d'assemblage plus efficace.

  > [!NOTE]
  > Seule la chaîne d'outils de compilation de Microsoft est supportée de manière suivie par les contributeurs actifs à httpd. Bien que le projet accepte régulièrement des correctifs pour s'assurer que MinGW et d'autre outils de compilation fonctionnent, ou même pour les améliorer, ils ne sont pas maintenus de manière suivie et sont même souvent hors d'état de fonctionner à certains stades du développement normal.
- Le SDK de la plate-forme Windows mis à jour, février 2003 ou plus récent.

  Un SDK approprié pour la plate-forme Windows est inclus par défaut dans les versions complètes (et non Express/lite) de Visual C++ 7.1 (Visual Studio 2002) et supérieures ; les utilisateurs peuvent ignorer ces étapes, à moins qu'ils aient choisi d'utiliser une version plus récente ou différente du SDK.

  Pour pouvoir utiliser Visual C++ 6.0 or 7.0 (Studio 2000 .NET), l'environnement du SDK de la plate-forme doit être préparé en utilisant le script `setenv.bat` (installé par le SDK de la plate-forme) avant de lancer la compilation en ligne de commande ou l'interface GUI msdev/devenv. L'installation du SDK de la plate-forme pour les versions Express de Visual Studio (2003 et supérieures) devrait ajuster l'environnement par défaut de manière appropriée.

  ```
  "c:\Program Files\Microsoft Visual Studio\VC98\Bin\VCVARS32"
      "c:\Program Files\Platform SDK\setenv.bat"
  ```
- Perl et awk

  De nombreuses étapes recommandées ici nécessitent un interpréteur perl durant le processus de préparation de la compilation.

  Pour installer Apache à partir du système de compilation, de nombreux fichiers sont modifiés via l'utilitaire `awk.exe`. awk effectue la modification des fichiers au moment de l'installation ; il a été choisi car il nécessite un téléchargement de petite taille (par rapport à Perl ou WSH/VB). Le site de Brian Kernighan [http://www.cs.princeton.edu/~bwk/btl.mirror/](http://www.cs.princeton.edu/~bwk/btl.mirror/) propose un binaire précompilé pour Win32, [http://www.cs.princeton.edu/~bwk/btl.mirror/awk95.exe](http://www.cs.princeton.edu/~bwk/btl.mirror/awk95.exe), que vous devez enregistrer sous le nom `awk.exe` (plutôt que `awk95.exe`).

  > [!NOTE]
  > Si awk.exe n'est pas trouvé, la cible install du fichier Makefile.win n'effectuera aucune substitution dans les fichiers .conf installés. Vous devez modifier manuellement les fichiers .conf installés afin de permettre au serveur de démarrer. Recherchez et remplacez toutes les balises "@token@" par une valeur appropriée.

  > [!NOTE]
  > L'IDE Visual Studio ne trouvera le chemin de `awk.exe` que dans la variable PATH, ou dans le chemin des exécutables spécifié par l'option de menu Tools -\> Options -\> (Projects -\>) Directories. Assurez-vous qu'awk.exe est bien dans votre chemin système.

  > [!NOTE]
  > Notez aussi, si vous utilisez les outils Cygwin ([http://www.cygwin.com/](http://www.cygwin.com/)), que l'utilitaire awk de nomme `gawk.exe` et que le fichier `awk.exe` est en fait un lien symbolique vers le fichier `gawk.exe`. Le shell de commandes Windows ne reconnaît pas les liens symboliques, et par conséquent la compilation d'InstallBin échouera. Pour contourner le problème, vous pouvez supprimer le lien `awk.exe` de l'installation de Cygwin, et copier `gawk.exe` vers `awk.exe`. Notez aussi que les portages cygwin/mingw de gawk 3.0.x étaient bogués ; veuillez par conséquent effectuer une mise à jour vers la version 3.1.x avant l'utilisation de tout portage de gawk.
- \[Optionnel\] bibliothèque zlib (pour le module [[12-modules/mod_deflate|mod_deflate]])

  Zlib doit être installée dans un sous-répertoire du répertoire `srclib` et nommé `zlib`. Elle doit être compilée directement à cette place. Zlib est disponible à l'adresse [http://www.zlib.net/](http://www.zlib.net/) -- le fonctionnement correct du module [[12-modules/mod_deflate|mod_deflate]] a été vérifié avec la version 1.2.3.

  ```
  nmake -f win32\Makefile.msc
  nmake -f win32\Makefile.msc test
  ```
- \[Optionnel\] Bibliothèques OpenSSL (pour le module [[12-modules/mod_ssl|mod_ssl]] et `ab.exe` avec le support ssl)

  > [!NOTE]
  > La bibliothèque OpenSSL est un logiciel de chiffrement. Le pays dans lequel vous résidez peut imposer des restrictions à l'importation, la possession, l'utilisation, et/ou la réexportation vers un autre pays des logiciels de chiffrement. AVANT d'utiliser tout logiciel de chiffrement, veuillez consulter la législation de votre pays, les règles et politiques d'importation, de possession, ou d'utilisation, et de réexportation des logiciels de chiffrement, afin de déterminer si vous en avez le droit. Voir [http://www.wassenaar.org/](http://www.wassenaar.org/) pour plus de détails.

  La configuration et la compilation d'OpenSSL nécessite l'installation de perl.

  Pour pouvoir compiler [[12-modules/mod_ssl|mod_ssl]] ou le projet `abs.exe`, qui devient ab.c avec le support SSL activé, vous devez télécharger OpenSSL à l'adresse [http://www.openssl.org/source/](http://www.openssl.org/source/), et l'installer dans un sous-répertoire du répertoire `srclib` que vous nommerez `openssl`. Afin de préparer OpenSSL à la liaison avec le module Apache mod\_ssl ou abs.exe, et désactiver les fonctionnalités d'Openssl grévées de brevets, vous pouvez utiliser la commande de compilation suivante :

  ```
  perl Configure no-rc5 no-idea enable-mdc2 enable-zlib VC-WIN32
       -Ipath/to/srclib/zlib -Lpath/to/srclib/zlib
  ms\do_masm.bat
  nmake -f ms\ntdll.mak
  ```

  > [!NOTE]
  > Il est déconseillé d'utiliser zlib-dynamic, car la charge de la décompression des flux SSL est alors transférée à la première requête qui doit charger la dll zlib. Notez que le correctif proposé active le drapeau -L afin de pouvoir fonctionner avec les compilations Windows, corrige le nom de zdll.lib et s'assure que les fichiers .pdb sont générés afin de pouvoir résoudre les problèmes. Si l'assembleur n'est pas installé, vous devez ajouter no-asm ci-dessus et utiliser le script ms\\do\_ms.bat à la place de ms\\do\_masm.bat.
- \[Optionnel\] Bibliothèques de bases de données (pour [[12-modules/mod_dbd|mod_dbd]] et [[12-modules/mod_authn_dbm|mod_authn_dbm]])

  La bibliothèque apr-util fournit un accès aux fonctionnalités clients dbm (base de données à base de clés) et dbd (base de données à base de requêtes) au serveur httpd et à certains de ses modules, comme les modules d'authentification et d'autorisation. Les fournisseurs sdbm dbm et odbc dbd sont compilés automatiquement.

  Le support dbd inclut le paquet instantclient Oracle, MySQL, PostgreSQL et sqlite. Par exemple, pour les compiler tous, définissez LIB de façon à inclure le chemin des bibliothèques, INCLUDE de façon à inclure le chemin des en-têtes, et PATH de façon à inclure le chemin des dll et bin de chacun des quatre SDK, et définissez la variable d'environnement DBD\_LIST de façon à indiquer au processus de compilation quels SDKs pilotes clients du sont correctement installés ; par exemple :

  ```
  set DBD_LIST=sqlite3 pgsql oracle mysql
  ```

  De manière similaire, le support dbm peut être étendu avec DBM\_LIST pour compiler un fournisseur Berkeley DB (db) et/ou un fournisseur gdbm, en configurant tout d'abord de la même manière LIB, INCLUDE et PATH afin de s'assurer que les bibliothèques et en-têtes de la bibliothèque client sont bien disponibles.

  ```
  set DBM_LIST=db gdbm
  ```

  > [!NOTE]
  > En fonction du choix des distributions de bases de données, il peut s'avérer nécessaire de modifier le nom des cibles de l'édition de liens (par exemple gdbm.lib à la place de libgdb.lib) listées dans les fichiers .dsp/.mak des répertoires srclib\\apr-util\\dbd ou ...\\dbm correspondants.

  Voir le fichier README-win32.txt pour plus d'informations à propos de l'obtention des différents SDKs pilotes de bases de données.

## Compilation à partir des sources Unix

Le projet du serveur HTTP Apache à pour politique de ne fournir que des sources de type Unix. Les paquets source de type Windows disponibles en téléchargement ont été élaborés par des contributeurs, et ne seront pas forcément reconduits pour toutes les versions. Vous pouvez cependant compiler le serveur sous Windows à partir des sources Unix en ajoutant quelques étapes supplémentaires.

1. Téléchargez et ouvrez le tarball source Unix de la dernière version du serveur HTTP Apache.
2. Téléchargez et ouvrez le tarball source Unix de la dernière version de APR, APR-Util et APR-Iconv, et copier l'arborescence obtenue dans httpd-2.x.x\\srclib\\apr, httpd-2.x.x\\srclib\\apr-util et httpd-2.x.x\\srclib\\apr-iconv
3. Ouvrez la console et placez-vous au niveau du répertoire httpd-2.x.x
4. Exécutez l'utilitaire de conversion de fins de ligne

```
perl srclib\apr\build\lineends.pl
```

Vous pouvez maintenant compiler le serveur via l'environnement de développement Visual Studio en utilisant l'IDE. Les compilations du serveur en ligne de commande ne sont possibles avec des sources de type Unix que si vous exportez les fichiers .mak comme indiqué ci-dessous.

## Compilation à partir de la ligne de commandes

`Makefile.win` est le makefile principal ou racine d'Apache. Pour compiler Apache sous Windows, utilisez simplement une des commandes suivantes pour compiler la version `release` ou `debug` :

```
nmake /f Makefile.win _apacher
nmake /f Makefile.win _apached
```

Ces deux commandes effectuent la compilation d'Apache. Cependant, avec la deuxième, les fichiers résultants ne seront pas optimisés, ce qui va faciliter l'examen pas à pas du code pour trouver des bogues et résoudre les problèmes.

Vous pouvez indiquer vos choix en matière de fournisseurs dbd et dbm à l'aide des variables (d'environnement) additionnelles de make DBD\_LIST et DBM\_LIST ; voir les commentaires à propos des \[Optionnel\] Bibliothèques de bases de données ci-dessus. Consultez les commentaires initiaux dans Makefile.win pour plus d'options pouvant être fournies lors de la compilation.

## Compilation depuis l'espace de travail IDE de Developer Studio

Apache peut aussi être compilé depuis l'environnement de développement Visual Studio de VC++. Pour simplifier ce processus, l'espace de travail Visual Studio `Apache.dsw` est fourni. Cet espace de travail expose la liste complète des projets `.dsp` actifs nécessaires à l'installation binaire complète d'Apache. Il inclut les dépendances entre projets afin que ces derniers soient compilés selon l'ordre approprié.

Ouvrez l'espace de travail `Apache.dsw`, et sélectionnez `InstallBin` (compilation `Release` ou `Debug`, selon vos souhaits) comme Active Project. `InstallBin` provoque la compilation de tous les projets concernés, puis invoque `Makefile.win` pour installer les exécutables et dlls compilés. Vous pouvez modifier la valeur de `INSTDIR=` via la configuration de `InstallBin`, onglet Général, entrée ligne de commandes de compilation. La valeur par défaut de `INSTDIR` est le répertoire `/Apache2`. Si vous désirez effectuer un test de compilation (sans installation), sélectionnez le projet `BuildBin`.

Les fichiers projets `.dsp` sont distribués au format Visual Studio 6.0 (98). Visual C++ 5.0 (97) les reconnaît. Les utilisateurs de Visual Studio 2002 (.NET) et versions supérieures doivent convertir `Apache.dsw` et les fichiers `.dsp` en un projet `Apache.sln`, ainsi que les fichiers `.msproj` ; assurez-vous de reconvertir le fichier `.msproj` si l'un des fichiers source `.dsp` est modifié ! Cette opération est vraiment très simple, il suffit de réouvrir `Apache.dsw` dans l'IDE VC++ 7.0 et de le reconvertir.

> [!NOTE]
> Il y a une erreur dans la conversion .vcproj des fichiers .dsp. devenv.exe interprète mal le drapeau /D pour les drapeaux RC contenant de grandes /D'éfinitions entourées de guillemets, et contenant elles-mêmes des espaces. Ainsi, la commande :
>
> ```
> perl srclib\apr\build\cvtdsp.pl -2005
> ```
>
> va convertir les drapeaux /D pour les drapeaux RC afin d'utiliser une syntaxe alternative, interprétable ; malheureusement, cette syntaxe n'est pas supportée par Visual Studio 97 ou ses fichiers .mak exportés. Ces drapeaux /D permettent de transmettre la longue description des fichiers de mod\_apachemodule.so à leurs compilations d'identificateur de version de ressource .rc partagée.

> [!NOTE]
> **Compilation avec OpenSSL versions 1.1.0 et supérieures** Suite à une modification de la structure de compilation d'OpenSSL à partir de la version 1.1.0, vous devez convertir les fichiers dsp concernés via la commance cvtdsp.pl fournie par APR versions 1.6 et supérieures :
>
> ```
> perl srclib\apr\build\cvtdsp.pl -ossl11
> ```

Les utilisateurs de Visual Studio 2002 (.NET) et versions supérieures doivent aussi utiliser la boîte de dialogue Configuration Manager du menu Build pour décocher les deux versions `Debug` et `Release` des modules [[12-modules/mod_ssl|mod_ssl]] et [[12-modules/mod_deflate|mod_deflate]] pour `abs`. Ces modules sont compilés en invoquant `nmake` ou directement l'IDE avec la cible `BinBuild` pour compiler ces modules de manière conditionnelle si les sous-répertoires de `srclib` `openssl` et/ou `zlib` existent, et en fonction des définitions des variables d'environnement `DBD_LIST` et `DBM_LIST`.

## Export des fichiers .mak de la ligne de commandes

Les fichiers `.mak` exportés posent plus de problèmes, mais les utilisateurs de Visual C++ 5.0 en ont besoin pour compiler [[12-modules/mod_ssl|mod_ssl]], abs ([[10-commandes/ab|ab]] avec support SSL) et/ou [[12-modules/mod_deflate|mod_deflate]]. Les fichiers .mak supportent aussi un choix plus large de distributions de chaînes d'outils C++, comme Visual Studio Express.

Vous devez tout d'abord compiler tous les projets afin de créer toutes les cibles dynamiques auto-générées, de façon à ce que les dépendances puissent être interprétées correctement. Compilez l'ensemble du projet depuis l'IDE Visual Studio 6.0 (98), en utilisant la cible `BuildAll`, puis utilisez le menu de projet Export pour tous les makefiles (en cochant "with dependencies"). Utilisez la commande suivante pour transformer les chemins absolus en chemins relatifs de façon à ce que la compilation puisse s'effectuer depuis n'importe quelle position dans l'arborescence :

```
perl srclib\apr\build\fixwin32mak.pl
```

Vous devez exécuter cette commande depuis la *racine* de l'arborescence des sources de httpd. Tout fichier projet `.mak` et `.dep` du répertoire courant et de ses sous-répertoires sera corrigé, et les repères de temps ajustés en fonction des `.dsp`.

Vérifiez toujours le SDK de la plate-forme ou autres chemins fichiers locaux, spécifiques à la machine dans les fichiers `.mak` et `.dep` générés. Le répertoire `DevStudio\Common\MSDev98\bin\` (VC6) contient un fichier `sysincl.dat` qui énumère toutes les exceptions. Mettez à jour ce fichier (en particulier les chemins avec slashes et anti-slashes, tels que `sys/time.h` et `sys\time.h`) de façon à ignorer ces nouvelles dépendances. Inclure les chemins d'installation locale dans un fichier `.mak` distribué fera échouer la compilation.

Si vous soumettez un patch qui modifie les fichiers projet, nous devons valider la modification de ces fichiers projet au format Visual Studio 6.0. Les modifications doivent êtres simples, avec un minimum de drapeaux de compilation et d'édition de liens qui pourront être reconnus par tous les environnements Visual Studio.

## Installation

Une fois compilé, Apache doit être installé dans le répertoire racine du serveur. La valeur par défaut est le répertoire `\Apache2`, sur le même disque.

Pour compiler et installer automatiquement tous les fichiers dans le répertoire *rep* désiré, utilisez une des commandes `nmake` suivantes :

```
nmake /f Makefile.win installr INSTDIR=dir
nmake /f Makefile.win installd INSTDIR=dir
```

L'argument *rep* de `INSTDIR` permet de spécifier le répertoire d'installation ; il peut être omis si Apache doit être installé dans `\Apache22` (du lecteur de disque courant.

## Avertissement à propos de la compilation d'Apache à partir de l'arborescence de développement

> [!NOTE]
> Notez que seuls les fichiers `.dsp` sont maintenus d'une distribution `release` à l'autre. Les fichiers `.mak` ne sont PAS régénérés, suite à l'énorme perte de temps des relecteurs . Vous ne pouvez donc pas utiliser les commandes `NMAKE` ci-dessus pour compiler des fichiers de projet `.dsp` révisés si vous n'exporter pas ensuite vous-même tous les fichiers `.mak` du projet. Ceci n'est pas nécessaire si vous effectuez la compilation depuis l'environnement Microsoft Developer Studio.

## Compilation de httpd avec cmake

La documentation principale pour ce mécanisme de compilation se trouve dans le fichier `README.cmake` situé dans l'arborescence des sources. Consultez ce fichier pour des instructions détaillées.

Pour compiler httpd avec cmake, vous devez compiler APR et APR-util séparément. Consultez les fichiers `README.cmake` de ces projets pour obtenir des instructions.

Les principales limitations de la compilation basée sur cmake sont héritées du projet APR-util et sont énumérées ci-dessous à cause de leur impact sur httpd :

- Il n'est pas possible de compiler le projet APR-iconv avec cmake, et la compilation de APR-util ne peut pas utiliser de projet APR-iconv précompilé. A cause de cela, il n'est pas possible d'utiliser [[12-modules/mod_charset_lite|mod_charset_lite]] et probablement d'autres modules tiers.
- La compilation du sous-projet APR-util avec cmake ne supporte pas la plupart des bibliothèques optionnelles DBM et DBD utilisées par les fichiers projet Visual Studio inclus. Cela limite les serveurs de bases de données d'arrière-plan supportés par de nombreux modules tiers ou inclus.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
