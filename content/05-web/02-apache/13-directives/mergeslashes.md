---
title: "MergeSlashes"
description: "Directive Apache MergeSlashes (core) — Fusion des slashes consécutifs dans les URLs par le serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fusion des slashes consécutifs dans les URLs par le serveur. |
| **Syntaxe** | `MergeSlashes ON\|OFF` |
| **Valeur par défaut** | `MergeSlashes ON` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.39 du serveur HTTP Apache |

## Utilisation

Par défaut, le serveur fusionne les caractères slash ('/') multiples et consécutifs dans la partie chemin de l'URL d'une requête.

Lorsque cette partie chemin de l'URL est appliquée au système de fichiers, ces slashes multiples sont inutiles. Il peut être cependant préférable de conserver ces slashes multiples et consécutifs car ils peuvent avoir une signification dans le cas des URLs gérées différemment, par exemple par CGI ou par un serveur mandataire. Il convient alors de définir `MergeSlashes` à *OFF* pour conserver les slashes multiples consécutifs, ce qui correspond au comportement traditionnel.

Lorsque cette directive est définie à "OFF", les expressions rationnelles utilisées dans le fichier de configuration pour effectuer une comparaison de la partie chemin de l'URL ((`<LocationMatch>`, `RewriteRule`, ...) doivent en effet tenir compte de la présence éventuelle de slashes multiples et consécutifs. Les sections `<Location>` à base d'expressions non rationnelles correspondent toujours à des URLs avec slashes fusionnés et ne peuvent pas tenir compte des slashes multiples.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
