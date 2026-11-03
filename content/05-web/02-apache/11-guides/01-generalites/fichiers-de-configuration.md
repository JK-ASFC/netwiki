---
title: "Fichiers de configuration"
description: "Apache HTTP Server — Fichiers de configuration. Ce document décrit les fichiers utilisés pour configurer le Serveur HTTP Apache."
tags: [apache, guide]
icon: book-open
---

Ce document décrit les fichiers utilisés pour configurer le Serveur HTTP Apache.

## Fichiers de configuration principaux

- [[12-modules/mod_mime|mod_mime]]
- [[13-directives/ifdefine|<IfDefine>]]
- [[13-directives/include|Include]]
- [[13-directives/typesconfig|TypesConfig]]

La configuration du serveur HTTP Apache est effectuée en plaçant des directives dans des fichiers de configuration au format texte. Le fichier de configuration principal se nomme en général `httpd.conf`. La localisation de ce fichier est définie à la compilation, mais peut être redéfinie à l'aide de l'option de ligne de commande `-f`. En outre, d'autres fichiers de configuration peuvent être ajoutés à l'aide de la directive [[13-directives/include|Include]], et des caractères de remplacement peuvent être utilisés pour inclure de nombreux fichiers de configuration. Des directives de tous types peuvent être placées dans chacun de ces fichiers de configuration. Les modifications dans les fichiers de configuration principaux ne sont prises en compte par httpd que lorsque le serveur est démarré ou redémarré.

Le serveur lit aussi un fichier contenant les types de document mime ; ce fichier est défini par la directive [[13-directives/typesconfig|TypesConfig]], et se nomme `mime.types` par défaut.

## Syntaxe des fichiers de configuration

Les fichiers de configuration de httpd contiennent une directive par ligne. On peut utiliser l'anti-slash "\\" comme dernier caractère d'une ligne pour indiquer que la directive continue à la ligne suivante ; pour que cette continuation soit prise en compte, il ne doit y avoir aucun caractère ni blanc entre l'anti-slash et la fin de la ligne.

Les lignes qui commencent par un croisillon « # » sont interprétées comme des commentaires et sont ignorées. Les commentaires **ne doivent pas** se trouver sur la même ligne qu'une directive de configuration, y compris au début de la continuation d'une ligne comme décrit dans le paragraphe précédent. Les commentaires peuvent aussi continuer sur la ligne suivante, ce qui signifie que la prochaine ligne physique est aussi interprétée comme un commentaire car la ligne logique commence par un croisillon.

Les blancs apparaissant avant une directive sont ignorés ; vous pouvez donc indenter ces dernières pour améliorer la lisibilité. Les lignes vides sont aussi ignorées. les arguments de directive sont séparés par des blancs. Si un argument contient des espaces, il doit être entouré de guillemets.

### Citation et échappement

Un argument qui contient des espaces doit être entouré de guillemets doubles (`"`) ou de guillemets simples (`'`). Les guillemets eux-mêmes ne font pas partie de l’argument.

À l’intérieur d’une chaîne entre guillemets, seules deux séquences d’échappement sont reconnues : `\\` produit une controblique littérale et `\"` (ou `\'` si la chaîne est entourée de guillemets simples) produit un guillemet littéral sans terminer la chaîne. Toutes les autres séquences avec controblique sont conservées telles quelles — par exemple, `\n` sera considéré comme une chaîne littéral de deux caractères `\n`, pas comme une nouvelle ligne.

En dehors des guillemets, les controbliques n’ont aucune signification spéciale et sont traitées comme des caractères littéraux. La seule exception est la controblique de continuation de ligne en fin de ligne, comme décrit ci-avant.

Notez que des chaînes entre guillemets adjacentes sans espace entre elles ne sont **pas** concaténées — elles sont traitées comme des arguments séparés. Par exemple :

```
# Il ne s’agit pas d’un seul argument, mais de DEUX :
Header set X-Foo "arg1""arg2"
```

Certaines directives acceptent des arguments qui contiennent des sous-expressions ayant leur propre syntaxe, telles que les drapeaux de la directive [[13-directives/rewriterule|RewriteRule]] ou les expression [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]]. Dans ces cas, l’interpréteur de fichier de configuration enlève tout d’abord les guillemets englobants et traite les séquences avec controblique comme décrit ci-avant, puis l’interpréteur propre à la directive traite le résultat. En cas de doute, utiliser des guillemets simples autour d’un argument qui contient des controbliques peut éviter un double traitement inattendu des séquenses d’échappement.

Les directives dans les fichiers de configuration ne sont pas sensibles à la casse, mais leurs arguments le sont souvent.

Les valeurs des variables d'environnement ou des variables définies via la directive [[13-directives/define|Define]] peuvent être utilisées dans le fichier de configuration en utilisant la syntaxe `${VAR}`. Si "VAR" est le nom d'une variable valable, la valeur de la variable est alors substituée à la chaîne `${VAR}`, et le processus de lecture du fichier de configuration continue comme si la chaîne correspondant à la valeur de la variable s'y était trouvée littéralement. Les variables définies via la directive [[13-directives/define|Define]] l'emportent sur les autres variables d'environnement de l'interpréteur de commande. Si la variable "VAR" n'est pas trouvée, la chaîne `${VAR}` n'est pas modifiée, et un avertissement est enregistré dans le journal. Le caractère ":" est interdit dans les noms de variables afin d'éviter tout conflit avec la syntaxe de la directive [[13-directives/rewritemap|RewriteMap]].

Seules les variables d'environnement de l'interpréteur de commande définies avant le démarrage du serveur peuvent être utilisées en extension. Les variables d'environnement définies dans le fichier de configuration lui-même, par exemple avec [[13-directives/setenv|SetEnv]], prennent effet trop tard pour pouvoir être utilisées en extension au sein du fichier de configuration.

La longueur maximale d'une ligne dans un fichier de configuration normal, après substitution des variables et fusion des lignes interrompues, est approximativement de 16 Mo. Dans les [[11-guides/01-generalites/fichiers-de-configuration|fichiers .htaccess]], la longueur maximale est de 8190 caractères.

Vous pouvez vérifier l'absence d'erreurs de syntaxe dans vos fichiers de configuration sans démarrer le serveur à l'aide de la commande `apachectl configtest` ou de l'option de ligne de commande `-t`.

Vous pouvez utiliser la définition `-DDUMP_CONFIG` de [[12-modules/mod_info|mod_info]] pour afficher la configuration avec tous les fichiers inclus et les variables d'environnement évaluées, tous les commentaires et les sections [[13-directives/ifdefine|<IfDefine>]] et [[13-directives/ifmodule|<IfModule>]] non actives ayant été supprimés. Cependant, la sortie ne reflète pas les fusions ou écrasements pouvant intervenir en cas de définitions multiples de directives.

## Modules

- [[12-modules/mod_so|mod_so]]
- [[13-directives/ifmodule|<IfModule>]]
- [[13-directives/loadmodule|LoadModule]]

httpd est un serveur modulaire. Ceci implique que seules les fonctionnalités les plus courantes sont incluses dans le serveur de base. Les fonctionnalités étendues sont fournies à l'aide de modules qui peuvent être chargés dans httpd. Par défaut, un jeu de modules de base est inclus dans le serveur à la compilation. Si le serveur est compilé de façon à utiliser les [[11-guides/01-generalites/prise-en-charge-des-objets-dynamiques-partages-dso|modules chargés dynamiquement]], alors les modules peuvent être compilés séparément et chargés à n'importe quel moment à l'aide de la directive [[13-directives/loadmodule|LoadModule]]. Dans le cas contraire, httpd doit être recompilé pour ajouter ou supprimer des modules. Les directives de configuration peuvent être incluses de manière conditionnelle selon la présence ou l'absence d'un module particulier en les plaçant dans un bloc [[13-directives/ifmodule|<IfModule>]].

Pour voir quels modules ont été compilés avec le serveur, vous pouvez utiliser l'option de ligne de commande `-l`.

## Portée des directives

- [[13-directives/directory|<Directory>]]
- [[13-directives/directorymatch|<DirectoryMatch>]]
- [[13-directives/files|<Files>]]
- [[13-directives/filesmatch|<FilesMatch>]]
- [[13-directives/location|<Location>]]
- [[13-directives/locationmatch|<LocationMatch>]]
- [[13-directives/virtualhost|<VirtualHost>]]

Les directives placées dans les fichiers de configuration principaux s'appliquent au serveur dans son ensemble. Si vous souhaitez modifier la configuration d'une partie du serveur seulement, vous pouvez limiter la portée de vos directives en les plaçant dans une section [[13-directives/directory|<Directory>]], [[13-directives/directorymatch|<DirectoryMatch>]], [[13-directives/files|<Files>]], [[13-directives/filesmatch|<FilesMatch>]], [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]]. Ces sections limitent le champ d'application des directives qu'elles contiennent à des URls ou des portions du système de fichiers particulières. Elles peuvent aussi être imbriquées, ce qui permet une configuration très fine.

httpd peut servir simultanément de nombreux sites web au travers des [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Serveurs Virtuels]]. La portée des directives peut ainsi être limitée en les plaçant dans des sections [[13-directives/virtualhost|<VirtualHost>]], afin qu'elles ne s'appliquent qu'aux requêtes pour un site web particulier.

Bien que la plupart des directives puissent être placées dans chacune de ces sections, certaines d'entre elles n'ont aucun sens dans certains contextes. Par exemple, les directives qui contrôlent la création des processus n'ont de sens que dans le contexte du serveur global. Pour déterminer quelles directives peuvent être placées dans quelles sections, consultez le Contexte de la directive. Pour plus d'informations, nous fournissons des détails dans [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections Directory, Location et Files]].

## Fichiers .htaccess

- [[13-directives/accessfilename|AccessFileName]]
- [[13-directives/allowoverride|AllowOverride]]

httpd permet la gestion décentralisée de la configuration à l'aide de fichiers spéciaux placés dans l'arborescence du site web. Ces fichiers spéciaux se nomment en général `.htaccess`, mais tout autre nom peut être spécifié à l'aide de la directive [[13-directives/accessfilename|AccessFileName]]. Les directives placées dans les fichiers `.htaccess` s'appliquent au répertoire dans lequel vous avez placé le fichier, ainsi qu'à tous ses sous-répertoires. La syntaxe des fichiers `.htaccess` est la même que celle des fichiers de configuration principaux. Comme les fichiers `.htaccess` sont lus à chaque requête, les modifications de ces fichiers prennent effet immédiatement.

Pour déterminer quelles directives peuvent être placées dans les fichiers `.htaccess`, consultez le Contexte de la directive. L'administrateur du serveur peut contrôler quelles directives peuvent être placées dans les fichiers `.htaccess` en définissant la directive [[13-directives/allowoverride|AllowOverride]] dans les fichiers de configuration principaux.

Pour plus d'informations sur les fichiers `.htaccess`, se référer au [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|tutoriel .htaccess]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
