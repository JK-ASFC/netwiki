---
title: "SSILastModified"
description: "Directive Apache SSILastModified (mod_include) — Définit si des en-têtes Last-Modified sont générés par le serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_include]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si des en-têtes `Last-Modified` sont générés par le serveur. |
| **Syntaxe** | `SSILastModified on\|off` |
| **Valeur par défaut** | `SSILastModified off` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_include\|mod_include]] |
| **Compatibilité** | Disponible à partir de la version 2.2.15 du serveur HTTP Apache. |

## Utilisation

Dans le cas général, un fichier filtré par [[12-modules/mod_include|mod_include]] peut contenir des éléments soit générés dynamiquement, soit éventuellement modifiés indépendemment du fichier original. En conséquence, l'en-tête `Last-Modified` est supprimé par défaut de la réponse.

La directive `SSILastModified` permet de modifier ce comportement en faisant en sorte que l'en-tête `Last-Modified` soit respecté s'il est déjà présent, ou défini dans le cas contraire. On peut aussi l'utiliser pour la mise en cache de la sortie. La directive `SSILastModified` peut prendre une des valeurs suivantes :

**`off`**

L'en-tête `Last-Modified` sera supprimé des réponses, à moins que la directive [[13-directives/xbithack|XBitHack]] ne soit définie à `full` comme décrit plus loin.

**`on`**

L'en-tête `Last-Modified` sera respecté s'il est déjà présent, et ajouté à la réponse si cette dernière est un fichier et si l'en-tête est manquant. La directive [[13-directives/ssilastmodified|SSILastModified]] l'emporte sur la directive [[13-directives/xbithack|XBitHack]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
