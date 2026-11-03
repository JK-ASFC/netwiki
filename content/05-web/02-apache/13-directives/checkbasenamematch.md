---
title: "CheckBasenameMatch"
description: "Directive Apache CheckBasenameMatch (mod_speling) — Vérifie aussi la correspondance des fichiers, même avec des extensions différentes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_speling]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vérifie aussi la correspondance des fichiers, même avec des extensions différentes |
| **Syntaxe** | `CheckBasenameMatch on\|off` |
| **Valeur par défaut** | `CheckBasenameMatch On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_speling\|mod_speling]] |
| **Compatibilité** | Disponible à partir de la version 2.4.50 du serveur HTTP Apache |

## Utilisation

Lorsqu'elle est définie, cette directive étend le processus de correction orthographique à l'extension des noms de fichiers. Par exemple, un fichier de nom `foo.gif` sera pris en compte par une requête pour `foo` ou `foo.jpg`. Ceci peut s'avérer particulièrement utile en conjonction avec les [[11-guides/01-generalites/negociation-de-contenu|MultiViews]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
