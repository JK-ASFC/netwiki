---
title: "Utilisation d'Apache avec Novell NetWare"
description: "Apache HTTP Server — Utilisation d'Apache avec Novell NetWare. WARNING Novell NetWare est en fin de vie et n’est plus pris en charge. Ce document est conservé à titre de référence historique seulement. Les liens vers des ressources de Novell initialement référencées dans ce document ne sont plus foncti"
tags: [apache, guide]
icon: book-open
---

> [!WARNING]
> Novell NetWare est en fin de vie et n’est plus pris en charge. Ce document est conservé à titre de référence historique seulement. Les liens vers des ressources de Novell initialement référencées dans ce document ne sont plus fonctionnels.

Ce document explique l'installation, la configuration et le lancement d'Apache 2.0 sous Novell NetWare 6.0 et les versions ultérieures. Si vous trouvez une bogue, ou voulez tout simplement contribuer de quelque manière que ce soit, utilisez s'il vous plait notre [page des rapports de bogues.](http://httpd.apache.org/bug_report.html)

La page des rapports de bogues et la liste de diffusion dev-httpd ne doivent pas être utilisées pour poser des questions à propos de la configuration ou du lancement d'Apache. Avant de soumettre un rapport de bogue ou une question, consultez ce document, la [FAQ](https://cwiki.apache.org/confluence/display/httpd/FAQ) ou tout autre sujet de la documentation en rapport avec votre problème. Si vous n'avez toujours pas résolu votre problème, postez votre question dans le newsgroup novell.devsup.webserver (par le passé à `news://developer-forums.novell.com/novell.devsup.webserver`), où de nombreux utilisateurs d'Apache sont prêts à répondre à toutes les nouvelles et obscures questions à propos de l'utilisation d'Apache sous Netware.

Dans la majeure partie de ce document, vous êtes sensé avoir installé Apache à partir d'une distribution binaire. Si vous voulez compiler Apache vous-même (par exemple pour aider au développement, ou pour rechercher des bogues), reportez-vous à la section traitant de la Compilation d'Apache pour Netware ci-dessous.

## Prérequis

Apache 2.0 nécessite NetWare 6.0 service pack 3 et supérieurs pour fonctionner. Si vous utilisez un service pack antérieur à SP3, vous devez installer les dernières bibliothèques Netware pour C (LibC) (par le passé à `http://developer.novell.com/ndk/libc.htm`).

Vous pouviez trouver les services packs Netware à cette adresse : `http://support.novell.com/misc/patlst.htm#nw`.

Apache 2.0 pour NetWare peut aussi fonctionner dans un environnement NetWare 5.1, à partir du moment où le dernier service pack ou la dernière version des bibliothèques Netware pour C (LibC) (anciennement à `http://developer.novell.com/ndk/libc.htm`) ont été installés. **ATTENTION :** Apache 2.0 pour NetWare n'a pas été testé dans cet environnement car il n'a pas été conçu pour ce dernier.

## Téléchargement d'Apache pour NetWare

Les informations à propos de la dernière version d'Apache sont disponibles sur le site web d'Apache à [http://www.apache.org/](http://www.apache.org/). Vous y trouverez la version courante, des versions alpha ou bêta-test plus récentes, ainsi que des sites miroirs et des sites FTP anonymes. Les distributions binaires des dernières versions d'Apache 2.0 pour NetWare sont disponibles [ici](http://www.apache.org/dist/httpd/binaries/netware).

## Installation d'Apache pour NetWare

Il n'existe pas actuellement de programme d'installation d'Apache pour Netware. Si vous installez Apache 2.0 pour NetWare à partir des sources, vous devrez copier les fichiers sur le serveur manuellement.

Suivez ces instructions pour installer Apache sous Netware à partir de la distribution binaire (en supposant que vous effectuez l'installation dans `sys:/apache2`) :

- Décompressez le fichier binaire téléchargé à la racine du volume `SYS:` (vous pouvez cependant l'installer dans tout volume)
- Editez le fichier `httpd.conf` et définissez les directives [[13-directives/serverroot|ServerRoot]] et [[13-directives/servername|ServerName]] avec les valeurs correctes des chemins de fichiers qui correspondent à la configuration de votre serveur.
- Ajoutez `SYS:/APACHE2` au chemin de recherche, par une commande du style :

  ```
  SEARCH ADD
        SYS:\APACHE2
  ```

Suivez ces instructions pour installer Apache pour Netware manuellement à partir de votre propre répertoire de sources (en supposant que vous effectuez l'installation dans `sys:/apache2`) :

- Créez un répertoire que vous appellerez `Apache2` dans un volume Netware.
- Copiez `APACHE2.NLM`, `APRLIB.NLM` dans `SYS:/APACHE2`.
- Créez un répertoire que vous appellerez `BIN` dans `SYS:/APACHE2`.
- Copiez `HTDIGEST.NLM`, `HTPASSWD.NLM`, `HTDBM.NLM`, `LOGRES.NLM`, `ROTLOGS.NLM` dans `SYS:/APACHE2/BIN`.
- Créez un répertoire que vous appellerez `CONF` dans `SYS:/APACHE2`.
- Copiez le fichier `HTTPD-STD.CONF` dans le répertoire `SYS:/APACHE2/CONF` et renommez-le en `HTTPD.CONF`.
- Copiez les fichiers `MIME.TYPES`, `CHARSET.CONV` et `MAGIC` dans le répertoire `SYS:/APACHE2/CONF`.
- Copiez tous les fichiers et sous-répertoires de `\HTTPD-2.0\DOCS\ICONS` dans `SYS:/APACHE2/ICONS`.
- Copiez tous les fichiers et sous-répertoires de `\HTTPD-2.0\DOCS\MANUAL` dans `SYS:/APACHE2/MANUAL`.
- Copiez tous les fichiers et sous-répertoires de `\HTTPD-2.0\DOCS\ERROR` dans `SYS:/APACHE2/ERROR`.
- Copiez tous les fichiers et sous-répertoires de `\HTTPD-2.0\DOCS\DOCROOT` dans `SYS:/APACHE2/HTDOCS`.
- Créez le répertoire `SYS:/APACHE2/LOGS` sur le serveur.
- Créez le répertoire `SYS:/APACHE2/CGI-BIN` sur le serveur.
- Créez le répertoire `SYS:/APACHE2/MODULES` et copiez tous les modules nlm dans le répertoire `modules`.
- Editez le fichier `HTTPD.CONF`, et recherchez toutes les marques `@@Value@@` afin de les remplacer par les valeurs appropriées.
- Ajoutez `SYS:/APACHE2` au chemin de recherche, par une commande du style :

  ```
  SEARCH ADD
        SYS:\APACHE2
  ```

  .

Outre le volume par défaut `SYS`, Apache peut être installé dans tout autre volume.

Au cours du processus d'installation, l'ajout du mot-clé "install" à la ligne de commande du makefile va provoquer la construction d'une distribution complète sous forme d'un paquetage dans le sous-répertoire `DIST`. Vous pouvez simplement installer Apache en copiant la distribution créée précédemment à la racine d'un volume Netware (voir Compilation d'Apache pour NetWare ci-dessous).

## Exécuter Apache pour NetWare

Pour démarrer Apache, tapez simplement `apache` dans la console. Ceci aura pour effet de charger Apache dans l'espace d'adressage du système d'exploitation. Si vous préférez charger Apache dans un espace d'adressage protégé, vous pouvez spécifier cet espace d'adressage à l'aide de l'instruction de chargement suivante :

```
load address space = apache2 apache2
```

Cette instruction va charger Apache dans un espace d'adressage appelé apache2. Il est possible d'exécuter plusieurs instances simultanées d'Apache sous Netware, en chargeant chacune d'entre elles dans son propre espace d'adressage protégé.

Une fois démarré, Apache écoute le port 80 (à moins que vous n'ayez modifié la directive [[13-directives/listen|Listen]] dans les fichiers de configuration). Pour vous connecter au serveur et afficher la page par défaut, lancez un navigateur et entrez le nom du serveur ou son adresse IP. Vous devriez voir une page de bienvenue, et un lien vers le manuel Apache. Si rien ne se produit, ou si vous obtenez un message d'erreur, consultez le fichier `error_log` dans le répertoire `logs`.

Lorsque votre installation de base fonctionne, vous devez la configurer correctement en éditant les fichiers du répertoire `conf`.

Pour arrêter une instance d'Apache s'exécutant dans l'espace d'adressage du système d'exploitation, entrez simplement dans la console :

```
unload apache2
```

ou

```
apache2 shutdown
```

Si Apache s'exécute dans un espace d'adressage protégé, spécifiez cet espace d'adressage dans l'instruction d'arrêt :

```
unload address space = apache2 apache2
```

Lorsqu'on travaille avec Apache, il est important de savoir comment il trouve ses fichiers de configuration. Vous pouvez spécifier un fichier de configuration sur la ligne de commande de deux manières :

- `-f` spécifie un chemin vers un fichier de configuration particulier

```
apache2 -f "vol:/nom-serveur/conf/fich-conf.conf"
```

```
apache -f test/test.conf
```

Dans ces cas, la directive [[13-directives/serverroot|ServerRoot]] doit être correctement définie dans le fichier de configuration.

Si vous ne spécifiez pas de nom de fichier de configuration avec l'option `-f`, Apache utilisera le nom de fichier codé en dur dans le serveur, en général `conf/httpd.conf`. L'invocation d'Apache avec l'option `-V` indiquera ce nom comme valeur de l'étiquette `SERVER_CONFIG_FILE`. Apache va ensuite déterminer son [[13-directives/serverroot|ServerRoot]] en effectuant les tests suivants, dans cet ordre

- Une directive `ServerRoot` via une option `-C` switch.
- L'option de ligne de commande `-d`.
- Le contenu du répertoire courant.
- La racine du répertoire d'installation codée en dur dans le serveur.

La racine du répertoire d'installation codée en dur dans le serveur est en général `sys:/apache2`. L'invocation d'Apache avec l'option `-V` indiquera ce chemin comme valeur de l'étiquette `HTTPD_ROOT`.

Apache 2.0 pour Netware comporte un jeu d'options de ligne de commande permettant d'afficher ou de modifier certaines caractéristiques de l'instance du serveur web en cours d'exécution. Ces options ne sont disponibles que lorsqu'Apache est en cours d'exécution. Chacune de ces options doit être précédée du mot-clé `APACHE2`.

**RESTART**

Demande à Apache d'arrêter tout worker thread en cours d'exécution lorsqu'il devient inactif, de recharger le fichier de configuration, et de redémarrer chaque worker thread en fonction de la nouvelle configuration.

**VERSION**

Affiche des informations à propos de la version de l'instance d'Apache en cours d'exécution.

**MODULES**

Affiche la liste des modules chargés (intégrés et externes).

**DIRECTIVES**

Affiche la liste des directives disponibles.

**SETTINGS**

Active ou désactive l'affichage du statut des threads sur la console. En cas d'activation, l'état de chaque thread en cours d'exécution s'affiche sur l'écran de la console Apache.

**SHUTDOWN**

Arrête l'instance du serveur web Apache en cours d'exécution.

**HELP**

Décrit chacune des options disponibles au cours de l'exécution d'Apache.

Par défaut, ces options sont passées à l'instance d'apache s'exécutant dans l'espace d'adressage du système d'exploitation. Pour passer une option à une instance d'Apache spécifique s'exécutant dans un espace d'adressage protégé, ajouter le paramètre -p suivi du nom de l'espace d'adressage. Pour plus d'informations, tapez "apache2 Help" sur la ligne de commande.

## Configuration d'Apache pour NetWare

Apache lit en général ses fichiers de configuration dans le répertoire `conf`. Ces fichiers sont les mêmes que ceux de la version Unix, mais quelques directives sont différentes sous Netware. Voir la Documentation Apache pour l'ensemble des directives disponibles.

Les principales différences propres à Apache pour NetWare sont :

- Comme Apache pour Netware est une application multithread, elle n'utilise pas de processus séparé pour chaque requête, comme c'est le cas pour certaines implémentations sous Unix. Il n'y a que des threads en cours d'exécution : un thread parent, et plusieurs threads enfants ou worker qui traitent les requêtes.

  En conséquence, les directives de gestion des "processus" sont différentes :

  [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] - comme sous Unix, cette directive contrôle le nombre maximum de connexions qu'un worker thread peut traiter avant de s'arrêter. Avec la valeur par défaut `MaxConnectionsPerChild 0`, le thread va pouvoir traiter un nombre illimité de requêtes. Cette valeur est recommandée sous Netware, à moins que vous n'ayez des raisons particulières de la modifier.

  [[13-directives/startthreads|StartThreads]] - Cette directive indique au serveur le nombre de threads qu'il doit lancer au démarrage. Il est recommandé de conserver la valeur par défaut `StartThreads 50`.

  [[13-directives/minsparethreads|MinSpareThreads]] - Cette directive indique au serveur le nombre de worker threads additionnels qu'il doit lancer si le nombre de threads inactifs tombe en dessous de cette valeur. Il est recommandé de conserver la valeur par défaut `MinSpareThreads 10`.

  [[13-directives/maxsparethreads|MaxSpareThreads]] - Cette directive indique au serveur qu'il doit commencer à arrêter des worker threads si le nombre de threads inactifs passe au dessus de cette valeur. Il est recommandé de conserver la valeur par défaut `MaxSpareThreads 100`.

  [[13-directives/maxthreads|MaxThreads]] - Cette directive impose un nombre maximum de worker threads. Il est recommandé de conserver la valeur par défaut `ThreadsPerChild 250`.

  [[13-directives/threadstacksize|ThreadStackSize]] - Cette directive indique au serveur la taille de la pile à utiliser pour un worker thread individuel. Il est recommandé de conserver la valeur par défaut `ThreadStackSize 65536`.
- Les directives qui acceptent des noms de fichiers comme arguments ne doivent pas utiliser des noms de fichiers Unix, mais des noms de fichiers Netware. Cependant, comme Apache utilise des noms de style Unix en interne, on doit utiliser des slashes et non des antislashes. Il est recommandé de préfixer tous les chemins de fichiers racines par un nom de volume. Si ce dernier est omis, Apache supposera que le volume est `SYS:`, ce qui n'est pas forcément correct.
- Apache pour Netware a la possibilité de charger des modules en cours d'exécution, sans avoir à recompiler le serveur. Si Apache est compilé avec les options par défaut, il va installer de nombreux modules optionnels dans le répertoire `\Apache2\modules`. Pour les activer, ou en activer d'autres, on doit utiliser la directive [[13-directives/loadmodule|LoadModule]]. Par exemple, pour activer le module status, ajoutez la ligne suivante :

  ```
  LoadModule status_module modules/status.nlm
  ```

  Des informations à propos de la [[12-modules/mod_so|création de modules chargeables]] sont aussi disponibles.

### Autres directives spécifiques à Netware :

- [[13-directives/cgimapextension|CGIMapExtension]] - Cette directive associe une extension de fichier CGI à un interpréteur de script.

- [[13-directives/securelisten|SecureListen]] - Cette directive active le chiffrement SSL pour un port spécifique.

- [[13-directives/nwssltrustedcerts|NWSSLTrustedCerts]] - Cette directive permet d'ajouter des certificats de confiance pouvant être utilisés pour créer des connexions sécurisées vers des serveurs mandataires.

- [[13-directives/nwsslupgradeable|NWSSLUpgradeable]] - Cette directive permet de faire passer en SSL une connexion initialisée sur les adresse IP et Port spécifiés.

## Compilation d'Apache pour NetWare

La compilation d'Apache nécessite MetroWerks CodeWarrior 6.x ou supérieur. Une fois compilé, Apache peut être installé à la racine de tout volume Netware. Le répertoire d'installation par défaut est `sys:/Apache2`.

Avant de démarrer Apache, vous devez remplir le répertoire `conf`. Copiez le fichier `HTTPD-STD.CONF` depuis le répertoire `conf` de la distribution et renommez-le en `HTTPD.CONF`. Editez le fichier `HTTPD.CONF` en recherchant les repères `@@Value@@`, et remplacez ces derniers par la valeur appropriée. Copiez de même les fichiers `conf/magic` et `conf/mime.types`. Vous pouvez aussi construire une distribution complète en ajoutant le mot-clé `install` lors de l'invocation des makefiles.

### Prérequis :

Les outils de développement suivants sont nécessaires pour la compilation d'Apache pour Netware :

- Metrowerks CodeWarrior 6.0 ou supérieur avec le NetWare PDK 3.0 (anciennement à `http://developer.novell.com/ndk/cwpdk.htm`) ou supérieur.
- Les bibliothèques Netware pour C (LibC) (anciennement à `http://developer.novell.com/ndk/libc.htm`)
- Les bibliothèques LDAP pour C (anciennement à `http://developer.novell.com/ndk/cldap.htm`)
- Le [Code source de la bibliothèque de compression ZLIB](http://www.gzip.org/zlib/)
- L'utilitaire AWK (awk, gawk ou similaire). AWK peut être téléchargé à `http://developer.novell.com/ndk/apache.htm`. L'utilitaire doit se trouver dans votre chemin windows et avoir pour nom `awk.exe`.
- Pour utiliser les makefiles, vous devez disposer de GNU make version 3.78.1 (GMake) disponible à `http://developer.novell.com/ndk/apache.htm`..

### Compiler Apache en utilisant les makefiles Netware :

- Définissez la variable d'environnement `NOVELLLIBC` avec le chemin des bibliothèques Netware pour C SDK ; par exemple :

  ```
  Set
      NOVELLLIBC=c:\novell\ndk\libc
  ```
- Définissez la variable d'environnement `METROWERKS` avec le chemin de votre compilateur Metrowerks CodeWarrior ; par exemple :

  ```
  Set
      METROWERKS=C:\Program Files\Metrowerks\CodeWarrior
  ```

  . Si vous l'avez installé dans le répertoire par défaut `C:\Program Files\Metrowerks\CodeWarrior`, vous n'avez pas besoin de définir cette variable.
- Définissez la variable d'environnement `LDAPSDK` avec le chemin des bibliothèques LDAP pour C ; par exemple :

  ```
  Set
      LDAPSDK=c:\Novell\NDK\cldapsdk\NetWare\libc
  ```
- Définissez la variable d'environnement `ZLIBSDK` avec le chemin du code source de la bibliothèque Zlib ; par exemple :

  ```
  Set ZLIBSDK=D:\NOVELL\zlib
  ```
- Définissez la variable d'environnement `PCRESDK` avec le chemin d'installation du code source de la bibliothèque PCRE ; par exemple :

  ```
  Set PCRESDK=D:\NOVELL\pcre
  ```
- Définissez la variable d'environnement `AP_WORK` avec le chemin du code source de `httpd`.

  ```
  Set AP_WORK=D:\httpd-2.0.x
  ```
- Définissez la variable d'environnement `APR_WORK` avec le chemin du code source d'`apr` ; en général `\httpd\srclib\apr`, mais le projet APR peut se trouver en dehors de la structure des répertoires de httpd.

  ```
  Set APR_WORK=D:\apr-1.x.x
  ```
- Définissez la variable d'environnement `APU_WORK` avec le chemin du code source d'`apr-util` ; en général `\httpd\srclib\apr-util`, mais le projet APR-UTIL peut se trouver en dehors de la structure des répertoires de httpd.

  ```
  Set
      APU_WORK=D:\apr-util-1.x.x
  ```
- Vérifiez que les chemins des utilitaires AWK et GNU make (`gmake.exe`) ont bien été inclus dans la variable d'environnement système `PATH`.
- Téléchargez le code source et décompressez-le dans un répertoire de votre choix sur votre station de travail.
- Positionnez-vous dans le répertoire `\httpd-2.0` et compilez les utilitaires précompilés à l'aide de la commande "`gmake -f nwgnumakefile prebuild`". Cette cible va créer le répertoire `\httpd-2.0\nwprebuild`, et y copier tous les utilitaires nécessaires au franchissement des étapes suivantes de la compilation.
- Copiez les fichiers `\httpd-2.0\nwprebuild\GENCHARS.nlm` et `\httpd-2.0\nwprebuild\DFTABLES.nlm` vers le volume `SYS:` d'un serveur Netware et exécutez-les à l'aide des commandes suivantes :

  ```
  SYS:\genchars > sys:\test_char.h
  SYS:\dftables sys:\chartables.c
  ```
- Copiez les fichiers `test_char.h` et `chartables.c` vers le répertoire `\httpd-2.0\os\netware` de la machine où s'effectue la compilation.
- Positionnez-vous dans le répertoire `\httpd-2.0` et compilez Apache à l'aide de la commande "`gmake -f nwgnumakefile`". Vous pouvez créer un répertoire pour la distribution en ajoutant le paramètre install à la commande ; par exemple :

  ```
  gmake -f nwgnumakefile install
  ```

### Options de make supplémentaires

- `gmake -f nwgnumakefile`

  Compile les versions de distribution de tous les binaires et les copie dans un répertoire `\release`.
- `gmake -f nwgnumakefile DEBUG=1`

  Compile les versions de débogage de tous les binaires et les copie dans un répertoire `\debug`.
- `gmake -f nwgnumakefile install`

  Crée une distribution complète d'Apache avec les binaires, la documentation et les fichiers support dans un répertoire `\dist\Apache2`.
- `gmake -f nwgnumakefile prebuild`

  Compile tous les utilitaires précompilés et les copie dans le répertoire `\nwprebuild`.
- `gmake -f nwgnumakefile installdev`

  Même effet que l'option install, mais en plus, les répertoires `\lib` et `\include` sont créés dans le répertoire de destination, et les en-têtes et fichiers d'import y sont copiés.
- `gmake -f nwgnumakefile clean`

  Supprime tous les fichiers objets et les binaires de la zone de compilation `\release.o`, ou `\debug.o` si `DEBUG` a été défini.
- `gmake -f nwgnumakefile clobber_all`

  Même effet que clean, mais en plus, le répertoire de la distribution est supprimé s'il existe.

### Variables d'environnement supplémentaires

- Pour compiler tous les modules expérimentaux, définissez la variable d'environnement `EXPERIMENTAL` :

  ```
  Set EXPERIMENTAL=1
  ```
- Pour compiler Apache en utilisant les sockets de style BSD standard, plutôt que Winsock, définissez la variable d'environnement `USE_STDSOCKETS` :

  ```
  Set USE_STDSOCKETS=1
  ```

### Compilation de mod\_ssl pour la plate-forme Netware

Pour fournir les services SSL, Apache pour Netware utilise par défaut le module intégré [[12-modules/mod_nw_ssl|mod_nw_ssl]]. Ce module ne fournit que les services SSL implémentés par le système d'exploitation Netware lui-même pour gérer tous les chiffrements pour un port donné. Cependant, on peut aussi utiliser mod\_ssl de la même manière que sur les autres plate-formes.

Afin de pouvoir compiler mod\_ssl pour la plate-forme Netware, les bibliothèques OpenSSL doivent être disponibles. Elles peuvent être installées de la manière suivante :

- Téléchargez la dernière distribution du code source d'OpenSSL 0.9.8 depuis la page [OpenSSL Source](http://www.openssl.org/source/) (les versions 0.9.7 doivent être patchées, et ne sont donc pas recommandées).
- Editez le fichier `NetWare/set_env.bat`, et effectuez toutes modifications nécessaires des chemins des outils et utilitaires en fonction de votre environnement de développement.
- Exécutez les scripts suivants depuis la racine du répertoire des sources d'OpenSSL :

  ```
  Netware\set_env netware-libc
  Netware\build netware-libc
  ```

  Pour des raisons de performances, vous devez activer la compilation avec le code ASM. Télécharger NASM depuis le [site SF](http://nasm.sourceforge.net/). Configurez ensuite OpenSSL pour utiliser le code ASM :

  ```
  Netware\build netware-libc nw-nasm enable-mdc2 enable-md5
  ```

  Attention : n'utilisez pas l'Assembleur CodeWarrior - il produit un code de mauvaise qualité !
- Avant de compiler Apache, définissez la variable d'environnement `OSSLSDK` avec le chemin absolu de la racine du répertoire du code source d'openssl, et définissez WITH\_MOD\_SSL à 1.

  ```
  Set OSSLSDK=d:\openssl-0.9.8x
  Set WITH_MOD_SSL=1
  ```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
