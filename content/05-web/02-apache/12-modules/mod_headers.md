---
title: "mod_headers"
description: "Module Apache mod_headers — Personnalisation des en-têtes de requêtes et de réponses HTTP. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_headers]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Personnalisation des en-têtes de requêtes et de réponses HTTP |
| **Statut** | Extension |
| **Identificateur** | `headers_module` |
| **Fichier source** | `mod_headers.c` |

## Sommaire

Ce module fournit des directives permettant de contrôler et modifier les en-têtes de requêtes et de réponses HTTP. Les en-têtes peuvent être fusionnés, remplacés ou supprimés.

## Chronologie du traitement

Les directives fournies par [[12-modules/mod_headers|mod_headers]] peuvent s'insérer presque partout dans la configuration du serveur, et on peut limiter leur portée en les plaçant dans des [[11-guides/01-generalites/sections-de-configuration|sections de configuration]].

La chronologie du traitement est importante et est affectée par l'ordre d'apparition des directives dans le fichier de configuration et par leur placement dans les [[11-guides/01-generalites/sections-de-configuration|sections de configuration]]. Ainsi, ces deux directives ont un effet différent si leur ordre est inversé :

```apache
RequestHeader append MirrorID "mirror 12"
RequestHeader unset MirrorID
```

Dans cet ordre, l'en-tête `MirrorID` n'est pas défini. Si l'ordre des directives était inversé, l'en-tête `MirrorID` serait défini à "mirror 12".

## Traitement précoce et traitement tardif

[[12-modules/mod_headers|mod_headers]] peut agir soir précocement, soit tardivement au niveau de la requête. Le mode normal est le mode tardif, lorsque les en-têtes de *requête* sont définis, immédiatement avant l'exécution du générateur de contenu, et pour les en-têtes de *réponse*, juste au moment où la réponse est envoyée sur le réseau. Utilisez toujours le mode tardif sur un serveur en production.

Le mode précoce a été conçu à des fins d'aide aux tests et au débogage pour les développeurs. Les directives définies en utilisant le mot-clé `early` sont censées agir au tout début du traitement de la requête. Cela signifie que l'on peut les utiliser pour simuler différentes requêtes et définir des situations de test, tout en gardant à l'esprit que les en-têtes peuvent être modifiés à tout moment par d'autres modules avant que le réponse ne soit générée.

Comme les directives précoces sont traitées avant que le chemin de la requête ne soit parcouru, les en-têtes précoces ne peuvent être définis que dans un contexte de serveur principal ou de serveur virtuel. Les directives précoces ne peuvent pas dépendre d'un chemin de requête, si bien qu'elles échoueront dans des contextes tels que [[13-directives/directory|<Directory>]] ou [[13-directives/location|<Location>]].

## Exemples

1. Copie tous les en-têtes de requête qui commencent par "TS" vers les en-têtes de la réponse :

   ```apache
   Header echo ^TS
   ```
2. Ajoute à la réponse un en-tête, `mon-en-tête`, qui contient un horodatage permettant de déterminer le moment où la requête a été reçue, et le temps qui s'est écoulé jusqu'à ce que la requête ait commencé à être servie. Cet en-tête peut être utilisé par le client pour estimer la charge du serveur ou isoler les goulets d'étranglement entre le client et le serveur.

   ```apache
   Header set mon-en-tête "%D %t"
   ```

   le résultat est l'ajout à la réponse d'un en-tête du type :

   ```
   mon-en-tête: D=3775428 t=991424704447256
   ```
3. Dit Bonjour à Joe

   ```
   Header set mon-en-tête "Bonjour Joe. Il a fallu %D microsecondes \
   à Apache pour servir cette requête."
   ```

   le résultat est l'ajout à la réponse d'un en-tête du type :

   ```apache
   Header set MyHeader "Bonjour Joe. Il a fallu D=3775428 microsecondes à Apache
         pour servir cette requête."
   ```
4. Ajoute l'en-tête `mon-en-tête` à la réponse si et seulement si l'en-tête `mon-en-tête-requête` est présent dans la requête. Ceci peut s'avérer utile pour générer des en-têtes de réponse "à la tête du client". Notez que cet exemple nécessite les services du module [[12-modules/mod_setenvif|mod_setenvif]].

   ```apache
   SetEnvIf MyRequestHeader myvalue HAVE_MyRequestHeader
   Header set MyHeader "%D %t mytext" env=HAVE_MyRequestHeader
   ```

   Si l'en-tête `mon-en-tête-requête: mavaleur` est présent dans la requête HTTP, la réponse contiendra un en-tête du type :

   ```
   mon-en-tête: D=3775428 t=991424704447256 montexte
   ```
5. Permet à DAV de fonctionner avec Apache sur SSL (voir la [description du problème](http://svn.haxx.se/users/archive-2006-03/0549.shtml)) en remplaçant *https:* par *http:* dans l'en-tête *Destination* :

   ```apache
   RequestHeader edit Destination ^https: http: early
   ```
6. Définit la valeur d'un même en-tête sous de multiples conditions non exclusives, mais ne duplique pas une valeur déjà définie dans l'en-tête qui en résulte. Si toutes les conditions suivantes sont satisfaites pour une requête (en d'autres termes, si les trois variables d'environnement `CGI`, `NO_CACHE` et `NO_STORE` existent pour la requête) :

   ```apache
   Header merge Cache-Control no-cache env=CGI
   Header merge Cache-Control no-cache env=NO_CACHE
   Header merge Cache-Control no-store env=NO_STORE
   ```

   alors, la réponse contiendra l'en-tête suivant :

   ```
   Cache-Control: no-cache, no-store
   ```

   Si `append` avait été utilisé à la place de `merge`, la réponse aurait contenu l'en-tête suivant :

   ```
   Cache-Control: no-cache, no-cache, no-store
   ```
7. Définit un cookie de test si et seulement si le client n'envoie pas de cookie

   ```apache
   Header set Set-Cookie testcookie "expr=-z %{req:Cookie}"
   ```
8. Ajoute un en-tête de mise en cache pour les réponses avec un code d'état HTTP de 200

   ```apache
   Header append Cache-Control s-maxage=600 "expr=%{REQUEST_STATUS} == 200"
   ```

## Directives

- [[13-directives/requestheader|RequestHeader]]
- [[13-directives/header|Header]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
