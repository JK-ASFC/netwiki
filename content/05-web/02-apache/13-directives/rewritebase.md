---
title: "RewriteBase"
description: "Directive Apache RewriteBase (mod_rewrite) — Définit l'URL de base pour les réécritures au niveau répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'URL de base pour les réécritures au niveau répertoire |
| **Syntaxe** | `RewriteBase chemin_URL` |
| **Valeur par défaut** | `Pas de valeur par défaut` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |

## Utilisation

La directive `RewriteBase` permet de spécifier le préfixe d'URL à utiliser dans un contexte de répertoire (htaccess) pour les directives [[13-directives/rewriterule|RewriteRule]] qui réécrivent vers un chemin relatif.

Cette directive est *obligatoire* si vous utilisez un chemin relatif dans une substitution, et dans un contexte de répertoire (htaccess), sauf si au moins une de ces conditions est vérifiée :

- La requête initiale, ainsi que la substitution, se situent par raport à la valeur de la directive [[13-directives/documentroot|DocumentRoot]] (c'est à dire que pour y accéder, il n'est pas nécessaire d'utiliser une directive telle qu'[[13-directives/alias|Alias]]).
- Le chemin de répertoire auquel la [[13-directives/rewriterule|RewriteRule]] s’applique, suffixé par la substitution relative est aussi valable en tant que chemin d'URL sur le serveur (ce qui est rare).
- A partir de la version 2.4.16 du serveur HTTP Apache, cette directive peut être omise lorsque la requête est mise en correspondance avec le système de fichiers via la directive [[13-directives/alias|Alias]] ou le module [[12-modules/mod_userdir|mod_userdir]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
