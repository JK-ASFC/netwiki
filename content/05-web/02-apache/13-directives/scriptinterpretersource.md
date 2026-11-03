---
title: "ScriptInterpreterSource"
description: "Directive Apache ScriptInterpreterSource (core) — Permet de localiser l'interpréteur des scripts CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet de localiser l'interpréteur des scripts CGI |
| **Syntaxe** | `ScriptInterpreterSource Registry\|Registry-Strict\|Script` |
| **Valeur par défaut** | `ScriptInterpreterSource Script` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Win32 seulement. |

## Utilisation

Cette directive permet de contrôler la méthode qu'utilise Apache httpd pour trouver l'interpréteur destiné à exécuter les scripts CGI. La définition par défaut est `Script` : ceci indique à Apache httpd qu'il doit utiliser l'interpréteur précisé dans la ligne shebang du script (la première ligne, commençant par `#!`). Sur les systèmes Win32, cette ligne ressemble souvent à ceci :

```perl
#!C:/Perl/bin/perl.exe
```

ou simplement, dans le cas où `perl` est dans le `PATH` :

```perl
#!perl
```

Avec `ScriptInterpreterSource Registry`, Windows va effectuer une recherche dans l'arborescence `HKEY_CLASSES_ROOT` de la base de registre avec comme mot-clé l'extension du fichier contenant le script (par exemple `.pl`). C'est la commande définie par la sous-clé de registre `Shell\ExecCGI\Command` ou, si elle n'existe pas, la sous-clé `Shell\Open\Command` qui est utilisée pour ouvrir le fichier du script. Si ces clés de registre ne sont pas trouvées, Apache httpd utilise la méthode de l'option `Script`.

> [!WARNING]
> **Sécurité**
>
> Soyez prudent si vous utilisez `ScriptInterpreterSource Registry` avec des répertoires faisant l'objet d'un [[13-directives/scriptalias|ScriptAlias]], car Apache httpd va essayer d'exécuter **tous** les fichiers contenus dans celui-ci. L'option `Registry` peut causer des appels de programmes non voulus sur des fichiers non destinés à être exécutés. Par exemple, la commande par défaut open sur les fichiers `.htm` sur la plupart des systèmes Windows va lancer Microsoft Internet Explorer ; ainsi, toute requête HTTP pour un fichier `.htm` situé dans le répertoire des scripts va lancer le navigateur en arrière-plan sur le serveur, ce qui a toutes les chances de crasher votre système dans les minutes qui suivent.

L'option `Registry-Strict` agit de manière identique à `Registry`, mais n'utilise que la sous-clé `Shell\ExecCGI\Command`. La présence de la clé `ExecCGI` n'étant pas systématique, Elle doit être définie manuellement dans le registre Windows et évite ainsi tout appel de programme accidentel sur votre système.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
