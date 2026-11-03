---
title: "mod_include"
description: "Module Apache mod_include — Documents html interprétés par le serveur (Server Side Includes ou SSI). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_include]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Documents html interprétés par le serveur (Server Side Includes ou SSI) |
| **Statut** | Base |
| **Identificateur** | `include_module` |
| **Fichier source** | `mod_include.c` |

## Sommaire

Ce module fournit un filtre qui va traiter les fichiers avant de les envoyer au client. Le traitement est contrôlé via des commentaires SGML spécialement formatés, aussi nommés *éléments*. Ces éléments permettent l'insertion conditionnelle de texte, l'inclusion d'autres fichiers ou programmes, ainsi que la définition et l'affichage de variables d'environnement.

## Activation des SSI

Les SSI sont implémentés par le [[11-guides/01-generalites/filtres|filtre]] `INCLUDES`. Si des documents contenant des directives SSI possèdent une extension .shtml, les directives suivantes indiqueront à Apache de les interpréter et d'assigner le type MIME `text/html` au document obtenu :

```apache
AddType text/html .shtml
AddOutputFilter INCLUDES .shtml
```

L'option suivante doit être définie pour les répertoires qui contiennent les fichiers shtml (en général dans une section [[13-directives/directory|<Directory>]], mais cette option peut également être définie dans un fichier `.htaccess` si `AllowOverride Options` a été défini pour le répertoire considéré) :

```apache
Options +Includes
```

Pour des raisons de compatibilité ascendante, le [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaire]] `server-parsed` peut aussi activer le filtre INCLUDES. Ainsi, Apache va activer le filtre INCLUDES pour tout document de type MIME `text/x-server-parsed-html` ou `text/x-server-parsed-html3` (et le document obtenu aura pour type MIME `text/html`).

Pour plus d'informations, voyez notre [[11-guides/02-guides-pratiques/tutoriel-apache-httpd-introduction-aux-inclusions-cote-serveur-server-|Tutoriel SSI]].

## PATH\_INFO et SSI

Les fichiers traités dans le cadre des SSI n'acceptent plus par défaut les requêtes avec `PATH_INFO` (les informations relatives au chemin en fin de requête). La directive [[13-directives/acceptpathinfo|AcceptPathInfo]] permet de configurer le serveur de façon à ce qu'il accepte ce genre de requête.

## Eléments disponibles

Le document est interprété comme un document HTML, avec des commandes spéciales incluses sous forme de commentaires SGML. La syntaxe d'une commande est la suivante :

```
<!--#élément attribut=valeur
attribut=valeur ... -->
```

Les valeurs sont souvent entourées de guillemets, mais on peut aussi utiliser des apostrophes (`'`) ou des apostrophes inverses (\`). De nombreuses commandes n'acceptent qu'une seule paire attribut-valeur. Notez que le terminateur de commentaire (`-->`) doit être précédé d'un espace afin d'être sûr qu'il ne soit pas considéré comme un élément de commande SSI. Notez aussi que le délimiteur de début `<!--#` est *un* élément de commande et ne doit donc pas contenir d'espace.

La table suivante contient la liste des éléments autorisés :

| Elément | Description |
| --- | --- |
| `comment` | commentaire SSI |
| `config` | configure les formats de sortie |
| `echo` | affiche le contenu de variables |
| `exec` | exécute des programmes externes |
| `fsize` | affiche la taille d'un fichier |
| `flastmod` | affiche la date de dernière modification d'un fichier |
| `include` | inclut un fichier |
| `printenv` | affiche toutes les variables disponibles |
| `set` | définit la valeur d'une variable |

Les éléments SSI peuvent être définis par d'autres modules que [[12-modules/mod_include|mod_include]]. À ce titre, l'élément `exec` est fourni par [[12-modules/mod_cgi|mod_cgi]], et ne sera disponible que si ce module est chargé.

### L'élément comment

Cette commande n'affiche aucune information. Elle n'a pour but que l'ajout de commentaires dans un fichier et ces commentaires ne sont pas affichés.

Cette syntaxe est disponible à partir de la version 2.4.21 du serveur HTTP Apache.

```
<!--#comment Blah Blah Blah -->
   or
<!--#comment text="Blah Blah Blah" -->
```

### L'élément config

Cette commande contrôle divers aspects de l'interprétation. Les attributs valides sont :

**`echomsg` (*Versions 2.1 et supérieures d'Apache*)**

La valeur est un message qui sera envoyé au client si l'élément `echo` tente d'afficher le contenu d'une variable non définie. Cet attribut l'emporte sur toute directive [[13-directives/ssiundefinedecho|SSIUndefinedEcho]].

```
<!--#config echomsg="[Valeur non définie]" -->
```

**`errmsg`**

La valeur est un message qui sera envoyé au client si une erreur survient lors de l'interprétation du document. Cet attribut l'emporte sur toute directive [[13-directives/ssierrormsg|SSIErrorMsg]].

```
<!--#config errmsg="[Zut, quelque chose s'est mal passé.]" -->
```

**`sizefmt`**

La valeur définit l'unité employée lors de l'affichage de la taille d'un fichier. Les valeurs possibles sont `bytes` pour une taille en octets, ou `abbrev` pour une taille en Ko ou Mo selon son importance ; par exemple, une taille de 1024 octets sera affichée sous la forme "1K".

```
<!--#config sizefmt="abbrev" -->
```

**`timefmt`**

La valeur est une chaîne que pourra utiliser la fonction de la bibliothèque standard `strftime(3)` lors de l'affichage des dates.

```
<!--#config timefmt=""%R, %B %d, %Y"" -->
```

### L'élément echo

Cette commande affiche le contenu d'une des variables include définies ci-dessous. Si la variable n'est pas définie, le résultat est déterminé par la valeur de la directive [[13-directives/ssiundefinedecho|SSIUndefinedEcho]]. Le format d'affichage des dates est défini par l'attribut `timefmt` de la commande config.

Attributs:

**`var`**

La valeur est le nom de la variable à afficher.

**`decoding`**

Spécifie si Apache doit effectuer un décodage dans la variable avant son traitement ultérieur. La valeur par défaut est `none`, et dans ce cas, aucun décodage n'est effectué. Si la valeur est `url`, un décodage de type URL sera effectué (il s'agit du codage de type %-encoding utilisé dans les URLs des liens, etc...). Si la valeur est `urlencoded`, c'est un décodage des éléments de type application/x-www-form-urlencode (que l'on trouve dans les chaînes de paramètres) qui sera effectué. Si la valeur est `base64`, un decodage de type base64 sera effectué, et si elle est `entity`, c'est un décodage des entités HTML qui sera effectué. Ce décodage est effectué avant tout codage ultérieur de la variable. Il est possible d'effectuer plusieurs décodages en spécifiant plusieurs valeurs séparées par des virgules. Les spécifications de décodages restent valables jusqu'au prochain attribut de décodage, ou la fin de l'élément.

Pour être pris en compte, l'attribut de `décodage` doit *précéder* l'attribut `var` correspondant.

**`encoding`**

Spécifie la manière dont Apache va coder les caractères spéciaux que la variable contient avant leur affichage. S'il est défini à `none`, aucun codage ne sera effectué. S'il est défini à `url`, un codage de type URL sera effectué (aussi connu sous le nom de codage avec caractères % , il convient pour les URLS des liens, etc...). S'il est défini à `urlencoded`, c'est un codage compatible application/x-www-form-urlencoded qui sera effectué (à utiliser dans les chaînes de paramètres). S'il est défini à `base64`, c'est un encodage de type base64 qui sera effectué. Au début d'un élément `echo`, la valeur par défaut est définie à `entity`, ce qui correspond à un codage de type entité (codage qui convient pour un élément HTML de type bloc, comme le paragraphe d'un texte). Cette valeur par défaut peut être modifiée en ajoutant un attribut `encoding`, qui fera effet jusqu'à la définition d'un nouvel attribut `encoding` ou la fin de l'élément echo.

Pour produire son effet, l'attribut `encoding` doit précéder l'attribut `var` concerné.

> [!WARNING]
> Afin de prévenir les attaques de type cross-site scripting, il est recommandé de *toujours* encoder les données fournies par les utilisateurs.

**Example**

```
<!--#echo encoding="entity" var="QUERY_STRING" -->
```

### L'élément exec

La commande `exec` exécute la commande shell ou le script spécifié. Elle nécessite le chargement du module [[12-modules/mod_cgi|mod_cgi]]. Si [[13-directives/options|Options]] `IncludesNOEXEC` est définie, cette commande est désactivée. Les attributs disponibles sont :

**`cgi`**

La valeur spécifie un chemin URL vers le script CGI (encodé avec caractères %). Si le chemin ne commence pas par un slash (/), il est considéré comme relatif au document courant. Le document référencé par ce chemin est invoqué en tant que script CGI, même s'il n'est pas censé être reconnu comme tel par le serveur. Les scripts CGI doivent cependant être activés dans le répertoire qui contient les scripts (via la directive [[13-directives/scriptalias|ScriptAlias]] ou l'[[13-directives/options|Options]] `ExecCGI`).

Le `PATH_INFO` et la chaîne d'arguments (`QUERY_STRING`) de la requête originale du client sont fournis au script CGI ; ils *ne peuvent pas* être spécifiés dans le chemin de l'URL. Le script disposera des variables include en plus de l'environnement standard [[12-modules/mod_cgi|CGI]].

**Exemple**

```
<!--#exec cgi="/cgi-bin/exemple.cgi" -->
```

Si, à la place d'un flux de sortie, le script renvoie un en-tête `Location:`, ce dernier sera traduit en ancrage HTML.

L'élément `include virtual` doit être préféré à `exec cgi`. En particulier, si vous devez transmettre des arguments supplémentaires à un programme CGI en utilisant la chaîne d'arguments de la requête, c'est impossible avec `exec cgi`, mais vous pouvez y parvenir avec `include virtual` comme suit :

```
<!--#include virtual="/cgi-bin/exemple.cgi?argument=valeur" -->
```

**`cmd`**

Le serveur va exécuter la commande fournie en utilisant `/bin/sh`. La commande dispose des variables include, en plus du jeu habituel de variables CGI.

Il est toujours préférable d'utiliser `#include virtual` à la place de `#exec cgi` ou `#exec cmd`. `#include virtual` utilise le mécanisme standard des sous-requêtes d'Apache pour inclure des fichiers ou des scripts. Il a fait l'objet de tests plus approfondis et sa maintenance est mieux suivie.

De plus, sur certaines plate-formes, comme Win32, et sous unix, si l'on utilise [[11-guides/01-generalites/support-suexec|suexec]], il est impossible de transmettre des arguments à une commande dans une directive `exec`, à moins d'insérer des espaces dans la commande. Ainsi, alors que ce qui suit fonctionnera sous unix avec une configuration sans suexec, l'effet produit ne sera pas celui désiré sous Win32, ou dans le cas de l'utilisation de suexec :

```
<!--#exec cmd="perl /chemin/vers/script_perl arg1 arg2" -->
```

### L'élément fsize

Cette commande permet d'afficher la taille du fichier spécifié en fonction des spécifications de format de `sizefmt`. Attributs :

**`file`**

La valeur est le chemin du fichier, relatif au répertoire contenant le document en cours d'interprétation.

```
    Ce fichier a une taille de <!--#fsize file="mod_include.html"
--> octets.
```

La valeur de `file` ne peut pas faire référence à un fichier situé à un niveau supérieur de l'arborescence du répertoire courant ou en dehors de la racine des documents ; il ne peut donc ni commencer par un slash, ni contenir la séquence de caractères `../`. Si c'est le cas, le message d'erreur `The given path was above the root path` sera renvoyé.

**`virtual`**

La valeur est un chemin URL (codé avec caractères %). S'il ne commence pas par un slash (/), il est considéré comme relatif au document courant. Notez que cette commande n'affiche *pas* la taille de la sortie d'un programme CGI, mais la taille du programme CGI lui-même.

```
    Ce fichier a une taille de <!--#fsize
virtual="/docs/mod/mod_include.html" --> octets.
```

Notez que dans la plupart des cas, ces deux attributs sont identiques. Cependant, l'attribut `file` ne respecte pas les aliases URL-space.

### L'élément flastmod

Cette commande permet d'afficher la date de dernière modification du fichier spécifié, en fonction des spécifications de format de `timefmt`. Les attributs sont les mêmes que ceux de la commande `fsize`.

### L'élément include

Cette commande permet d'insérer le texte d'un autre document ou fichier dans le fichier en cours d'interprétation. Tout fichier inclus est soumis au contrôle d'accès habituel. Si [[13-directives/options|Options]] `IncludesNOEXEC` est défini pour le répertoire contenant le fichier interprété, seuls les documents possèdant un type MIME de type texte (`text/plain`, `text/html`, etc...) seront inclus. Les scripts CGI, quant à eux, sont invoqués de manière habituelle en utilisant l'URL complète fournie avec la commande, y compris toute chaîne d'arguments éventuelle.

Un attribut définit le chemin du document à inclure, et peut apparaître plusieurs fois dans l'élément à inclure ; en retour, pour chaque attribut fourni à la commande include, une inclusion est effectuée. Les attributs disponibles sont :

**`file`**

La valeur est un chemin relatif au répertoire contenant le fichier en cours d'interprétation. Elle ne peut ni contenir `../`, ni être un chemin absolu. Ainsi, vous ne pouvez pas inclure de fichiers situés en dehors de l'arborescence du site web ou dans un niveau supérieur à celui du fichier courant dans cette arborescence. Il est toujours préférable d'utiliser l'attribut `virtual`.

**`virtual`**

La valeur est un chemin URL (codé avec caractères %). L'URL ne peut contenir qu'un chemin et une chaîne d'arguments éventuelle, à l'exclusion de tout protocole ou nom d'hôte. S'il ne commence pas par un slash (/), il est considéré comme relatif au document courant.

Une URL est construite à partir de l'attribut, et la sortie que renverrait le serveur si l'URL était accédée par le client est incluse dans la sortie interprétée. Les inclusions de fichiers peuvent ainsi être imbriquées.

Si l'URL spécifiée correspond à un programme CGI, le programme sera exécuté, et son flux de sortie inséré à la place de la directive dans le fichier interprété. Vous pouvez insérer une chaîne d'arguments dans une URL correspond à un programme CGI :

```
<!--#include virtual="/cgi-bin/exemple.cgi?argument=valeur" -->
```

`include virtual` doit être préféré à `exec cgi` pour inclure le flux de sortie d'un programme CGI dans un document HTML.

Si la directive [[13-directives/keptbodysize|KeptBodySize]] est correctement définie et valide pour le fichier inclus, les tentatives de requêtes POST vers le document HTML qui inclut des fichiers seront transmises aux sous-requêtes en tant que requêtes POST elles-mêmes. Sans cette directive, toutes les sous-requêtes sont traitées en tant que requêtes GET.

**`onerror`**

La valeur est un chemin-URL (codé-%) qui est affiché si une tentative précédente d'inclure un fichier ou un attribut virtuel a échoué. Pour produire son effet, cet attribut doit être spécifié après le fichier ou les attributs virtuels concernés. Si la tentative d'inclure le chemin onerror échoue, ou si onerror n'est pas spécifié, c'est le message d'erreur par défaut qui sera inclus.

```xml
# Exemple simple
<!--#include virtual="/not-exist.html" onerror="/error.html" -->
```

```xml
# Chemins onerror dédiés
<!--#include virtual="/path-a.html" onerror="/error-a.html" virtual="/path-b.html" onerror="/error-b.html" -->
```

### L'élément printenv

Cette commande affiche la liste en mode texte de toutes les variables et de leurs valeurs. Les caractères spéciaux sont encodés `entity` avant d'être affichés (se reporter à l'élément `echo` pour plus de détails). Cette commande ne comporte pas d'attributs.

**Exemple**

```
<pre>
  <!--#printenv -->
</pre>
```

### L'élément set

Cette commande permet de définir la valeur d'une variable. Les attributs sont :

**`var`**

Le nom de la variable à définir.

**`value`**

La valeur à affecter à la variable.

**`decoding`**

Spécifie si Apache doit effectuer un décodage dans la variable avant son traitement ultérieur. La valeur par défaut est `none`, et dans ce cas, aucun décodage n'est effectué. Si la valeur est `url`, `urlencoded`, `base64` ou `entity`, c'est un décodage de type URL, application/x-www-form-urlencoded, base64 ou entité HTML qui sera respectivement effectué. Il est possible d'effectuer plusieurs décodages en spécifiant plusieurs valeurs séparées par des virgules. Les spécifications de décodages restent valables jusqu'au prochain attribut de décodage, ou la fin de l'élément. Pour être pris en compte, l'attribut de `décodage` doit *précéder* l'attribut `var` correspondant.

**`encoding`**

Spécifie la manière dont Apache va encoder les caractères spéciaux que la variable contient avant leur affichage. S'il est défini à `none`, aucun encodage ne sera effectué. Si la valeur est `url`, `urlencoding`, `base64` ou `entity`, c'est un encodage de type URL, application/x-www-form-urlencoded, base64 ou entité HTML qui sera respectivement effectué. Il est possible de spécifier plusieurs types d'encodage en les séparant par des virgules. La spécification du type d'encodage fera effet jusqu'à la définition d'un nouvel attribut encoding ou la fin de l'élément. Pour produire son effet, l'attribut `encoding` doit précéder l'attribut `var` concerné. Les encodages sont effectués après les opérations de décodage.

**Exemple**

```
<!--#set var="category" value="help" -->
```

## Variables include

À l'instar des variables de l'environnement CGI standard, ces variables sont mises à la disposition de la commande `echo`, des opérateurs conditionnels `if` et `elif`, et de tout programme invoqué par le document.

**`DATE_GMT`**

La date GMT (Greenwich Mean Time) courante.

**`DATE_LOCAL`**

La date locale courante.

**`DOCUMENT_ARGS`**

Cette variable contient la chaîne de paramètres de la requête du document SSI actif, ou la chaîne vide si aucune chaîne de paramètres de requête n'est incluse. Pour les sous-requêtes invoquées par la directive SSI `include`, `QUERY_STRING` contiendra la chaîne de paramètres de la sous-requête et `DOCUMENT_ARGS` la chaîne de paramètres du document SSI (disponible à partir de la version 2.4.19 du serveur HTTP Apache).

**`DOCUMENT_NAME`**

Le nom de base du fichier demandé par l'utilisateur (sans son chemin).

**`DOCUMENT_PATH_INFO`**

La partie terminale du chemin du fichier. Voir la directive [[13-directives/acceptpathinfo|AcceptPathInfo]] pour plus d'informations à propos de `PATH_INFO`.

**`DOCUMENT_URI`**

Le chemin URL (caractères % décodés) du document demandé par l'utilisateur. Notez que dans le cas d'inclusions de fichiers imbriquées, il ne s'agit *pas* de l'URL du document courant. Notez également que si l'URL est modifiée en interne (par exemple via une directive [[13-directives/alias|alias]] ou [[13-directives/directoryindex|directoryindex]]), c'est l'URL modifiée que contiendra la variable.

**`LAST_MODIFIED`**

La date de dernière modification du document demandé par l'utilisateur.

**`QUERY_STRING_UNESCAPED`**

Si une chaîne d'arguments est présente dans la requête pour le document SSI actif, elle sera affectée à cette variable, les caractères %-décodés, et éventuellement *échappés* pour qu'ils ne soient pas interprétés par le shell (les caractères spéciaux comme `&`,etc... sont précédés d'anti-slashes). Cette variable n'est pas définie si aucune chaîne d'arguments n'est présente. Utilisez `DOCUMENT_ARGS` si l'échappement des caractères du shell n'est pas souhaité.

**`USER_NAME`**

Le nom d'utilisateur du propriétaire du fichier.

## Substitution de variable

Une substitution de variable à l'intérieur d'une chaîne entre guillemets s'effectue dans la plupart des situations où cette dernière peut raisonablement constituer un argument d'une directive SSI. Sont concernées les directives `config`, `exec`, `flastmod`, `fsize`, `include`, `echo`, et `set`. Si la directive [[13-directives/ssilegacyexprparser|SSILegacyExprParser]] est définie à `on`, la substitution s'effectue aussi dans les arguments des opérateurs conditionnels. Vous pouvez insérer un signe dollar en tant que caractère littéral dans une chaîne en utilisant un anti-slash :

```
<!--#set var="cur" value="\$test" -->
```

Si une référence de variable doit être substituée au beau milieu d'une séquence de caractères qui pourrait être elle-même considérée comme un identifiant valide, l'ambiguïté peut être levée en entourant la référence d'accolades, à la manière du shell :

```
<!--#set var="Zed" value="${REMOTE_HOST}_${REQUEST_METHOD}" -->
```

Dans cet exemple, la variable `Zed` se verra affecter la valeur "`X_Y`" si `REMOTE_HOST` et `REQUEST_METHOD` contiennent respectivement "`X`" et "`Y`".

## Eléments de contrôle d'inclusion conditionnelle

Les éléments de base du contrôle d'inclusion conditionnelle sont :

```xml
<!--#if expr="test_condition" -->
<!--#elif expr="test_condition" -->
<!--#else -->
<!--#endif -->
```

L'élément `if` fonctionne de la même manière que la directive if d'un langage de programmation. La condition est évaluée et si le résultat est vrai, le texte qui suit jusqu'au prochain élément `elif`, `else` ou `endif` sera inclus dans le flux de sortie.

Les éléments `elif` ou `else` permettent d'insérer du texte dans le flux de sortie si *test\_condition* s'est révélé faux. Ces éléments sont optionnels.

L'élément `endif` termine le bloc de traitement conditionnel `if` et est obligatoire.

*test\_condition* est une expression booléenne qui emprunte la syntaxe [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]]. La directive [[13-directives/ssilegacyexprparser|SSILegacyExprParser]] permet de modifier cette syntaxe pour la rendre compatible avec Apache HTTPD 2.2.x.

Le jeu de variables SSI avec l'élément `var` sont exportées vers l'environnement de la requête et sont accessibles via la fonction `reqenv`. Pour faire simple, le nom de fonction `v` est aussi disponible dans le module [[12-modules/mod_include|mod_include]].

Dans l'exemple suivant, "depuis le réseau local" sera affiché si l'adresse IP du client appartient au sous-réseau 10.0.0.0/8.

```xml
<!--#if expr='-R "10.0.0.0/8"' -->
  depuis le réseau local
<!--#else -->
  depuis ailleurs
<!--#endif -->
```

Dans l'exemple suivant, "foo vaut bar" sera affiché si la variable `foo` contient la valeur "bar".

```xml
<!--#if expr='v("foo") = "bar"' -->
  foo vaut bar
<!--#endif -->
```

> [!NOTE]
> **Documentation de référence**
>
> Voir aussi [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]] pour une référence complète et des exemples. Les fonctions *restricted* ne sont pas disponibles dans [[12-modules/mod_include|mod_include]].

## Syntaxe des expressions héritée

Cette section décrit la syntaxe de l'élément `#if expr` dans le cas où la directive [[13-directives/ssilegacyexprparser|SSILegacyExprParser]] est définie à `on`.

**`chaîne`**

vrai si *chaîne* n'est pas vide

**`-A string`**

vrai si l'URL que contient la chaîne est accessible du point de vue de la configuration, faux sinon. Il s'avère utile lorsqu'un lien vers une URL doit être caché aux utilisateurs qui ne sont pas autorisés à voir cette URL. Notez que le test porte sur l'autorisation d'accès à l'URL, et non sur son existence.

**Exemple**

```xml
<!--#if expr="-A /prive" -->
  Cliquez <a href="/prive">ici</a> pour accéder aux
  informations privées.
<!--#endif -->
```

**`chaîne1 = chaîne2 chaîne1 == chaîne2 chaîne1 != chaîne2`**

Compare *chaîne1* à *chaîne2*. Si *chaîne2* est de la forme `/chaîne2/`, elle est traitée comme une expression rationnelle. Les expressions rationnelles sont implémentées par le moteur [PCRE](http://www.pcre.org) et possèdent la même syntaxe que celles de [perl 5](http://www.perl.com). Notez que `==` n'est qu'un alias pour `=` et se comporte exactement de la même manière que ce dernier.

Si vous faites une comparaison directe (`=` ou `==`), vous pouvez extraire des parties de l'expression rationnelle. Les parties extraites sont stockées dans les variables spéciales `$1` .. `$9`. L'ensemble de la chaîne correspondant à l'expression rationnelle est stocké dans la variable spéciale `$0`.

**Exemple**

```xml
<!--#if expr="$QUERY_STRING = /^sid=([a-zA-Z0-9]+)/" -->
<!--#set var="session" value="$1" -->
<!--#endif -->
```

**`chaîne1 < chaîne2 chaîne1 <= chaîne2 chaîne1 > chaîne2 chaîne1 >= chaîne2`**

Compare *chaîne1* à *chaîne2*. Notez que les chaînes sont comparées de manière *littérale* (en utilisant `strcmp(3)`). Ainsi, la chaîne "100" est inférieure à "20".

**`( test_condition )`**

vrai si *test\_condition* est vrai

**`! test_condition`**

vrai si *test\_condition* est faux

**`test_condition1 && test_condition2`**

vrai si *test\_condition1* et *test\_condition2* sont tous les deux vrais

**`test_condition1 || test_condition2`**

vrai si au moins un des tests *test\_condition1* ou *test\_condition2* est vrai

"`=`" et "`!=`" ont une priorité supérieure à "`&&`" et "`||`". "`!`" a la priorité la plus haute. Ainsi, les deux directives suivantes sont équivalentes :

```xml
<!--#if expr="$a = test1 && $b = test2" -->
<!--#if expr="($a = test1) && ($b = test2)" -->
```

Les opérateurs booléens `&&` et `||` ont la même priorité. Ainsi, si vous voulez augmenter la priorité d'un de ces opérateurs, vous devez utiliser des parenthèses.

Tout ce qui n'est pas reconnu comme variable ou opérateur est traité comme une chaîne. Les chaînes peuvent aussi être entourées d'apostrophes : `'chaîne'`. Les chaînes sans apostrophe ne peuvent pas contenir d'espaces (espaces ou tabulations) car ceux-ci servent à séparer certains éléments comme les variables. Si plusieurs chaînes se trouvent dans une ligne, elles sont concaténées en utilisant des espaces. Ainsi,

```
chaîne1 chaîne2 devient chaîne1 chaîne2

et

'chaîne1 chaîne2' devient chaîne1 chaîne2.
```

> [!NOTE]
> **Optimisation des expressions booléennes**
>
> Si les expressions atteignent une complexité suffisante pour ralentir les traitements de manière significative, vous pouvez essayer de les optimiser en fonction des règles d'évaluation :
>
> - Les expressions sont évaluées de la gauche vers la droite
> - Les opérateurs booléens binaires (`&&` et `||`) font l'objet d'une évaluation abrégée chaque fois que cela est possible. En d'autres termes, et selon la règle ci-dessus, [[12-modules/mod_include|mod_include]] évalue tout d'abord la partie gauche de l'expression. Si le résultat de l'évaluation de cette partie gauche suffit à déterminer le résultat final, l'évaluation s'arrête ici. Dans le cas contraire, la partie droite est évaluée, et le résultat final tient compte des résultats des évaluations des parties gauche et droite.
> - L'évaluation abrégée est désactivée tant qu'il reste des expressions régulières à traiter. Ces dernières doivent être évaluées afin de définir les variables correspondant aux références arrières (`$1` .. `$9`).
>
> Si vous voulez déterminer la manière dont une expression est traitée, vous pouvez recompiler [[12-modules/mod_include|mod_include]] en utilisant l'option de compilation `-DDEBUG_INCLUDE`. Ceci a pour effet d'insérer, pour chaque expression interprétée, des informations étiquetées, l'arbre d'interprétation et la manière dont elle est évaluée au sein du flux de sortie envoyé au client.

> [!NOTE]
> **Slashes d'échappement dans les expressions rationnelles**
>
> Tous les caractères slashes qui ne sont pas des séparateurs dans votre expression rationnelle doivent être échappés, et ceci sans tenir compte de leur signification du point de vue du moteur d'expressions rationnelles.

> [!NOTE]
> **Documentation de référence**
>
> Voir le document [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]], pour une référence complète et des exemples.

## Directives

- [[13-directives/ssiendtag|SSIEndTag]]
- [[13-directives/ssiundefinedecho|SSIUndefinedEcho]]
- [[13-directives/ssierrormsg|SSIErrorMsg]]
- [[13-directives/ssistarttag|SSIStartTag]]
- [[13-directives/ssitimeformat|SSITimeFormat]]
- [[13-directives/ssietag|SSIETag]]
- [[13-directives/ssilastmodified|SSILastModified]]
- [[13-directives/ssilegacyexprparser|SSILegacyExprParser]]
- [[13-directives/xbithack|XBitHack]]

## Voir aussi

- [[13-directives/options|Options]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
