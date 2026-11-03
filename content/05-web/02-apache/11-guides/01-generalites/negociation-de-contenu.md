---
title: "Négociation de contenu"
description: "Apache HTTP Server — Négociation de contenu. Apache HTTPD prend en charge la négociation de contenu telle qu'elle est décrite dans la spécification HTTP/1.1. Il peut choisir la meilleure représentation d'une ressource en fonction des préférences du navigateur pour ce qui concerne le t"
tags: [apache, guide]
icon: book-open
---

Apache HTTPD prend en charge la négociation de contenu telle qu'elle est décrite dans la spécification HTTP/1.1. Il peut choisir la meilleure représentation d'une ressource en fonction des préférences du navigateur pour ce qui concerne le type de media, les langages, le jeu de caractères et son encodage. Il implémente aussi quelques fonctionnalités pour traiter de manière plus intelligente les requêtes en provenance de navigateurs qui envoient des informations de négociation incomplètes.

La négociation de contenu est assurée par le module [[12-modules/mod_negotiation|mod_negotiation]] qui est compilé par défaut dans le serveur.

## À propos de la négociation de contenu

Une ressource peut être disponible selon différentes représentations. Par exemple, elle peut être disponible en différents langages ou pour différents types de média, ou une combinaison des deux. Pour faire le meilleur choix, on peut fournir à l'utilisateur une page d'index, et le laisser choisir. Cependant, le serveur peut souvent faire ce choix automatiquement. Cela est possible car les navigateurs peuvent envoyer des informations sur les représentations qu'ils préfèrent à l'intérieur de chaque requête. Par exemple, un navigateur peut indiquer qu'il préfère voir les informations en français, mais qu'en cas d'impossibilité l'anglais peut convenir. Les navigateurs indiquent leurs préférences à l'aide d'en-têtes dans la requête. Pour ne demander que des représentations en français, le navigateur peut utiliser l'en-tête :

```
Accept-Language: fr
```

Notez qu'il ne sera tenu compte de cette préférence que s'il existe un choix de représentations et que ces dernières varient en fonction du langage.

À titre d'exemple d'une requête plus complexe, ce navigateur a été configuré pour accepter le français et l'anglais, avec une préférence pour le français, et accepter différents types de média, avec une préférence pour HTML par rapport à au texte plat (« plain text ») ou autres types de fichiers texte, et avec une préférence pour GIF ou JPEG par rapport à tout autre type de média, mais autorisant tout autre type de média en dernier ressort :

```apache
Accept-Language: fr; q=1.0, en; q=0.5
Accept: text/html; q=1.0, text/*; q=0.8, image/gif; q=0.6, image/jpeg; q=0.6, image/*; q=0.5, */*; q=0.1
```

httpd prend en charge la négociation de contenu « server driven » (telle qu'elle est définie dans la spécification HTTP/1.1), où c'est le serveur qui décide quelle est la meilleure représentation à renvoyer pour la ressource demandée. Il prend entièrement en charge les en-têtes de requête `Accept`, `Accept-Language`, `Accept-Charset` et `Accept-Encoding`. httpd prend aussi en charge la négociation de contenu transparente, qui est un protocole de négociation expérimental défini dans les RFC 2295 et 2296. Il ne prend pas en charge la négociation de fonctionnalité (feature negotiation) telle qu'elle est définie dans ces RFCs.

Une **ressource** est une entité conceptuelle identifiée par un URI (RFC 2396). Un serveur HTTP comme le serveur HTTP Apache propose l'accès à des **représentations** de la ressource à l'intérieur de son espace de nommage, chaque représentation étant composée d'une séquence d'octets avec la définition d'un type de media, d'un jeu de caractères, d'un encodage, etc. À un instant donné, chaque ressource peut être associée avec zéro, une ou plusieurs représentations. Si plusieurs représentations sont disponibles, la ressource est qualifiée de **négociable** et chacune de ses représentations se nomme **variante**. Les différences entre les variantes disponibles d'une ressource négociable constituent les **dimensions** de la négociation.

## La négociation avec httpd

Pour négocier une ressource, on doit fournir au serveur des informations à propos de chacune des variantes. Il y a deux manières d'y parvenir :

- Utiliser une liste de correspondances de type (« type-map ») (*c'est à dire* un fichier `*.var`) qui nomme explicitement les fichiers contenant les variantes, ou
- Utiliser une recherche « multivues », où le serveur effectue une recherche de correspondance sur un motif de nom de fichier implicite et fait son choix parmi les différents résultats.

### Utilisation d'un fichier de correspondances de types (type-map)

Une liste de correspondances de types est un document associé au gestionnaire `type-map` (ou, dans un souci de compatibilité ascendante avec des configurations de httpd plus anciennes, le type MIME `application/x-type-map`). Notez que pour utiliser cette fonctionnalité, vous devez, dans le fichier de configuration, définir un gestionnaire qui associe un suffixe de fichier à une `type-map`, ce qui se fait simplement en ajoutant

```apache
AddHandler type-map .var
```

dans le fichier de configuration du serveur.

Les fichiers de correspondances de types doivent posséder le même nom que la ressource qu'ils décrivent, avec pour extension `.var`. Dans l'exemple ci-dessous, la ressource a pour nom `foo`, et le fichier de correspondances se nomme donc `foo.var`.

Ce fichier doit comporter une entrée pour chaque variante disponible ; chaque entrée consiste en une ligne contiguë d'en-têtes au format HTTP. Les entrées sont séparées par des lignes vides. Les lignes vides à l'intérieur d'une entrée sont interdites. Par convention, le fichier de correspondances de types débute par une entrée concernant l'entité considérée dans son ensemble (bien que ce ne soit pas obligatoire, et ignoré si présent). Un exemple de fichier de correspondances de types est fourni ci-dessous.

Les URIs de ce fichier sont relatifs à la localisation du fichier de correspondances de types. En général, ces fichiers se trouveront dans le même répertoire que le fichier de correspondances de types, mais ce n'est pas obligatoire. Vous pouvez utiliser des URIs absolus ou relatifs pour tout fichier situé sur le même serveur que le fichier de correspondances.

```apache
URI: foo

URI: foo.en.html
Content-type: text/html
Content-language: en

URI: foo.fr.de.html
Content-type: text/html;charset=iso-8859-2
Content-language: fr, de
```

Notez aussi qu'un fichier de correspondances de types prend le pas sur les extensions de noms de fichier, même si les Multivues sont activées. Si un fichier de correspondances de types `.var` est trouvé au cours d'un balayage de répertoire de Multivues, le serveur n'utilisera *que* les variantes listées dans ce fichier de correspondances de types. Tout autre fichier du répertoire qui correspond au nom de base mais n'est pas listé dans les correspondances de types sera totalement ignoré. Par exemple, si `foo.var` existe et ne liste que `foo.en.html` et `foo.fr.de.html`, un fichier `foo.mn.html` présent dans le même répertoire ne sera jamais servi après négociation, même si le client demande « Mongolian ». Pour qu'une telle variante soit disponible, elle doit être ajoutée au fichier de correspondances de types.

Ce comportement est intéressant pour les sites qui ajoutent de nouvelles variantes linguistiques au cours du temps. Si vous avez une ressource existante `foo.html` et ajoutez par la suite des variantes traduites avec des extensions de langue, vous devez lister toutes les variantes (y compris l'original) dans le fichier de correspondances de types. Il est possible d'assigner sa langue au fichier original dans le fichier de correspondances de types sans avoir à le renommer :

```apache
URI: foo

URI: foo.html
Content-type: text/html
Content-language: en

URI: foo.fr.html
Content-type: text/html
Content-language: fr
```

Si les variantes possèdent des qualités de source différentes, elles peuvent être indiquées par l'ajout du paramètre « qs » au type de média, comme pour cette image (disponible en JPEG, GIF ou ASCII-art) :

```apache
URI: foo

URI: foo.jpeg
Content-type: image/jpeg; qs=0.8

URI: foo.gif
Content-type: image/gif; qs=0.5

URI: foo.txt
Content-type: text/plain; qs=0.01
```

Les valeurs de qs peuvent varier de 0.000 à 1.000. Notez que toute variante possédant une valeur de qs de 0.000 ne sera jamais choisie. Les variantes qui n'ont pas de paramètre qs défini se voient attribuer une valeur de 1.0. Le paramètre qs indique la qualité relative de la variante comparée à celle des autres variantes disponibles, sans tenir compte des capacités du client. Par exemple, un fichier JPEG possède en général une qualité supérieure à celle d'un fichier ASCII s'il représente une photographie. Cependant, si la ressource représentée est un ASCII art original, la représentation ASCII sera de meilleure qualité que la représentation JPEG. Ainsi une valeur de qs est associée à une variante en fonction de la nature de la ressource qu'elle représente.

La liste complète des en-têtes reconnus est disponible dans la documentation sur les [[12-modules/mod_negotiation|correspondances de types du module mod_negotiation]].

### Multivues (option Multiviews)

`MultiViews` est une option qui s'applique à un répertoire, ce qui signifie qu'elle peut être activée à l'aide d'une directive [[13-directives/options|Options]] à l'intérieur d'une section [[13-directives/directory|<Directory>]], [[13-directives/location|<Location>]] ou [[13-directives/files|<Files>]] dans `httpd.conf`, ou (si [[13-directives/allowoverride|AllowOverride]] est correctement positionnée) dans des fichiers `.htaccess`. Notez que `Options All` n'active pas `MultiViews` ; vous devez activer cette option en la nommant explicitement.

L'effet de `MultiViews` est le suivant : si le serveur reçoit une requête pour `/tel/répertoire/foo`, si `MultiViews` est activée pour `/tel/répertoire` et si `/tel/répertoire/foo` n'existe *pas*, le serveur parcourt le répertoire à la recherche de fichiers nommés foo.\*, et simule littéralement une correspondance de types (type map) qui liste tous ces fichiers, en leur associant les mêmes types de média et encodages de contenu qu'ils auraient eu si le client avait demandé l'accès à l'un d'entre eux par son nom. Il choisit ensuite ce qui correspond le mieux aux besoins du client.

`MultiViews` peut aussi s'appliquer à la recherche du fichier nommé par la directive [[13-directives/directoryindex|DirectoryIndex]], si le serveur tente d'indexer un répertoire. Si les fichiers de configuration spécifient

```apache
DirectoryIndex index
```

le serveur va choisir entre `index.html` et `index.html3` si les deux fichiers sont présents. Si aucun n'est présent, alors qu'`index.cgi` existe, le serveur l'exécutera.

Si, parcequ'elle n'est pas reconnue par `mod_mime`, l'extension d'un des fichiers du répertoire ne permet pas de déterminer son jeu de caractères, son type de contenu, son langage, ou son encodage, le résultat dépendra de la définition de la directive [[13-directives/multiviewsmatch|MultiViewsMatch]]. Cette directive détermine si les gestionnaires (handlers), les filtres et autres types d'extensions peuvent participer à la négociation MultiVues.

## Les méthodes de négociation

Une fois obtenue la liste des variantes pour une ressource donnée, httpd dispose de deux méthodes pour choisir la meilleure variante à renvoyer, s'il y a lieu, soit à partir d'un fichier de correspondances de types, soit en se basant sur les noms de fichier du répertoire. Il n'est pas nécessaire de connaître en détails comment la négociation fonctionne réellement pour pouvoir utiliser les fonctionnalités de négociation de contenu de httpd. La suite de ce document explique cependant les méthodes utilisées pour ceux ou celles qui sont intéressés(ées).

Il existe deux méthodes de négociation :

1. **La négociation effectuée par le serveur selon l'algorithme de httpd** est utilisée par défaut. L'algorithme de httpd est expliqué plus en détails ci-dessous. Quand cet algorithme est utilisé, httpd peut parfois « bricoler » le facteur de qualité (qs) d'une dimension particulière afin d'obtenir un meilleur résultat. La manière dont httpd peut modifier les facteurs de qualité est expliquée plus en détails ci-dessous.
2. **La négociation de contenu transparente** est utilisée quand le navigateur le demande explicitement selon le mécanisme défini dans la RFC 2295. Cette méthode de négociation donne au navigateur le contrôle total du choix de la meilleure variante ; le résultat dépend cependant de la spécificité des algorithmes utilisés par le navigateur. Au cours du processus de négociation transparente, le navigateur peut demander à httpd d'exécuter l'« algorithme de sélection de variante à distance » défini dans la RFC 2296.

### Les dimensions de la négociation

| Dimension | Notes |
| --- | --- |
| Type de média | Le navigateur affiche ses préférences à l'aide du champ d'en-tête `Accept`. Chaque type de média peut se voir associé un facteur de qualité. La description de la variante peut aussi avoir un facteur de qualité (le paramètre « qs »). |
| Langage | Le navigateur affiche ses préférences à l'aide du champ d'en-tête `Accept-Language`. Chaque langue peut se voir associé un facteur de qualité. Les variantes peuvent être associées avec zéro, un ou plusieurs langages. |
| Encodage | Le navigateur affiche ses préférences à l'aide du champ d'en-tête `Accept-Encoding`. Chaque encodage peut se voir associé un facteur de qualité. |
| Jeu de caractères | Le navigateur affiche ses préférences à l'aide du champ d'en-tête `Accept-Charset`. Chaque jeu de caractère peut se voir associé un facteur de qualité. Les variantes peuvent préciser un jeu de caractères comme paramètre du type de média. |

### L'algorithme de négociation de httpd

httpd peut utiliser l'algorithme suivant pour choisir la « meilleure » variante (s'il y en a une) à renvoyer au navigateur. Cet algorithme n'est pas configurable. Il fonctionne comme suit :

1. En premier lieu, pour chaque dimension de la négociation, consulter le champ d'en-tête *Accept\** approprié et assigner une qualité à chaque variante. Si l'en-tête *Accept\** pour toute dimension implique que la variante n'est pas acceptable, éliminer cette dernière. S'il ne reste plus de variante, aller à l'étape 4.
2. Choisir la « meilleure » variante par élimination. Chacun des tests suivants est effectué dans cet ordre. Toute variante non sélectionnée à l'issue d'un test est éliminée. Après chaque test, s'il reste une seule variante, choisir cette dernière comme celle qui correspond le mieux puis aller à l'étape 3. S'il reste plusieurs variantes, passer au test suivant.

   1. Multiplier le facteur de qualité de l'en-tête `Accept` par le facteur de qualité « qs » pour le type de média de ces variantes, et choisir la variante qui possède la valeur la plus importante.
   2. Sélectionner les variantes qui possèdent le facteur de qualité de langage le plus haut.
   3. Sélectionner les variantes dont le langage correspond le mieux, en se basant sur l'ordre des langages de l'en-tête `Accept-Language` (s'il existe), ou de la directive `LanguagePriority` (si elle existe).
   4. Sélectionner les variantes possédant le paramètre de média « level » le plus élevé (utilisé pour préciser la version des types de média text/html).
   5. Sélectionner les variantes possédant le paramètre de média « charset » (jeu de caractères) qui correspond le mieux, en se basant sur la ligne d'en-tête `Accept-Charset` . Le jeu de caractères ISO-8859-1 est acceptable sauf s'il est explicitement exclus. Les variantes avec un type de média `text/*` mais non explicitement associées avec un jeu de caractères particulier sont supposées être en ISO-8859-1.
   6. Sélectionner les variantes dont le paramètre de média « charset » associé n'est *pas* ISO-8859-1. S'il n'en existe pas, sélectionner toutes les variantes.
   7. Sélectionner les variantes avec le meilleur encodage. S'il existe des variantes avec un encodage acceptable pour le client, sélectionner celles-ci. Sinon, s'il existe des variantes encodées et des variantes non encodées, ne sélectionner que les variantes non encodées. Si toutes les variantes sont encodées ou si aucune ne l'est, sélectionner toutes les variantes.
   8. Sélectionner les variantes dont le contenu a la longueur la plus courte.
   9. Sélectionner la première des variantes restantes. Il s'agira soit de la première variante listée dans le fichier de correspondances de types, soit, quand les variantes sont lues depuis le répertoire, la première par ordre alphabétique quand elles sont triées selon le code ASCII.
3. L'algorithme a maintenant sélectionné une variante considérée comme la « meilleure », il la renvoie donc au client en guise de réponse. L'en-tête HTTP `Vary` de la réponse est renseigné de façon à indiquer les dimensions de la négociation (les navigateurs et les caches peuvent utiliser cette information lors de la mise en cache de la ressource). Travail terminé.
4. Le passage par cette étape signifie qu'aucune variante n'a été sélectionnée (parce qu'aucune n'est acceptable pour le navigateur). Envoyer une réponse avec un code de statut 406 (qui signifie « Aucune représentation acceptable ») et un corps comportant un document HTML qui affiche les variantes disponibles. Renseigner aussi l'en-tête HTTP `Vary` de façon à indiquer les dimensions de la variante.

## Ajustement des valeurs de qualité

Parfois httpd modifie les valeurs de qualité par rapport à celles qui découleraient d'une stricte interprétation de l'algorithme de négociation de httpd ci-dessus, cela afin d'améliorer les résultats de l'algorithme pour les navigateurs qui envoient des informations incomplètes ou inappropriées. Certains des navigateurs les plus populaires envoient des informations dans l'en-tête `Accept` qui, sans ce traitement, provoqueraient la sélection d'une variante inappropriée dans de nombreux cas. Quand un navigateur envoie des informations complètes et correctes ces ajustements ne sont pas effectués.

### Types de média et caractères génériques

L'en-tête de requête `Accept:` indique les types de média souhaités. Il peut aussi contenir des types de média avec caractères génériques, comme « image/\* » ou « \*/\* » où \* correspond à n'importe quelle chaîne de caractères. Ainsi une requête contenant :

```
Accept: image/*, */*
```

indiquerait que tout type de média est acceptable, avec une préférence pour les types commençant par « image/ ». Certains navigateurs ajoutent par défaut des types de média avec caractères génériques aux types explicitement nommés qu'ils peuvent gérer. Par exemple :

```
Accept: text/html, text/plain, image/gif, image/jpeg, */*
```

Cela indique que les types explicitement listés sont préférés, mais qu'une représentation avec un type différent de ces derniers conviendra aussi. Les valeurs de qualités explicites, afin de préciser ce que veut vraiment le navigateur, s'utilisent comme suit :

```
Accept: text/html, text/plain, image/gif, image/jpeg, */*; q=0.01
```

Les types explicites n'ont pas de facteur de qualité, la valeur par défaut de leur préférence est donc de 1.0 (la plus haute). Le type avec caractères génériques \*/\* se voit attribuer une préférence basse de 0.01, si bien que les types autres que ceux explicitement listés ne seront renvoyés que s'il n'existe pas de variante correspondant à un type explicitement listé.

Si l'en-tête `Accept:` ne contient *pas* de facteur de qualité, httpd positionne la valeur de qualité de « \*/\* », si présent, à 0.01 pour simuler l'effet désiré. Il positionne aussi la valeur de qualité des types avec caractères génériques au format « type/\* » à 0.02 (ils sont donc préférés à ceux correspondant à « \*/\* »). Si un type de média dans l'en-tête `Accept:` contient un facteur de qualité, ces valeurs spéciales ne seront *pas* appliquées, de façon à ce que les requêtes de navigateurs qui envoient les informations explicites à prendre en compte fonctionnent comme souhaité.

### Exceptions dans la négociation du langage

A partir de la version 2.0 de httpd, certaines exceptions ont été ajoutées à l'algorithme de négociation afin de ménager une issue de secours quand la négociation ne trouve aucun langage correspondant.

Quand un client demande une page sur votre serveur, si ce dernier ne parvient pas à trouver une page dont la langue correspond à l'en-tête `Accept-language` envoyé par le navigateur, il enverra au client une réponse « Aucune variante acceptable » ou « Plusieurs choix possibles ». Pour éviter ces messages d'erreur, il est possible de configurer httpd de façon que, dans ces cas, il ignore l'en-tête `Accept-language` et fournisse tout de même un document, même s'il ne correspond pas exactement à la demande explicite du client. La directive [[13-directives/forcelanguagepriority|ForceLanguagePriority]] peut être utilisée pour éviter ces messages d'erreur et leur substituer une page dont le langage sera déterminé en fonction du contenu de la directive [[13-directives/languagepriority|LanguagePriority]].

Le serveur va aussi essayer d'étendre sa recherche de correspondance aux sous-ensembles de langages quand aucune correspondance exacte ne peut être trouvée. Par exemple, si un client demande des documents possédant le langage `en-GB`, c'est à dire anglais britannique, le standard HTTP/1.1 n'autorise normalement pas le serveur à faire correspondre cette demande à un document dont le langage est simplement `en` (notez qu'inclure `en-GB` et non `en` dans l'en-tête `Accept-Language` constitue une quasi-erreur de configuration, car il est très peu probable qu'un lecteur qui comprend l'anglais britannique, ne comprenne pas l'anglais en général. Malheureusement, de nombreux clients ont réellement des configurations par défaut de ce type). Cependant, si aucune autre correspondance de langage n'est possible, et si le serveur est sur le point de renvoyer une erreur « Aucune variable acceptable » ou de choisir le langage défini par la directive [[13-directives/languagepriority|LanguagePriority]], le serveur ignorera la spécification du sous-ensemble de langage et associera la demande en `en-GB` à des documents en `en`. Implicitement, httpd ajoute le langage parent à la liste de langages acceptés par le client avec une valeur de qualité très basse. Notez cependant que si le client demande « en-GB; q=0.9, fr; q=0.8 », et si le serveur dispose de documents estampillés « en » et « fr », c'est le document « fr » qui sera renvoyé, tout cela dans un souci de compatibilité avec la spécification HTTP/1.1 et afin de fonctionner efficacement avec les clients correctement configurés.

Pour prendre en charge les techniques avancées (comme les cookies ou les chemins d'URL spéciaux) afin de déterminer le langage préféré de l'utilisateur, le module [[12-modules/mod_negotiation|mod_negotiation]] reconnaît la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]] `prefer-language` depuis la version 2.0.47 de httpd. Si elle est définie et contient un symbole de langage approprié, [[12-modules/mod_negotiation|mod_negotiation]] va essayer de sélectionner une variante correspondante. S'il n'existe pas de telle variante, le processus normal de négociation sera lancé.

**Exemple**

```apache
SetEnvIf Cookie "language=(.+)" prefer-language=$1
Header append Vary cookie
```

## Extensions à la négociation de contenu transparente

httpd étend le protocole de négociation de contenu transparente (RFC 2295) comme suit. Un nouvel élément `{encodage ..}` est utilisé dans les listes de variantes pour marquer celles qui ne sont disponibles qu'avec un encodage de contenu spécifique. L'implémentation de l'algorithme RVSA/1.0 (RFC 2296) est étendue à la reconnaissance de variantes encodées dans la liste, et à leur utilisation en tant que variantes candidates à partir du moment où leur encodage satisfait au contenu de l'en-tête de requête `Accept-Encoding`. L'implémentation RVSA/1.0 n'arrondit pas les facteurs de qualité calculés à 5 décimales avant d'avoir choisi la meilleure variante.

## Remarques à propos des liens hypertextes et des conventions de nommage

Si vous utilisez la négociation de langage, vous avez le choix entre différentes conventions de nommage, car les fichiers peuvent posséder plusieurs extensions, et l'ordre dans lequel ces dernières apparaissent est en général sans rapport (voir la documentation sur le module [[12-modules/mod_mime|mod_mime]] pour plus de détails).

Un fichier type possède une extension liée au type MIME (*par exemple*, `html`), mais parfois aussi une extension liée à l'encodage (*par exemple*, `gz`), et bien sûr une extension liée au langage (*par exemple*, `en`) quand plusieurs variantes de langage sont disponibles pour ce fichier.

Exemples :

- foo.en.html
- foo.html.en
- foo.en.html.gz

Ci-dessous d'autres exemples de noms de fichiers avec des liens hypertextes valables et non valables :

| Nom fichier | lien valide | Lien invalide |
| --- | --- | --- |
| *foo.html.en* | foo foo.html | - |
| *foo.en.html* | foo | foo.html |
| *foo.html.en.gz* | foo foo.html | foo.gz foo.html.gz |
| *foo.en.html.gz* | foo | foo.html foo.html.gz foo.gz |
| *foo.gz.html.en* | foo foo.gz foo.gz.html | foo.html |
| *foo.html.gz.en* | foo foo.html foo.html.gz | foo.gz |

En regardant la table ci-dessus, vous remarquerez qu'il est toujours possible d'utiliser le nom de fichier sans extension dans un lien (*par exemple*, `foo`). L'avantage est de pouvoir dissimuler le type réel du fichier associé à un document et de pouvoir le modifier ultérieurement, *par exemple*, de `html` à `shtml` ou `cgi` sans avoir à mettre à jour aucun lien.

Si vous souhaitez continuer à utiliser un type MIME dans vos liens (*par exemple* `foo.html`), l'extension liée au langage (y compris une extension liée à l'encodage s'il en existe une) doit se trouver à droite de l'extension liée au type MIME (*par exemple*, `foo.html.en`).

## Remarque sur la mise en cache

Quand un cache stocke une représentation, il l'associe avec l'URL de la requête. Lorsque cette URL est à nouveau demandée, le cache peut utiliser la représentation stockée. Cependant, si la ressource est négociable au niveau du serveur, il se peut que seule la première variante demandée soit mise en cache et de ce fait, la correspondance positive du cache peut entraîner une réponse inappropriée. Pour éviter cela, httpd marque par défaut toutes les réponses qui sont renvoyées après une négociation de contenu comme « non-cachables » par les clients HTTP/1.0. httpd prend aussi en charge les fonctionnalités du protocole HTTP/1.1 afin de permettre la mise en cache des réponses négociées.

Pour les requêtes en provenance d'un client compatible HTTP/1.0 (un navigateur ou un cache), la directive [[13-directives/cachenegotiateddocs|CacheNegotiatedDocs]] peut être utilisée pour permettre la mise en cache des réponses qui ont fait l'objet d'une négociation. Cette directive peut intervenir dans la configuration au niveau du serveur ou de l'hôte virtuel, et n'accepte aucun argument. Elle n'a aucun effet sur les requêtes en provenance de clients HTTP/1.1.

Pour les clients HTTP/1.1, httpd envoie un en-tête de réponse HTTP `Vary` afin d'indiquer les dimensions de la négociation pour cette réponse. Les caches peuvent utiliser cette information afin de déterminer si une requête peut être servie à partir de la copie locale. Pour inciter un cache à utiliser la copie locale sans tenir compte des dimensions de la négociation, définissez la [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variable d'environnement]] `force-no-vary`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
