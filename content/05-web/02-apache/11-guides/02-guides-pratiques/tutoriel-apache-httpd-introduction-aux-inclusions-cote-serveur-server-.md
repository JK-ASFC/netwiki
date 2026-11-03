---
title: "Tutoriel Apache httpd : Introduction aux \"Inclusions Côté Serveur\" (Server Side Includes - SSI)"
description: "Apache HTTP Server — Tutoriel Apache httpd : Introduction aux \"Inclusions Côté Serveur\" (Server Side Includes - SSI). Les SSI permettent d'ajouter du contenu dynamique à des documents HTML préexistants sans nécessiter de cadriciel complet d’application. Ils s’avèrent particulièrement utiles pour insérer des éléments courants — en-têtes, pieds de page, navi"
tags: [apache, guide]
icon: book-open
---

Les SSI permettent d'ajouter du contenu dynamique à des documents HTML préexistants sans nécessiter de cadriciel complet d’application. Ils s’avèrent particulièrement utiles pour insérer des éléments courants — en-têtes, pieds de page, navigation, horodatages — dans des pages qui, sans cela, seraient statiques.

## Introduction

- [[12-modules/mod_include|mod_include]]
- [[12-modules/mod_cgi|mod_cgi]]
- [[12-modules/mod_expires|mod_expires]]
- [[13-directives/options|Options]]
- [[13-directives/xbithack|XBitHack]]
- [[13-directives/addtype|AddType]]
- [[13-directives/setoutputfilter|SetOutputFilter]]
- [[13-directives/browsermatchnocase|BrowserMatchNoCase]]

Les SSI permettent d’insérer de simples directives dans les fichiers HTML, que le serveur évaluera avant d’envoyer la page au client. Il s’agit d’une manière simple de stocker du contenu partagé (comme un pied de page global au site ou un horodatage de dernière modification) en un seul endroit, sans nécessiter de moteur de modèle ou de serveur d’applications.

Ce document décrit la manière de configurer httpd pour autoriser les SSI, les directives SSI basiques pour les tâches courantes, ainsi que quelques techniques plus avancées comme l’inclusion de variable et les expressions conditionnelles.

## Qu'est-ce que SSI ?

Les directives SSI sont des commentaires HTML avec une syntaxe spécifique que le module [[12-modules/mod_include|mod_include]] reconnaît et évalue avant que la page ne soit envoyée au client. Elle sont de la forme suivante :

```xml
<!--#echo var="DATE_LOCAL" -->
```

Lorsque la page est servie, ce fragment est remplacé par sa valeur :

```
Thursday, 18-Jun-2026 14:22:07 EDT
```

Les directives étant intégrées dans des commentaires HTML, les navigateurs les ignoreront si les SSI ne sont pas activées (bien qu’elles demeurent visibles dans le code source de la page).

## Configurer votre serveur pour permettre les SSI

Pour activer le traitement des SSI, ajoutez la directive suivante à votre fichier `httpd.conf` ou à un fichier `.htaccess` :

```apache
Options +Includes
```

Si cette option est définie, httpd va analyser les fichiers en y recherchant des directives SSI. Comme la plupart des configurations contiennent plusieurs directives [[13-directives/options|Options]] qui peuvent s’outrepasser les unes les autres, appliquez la directive d’activation au répertoire spécifique pour lequel vous voulez activer les SSI.

Vous devez aussi indiquer à httpd les fichiers qu’il doit analyser. Pour ce faire, il existe deux approches courantes.

La première consiste à indiquer une extension de nom de fichier (en général `.shtml`) pour les pages pour lesquelles les SSI sont activées :

```apache
AddType text/html .shtml
AddOutputFilter INCLUDES .shtml
```

Cette approche a pour désavantage de nécessiter, pour ajouter des SSI à une page existante, de renommer le fichier (et de mettre à jour tous les liens vers ce dernier) pour utiliser l’extension `.shtml`.

La seconde approche consiste à utiliser la directive [[13-directives/xbithack|XBitHack]] :

```apache
XBitHack on
```

La directive [[13-directives/xbithack|XBitHack]] indique à httpd qu’il doit analyser tout fichier dont le bit d’exécution est positionné. Ainsi, pour activer les SSI pour une page existante, il suffit de rendre le fichier exécutable :

```bash
chmod +x pagename.html
```

> [!WARNING]
> Évitez de configurer httpd pour analyser *tous* les fichiers `.html` pour y trouver des directives SSI. Cela force en effet le serveur à parcourir tous les fichiers HTML qu’il sert, même ceux qui n’ont pas de contenu SSI, ce qui ajoute une surcharge de travail inutile.

Sous Windows, il n’y a pas de bit d’exécution ; l’approche avec la directive [[13-directives/xbithack|XBitHack]] n’est donc pas valable dans ce cas. Vous devrez alors utiliser l’approche par extension de nom de fichier.

Par défaut, httpd n’envoie pas la date de dernière modification ou les en-têtes content-length sur les pages SSI, car ces valeurs sont difficiles à calculer pour un contenu dynamique. Cela peut empêcher la mise en cache et induire un ressenti de performances plus lentes. Deux approches peuvent aider :

1. Utilisez la directive `XBitHack Full` qui indique à httpd qu’il doit déterminer la date de dernière modification à partir du fichier initialement demandé, tout en ignorant les dates de dernière modification des fichiers inclus.
2. Utilisez le module [[12-modules/mod_expires|mod_expires]] pour définir un moment d’expiration explicite, indiquant ainsi aux navigateurs et aux mandataires que le contenu peut être mis en cache.

## Directives SSI de base

Les directives SSI utilisent la syntaxe suivante :

```xml
<!--#function attribute=value attribute=value ... -->
```

Si les SSI sont correctement configurées, la directive sera remplacée par sa sortie. Dans le cas contraire, elle demeurera en tant que commentaire HTML — invisible à l’utilisateur final, mais présente dans le code source de la page.

### La date courante

```xml
<!--#echo var="DATE_LOCAL" -->
```

La fonction `echo` a pour sortie la valeur d’une variable. Les variables standard incluent le jeu complet de variables d’environnement disponibles pour les programmes CGI, ainsi que les variables que vous pouvez définir avec `set`.

Pour personnaliser le format de la date, utilisez la fonction `config` avec l’attribut `timefmt` :

```xml
<!--#config timefmt="%A %B %d, %Y" -->
Today is <!--#echo var="DATE_LOCAL" -->
```

### Date de modification du fichier

```xml
Dernière modification du document <!--#flastmod file="index.html" -->
```

Le format peut là aussi être modifié à l'aide de l'attribut `timefmt`.

### Inclusion des résultats d'un programme CGI

Les SSI permettent d’inclure directement la sortie d’un programme CGI dans la page :

```xml
<!--#include virtual="/cgi-bin/counter.pl" -->
```

## Exemples additionnels

Vous trouverez dans les exemples pratiques suivants des cas d’utilisation courants des SSI.

### Quand ce document a-t-il été modifié ?

Une des utilisations courantes des SSI est l’affichage d’un horodatage « date de dernière modification » sur chaque page. Le code suivant utilise la variable `LAST_MODIFIED` ; vous pouvez donc coller le même extrait dans tout fichier sans modifier son nom :

```xml
<!--#config timefmt="%D" -->
Date de dernière modification de ce fichier <!--#echo var="LAST_MODIFIED" -->
```

Pour des détails à propos des chaînes de formatage de `timefmt`, voir la documentation de `strftime` dans le manuel de référence de la bibliothèque C de votre système.

### Inclusion d'un pied de page standard

Sur un site qui comporte plus que quelques pages, maintenir un en-tête ou un pied de page cohérent sur toutes les pages peut s’avérer fastidieux. Les SSI résolvent ce problème en permettant de stocker le contenu partagé dans un seul fichier et d’inclure ce dernier n’importe où :

```xml
<!--#include virtual="/footer.html" -->
```

La fonction `include` accepte deux attributs : `file` qui spécifie un chemin relatif au répertoire actuel (il ne peut pas spécifier un chemin absolu ou contenant `../`), et `virtual` qui spécifie un URL relatif au document servi (et qui peut commencer par `/`, mais doit être sur le même serveur).

Les directives SSI au sein des fichiers inclus sont évaluées normalement et les inclusions peuvent être imbriquées. Cela signifie que vous pouvez placer un horodatage `LAST_MODIFIED` dans votre fichier de pied de page, et qu’il sera évalué dans le contexte de chaque page qui l’inclut.

## Autres options de configuration

En plus de `timefmt`, la fonction `config` accepte deux autres attributs.

L’attribut `errmsg` modifie le message d’erreur affiché lorsqu’une directive SSI échoue. Le message par défaut est :

```
[an error occurred while processing this directive]
```

Vous pouvez le remplacer par un contenu plus adapté à votre site :

```xml
<!--#config errmsg="[Content unavailable]" -->
```

L’attribut `sizefmt` contrôle la manière dont les tailles de fichier sont spécifiées : `bytes` pour un décompte en octets ou `abbrev` pour une forme abrégée en Ko ou Mo.

## Exécution de commandes

La fonction `exec` permet d’exécuter une commande du shell et d’inclure sa sortie dans la page. Sur les systèmes de style Unix, la commande est exécutée via `/bin/sh`, et sous Windows via l’interpréteur de commande.

```xml
<pre>
<!--#exec cmd="ls" -->
</pre>
```

> [!WARNING]
> La fonctionnalité `exec` constitue un risque de sécurité significatif. En effet, elle exécute des commandes arbitraires avec les privilèges du processus du serveur web. Si les utilisateurs peuvent éditer du contenu sur votre site, assurez-vous que cette fonctionnalité soit désactivée en spécifiant `IncludesNOEXEC` au lieu de `Includes` dans la définition de la directive [[13-directives/options|Options]].

## Techniques SSI avancées

Au-delà de la simple inclusion de contenu, les SSI prennent en charge les variables et les expressions conditionnelles, rendant possible la génération de contenus différents en fonction du contexte de la requête.

### Définition de variables

La directive `set` permet de définir des variables à utiliser plus tard dans la page :

```xml
<!--#set var="name" value="Rich" -->
```

Les variables peuvent référencer d’autres variables (y compris des [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variables d’environnement]]) en utilisant le signe dollar (`$`) comme préfixe :

```xml
<!--#set var="modified" value="$LAST_MODIFIED" -->
```

Pour inclure un signe dollar littéral, protégez-le avec une contre-oblique :

```xml
<!--#set var="cost" value="\$100" -->
```

Lorsqu'un nom de variable risque d'être ambigu au sein d'une chaîne plus longue, utilisez des accolades pour le délimiter :

```xml
<!--#set var="date" value="${DATE_LOCAL}_${DATE_GMT}" -->
```

### Expressions conditionnelles

[[12-modules/mod_include|mod_include]] fournit les éléments `if`, `elif`, `else` et `endif` permettant de construire une logique conditionnelle. Cette fonctionnalité permet de générer des sorties différentes à partir d’une seule page physique.

La structure est :

```xml
<!--#if expr="test_condition" -->
<!--#elif expr="test_condition" -->
<!--#else -->
<!--#endif -->
```

Une *test\_condition* peut comparer des valeurs ou vérifier si une variable n’est pas vide. Voir la documentation de [[12-modules/mod_include|mod_include]] pour la liste complète des opérateurs de comparaison.

Par exemple, pour afficher des salutations différentes en fonction de l’heure du jour :

```xml
Good
<!--#if expr="%{TIME_HOUR} <12" -->
morning!
<!--#else -->
afternoon!
<!--#endif -->
```

Toute variable — définie par l’utilisateur ou issue de l’environnement — peut être utilisée dans les expressions conditionnelles. Voir [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le Serveur HTTP Apache]] pour des détails complets à propos du moteur d’évaluation des expressions.

Combinées avec la capacité de httpd à définir des variables d’environnement en utilisant [[13-directives/setenvif|SetEnvIf]] et les directives apparentées, les SSI conditionnelles peuvent traiter une grande variété de scénarios de contenu dynamique sans nécessiter de cadriciel complet d’applications.

## Conclusion

Pour les sites principalement statiques mais nécessitant quelques touches dynamiques, les SSI évitent la surcharge de travail induite par la configuration d’une pile complète d’applications. Elles ne requièrent que [[12-modules/mod_include|mod_include]] et quelques lignes de configuration pour fonctionner.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
