---
title: "CharsetOptions"
description: "Directive Apache CharsetOptions (mod_charset_lite) — Précise les détails de la traduction du jeu de caractères. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_charset_lite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Précise les détails de la traduction du jeu de caractères |
| **Syntaxe** | `CharsetOptions option [option] ...` |
| **Valeur par défaut** | `CharsetOptions ImplicitAdd` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_charset_lite\|mod_charset_lite]] |

## Utilisation

La directive `CharsetOptions` permet de préciser certains détails du comportement du module [[12-modules/mod_charset_lite|mod_charset_lite]]. *Option* accepte les valeurs suivantes :

**`ImplicitAdd | NoImplicitAdd`**

Le mot-clé `ImplicitAdd` indique que [[12-modules/mod_charset_lite|mod_charset_lite]] doit insérer son filtre de manière implicite lorsque la configuration indique que le jeu de caractère du contenu doit être traduit. Si la chaîne de filtrage est configurée de manière explicite via la directive [[13-directives/addoutputfilter|AddOutputFilter]], l'option `NoImplicitAdd` doit être utilisée afin que [[12-modules/mod_charset_lite|mod_charset_lite]] n'ajoute pas son propre filtre.

**`TranslateAllMimeTypes | NoTranslateAllMimeTypes`**

Normalement, [[12-modules/mod_charset_lite|mod_charset_lite]] n'effectuera une traduction qu'en présence d'un petit nombre de types MIME parmi tous les types possibles. Lorsque l'option `TranslateAllMimeTypes` est utilisée pour une section de configuration donnée, la traduction est effectuée sans se préoccuper du type MIME.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
