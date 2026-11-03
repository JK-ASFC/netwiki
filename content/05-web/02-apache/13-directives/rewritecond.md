---
title: "RewriteCond"
description: "Directive Apache RewriteCond (mod_rewrite) — Définit une condition qui devra être satisfaite pour que la réécriture soit effectuée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une condition qui devra être satisfaite pour que la réécriture soit effectuée |
| **Syntaxe** | `RewriteCond TestString [!]CondPattern [flags]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |

## Utilisation

La directive `RewriteCond` permet de définir une condition d'exécution d'une règle. Une ou plusieurs conditions `RewriteCond` peuvent précéder une directive [[13-directives/rewriterule|RewriteRule]]. La règle de réécriture correspondante n'est ainsi exécutée que si ces conditions sont satisfaites, **et** si l'URI correspond au modèle spécifié dans la règle.

Si *CondPattern* est préfixé par un `!`, la condition ne sera évaluée à vrai que si *CondPattern* ne correspond pas.

**TestString**

*TestString* est une chaîne qui peut contenir les extensions suivantes en plus du texte simple :

**Références arrières**

**`$N` — Références arrières des règles RewriteRule**

Les références arrières de la forme `$N` (0 \<= N \<= 9). $1 à $9 permettent d'accéder aux parties regroupées (entre parenthèses) du modèle, issues de la `RewriteRule` concernée par le jeu de conditions `RewriteCond` courant. $0 donne accès à l'ensemble de la chaîne correspondant au modèle.

**`%N` — Références arrières des conditions RewriteCond**

Les références arrières de la forme `%N` (0 \<= N \<= 9). %1 à %9 permettent d'accéder aux parties regroupées (entre parenthèses) du modèle, issues de la dernière condition `RewriteCond` satisfaite du jeu de conditions `RewriteCond` courant. %0 donne accès à l'ensemble de la chaîne correspondant au modèle.

> [!NOTE]
> Les références arrières ne sont définies que si le motif correspond. Si le motif est préfixé de `!`, aucune référence arrière ne sera donc définie. Voir le document [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|La manière dont le jeu de règles est appliqué]] pour plus de détails à propos de l’ordre dans lequel les motifs sont mis en correspondance et les références arrières définies.

**Développement des mappages RewriteMap**

Ce sont des développements de la forme **`${mapname:key|default}`**. Voir la documentation de RewriteMap pour plus de détails.

**Le serveur et les variables CGI**

Ce sont des variables de la forme **`%{` *NAME\_OF\_VARIABLE* `}`** où *NAME\_OF\_VARIABLE* peut être une des chaînes de la liste suivante :

| En-têtes HTTP : | connexion & requête: |   |
| --- | --- | --- |
| HTTP\_ACCEPT HTTP\_COOKIE HTTP\_FORWARDED HTTP\_HOST HTTP\_PROXY\_CONNECTION HTTP\_REFERER HTTP\_USER\_AGENT | AUTH\_TYPE CONN\_REMOTE\_ADDR CONTEXT\_PREFIX CONTEXT\_DOCUMENT\_ROOT IPV6 PATH\_INFO QUERY\_STRING REMOTE\_ADDR REMOTE\_HOST REMOTE\_IDENT REMOTE\_PORT REMOTE\_USER REQUEST\_METHOD SCRIPT\_FILENAME |   |
| variables internes au serveur : | date et heure : | spéciaux : |
| DOCUMENT\_ROOT SCRIPT\_GROUP SCRIPT\_USER SERVER\_ADDR SERVER\_ADMIN SERVER\_NAME SERVER\_PORT SERVER\_PROTOCOL SERVER\_SOFTWARE | TIME\_YEAR TIME\_MON TIME\_DAY TIME\_HOUR TIME\_MIN TIME\_SEC TIME\_WDAY TIME | API\_VERSION CONN\_REMOTE\_ADDR HTTPS IS\_SUBREQ REMOTE\_ADDR REQUEST\_FILENAME REQUEST\_SCHEME REQUEST\_URI THE\_REQUEST |

Ces variables correspondent toutes aux en-têtes MIME HTTP de mêmes noms, au variables C du serveur HTTP Apache, ou aux champs `struct tm` du système Unix. La plupart d'entre elles sont documentées dans la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation des expressions]], dans la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|documentation des variables d’environnement]] ou dans la spécification de CGI ([RFC 3875](https://www.rfc-editor.org/rfc/rfc3875)).

SERVER\_NAME et SERVER\_PORT dépendent respectivement des valeurs des directives [[13-directives/usecanonicalname|UseCanonicalName]] et [[13-directives/usecanonicalphysicalport|UseCanonicalPhysicalPort]].

Les variables SCRIPT\_FILENAME et REQUEST\_FILENAME contiennent la même valeur — la valeur du champ `filename` de la structure interne `request_rec` du serveur HTTP Apache. Le premier nom est plus connu en tant que nom de variable CGI alors que le second est la contrepartie appropriée de REQUEST\_URI (qui contient la valeur du champ `uri` de la structure `request_rec`).

Si une substitution se produit et que la réécriture continue, la valeur des deux variables sera mise à jour en conséquence.

Si elles sont utilisées dans un contexte global au serveur (c’est-à-dire avant que la requête ne soit mise en parallèle avec le système de fichiers), SCRIPT\_FILENAME et REQUEST\_FILENAME ne peuvent pas contenir le chemin complet du système de fichiers local, car le chemin est inconnu à ce stade du traitement. Dans ce cas, les deux variables contiendront initialement la valeur de REQUEST\_URI. Pour obtenir le chemin complet du système de fichiers local correspondant à la requête, Utilisez une projection vers l’avant à base d’URL `%{LA-U:REQUEST_FILENAME}` pour déterminer la valeur finale de REQUEST\_FILENAME.

Parmi les variables spécifiques à [[12-modules/mod_rewrite|mod_rewrite]], ou trouve les suivantes :

**`API_VERSION`**

C'est la version de l'API des modules Apache httpd (l'interface interne entre le serveur et les modules) pour la construction courante de httpd, telle qu'elle est définie dans include/ap\_mmn.h. La version de l'API des modules correspond à la version du serveur Apache httpd utilisé (par exemple, pour la version 1.3.14 d'Apache httpd, il s'agit de la version 19990320:10), mais intéresse principalement les auteurs de modules.

**`CONN_REMOTE_ADDR`**

A partir de la version 2.4.8 : l'adresse IP distante de la connexion (voir le module [[12-modules/mod_remoteip|mod_remoteip]]).

**`HTTPS`**

Contient le texte "on" si la connexion utilise SSL/TLS, "off" dans le cas contraire (Cette variable peut être utilisée sans problème, que [[12-modules/mod_ssl|mod_ssl]] soit chargé ou non).

**`IS_SUBREQ`**

Contient le texte "true" si la requête en cours de traitement est une sous-requête, "false" dans le cas contraire. Une sous-requête est générée quand un module a besoin de se référer à des fichiers ou URIs addidionnels pour pouvoir mener à bien sa tâche.

**`REMOTE_ADDR`**

L'adresse IP de l'hôte distant (se référer au module [[12-modules/mod_remoteip|mod_remoteip]]).

**`REQUEST_FILENAME`**

Le chemin complet local au système de fichiers du fichier ou du script correspondant à la requête, s'il a déjà été déterminé par le serveur au moment où on y fait référence. Dans le cas contraire, et en particulier dans le cas d'un serveur virtuel, `REQUEST_FILENAME` contient la valeur de `REQUEST_URI`. En fonction de la valeur de la directive [[13-directives/acceptpathinfo|AcceptPathInfo]], le serveur peut n'utiliser que certains éléments de tête du `REQUEST_URI` pour déterminer à quel fichier correspond la requête.

**`REQUEST_SCHEME`**

Contient le protocole de la requête (en général "http" ou "https"). La valeur peut être modifiée par la directive [[13-directives/servername|ServerName]].

**`REQUEST_URI`**

La partie chemin de l'URI de la requête, comme "/index.html". Ceci exclut en particulier la chaîne de paramètres de la requête qui est contenue dans la variable `QUERY_STRING`. La valeur renvoyée pour `REQUEST_URI` a déjà été %-décodée ; pour la recoder, passez-la à la fonction de mappage "escape". Notez que cette variable de serveur est distincte de la variable d’environnement CGI de même nom : dans un contexte CGI, `REQUEST_URI` contient l’URI original complet de la requête, y compris la chaîne de paramètres. Voir la directive [[13-directives/cgivar|CGIVar]] pour les détails.

**`THE_REQUEST`**

La ligne de requête HTTP complète envoyée par le navigateur au serveur (par exemple, "`GET /index.html HTTP/1.1`"), à l'exclusion de tout en-tête ajouté par le navigateur. Cette valeur n'a pas été déséchappée (décodée), à la différence de la plupart des variables suivantes.

**Consultation de variables préfixées**

En plus des variables de serveur ci-avant, la syntaxe `%{PREFIX:name}` permet d’accéder à des ressources supplémentaires :

**`%{ENV:variable}`**

Où *variable* peut correspondre à n’importe quelle variable d’environnement. Peut être consulté via des structures internes d'Apache httpd et (si on ne les trouve pas ici) via la fonction `getenv()` à partir du processus du serveur Apache httpd.

**`%{SSL:variable}`**

Où *variable* est le nom d’une [[12-modules/mod_ssl|variable d’environnement SSL]]. Cette variable peut être utilisée que [[12-modules/mod_ssl|mod_ssl]] soit chargé ou non, mais elle sera toujours développée en une chaîne vide si [[12-modules/mod_ssl|mod_ssl]] n’est pas chargé. Exemple : `%{SSL:SSL_CIPHER_USEKEYSIZE}` pourra contenir la valeur `128`. Ces variables sont disponibles même si l'option `StdEnvVars` de la directive [[13-directives/ssloptions|SSLOptions]] n'a pas été définie.

**`%{HTTP:header}`**

Où *header* peut correspondre à n’importe quel nom d’en-tête MIME HTTP. Cette variable peut toujours être utilisée pour obtenir la valeur d'un en-tête envoyé dans la requête HTTP. Par exemple, `%{HTTP:Proxy-Connection}` contiendra la valeur de l'en-tête HTTP "`Proxy-Connection:`". Si on utilise un en-tête HTTP dans une condition, et si cette condition est évaluée à `vrai` pour la requête, cet en-tête sera ajouté à l'en-tête Vary de la réponse. Il ne le sera pas si la condition est évaluée à `faux`. L'ajout de l'en-tête HTTP à l'en-tête Vary est nécessaire à une mise en cache appropriée.

Il faut garder à l'esprit que les conditions suivent une logique de cout-circuit si le drapeau '**`ornext|OR`**' est utilisé, et que de ce fait, certaines d'entre elles ne seront pas évaluées.

**Sous-requêtes de projection vers l’avant**

Ces formes génèrent une sous-requête interne pour déterminer la valeur finale d’une variable qui n’est pas encore disponible à ce stade du traitement :

**`%{LA-U:variable}`**

Génère une sous-requête interne (à base d’URL) pour déterminer la valeur finale de *variable*. Ceci permet d'accéder à la valeur d'une variable pour la réécriture inconnue à ce stade du traitement, mais qui sera définie au cours d'une phase ultérieure.

Par exemple, pour effectuer une réécriture dépendant de la variable `REMOTE_USER` dans le contexte du serveur principal (fichier `httpd.conf`), vous devez utiliser `%{LA-U:REMOTE_USER}` - cette variable est définie par la phase d'autorisation qui intervient *après* la phase de traduction d'URL (pendant laquelle [[12-modules/mod_rewrite|mod_rewrite]] opère).

Par contre, comme [[12-modules/mod_rewrite|mod_rewrite]] implémente son contexte de répertoire (fichier `.htaccess`) via la phase Fixup de l'API, et comme la phase d'autorisation intervient *avant* cette dernière, vous pouvez vous contenter d'utiliser `%{REMOTE_USER}` dans ce contexte.

**`%{LA-F:variable}`**

Génère une sous-requête interne (à base de nom de fichier) pour déterminer la valeur finale de la *variable*. Identique la plupart du temps à LA-U ci-dessus.

**Syntaxe des expressions**

Si la chaîne *TestString* contient la valeur spéciale `expr`, le motif *CondPattern* sera traité comme une expression [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]]. Les en-têtes HTTP référencés dans l’expression seront ajoutés à l’en-tête Vary si le drapeau `novary` n’a pas été spécifié.

**CondPattern**

*CondPattern* est une expression rationnelle qui est appliquée à l'instance actuelle de *TestString*. *TestString* est d'abord évaluée, puis comparée à l'*CondPattern*.

*CondPattern* est en général une expression rationnelle, mais vous disposez des syntaxes supplémentaires suivantes pour effectuer d'autres tests utiles sur *TestString* :

Vous pouvez préfixer l'expression avec un caractère '`!`' (point d'exclamation) pour inverser le résultat de la condition, quelle que soit l'*expression de comparaison* utilisée.

**Comparaisons de chaînes**

**\<expression**

inférieur au sens lexicographique
Traite l'*expression* comme une chaîne de caractères et la compare lexicographiquement à *TestString*. La condition est satisfaite si *TestString* est inférieure au sens lexicographique à l'*expression*.

**\>expression**

supérieur au sens lexicographique
Traite l'*expression* comme une chaîne de caractères et la compare lexicographiquement à *TestString*. La condition est satisfaite si *TestString* est supérieure au sens lexicographique à l'*expression*.

**=expression**

égal au sens lexicographique
Traite l'*expression* comme une chaîne de caractères et la compare lexicographiquement à *TestString*. La condition est satisfaite si *TestString* est égale au sens lexicographique à l'*expression* (les deux chaînes sont exactement identiques, caractère pour caractère). Si *expression* est `""` (deux guillemets), *TestString* est comparée à la chaîne vide.

**\<=expression de comparaison**

inférieur ou égal à au sens lexicographique
Considère la *CondPattern* comme une chaîne de caractères et la compare au sens lexicographique à la *TestString*. Vrai si *TestString* précède lexicographiquement *CondPattern*, ou est égale à *CondPattern* (les deux chaînes sont identiques, caractère pour caractère).

**\>=expression de comparaison**

supérieur ou égal à au sens lexicographique
Considère la *CondPattern* comme une chaîne de caractères et la compare au sens lexicographique à la *TestString*. Vrai si *TestString* suit lexicographiquement *CondPattern*, ou est égale à *CondPattern* (les deux chaînes sont identiques, caractère pour caractère).

> [!NOTE]
> **Note**
>
> L'opérateur de comparaison de chaînes fait partie des arguments de la *CondPattern* et doit par conséquent se trouver entre les guillemets s'ils sont présents. Exemple :
>
> ```apache
> RewriteCond %{HTTP_USER_AGENT} "=This Robot/1.0"
> ```

**Comparaisons d’entiers**

**-eq**

est numériquement égal à
*TestString* est considérée comme un entier, et est comparée numériquement à l'*expression de comparaison*. Vrai si les deux expressions sont numériquement égales.

**-ge**

est numériquement supérieur ou égal à
*TestString* est considérée comme un entier, et est comparée numériquement à l'*expression de comparaison*. Vrai si *TestString* est numériquement supérieure ou égale à *CondPattern*.

**-gt**

est numériquement supérieur à
*TestString* est considérée comme un entier, et est comparée numériquement à l'*expression de comparaison*. Vrai si *TestString* est numériquement supérieure à *CondPattern*.

**-le**

est numériquement inférieur ou égal à
*TestString* est considérée comme un entier, et est comparée numériquement à l'*expression de comparaison*. Vrai si *TestString* est numériquement inférieure ou égale à *CondPattern*. Attention à la confusion avec le drapeau **-l** en utilisant la variante the **-L** ou **-h**.

**-lt**

est numériquement inférieur à
*TestString* est considérée comme un entier, et est comparée numériquement à l'*expression de comparaison*. Vrai si *TestString* est numériquement inférieure à *CondPattern*. Attention à la confusion avec le drapeau **-l** en utilisant la variante the **-L** ou **-h**.

**-ne**

Est numériquement **n**on **é**gal à
La *Chaîne de test* est considérée comme un entier et est numériquement comparée à l'*expression de comparaison*. Vrai si les deux éléments comparés sont numériquement différents. Equivalent à `!-eq`.

**Tests des attributs de fichier**

**-d**

est un **r**épertoire
Traite *TestString* comme un chemin et vérifie s'il existe ou pas, et s'il s'agit d'un répertoire.

**-f**

est un **f**ichier régulier
Traite *TestString* comme un chemin et vérifie s'il existe ou pas, et s'il s'agit d'un fichier régulier.

**-F**

test de l'existence d'un fichier via une sous-requête
Vérifie si *TestString* est un fichier valide, accessible à travers tous les contrôles d'accès du serveur actuellement configurés pour ce chemin. C'est une sous-requête interne qui effectue cette vérification - à utiliser avec précautions car les performances du serveur peuvent s'en trouver affectées !

**-h**

est un lien symbolique, selon la convention bash
Voir **-l**.

**-l**

est un **l**ien symbolique
Considère la *TestString* comme un chemin et vérifie son existence et si elle est un lien symbolique. On peut aussi utiliser la convention bash **-L** ou **-h** lorsqu'il y a risque de confusion avec les tests **-lt** ou **-le**.

**-L**

est un lien symbolique, selon la convention bash
Voir **-l**.

**-s**

est un fichier régulier d'une certaine taille
Considère la *TestString* comme un chemin et vérifie son existence et si elle est un fichier régulier d'une taille supérieure à zéro.

**-U**

test de l'existence d'une URL via une sous-requête
Vérifie si *TestString* est une URL valide, accessible à travers tous les contrôles d'accès du serveur actuellement configurés pour ce chemin. C'est une sous-requête interne qui effectue cette vérification - à utiliser avec précautions car les performances du serveur peuvent s'en trouver affectées !

Ce drapeau ne renvoie *que* des informations concernant le contrôle d'accès, l'authentification et l'autorisation. Il ne renvoie *pas* d'informations concernant le code d'état que le gestionnaire configuré (static file, CGI, proxy, etc...) aurait, quant à lui, retourné.

**-x**

a l'attribut d'exécution positionné
Considère la *TestString* comme un chemin et vérifie son existence et si elle a son attribut d'exécution positionné. Ce positionnement est déterminé en fonction de l'OS sous-jacent.

Par exemple :

```apache
RewriteCond /var/www/%{REQUEST_URI} !-f
RewriteRule ^(.+) /other/archive/$1 [R]
```

**Évaluation des expressions**

Si *TestString* contient la valeur spéciale `expr`, la *chaîne de comparaison* sera traitée en tant qu'expression rationnelle de type [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]].

Dans l'exemple ci-dessous, on utilise `-strmatch` pour comparer le `REFERER` avec le nom d'hôte du site afin de bloquer le hotlinking (référencement direct) non désiré.

```apache
RewriteCond expr "! %{HTTP_REFERER} -strmatch '*://%{HTTP_HOST}/*'"
RewriteRule "^/images" "-" [F]
```

**Drapeaux**

Vous pouvez aussi définir certains drapeaux pour la *CondPattern* en ajoutant ces **`[`*flags*`]`** comme troisième argument de la directive `RewriteCond`, où *flags* est un sous-ensemble séparé par des virgules des drapeaux suivants :

**'`nocase|NC`'**

(**n**o **c**ase)
Rend le test insensible à la casse - il n'est pas fait de distinction entre majuscules et minuscules, à la fois dans le développement de *TestString* et dans *CondPattern*. Ce drapeau n'est pris en compte que lors d'une comparaison entre *TestString* et *CondPattern*. Il ne l'est pas pour les vérification par sous-requêtes ou sur le système de fichiers.

**'`ornext|OR`'**

(**or** condition suivante)
Permet de chaîner les conditions de règles avec un OU au lieu du AND implicite. Exemple typique :

```apache
RewriteCond "%{REMOTE_HOST}"  "^host1"  [OR]
RewriteCond "%{REMOTE_HOST}"  "^host2"  [OR]
RewriteCond "%{REMOTE_HOST}"  "^host3"
RewriteRule ...règles concernant tous ces hôtes...
```

Sans ce drapeau, les paires condition/règle devraient être écrites trois fois.

**'`novary|NV`'**

(**n**o **v**ary)
Si la condition contient un en-tête HTTP, ce drapeau empêche ce dernier d'être ajouté à l'en-tête Vary de la réponse.
L'utilisation de ce drapeau peut provoquer une mise en cache incorrecte de la réponse, si la représentation de cette réponse varie avec la valeur de l'en-tête considéré. Ce drapeau ne devrait donc être utilisé que si l'on maîtrise parfaitement le fonctionnement de l'en-tête Vary.

**Exemple**

Pour réécrire la page d'accueil d'un site en fonction de l'en-tête \`\``User-Agent:`'' de la requête, vous pouvez utiliser ce qui suit :

```apache
RewriteCond  "%{HTTP_USER_AGENT}"  "(iPhone|Blackberry|Android)"
RewriteRule  "^/$"               "/homepage.mobile.html"  [L]

RewriteRule  "^/$"                 "/homepage.std.html"  [L]
```

Explications : si vous utilisez un navigateur qui s'identifie comme un navigateur de plateforme mobile (notez que l'exemple est incomplet car il existe de nombreuses autres plateformes mobiles), c'est la version pour mobile de la page d'accueil qui sera renvoyée. Dans le cas contraire, ce sera la page d'accueil standard.

Par défaut, plusieurs directives `RewriteCond` sont évaluées de manière séquentielle et combinées à l'aide d'un **ET** logique. Si une condition n'est pas vérifiée et en l'absence d'un opérateur logique **`OU`**, l'ensemble du jeu de règles est abandonné et les conditions restantes ne sont pas évaluées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
