---
title: "mod_mime"
description: "Module Apache mod_mime — Associe les extensions des fichiers demandés avec l'action déclenchée par ces fichiers et avec leur contenu (type MIME, langage, jeu de caractère et codage). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_mime]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions des fichiers demandés avec l'action déclenchée par ces fichiers et avec leur contenu (type MIME, langage, jeu de caractère et codage) |
| **Statut** | Base |
| **Identificateur** | `mime_module` |
| **Fichier source** | `mod_mime.c` |

## Sommaire

Ce module permet d'assigner des métadonnées aux contenus sélectionnés pour une réponse HTTP, en associant des modèles d'URI ou de noms de fichiers aux valeurs des métadonnées. Par exemple, les extensions de noms de fichiers définissent souvent le type de médium Internet, le langage, le jeu de caractères et le codage du contenu. Ces informations sont relayées par les messages HTTP véhiculant ces contenus, et utilisées au cours de la négociation de contenu lors de la sélection des différentes possibilités, de manière à ce que les préférences des utilisateurs soient respectées lors du choix d'un contenu à servir parmi plusieurs autres contenus. Voir [[12-modules/mod_negotiation|mod_negotiation]] pour plus d'informations à propos de la [[11-guides/01-generalites/negociation-de-contenu|négociation de contenu]].

Les directives [[13-directives/addcharset|AddCharset]], [[13-directives/addencoding|AddEncoding]], [[13-directives/addlanguage|AddLanguage]] et [[13-directives/addtype|AddType]] permettent d'associer des extensions de fichiers aux métadonnées de ces fichiers. Elles définissent respectivement le jeu de caractères, le codage du contenu, le langage du contenu et le type de médium (content-type) des documents. La directive [[13-directives/typesconfig|TypesConfig]] permet de spécifier un fichier qui contient lui-même des associations entre extensions et types de media.

De plus, [[12-modules/mod_mime|mod_mime]] peut définir le [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaire]] et les [[11-guides/01-generalites/filtres|filtres]] qui sont à l'origine du contenu et le traitent. Les directives [[13-directives/addhandler|AddHandler]], [[13-directives/addoutputfilter|AddOutputFilter]], et [[13-directives/addinputfilter|AddInputFilter]] permettent de contrôler les modules ou les scripts qui vont servir le document. La directive [[13-directives/multiviewsmatch|MultiviewsMatch]] permet à [[12-modules/mod_negotiation|mod_negotiation]] de déterminer les extensions de fichiers à inclure lors des tests de correspondances multivues.

Alors que [[12-modules/mod_mime|mod_mime]] associe des métadonnées avec des extensions de fichiers, le serveur de base [[12-modules/core|core]] fournit des directives permettant d'associer tous les fichiers d'un conteneur donné (par exemple [[13-directives/location|<Location>]], [[13-directives/directory|<Directory>]], ou [[13-directives/files|<Files>]]) avec des métadonnées particulières. Parmi ces directives, on trouve [[13-directives/forcetype|ForceType]], [[13-directives/sethandler|SetHandler]], [[13-directives/setinputfilter|SetInputFilter]], et [[13-directives/setoutputfilter|SetOutputFilter]]. Les directives du serveur de base l'emportent sur toute directive d'association d'extensions de noms de fichiers définie par [[12-modules/mod_mime|mod_mime]].

Notez que la modification des métadonnées d'un fichier ne modifie pas la valeur de l'en-tête `Last-Modified`. Ainsi, certaines copies de documents préalablement mises en cache peuvent encore être utilisées par un client ou un mandataire avec les anciens en-têtes. Si vous modifiez les métadonnées (langage, type de contenu, jeu de caractère ou codage), vous devez donc enregistrer une modification du fichier concerné (afin de mettre à jour sa date de dernière modification), pour être sûr que tous les visiteurs recevront le documents avec les en-têtes corrects.

## Fichiers avec extensions multiples

Les fichiers peuvent posséder plusieurs extensions dont l'ordre est *normalement* sans importance. Par exemple, si le fichier `welcome.html.fr` est associé au type de contenu `text/html` et au langage Français, le fichier `welcome.fr.html` possèdera exactement les même métadonnées. Si le fichier possède plusieurs extensions associées au même type de métadonnée, c'est celle de ces extensions la plus à droite qui sera utilisée, excepté pour ce qui concerne les langages et les codages de contenu. Par exemple, si `.gif` est associé au type de médium `image/gif`, et `.html` au type de médium `text/html`, le fichier `welcome.gif.html` sera associé au type de médium `text/html`.

Les Languages et les codages de contenu sont traités de manière cumulative, car il est possible d'assigner plusieurs langages ou codages à une ressource particulière. Par exemple, le fichier `welcome.html.en.de` sera servi avec les en-têtes `Content-Language: en, de` et `Content-Type: text/html`.

Des précautions doivent être prises lorsqu'un fichier avec extensions multiples est associé à la fois à un type de médium et à un gestionnaire. En général, cela impliquera la gestion de la requête par le module associé au gestionnaire. Par exemple, si l'extension `.imap` est associée au gestionnaire `imap-file` (du module [[12-modules/mod_imagemap|mod_imagemap]]), et si l'extension `.html` est associée au type de médium `text/html`, le fichier `world.imap.html` sera à la fois associé au gestionnaire `imap-file` et au type de médium `text/html`. Pour son traitement, c'est le gestionnaire `imap-file` qui sera utilisé, et il sera donc traité en tant que fichier imagemap.

Si vous préférez que seule la dernière partie d'un nom de fichier séparée du reste du nom par un point soit associée à une métadonnée particulière, n'utilisez pas les directives `Add*`. Par exemple, si vous souhaitez que le fichier `foo.html.asis` soit servi par le gestionnaire `send-as-is` fourni par le module [[12-modules/mod_asis|mod_asis]], mais pas le fichier `bar.asis.html`, alors, au lieu d'utiliser `AddHandler send-asis .asis`, utilisez plutôt :

**Configuration du gestionnaire en se basant seulement sur la dernière extension**

```apache
<FilesMatch "[^.]+\.asis$">
  SetHandler send-asis
</FilesMatch>
```

> [!NOTE]
> **Files with no extension**
>
> Les fichiers sans extension (comme `Makefile`) ne peuvent pas être reconnus par les directives de [[12-modules/mod_mime|mod_mime]] basées sur l'extension. Pour définir le type de contenu ou le jeu de caractères de tels fichiers, utilisez à la place une section [[13-directives/files|<Files>]] ou [[13-directives/filesmatch|<FilesMatch>]] :
>
> ```apache
> # Pour un fichier spécifique :
> <Files "Makefile">
>     ForceType text/plain
>     AddDefaultCharset UTF-8
> </Files>
>
> # Pour tous les fichiers sans extension :
> <FilesMatch "^[^.]+$">
>     ForceType text/plain
>     AddDefaultCharset UTF-8
> </FilesMatch>
> ```

## Codage du contenu

Un fichier d'un type de médium particulier peut être aussi codé d'une certaine manière pour simplifier sa transmission sur Internet. Alors que cela concerne en général la compression, comme `gzip`, il peut aussi s'agir de chiffrement, comme `pgp` ou d'un codage comme UUencoding, qui est conçu pour transmettre un fichier binaire sous un format ASCII (texte).

La RFC HTTP/1.1 ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)), section 14.11 stipule à ce titre :

> Le champ d'en-tête Content-Encoding de l'entité est utilisé en tant que modificateur du type de médium. Lorsqu'il est présent, sa valeur indique quels codages de contenu additionnels ont été appliqués au corps de l'entité, et ainsi quels mécanismes de décodage doivent être appliqués afin de retrouver le type de médium référencé par le champ d'en-tête Content-Type. Le codage de contenu est principalement utilisé pour permettre la compression d'un document sans perdre l'information concernant le type de médium sous-jacent.

En utilisant plusieurs extensions (voir la section ci-dessus à propos des extensions de fichiers multiples), vous pouvez indiquer qu'un fichier est d'un *type*, particulier, et possède aussi un *codage* particulier.

Considérons par exemple un fichier contenant un document Microsoft Word et compressé par pkzip pour réduire sa taille. Si l'extension `.doc` est associée au type de fichier Microsoft Word, et si l'extension `.zip` est associée au codage de fichier pkzip, alors le fichier `Resume.doc.zip` sera identifié comme document Word compressé par pkzip.

Apache joint un en-tête `Content-encoding` à la ressource afin d'informer le navigateur client à propos de la méthode de codage.

```apache
Content-encoding: pkzip
```

## Jeux de caractères et langages

En plus du type de fichier et du codage, un autre élément important d'information est le langage dans lequel le document est écrit, et avec quel jeu de caractères le contenu du fichier doit être affiché. Par exemple, un document peut être écrit en alphabet vietnamien ou cyrillique, et doit être affiché en conséquence. Cette information est aussi transmise via des en-têtes HTTP.

Les jeu de caractères, langage, codage et type MIME sont tous utilisés au cours du processus de négociation de contenu (voir [[12-modules/mod_negotiation|mod_negotiation]]) afin de déterminer quel document servir au client, lorsque plusieurs choix sont possibles en fonction du jeu de caractères, du langage, du codage ou du type MIME. Toutes les associations d'extensions de noms de fichiers créées via les directives [[13-directives/addcharset|AddCharset]], [[13-directives/addencoding|AddEncoding]], [[13-directives/addlanguage|AddLanguage]] et [[13-directives/addtype|AddType]] (ainsi que les associations d'extensions listées dans le fichier défini par la directive [[13-directives/mimemagicfile|MimeMagicFile]]), participent à ce processus de sélection. Les extensions de noms de fichiers qui n'ont été associés que par des directives [[13-directives/addhandler|AddHandler]], [[13-directives/addinputfilter|AddInputFilter]] ou [[13-directives/addoutputfilter|AddOutputFilter]], peuvent être incluses ou exclues du processus de sélection en utilisant la directive [[13-directives/multiviewsmatch|MultiviewsMatch]].

### Jeu de caractères

Pour transmettre cette information supplémentaire, Apache peut ajouter un en-tête `Content-Language`, afin de spécifier le langage dans lequel le document est écrit, et peut ajouter des informations additionnelles à l'en-tête `Content-Type` pour indiquer le jeu de caractères particulier qui doit être utilisé pour restituer correctement le document.

```
        Content-Language: en, fr
Content-Type: text/plain; charset=ISO-8859-1
```

Le langage est spécifié via son abréviation en deux lettres. Le `jeu de caractères` est le nom du jeu de caractères particulier qui doit être utilisé.

## Directives

- [[13-directives/addcharset|AddCharset]]
- [[13-directives/addencoding|AddEncoding]]
- [[13-directives/addhandler|AddHandler]]
- [[13-directives/addinputfilter|AddInputFilter]]
- [[13-directives/addlanguage|AddLanguage]]
- [[13-directives/addoutputfilter|AddOutputFilter]]
- [[13-directives/addtype|AddType]]
- [[13-directives/multiviewsmatch|MultiviewsMatch]]
- [[13-directives/defaultlanguage|DefaultLanguage]]
- [[13-directives/modmimeusepathinfo|ModMimeUsePathInfo]]
- [[13-directives/removecharset|RemoveCharset]]
- [[13-directives/removeencoding|RemoveEncoding]]
- [[13-directives/removehandler|RemoveHandler]]
- [[13-directives/removeinputfilter|RemoveInputFilter]]
- [[13-directives/removelanguage|RemoveLanguage]]
- [[13-directives/removeoutputfilter|RemoveOutputFilter]]
- [[13-directives/removetype|RemoveType]]
- [[13-directives/typesconfig|TypesConfig]]

## Voir aussi

- [[13-directives/mimemagicfile|MimeMagicFile]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
