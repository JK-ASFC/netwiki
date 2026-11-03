---
title: "Tutoriel du serveur HTTP Apache : fichiers .htaccess"
description: "Apache HTTP Server — Tutoriel du serveur HTTP Apache : fichiers .htaccess. Les fichiers .htaccess fournissent une méthode pour modifier la configuration du serveur au niveau de chaque répertoire, sans modifier les fichiers de configuration principaux du serveur."
tags: [apache, guide]
icon: book-open
---

Les fichiers `.htaccess` fournissent une méthode pour modifier la configuration du serveur au niveau de chaque répertoire, sans modifier les fichiers de configuration principaux du serveur.

## Fichiers .htaccess

- [[12-modules/core|core]]
- [[12-modules/mod_authn_file|mod_authn_file]]
- [[12-modules/mod_authz_groupfile|mod_authz_groupfile]]
- [[12-modules/mod_include|mod_include]]
- [[12-modules/mod_mime|mod_mime]]
- [[12-modules/mod_rewrite|mod_rewrite]]
- [[13-directives/accessfilename|AccessFileName]]
- [[13-directives/allowoverride|AllowOverride]]
- [[13-directives/allowoverridelist|AllowOverrideList]]
- [[13-directives/options|Options]]
- [[13-directives/addhandler|AddHandler]]
- [[13-directives/sethandler|SetHandler]]
- [[13-directives/authtype|AuthType]]
- [[13-directives/authname|AuthName]]
- [[13-directives/authuserfile|AuthUserFile]]
- [[13-directives/authgroupfile|AuthGroupFile]]
- [[13-directives/require|Require]]

## Que sont ce fichiers, comment les utiliser ?

Les fichiers `.htaccess` (ou "fichiers de configuration distribués") fournissent une méthode pour modifier la configuration du serveur au niveau d'un répertoire. Un fichier, contenant une ou plusieurs directives de configuration, est placé dans un répertoire de documents particulier, et ses directives s'appliquent à ce répertoire et à tous ses sous-répertoires.

> [!NOTE]
> **Note :**
>
> Si vous voulez donner un autre nom à votre fichier `.htaccess`, vous pouvez le faire en utilisant la directive [[13-directives/accessfilename|AccessFileName]]. Par exemple, si vous préférez nommer votre fichier `.config`, vous pouvez mettre ceci dans le fichier de configuration de votre serveur :
>
> ```apache
> AccessFileName ".config"
> ```

Les directives dans les fichiers `.htaccess` utilisent la même syntaxe que les [[11-guides/01-generalites/fichiers-de-configuration|fichiers de configuration principaux]]. Ce que vous pouvez mettre dans ces fichier est déterminé par les directives [[13-directives/allowoverride|AllowOverride]] et [[13-directives/allowoverridelist|AllowOverrideList]]. La directive [[13-directives/allowoverride|AllowOverride]] spécifie, sous forme de catégories, quelles directives seront traitées si elles se trouvent dans un fichier `.htaccess`, alors que la directive [[13-directives/allowoverridelist|AllowOverrideList]] nomme individuellement les directives permises (voir ci-après). Si une directive est permise dans un fichier `.htaccess`, la documentation de cette directive contiendra une section Override, spécifiant quelle valeur doit prendre la directive [[13-directives/allowoverride|AllowOverride]] pour que cette directive soit autorisée.

> [!NOTE]
> La valeur par défaut de la directive [[13-directives/allowoverride|AllowOverride]] est `None`. Cela signifie que les fichiers `.htaccess` seront complètement ignorés, à moins que vous ne les autorisiez explicitement pour un répertoire.

Par exemple, si vous regardez la documentation de la directive [[13-directives/adddefaultcharset|AddDefaultCharset]], vous verrez que cette dernière est permise dans les fichiers `.htaccess` (Voir la ligne de contexte dans le résumé de la directive). La ligne Override indique `FileInfo`. Vous devez donc avoir au moins `AllowOverride FileInfo` pour que cette directive soit traitée dans les fichiers `.htaccess`.

## Quand doit-on (ne doit-on pas) utiliser les fichiers .htaccess ?

Si vous avez accès au fichier de configuration principal du serveur, il est préférable d’y mettre toute votre configuration, plutôt que d’utiliser des fichiers `.htaccess`. Cela concerne l’authentification de l’utilisateur, les règles de [[12-modules/mod_rewrite|mod_rewrite]] et tout ce que vous seriez tenté de mettre dans un fichier `.htaccess`. Les directives du fichier de configuration principal ne sont chargées qu’une seule fois au démarrage du serveur et non pas à chaque requête, et en particulier, [[12-modules/mod_rewrite|mod_rewrite]] fonctionne mieux dans un contexte de configuration globale du serveur.

Les fichiers `.htaccess` ne devraient être utilisés que dans le cas où les fournisseurs de contenu ont besoin de modifier la configuration du serveur au niveau d'un répertoire, mais ne possèdent pas l'accès du superutilisateur sur le système du serveur. Cela est courant dans les environnements d’hébergement géré, l’hébergement basé sur un panneau de contrôle (comme cPanel ou Plesk) et les systèmes de gestion de contenu où l’application fournit un fichier `.htaccess` avec sa distribution. Si l’administrateur du serveur n’a pas envie d’effectuer des changements de configuration incessants, il peut être intéressant de permettre aux utilisateurs isolés d'effectuer eux-mêmes ces modifications par le biais de fichiers `.htaccess`.

Il y a deux raisons de préférer le fichier de configuration principal aux fichiers `.htaccess` : la performance et la sécurité.

**Performance :** Lorsque la directive [[13-directives/allowoverride|AllowOverride]] est définie de façon à autoriser l'utilisation des fichiers `.htaccess`, httpd va rechercher leur présence dans chaque répertoire. Ainsi, permettre l'utilisation des fichiers `.htaccess` est déjà en soi une cause de dégradation des performances, que vous utilisiez effectivement ces fichiers ou non ! De plus, le fichier `.htaccess` est chargé en mémoire chaque fois qu'un document fait l'objet d'une requête.

En outre, httpd doit rechercher des fichiers `.htaccess` dans tous les répertoires de niveau supérieur pour rassembler la totalité des directives applicables (Voir la section comment sont appliquées les directives). Ainsi, si un fichier fait l'objet d'une requête à partir d'un répertoire `/www/htdocs/exemple`, httpd doit rechercher les fichiers suivants :

```apache
/.htaccess
/www/.htaccess
/www/htdocs/.htaccess
/www/htdocs/example/.htaccess
```

En conséquence, chaque accès à un fichier de ce répertoire nécessite 4 accès au système de fichiers supplémentaires pour rechercher des fichiers `.htaccess`, même si aucun de ces fichiers n'est présent. Cet exemple ne peut se produire que si les fichiers `.htaccess` ont été autorisés pour le répertoire `/`, ce qui est rarement le cas.

**Sécurité :** Si vous permettez aux utilisateurs de modifier la configuration du serveur, il peut en résulter des conséquences sur lesquelles vous n'aurez aucun contrôle. Réfléchissez bien avant de donner ce privilège à vos utilisateurs. Ne pas donner aux utilisateurs les privilèges dont ils ont besoin va entraîner une augmentation des demandes de support technique. Assurez-vous d'avoir informé clairement vos utilisateurs du niveau de privilèges que vous leur avez attribué. Indiquer exactement comment vous avez défini la directive [[13-directives/allowoverride|AllowOverride]] et diriger les utilisateurs vers la documentation correspondante vous évitera bien des confusions ultérieures.

Si vous devez autoriser les fichiers `.htaccess` mais voulez n’autoriser que l’utilisation de directives spécifiques au lieu de catégories entières de directives, utilisez la directive [[13-directives/allowoverridelist|AllowOverrideList]]. Cette dernière vous permet de nommer individuellement les directives autorisées, vous permettant ainsi un contrôle plus fin que dans le cas de la directive [[13-directives/allowoverride|AllowOverride]] seule :

```apache
# N’autoriser que des directives spécifiques, pas des catégories entières de
# directives
AllowOverride None
AllowOverrideList Redirect RedirectMatch RewriteEngine RewriteRule RewriteCond
```

Avec cette configuration, toute directive non explicitement spécifiée causera une erreur du serveur si elle est rencontrée dans un fichier `.htaccess`. C’est un bon compromis entre possibilité et impossibilité totales d’outrepasser la configuration globale.

Placer une directive dans un fichier `.htaccess` dans un répertoire `/www/htdocs/example` équivaut exactement à placer cette même directive dans une section `<Directory "/www/htdocs/example">` de la configuration globale de votre serveur :

Fichier `.htaccess` dans `/www/htdocs/example` :

**Contenu du fichier .htaccess dans `/www/htdocs/example`**

```
AddType text/example ".exm"
```

**Section de votre fichier `httpd.conf`**

```
<Directory "/www/htdocs/example"> AddType text/example ".exm" </Directory>
```

L'utilisation des fichiers `.htaccess` peut être entièrement désactivée en définissant la directive [[13-directives/allowoverride|AllowOverride]] à `none` :

```apache
AllowOverride None
```

## Comment sont appliquées les directives ?

Les directives de configuration situées dans un fichier `.htaccess` s'appliquent au répertoire dans lequel ce fichier `.htaccess` se trouve, ainsi qu'à tous ses sous-répertoires. Cependant, souvenez-vous qu'il peut y avoir des fichiers `.htaccess` dans les répertoires de niveau supérieur. Les directives sont appliquées selon l'ordre dans lequel elles sont rencontrées. Ainsi, les directives d'un fichier `.htaccess` situé dans un répertoire particulier peuvent écraser les directives se trouvant dans des fichiers `.htaccess` situés à un niveau supérieur dans l'arborescence des répertoires. Et ces dernières peuvent elles-mêmes avoir écrasé des directives d'un fichier `.htaccess` situé à un niveau encore plus haut, ou dans le fichier de configuration du serveur principal.

Exemple :

Dans le répertoire `/www/htdocs/exemple1` se trouve un fichier `.htaccess` contenant ce qui suit :

```apache
Options +ExecCGI
```

> [!NOTE]
> "`AllowOverride Options`" doit être présent pour permettre l'utilisation de la directive "[[13-directives/options|Options]]" dans les fichiers `.htaccess`.

Dans le répertoire `/www/htdocs/exemple1/exemple2` se trouve un fichier `.htaccess` contenant ce qui suit :

```apache
Options Includes
```

Ainsi, à cause de ce second fichier `.htaccess` du répertoire `/www/htdocs/exemple1/exemple2`, l'exécution des CGI est interdite, car la dernière définition d'options `Options Includes` écrase toute autre définition d'options d'un fichier `.htaccess` situé dans un répertoire de niveau supérieur.

### Interactions entre les fichiers .htaccess et les fichiers de configuration du serveur principal

Comme indiqué dans la documentation sur les [[11-guides/01-generalites/sections-de-configuration|Sections de configuration]], les fichiers `.htaccess` peuvent écraser les directives des sections [[13-directives/directory|<Directory>]] pour le répertoire correspondant, mais peuvent eux-mêmes être écrasés par d'autres types de sections des fichiers de la configuration principale. Cette possibilité peut s'avérer utile pour forcer certaines configurations, même en cas de présence de l'option libérale [[13-directives/allowoverride|AllowOverride]]. Par exemple, pour interdire l'exécution de scripts en autorisant la définition de toute autre option dans les fichiers `.htaccess`, vous pouvez utiliser :

```apache
<Directory "/www/htdocs">
AllowOverride All
</Directory>

<Location "/">
Options +IncludesNoExec -ExecCGI
</Location>
```

> [!NOTE]
> Dans cet exemple, on considère que le chemin défini par la directive [[13-directives/documentroot|DocumentRoot]] est `/www/htdocs`.

## Exemple d'authentification

Comme avec toute utilisation de fichier `.htaccess`, placer ces directives dans une section [[13-directives/directory|<Directory>]] est préférable si vous avez accès au fichier de configuration principal (voir ci-avant). L’exemple suivant montre l’approche `.htaccess` :

Contenu du fichier `.htaccess` :

```apache
AuthType Basic
AuthName "Password Required"
AuthUserFile "/www/passwords/password.file"
AuthGroupFile "/www/passwords/group.file"
Require group admins
```

> [!NOTE]
> `AllowOverride AuthConfig` doit être présent pour que ces directives produisent leur effet.

Vous pouvez vous référer au [[11-guides/02-guides-pratiques/authentification-et-autorisation|tutoriel sur l'authentification]] pour une description plus détaillée de l'authentification et de l'autorisation.

## Exemple d'Inclusion Côté Serveur (Server Side Includes - SSI)

Les fichiers `.htaccess` sont aussi utilisés pour activer les SSI (Server Side Includes) pour un répertoire particulier. Pour y parvenir, on utilise les directives de configuration suivantes, placées dans un fichier `.htaccess` enregistré dans le répertoire considéré :

```apache
Options +Includes
AddType text/html "shtml"
AddHandler server-parsed shtml
```

> [!NOTE]
> `AllowOverride Options` et `AllowOverride FileInfo` doivent être tous les deux présents pour que ces directives puissent produire leur effet.

Vous pouvez vous référer au [[11-guides/02-guides-pratiques/tutoriel-apache-httpd-introduction-aux-inclusions-cote-serveur-server-|tutoriel SSI]] pour une description plus détaillée des SSI.

## Les règles de réécriture dans les fichiers .htaccess

Sivous utilisez des directives [[13-directives/rewriterule|RewriteRule]] dans un fichier `.htaccess`, gardez à l'esprit que les choses sont légèrement différentes dans un contexte de répertoire. En particulier, les règles sont relatives au répertoire courant, et non à l'URI original. Considérez les exemples suivants :

```apache
# Dans httpd.conf
RewriteRule "^/images/(.+)\.jpg" "/images/$1.png"

# Dans un fichier .htaccess situé dans le répertoire racine de vos
# documents
RewriteRule "^images/(.+)\.jpg" "images/$1.png"

# Dans un fichier .htaccess situé dans le répertoire images/
RewriteRule "^(.+)\.jpg" "$1.png"
```

On voit que si le fichier `.htaccess` se situe à la racine de vos documents, le slash de tête est supprimé de la valeur de remplacement spécifiée pour la règle [[13-directives/rewriterule|RewriteRule]], et que si le fichier `.htaccess` se situe dans le répertoire `images`, la chaîne `/images/` disparaît de cette même valeur de remplacement. Il doit donc en être de même dans votre expression rationnelle.

Dans un contexte `.htaccess`, les expressions rationnelles sont recompilées à chaque requête, alors que dans un contexte de configuration principale, elle ne sont compilées qu’une seule fois et mises en cache.

Veuillez vous référer à cette [[11-guides/05-reecriture-mod-rewrite/00-guide-pour-le-module-apache-mod-rewrite|documentation]] pour une étude détaillée de l'utilisation du module [[12-modules/mod_rewrite|mod_rewrite]].

## Exemple de CGI

> [!NOTE]
> Les scripts CGI constituent un mécanisme de gestion de contenu dynamique patrimonial. Pour les nouveaux déploiements, pensez à utiliser [[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]] avec un serveur d’applications FastCGI ou un gestionnaire spécifique à un cadriciel. Les informations ci-après restent cependant valables pour les environnements qui reposent encore sur une CGI traditionnelle.

Vous pouvez utiliser un fichier `.htaccess` pour autoriser l’exécution de programmes CGI dans un répertoire particulier. Pour y parvenir, vous pouvez utiliser la configuration suivante :

```apache
Options +ExecCGI
AddHandler cgi-script "cgi" "py"
```

Alternativement, si vous souhaitez que tous les fichiers d'un répertoire donné soient considérés comme des programmes CGI, vous pouvez utiliser la configuration suivante :

```apache
Options +ExecCGI
SetHandler cgi-script
```

> [!NOTE]
> `AllowOverride Options` et `AllowOverride FileInfo` doivent être tous les deux présents pour que ces directives puissent produire leur effet.

Vous pouvez vous référer au [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|tutoriel CGI]] pour une description plus détaillée de la configuration et de la proprammation CGI.

## Résolution des problèmes

De nombreuses raisons peuvent être à l'origine du fait que les directives que vous avez mises dans un fichier `.htaccess` ne produisent pas l'effet désiré.

Le plus souvent, le problème vient du fait que la définition de la directive [[13-directives/allowoverride|AllowOverride]] ne permet pas l'activation des directives de votre fichier `.htaccess`. Vérifiez si une directive `AllowOverride None` n'affecte pas le répertoire où se trouve votre fichier. Un bon test consiste à mettre un mot dénué de sens dans votre ficher `.htaccess` et de recharger la page :

```apache
TestMe
```

Si aucune erreur (HTTP 500) n'est générée par le serveur, il est pratiquement certain qu'une directive `AllowOverride None` affecte votre répertoire.

Par contre, si vous obtenez des erreurs de serveur lorsque vous tentez d'accéder à des documents, consultez votre journal des erreurs de httpd. Il vous indiquera probablement que la directive utilisée dans votre fichier `.htaccess` n'est pas permise.

```apache
[Thu Jun 18 09:12:31.528374 2026] [core:alert] [pid 12345] [client 192.168.1.50:54321] /var/www/html/.htaccess: DirectoryIndex not allowed here
```

Cela signifie soit que vous utilisez une directive qui n'est jamais permise dans les fichiers `.htaccess`, soit que vous n'avez pas défini la directive [[13-directives/allowoverride|AllowOverride]] à un niveau suffisant pour la directive que vous utilisez. Consultez la documentation de cette directive pour déterminer quel cas s'applique.

Le journal des erreurs peut aussi vous signaler une erreur de syntaxe dans l'usage de la directive elle-même.

```apache
[Thu Jun 18 09:14:02.946218 2026] [core:alert] [pid 12345] [client 192.168.1.50:54321] /var/www/html/.htaccess: RewriteCond: bad flag delimiters
```

Dans ce cas, le message d'erreur sera spécifique à l'erreur de syntaxe que vous avez commise.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
