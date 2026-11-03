---
title: "Les expressions dans le serveur HTTP Apache"
description: "Apache HTTP Server — Les expressions dans le serveur HTTP Apache. Historiquement, il existe de nombreuses variantes dans la syntaxe des expressions permettant d'exprimer une condition dans les différents modules du serveur HTTP Apache. À ce titre, des travaux sont en cours pour n'utiliser qu'une seule var"
tags: [apache, guide]
icon: book-open
---

Historiquement, il existe de nombreuses variantes dans la syntaxe des expressions permettant d'exprimer une condition dans les différents modules du serveur HTTP Apache. À ce titre, des travaux sont en cours pour n'utiliser qu'une seule variante nommée *ap\_expr*, pour toutes les directives de configuration. Ce document décrit l'interpréteur d'expressions *ap\_expr*.

Le type d'expression *ap\_expr* est appelé à remplacer la plupart des autres types d'expressions dans HTTPD. Par exemple, la directive obsolète [[13-directives/sslrequire|SSLRequire]] peut être remplacée par la directive [[12-modules/mod_authz_core|Require expr]].

## Syntaxe en Forme de Backus-Naur

La [Forme de Backus-Naur](http://fr.wikipedia.org/wiki/Forme_de_Backus-Naur) (souvent abrégée en BNF, de l'anglais Backus-Naur Form) est une notation permettant de décrire les règles syntaxiques des langages de programmation. En général, les expressions représentent des valeurs booléennes. Dans ce cas, le point de départ de la BNF est `expr`. Cependant, certaines directives comme [[13-directives/logmessage|LogMessage]] utilisent comme paramètres des expressions qui représentent des chaînes de caractères. Dans ce cas, le point de départ de la BNF est `string`.

> ```
> expr        ::= "true" | "false"
>               | "!" expr
>               | expr "&&" expr
>               | expr "||" expr
>               | "(" expr ")"
>               | comp
>
> comp        ::= stringcomp
>               | integercomp
>               | unaryop word
>               | word binaryop word
>               | word "in" "{" wordlist "}"
>               | word "in" listfunction
>               | word "=~" regex
>               | word "!~" regex
>
>
> stringcomp  ::= word "==" word
>               | word "!=" word
>               | word "<"  word
>               | word "<=" word
>               | word ">"  word
>               | word ">=" word
>
> integercomp ::= word "-eq" word | word "eq" word
>               | word "-ne" word | word "ne" word
>               | word "-lt" word | word "lt" word
>               | word "-le" word | word "le" word
>               | word "-gt" word | word "gt" word
>               | word "-ge" word | word "ge" word
>
> wordlist    ::= word
>               | wordlist "," word
>
> word        ::= word "." word
>               | digit
>               | "'" string "'"
>               | """ string """
>               | variable
>           | rebackref
>               | function
>
> string      ::= stringpart
>               | string stringpart
>
> stringpart  ::= cstring
>               | variable
>           | rebackref
>
> cstring     ::= ...
> digit       ::= [0-9]+
>
> variable    ::= "%{" varname "}"
>               | "%{" funcname ":" funcargs "}"
>
> rebackref   ::= "$" [0-9]
>
> function     ::= funcname "(" word ")"
>
> listfunction ::= listfuncname "(" word ")"
> ```

## Variables

L'interpréteur d'expressions fournit plusieurs variables de la forme `%{HTTP_HOST}`. Notez que la valeur d'une variable peut dépendre de la phase du traitement de la requête au cours de laquelle elle est évaluée. Par exemple, une expression utilisée dans une directive `<If >` sera évaluée avant la phase d'authentification. Par conséquent, la variable `%{REMOTE_USER}` ne sera pas encore définie à ce stade.

Pour des informations à propos de la définition et de la manipulation des variables d’environnement de requête (en utilisant [[13-directives/setenv|SetEnv]], [[13-directives/setenvif|SetEnvIf]], le drapeau `[E=...]` de [[12-modules/mod_rewrite|mod_rewrite]]'s et d’autres directives), voir [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Variables d’environnement dans Apache httpd]].

Les variables suivantes contiennent la valeur de l'en-tête de requête HTTP correspondant. La fonction `req` permet d'extraire les valeurs des autres en-têtes. L'utilisation de ces variables peut provoquer l'ajout du nom d'en-tête correspondant à l'en-tête Vary de la réponse HTTP, sauf spécification contraire pour la directive qui accepte l'expression comme paramètre. La function `req_novary` permet de modifier ce comportement.

| Nom |
| --- |
| `HTTP_ACCEPT` |
| `HTTP_COOKIE` |
| `HTTP_FORWARDED` |
| `HTTP_HOST` |
| `HTTP_PROXY_CONNECTION` |
| `HTTP_REFERER` |
| `HTTP_USER_AGENT` |

Autres variables liées aux requêtes

| Nom | Description |
| --- | --- |
| `REQUEST_METHOD` | La méthode HTTP de la requête entrante (par exemple `GET`) |
| `REQUEST_SCHEME` | Le protocole associé à l'URI de la requête |
| `REQUEST_URI` | La partie chemin de l'URI de la requête en excluant la chaîne de paramètres. Notez que cette variable diffère de la variable d’environnement CGI de même nom qui, quant à elle, inclut la chaîne de paramètres. |
| `DOCUMENT_URI` | Idem `REQUEST_URI` |
| `REQUEST_FILENAME` | Le chemin complet dans le système de fichiers local du fichier ou du script correspondant à la requête, si le serveur l'a dèjà déterminé à l'instant où `REQUEST_FILENAME` est référencée. Dans le cas contraire, comme dans un contexte de serveur virtuel, même valeur que `REQUEST_URI` |
| `SCRIPT_FILENAME` | Identique à `REQUEST_FILENAME` |
| `LAST_MODIFIED` | La date et heure de dernière modification du fichier au format `20101231235959`, si elle est déjà connue du serveur au moment où `LAST_MODIFIED` est référencé. |
| `SCRIPT_USER` | Le nom d'utilisateur du propriétaire du script. |
| `SCRIPT_GROUP` | Le nom du groupe auquel appartient le script. |
| `PATH_INFO` | L'information relative au nom de chemin située en fin, voir la directive [[13-directives/acceptpathinfo\|AcceptPathInfo]] |
| `QUERY_STRING` | La chaîne de paramètres de la requête courante |
| `IS_SUBREQ` | "`true`" si la requête courante est une sous-requête, "`false`" dans le cas contraire |
| `THE_REQUEST` | La requête complète (par exemple "`GET /index.html HTTP/1.1`") |
| `REMOTE_ADDR` | L'adresse IP de l'hôte distant |
| `REMOTE_PORT` | Le port de l'hôte distant (versions 2.4.26 et supérieures) |
| `REMOTE_HOST` | Le nom d'hôte de l'hôte distant |
| `REMOTE_USER` | Le nom de l'utilisateur authentifié, s'il existe (non disponible à l'intérieur d'un bloc `<If>`) |
| `REMOTE_IDENT` | Le nom de l'utilisateur défini par [[12-modules/mod_ident\|mod_ident]] |
| `SERVER_NAME` | La valeur de la directive [[13-directives/servername\|ServerName]] du serveur virtuel courant |
| `SERVER_PORT` | Le port associé au serveur virtuel courant ; voir la directive [[13-directives/servername\|ServerName]] |
| `SERVER_ADMIN` | La valeur de la directive [[13-directives/serveradmin\|ServerAdmin]] du serveur virtuel courant |
| `SERVER_PROTOCOL` | Le protocole utilisé par la requête |
| `DOCUMENT_ROOT` | La valeur de la directive [[13-directives/documentroot\|DocumentRoot]] du serveur virtuel courant |
| `AUTH_TYPE` | La valeur de la directive [[13-directives/authtype\|AuthType]] (par exemple "`basic`") |
| `CONTENT_TYPE` | Le type de contenu de la réponse (non disponible à l'intérieur d'un bloc `<If>`) |
| `HANDLER` | Le nom du [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers\|gestionnaire]] qui a généré la réponse |
| `HTTP2` | "`on`" si la requête utilise http/2, "`off`" dans le cas contraire |
| `HTTPS` | "`on`" si la requête utilise https, "`off`" dans le cas contraire |
| `IPV6` | "`on`" si la connexion utilise IPv6, "`off`" dans le cas contraire |
| `REQUEST_STATUS` | Le code d'erreur HTTP de la requête (non disponible à l'intérieur d'un bloc `<If>`) |
| `REQUEST_LOG_ID` | L'identifiant du message d'erreur associé à la requête (voir la directive [[13-directives/errorlogformat\|ErrorLogFormat]]) |
| `CONN_LOG_ID` | L'identifiant du message d'erreur associé à la connexion (voir la directive [[13-directives/errorlogformat\|ErrorLogFormat]]) |
| `CONN_REMOTE_ADDR` | L'adresse IP du correspondant pour la connexion (voir le module [[12-modules/mod_remoteip\|mod_remoteip]]) |
| `CONTEXT_PREFIX` |   |
| `CONTEXT_DOCUMENT_ROOT` |   |

Variables diverses

| Nom | Description |
| --- | --- |
| `TIME_YEAR` | L'année courante (par exemple `2010`) |
| `TIME_MON` | Le mois courant (`01`, ..., `12`) |
| `TIME_DAY` | Le jour courant dans le mois (`01`, ...) |
| `TIME_HOUR` | Les heures de la date courante (`00`, ..., `23`) |
| `TIME_MIN` | Les minutes de la date courante |
| `TIME_SEC` | Les secondes de la date courante |
| `TIME_WDAY` | Le jour de la semaine (à partir de `0` pour dimanche) |
| `TIME` | La date et heure au format `20101231235959` |
| `SERVER_SOFTWARE` | La chaîne contenant la version du serveur |
| `API_VERSION` | La date de la version de l'API (module magic number) |

Certains modules, comme [[12-modules/mod_ssl|mod_ssl]], définissent des variables supplémentaires.

## Opérateurs binaires

À l'exception de quelques opérateurs de comparaison internes, les opérateurs binaires sont de la forme "`-[a-zA-Z][a-zA-Z0-9_]+`", autrement dit un signe moins et au moins deux caractères. Le nom est insensible à la casse. Les modules peuvent fournir des opérateurs binaires supplémentaires.

### Opérateurs de comparaison

| Nom | Alternative | Description |
| --- | --- | --- |
| `==` | `=` | Egalité de chaînes |
| `!=` |   | Inégalité de chaînes |
| `<` |   | Chaîne inférieure à |
| `<=` |   | Chaîne inférieure ou égale à |
| `>` |   | Chaîne supérieure à |
| `>=` |   | Chaîne supérieure ou égale à |
| `=~` |   | La chaîne correspond à l'expression rationnelle |
| `!~` |   | La chaîne ne correspond pas à l'expression rationnelle |
| `-eq` | `eq` | Egalité d'entiers |
| `-ne` | `ne` | Inégalité d'entiers |
| `-lt` | `lt` | Entier inférieur à |
| `-le` | `le` | Entier inférieur ou égal à |
| `-gt` | `gt` | Entier supérieur à |
| `-ge` | `ge` | Entier supérieur ou égal à |

### Autres opérateurs binaires

| Nom | Description |
| --- | --- |
| `-ipmatch` | L'adresse IP correspond à adresse/masque |
| `-strmatch` | la chaîne de gauche correspond au modèle constitué par la chaîne de droite (contenant des caractères génériques \*, ?, \[\]) |
| `-strcmatch` | idem `-strmatch`, mais insensible à la casse |
| `-fnmatch` | idem `-strmatch`, mais les slashes ne sont pas pris en compte par les caractères génériques |

## Opérateurs unaires

Les opérateurs unaires acceptent un seul argument et sont de la forme "`-[a-zA-Z]`", autrement dit le signe moins et un caractère. Le nom *est* sensible à la casse. Les modules peuvent fournir des opérateurs unaires supplémentaires.

| Nom | Description | Remarques particulières |
| --- | --- | --- |
| `-d` | L'argument est traité comme un nom de fichier. Vrai si le fichier existe et correspond à un répertoire | oui |
| `-e` | L'argument est traité comme un nom de fichier. Vrai si le fichier (ou dir ou special) existe | oui |
| `-f` | L'argument est traité comme un nom de fichier. Vrai si le fichier existe et correspond à un fichier régulier | oui |
| `-s` | L'argument est traité comme un nom de fichier. Vrai si le fichier existe et n'est pas vide | oui |
| `-L` | L'argument est traité comme un nom de fichier. Vrai si le fichier existe et correspond à un lien symbolique | oui |
| `-h` | L'argument est traité comme un nom de fichier. Vrai si le fichier existe et correspond à un lien symbolique (identique à `-L`) | oui |
| `-F` | Vrai si la chaîne correspond a un fichier valide, accessible avec tous les contrôles d'accès configurés pour ce chemin. A cette fin, une sous-requête effectue la vérification, et vous devez utiliser ce drapeau avec soin car il peut impacter les performances de votre serveur ! |   |
| `-U` | Vrai si la chaîne correspond a une URL valide, accessible avec tous les contrôles d'accès configurés pour ce chemin. A cette fin, une sous-requête effectue la vérification, et vous devez utiliser ce drapeau avec soin car il peut impacter les performances de votre serveur ! |   |
| `-A` | Alias pour `-U` |   |
| `-n` | Vrai si la chaîne n'est pas vide |   |
| `-z` | Vrai si la chaîne est vide |   |
| `-T` | Faux si la chaîne est vide, "`0`", "`off`", "`false`", ou "`no`" (insensibilité à la casse). Vrai dans le cas contraire. |   |
| `-R` | Idem "`%{REMOTE_ADDR} -ipmatch ...`", en plus efficace |   |

Les opérateurs marqués comme "restreints" ne sont pas disponibles avec certains modules comme [[12-modules/mod_include|mod_include]].

## Fonctions

Normalement, les fonctions dont la valeur est une chaîne acceptent une chaîne comme argument et renvoient une chaîne. Les noms de fonctions sont insensibles à la casse. Les modules peuvent fournir des fonctions supplémentaires.

| Nom | Description | Notes particulières |
| --- | --- | --- |
| `req`, `http` | Lit l'en-tête de requête HTTP ; les noms d'en-tête correspondants peuvent être ajoutés à l'en-tête Vary, voir ci-dessous |   |
| `req_novary` | Identique à `req`, mais aucun nom d'en-tête n'est ajouté à l'en-tête Vary |   |
| `resp` | Lit l'en-tête de réponse HTTP (La plupart des en-têtes de la réponse ne seront pas encore définis pendant le traitement de la directive `<If>`) |   |
| `reqenv` | Recherche une variable d'environnement de requête (on peut aussi utiliser le raccourci `v`). | ordonnancement |
| `osenv` | Recherche une variable d'environnement du système d'exploitation |   |
| `note` | Recherche une note de requête | ordonnancement |
| `env` | Renvoie le premier résultat positif de `note`, `reqenv`, `osenv` | ordonnancement |
| `tolower` | Convertit une chaîne en minuscules |   |
| `toupper` | Convertit une chaîne en majuscules |   |
| `escape` | Echappe les caractères spéciaux en codage hexadécimal |   |
| `unescape` | "Déséchappe" les chaînes codées en hexadécimal, en ne gardant encodés que les slashes; renvoie la chaîne vide si la séquence %00 est rencontrée |   |
| `base64` | Encode la chaîne en base64 |   |
| `unbase64` | Décode les chaînes codées en base64, renvoie une chaîne tronquée si le caractère 0x00 est rencontré |   |
| `md5` | Génère un hash de la chaîne en utilisant MD5, puis code le hash obtenu en hexadécimal |   |
| `sha1` | Génère un hash de la chaîne en utilisant SHA1, puis encode le hash obtenu en hexadécimal |   |
| `file` | Lit le contenu d'un fichier(fins de lignes incluses, si elles existent) | limité |
| `filesize` | Renvoie la taille d'un fichier (ou 0 si le fichier n'existe pas ou ne correspond pas à un fichier régulier) | limité |
| `ldap` | Echappe les caractères selon la RFC4514 (Echappement des noms distinctifs LDAP - DN) et la RFC4515 (Echappement des filtres LDAP). Disponible à partir de la version 2.4.53 du serveur HTTP Apache. |   |

Les fonctions marquées comme "limité" dans la dernière colonne ne sont pas disponibles avec certains modules comme [[12-modules/mod_include|mod_include]].

Les fonctions marquées comme "ordonnancement" dans la dernière colonne nécessitent une attention particulière pour l'ordonnancement des différents composants du serveur, spécialement lorsque la fonction est utilisée au sein d'une directive \<[[13-directives/if|<If>]]\> qui est évaluée relativement tôt.

> [!NOTE]
> **Ordonnancement des variables d'environnement**
>
> Lorsque des variables d'environnement sont évaluées au sein d'une directive \<[[13-directives/if|<If>]]\>, il est important de tenir compte du moment où cette évaluation intervient dans le traitement de la requête. Par exemple, toute directive définie en dehors d'un contexte de serveur virtuel (directory, location, htaccess) aura peu de chance d'être déjà exécutée. Ainsi la directive [[13-directives/setenvif|SetEnvIf]] est une directive qui s'exécute avant cette évaluation.
>
> Lorsque `reqenv` est utilisé en dehors de la directive \<[[13-directives/if|<If>]]\>, l'évaluation survient en général plus tard, mais le moment exact dépend de la directive dans laquelle l'expression a été utilisée.

La fonction `reqenv` permet de tester les [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variables d’environnement à utilisation spéciale]] (telles que `no-gzip`, `nokeepalive`, etc.), ainsi que toute variable définie à l’aide de [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|SetEnv, SetEnvIf ou mod_rewrite]].

Lorsque les fonctions `req` ou `http` sont utilisées, le nom d'en-tête sera automatiquement ajouté à l'en-tête Vary de la réponse HTTP, sauf spécification contraire pour la directive qui accepte l'expression comme paramètre. La fonction `req_novary` permet d'empêcher l'ajout de noms d'en-têtes à l'en-tête Vary.

En plus des fonctions dont la valeur est une chaîne, il existe aussi des fonctions dont la valeur est une liste, qui acceptent une chaîne comme argument, et renvoient une liste de mots, autrement dit une liste de chaînes. La liste de mot peut être utilisée avec l'opérateur spécial `-in`. Les noms de fonctions sont insensibles à la casse. Les modules peuvent fournir des fonctions supplémentaires.

Il n'existe pas de fonctions internes dont la valeur est une liste. Le module [[12-modules/mod_ssl|mod_ssl]] fournit la fonction `PeerExtList`. Voir la description de la directive [[13-directives/sslrequire|SSLRequire]] pour plus de détails (notez que la fonction `PeerExtList` peut aussi être utilisée en dehors de la directive [[13-directives/sslrequire|SSLRequire]]).

## Exemples d'expressions

Les exemples suivants montent comment utiliser les expressions pour évaluer les requêtes :

```apache
# Comparer le nom d'hôte avec example.com et rediriger vers
# www.example.com si le nom d'hôte correspond
<If "%{HTTP_HOST} == 'example.com'">
    Redirect permanent "/" "http://www.example.com/"
</If>

# Forcer le type text/plain si un fichier fait l'objet d'une
# requête dont la chaîne de paramètres contient 'forcetext'
<If "%{QUERY_STRING} =~ /forcetext/">
    ForceType text/plain
</If>

# N'autoriser l'accès à ce contenu que pendant les heures de
# travail
<Directory "/foo/bar/business">
     Require expr %{TIME_HOUR} -gt 9 && %{TIME_HOUR} -lt 17
</Directory>

# Vérifie si un en-tête HTTP correspond à une des valeurs d'une liste
<If "%{HTTP:X-example-header} in { 'foo', 'bar', 'baz' }">
    La définition de l'en-tête correspond à une des valeurs recherchées
</If>

# Recherche la valeur d'une expression rationnelle dans une variable
# d'environnement, et renvoie la négation du résultat.
<If "! reqenv('REDIRECT_FOO') =~ /bar/">
    La condition est vérifiée
</If>

# Vérifie le résultat de la recherche d'une correspondance d'URI dans un
# contexte de répertoire avec l'option -f
<Directory "/var/www">
    AddEncoding x-gzip gz
<If "-f '%{REQUEST_FILENAME}.unzipme' && ! %{HTTP:Accept-Encoding} =~ /gzip/">
      SetOutputFilter INFLATE
</If>
</Directory>

# Vérifie l'adresse IP du client
<If "-R '192.168.1.0/24'">
    Header set matched true
</If>

# Exemple de fonction dans un contexte booléen
<If "md5('foo') == 'acbd18db4cc2f85cedef654fccc4a4d8'">
  Header set checksum-matched true
</If>

# Function example in string context
Header set foo-checksum "expr=%{md5:foo}"

# L'exemple suivant retarde l'évaluation de la clause de condition par rapport à
# <If>
Header always set CustomHeader my-value "expr=%{REQUEST_URI} =~ m#^/special_path\.php$#"

# Journalisation conditionnelle
CustomLog logs/access-errors.log common "expr=%{REQUEST_STATUS} >= 400"
CustomLog logs/access-errors-specific.log common "expr=%{REQUEST_STATUS} -in {'405','410'}"
```

## Autres

| Nom | Alternative | Description |
| --- | --- | --- |
| `-in` | `in` | chaîne contenue dans une liste de mots |
| `/regexp/` | `m#regexp#` | Expression rationnelle (la seconde forme permet de spécifier des délimiteurs autres que /) |
| `/regexp/i` | `m#regexp#i` | Expression rationnelle insensible à la casse |
| `$0 ... $9` |   | Références arrières dans les expressions rationnelles |

### Références arrières dans les expressions rationnelles

Les chaînes `$0` ... `$9` permettent de référencer les groupes de capture en provenance d'expressions rationnelles précédemment exécutées et mises en correspondance avec succès. Elles ne peuvent normalement être utilisées que dans la même expression que celle mise en correspondance, mais certains modules permettent de les utiliser de manière spéciale.

## Comparaison avec SSLRequire

La syntaxe *ap\_expr* consiste principalement en une surcouche de la syntaxe de la directive obsolète [[13-directives/sslrequire|SSLRequire]]. Vous pouvez consulter la liste de leur différences dans la documentation de la directive [[13-directives/sslrequire|SSLRequire]].

## Historique de version

La fonction `req_novary` est disponible à partir de la version 2.4.4 du serveur HTTP Apache.

## Voir aussi

- [[13-directives/if|<If>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
