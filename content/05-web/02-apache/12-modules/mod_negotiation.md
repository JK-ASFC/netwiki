---
title: "mod_negotiation"
description: "Module Apache mod_negotiation — Effectue la négociation de contenu. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_negotiation]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Effectue la négociation de contenu |
| **Statut** | Base |
| **Identificateur** | `negotiation_module` |
| **Fichier source** | `mod_negotiation.c` |

## Sommaire

La négociation de contenu, ou plus précisément la sélection de contenu, est la sélection parmi plusieurs documents disponibles, du document qui "colle" au plus près des possibilités du client. Pour y parvenir, deux méthodes sont employées.

- Une table de correspondances de types (un fichier associé au gestionnaire `type-map`) qui contient une liste explicite des fichiers contenant les différentes variantes.
- Une recherche multivues (Multiviews) (activée par l'[[13-directives/options|Options]] `Multiviews`), où le serveur effectue une recherche de correspondance de modèle de nom de fichier implicite, et fait son choix parmi les résultats.

## Tables de correspondances de types

Une table de correspondances de types possède un format similaire à celui des en-têtes de messagerie RFC822. Elle contient des descriptions de documents séparées par des lignes vides, toute ligne commençant par un dièse ('#') étant considérée comme un commentaire. Une description de document comporte plusieurs enregistrements d'en-têtes ; chaque enregistrement peut être réparti sur plusieurs lignes à condition que les lignes supplémentaires commencent par un ou plusieurs espaces. Lors du traitement, les espaces de début de ligne seront supprimés et les lignes concaténées. L'enregistrement d'un en-tête comprend un mot-clé qui se termine toujours par un caractère "deux-points" ':', suivi d'une valeur. Les espaces sont autorisés entre le nom d'en-tête et sa valeur, ainsi qu'entre les différents éléments de la valeur. Les en-têtes autorisés sont :

**`Content-Encoding:`**

Le codage du fichier. Apache ne reconnaît que les codages définis par une directive [[13-directives/addencoding|AddEncoding]]. Sont normalement inclus les codages `x-compress` pour les fichiers compressés avec compress, et `x-gzip` pour les fichiers compressés avec gzip. Le préfixe `x-` est ignoré lors des comparaisons de codages.

**`Content-Language:`**

Le(s) langage(s) de la variante, sous la forme d'un symbole de langage Internet standard ([RFC 1766](https://www.rfc-editor.org/rfc/rfc1766)). Par exemple, `en` correspond à l'anglais. Si la variante contient plusieurs langages, ils sont séparés par des virgules.

**`Content-Length:`**

La taille du fichier en octets. Si cet en-tête n'est pas présent, c'est la taille réelle du fichier qui est utilisée.

**`Content-Type:`**

Le type MIME du document avec des paramètres optionnels. Chaque variante doit comporter un en-tête `Content-Type` ; dans le cas contraire, la négociation ne fonctionnera pas correctement. Les paramètres sont séparés du type de médium ainsi qu'entre eux par un point-virgule, et possèdent la syntaxe `nom=valeur`. Les paramètres courants sont :

**`level`**

un entier spécifiant la version du type de média. Pour `text/html`, la valeur par défaut est 2, sinon 0.

**`qs`**

un nombre en virgule flottante de 0\[.000\] à 1\[.000\], indiquant la "qualité" relative de la variante courante par rapport aux autres variantes disponibles, indépendamment des possibilités du client. Par exemple, un fichier jpeg est en général une source de qualité supérieure à un fichier ascii s'il est censé représenter une image. Cependant, si la ressource représentée est une image ascii, un fichier ascii possèdera une qualité supérieure à un fichier jpeg. Toutes les valeurs de `qs` sont donc spécifiques à une certaine ressource.

**Exemple**

```
Content-Type: image/jpeg; qs=0.8
```

**`URI:`**

l'URI du fichier contenant la variante (du type de médium donné, codé selon le codage de contenu donné). Cet URI est considéré comme relatif au fichier de correspondances ; il doit être situé sur le même serveur, et doit faire référence au fichier auquel le client se verrait accorder l'accès s'il était requis directement.

**`Body:`**

Le contenu réel de la ressource peut être inclus dans la table de correspondances en utilisant l'en-tête Body. Cet en-tête doit contenir une chaîne désignant un délimiteur pour le contenu du corps. Les lignes suivantes du fichier de correspondances de types seront alors considérées comme parties du corps de la ressource jusqu'à ce que le délimiteur soit détecté.

**Exemple:**

```
Body:----xyz----
<html>
<body>
<p>Contenu de la page.</p>
</body>
</html>
----xyz----
```

Considérons une ressource, `document.html`, disponible en anglais, en français et en allemand. Les fichiers correspondants se nomment respectivement `document.html.en`, `document.html.fr`, et `document.html.de`. Le fichier de correspondances de types se nommera `document.html.var` et contiendra ce qui suit :

```
URI: document.html

Content-language: en
Content-type: text/html
URI: document.html.en

Content-language: fr
Content-type: text/html
URI: document.html.fr

Content-language: de
Content-type: text/html
URI: document.html.de
```

Ces quatre fichiers doivent se trouver dans le même répertoire, et le fichier `.var` doit être associé au gestionnaire `type-map` via une directive [[13-directives/addhandler|AddHandler]] :

```apache
AddHandler type-map .var
```

A l'arrivée d'une requête pour la ressource `document.html.var`, la variante de `document.html` qui correspond le mieux à la préference de langage spécifiée dans l'en-tête de la requête de l'utilisateur `Accept-Language` sera choisie.

Si `Multiviews` est activée, et si [[13-directives/multiviewsmatch|MultiviewsMatch]] est définie à "handlers" ou "any", une requête pour `document.html` va rechercher `document.html.var`, et continuer la négociation avec le gestionnaire explicite type-map.

D'autres directives de configuration, comme [[13-directives/alias|Alias]], peuvent être utilisées pour associer `document.html` avec `document.html.var`.

## Multivues

Une recherche Multivues est activée par l'[[13-directives/options|Options]] `Multiviews`. Si le serveur reçoit une requête pour `/un/répertoire/foo`, et si `/un/répertoire/foo` n'existe pas, le serveur parcourt le répertoire à la recherche de tous les fichiers de nom `foo.*`, et simule véritablement une correspondance de type qui nomme tous ces fichiers en leur assignant les mêmes type de média et codage de contenu qu'ils auraient eus si le client avait requis l'un d'entre eux avec son nom complet. Il choisit ensuite le fichier qui correspond le mieux au profile du client, puis renvoie le document.

La directive [[13-directives/multiviewsmatch|MultiviewsMatch]] définit si Apache doit prendre en compte les fichiers qui ne comportent pas de métadonnées de négociation de contenu lors du choix du fichier à servir.

## Directives

- [[13-directives/cachenegotiateddocs|CacheNegotiatedDocs]]
- [[13-directives/forcelanguagepriority|ForceLanguagePriority]]
- [[13-directives/languagepriority|LanguagePriority]]

## Voir aussi

- [[13-directives/options|Options]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
