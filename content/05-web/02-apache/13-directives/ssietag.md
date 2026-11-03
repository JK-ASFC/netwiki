---
title: "SSIETag"
description: "Directive Apache SSIETag (mod_include) — Définit si des en-têtes ETags sont générés par le serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si des en-têtes ETags sont générés par le serveur. |
| **Syntaxe** | `SSIETag on\|off` |
| **Valeur par défaut** | `SSIETag off` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |
| **Compatibilité** | Disponible à partir de la version 2.2.15 du serveur HTTP Apache. |

## Utilisation

Dans le cas général, un fichier filtré par [[12-modules/mod_include|mod_include]] peut contenir des éléments soit générés dynamiquement, soit éventuellement modifiés indépendemment du fichier original. En conséquence, il est demandé par défaut au serveur de ne pas générer d'en-tête `ETag` à la réponse en ajoutant `no-etag` aux informations de requête.

Ce comportement peut être modifié via la directive `SSIETag` qui permet au serveur de générer un en-tête `ETag`. On peut aussi l'utiliser pour la mise en cache de la sortie. Notez qu'un serveur d'arrière-plan ou un générateur de contenu dynamique peut lui-même générer un en-tête `ETag`, en ignorant l'information `no-etag`, cet en-tête `ETag` étant transmis par [[12-modules/mod_include|mod_include]] sans tenir compte de la définition de la présente directive. La directive `SSIETag` peut prendre une des valeurs suivantes :

**`off`**

`no-etag` sera ajouté aux informations de requête, et il sera demandé au serveur de ne pas générer d'en-tête `ETag`. Lorsqu'un serveur ignore la valeur de `no-etag` et génère tout de même un en-tête `ETag`, ce dernier sera respecté.

**`on`**

Les en-têtes `ETag` existants seront respectés, et ceux générés par le serveur seront ajoutés à la réponse.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
