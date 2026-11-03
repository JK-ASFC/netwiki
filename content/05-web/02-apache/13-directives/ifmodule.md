---
title: "<IfModule>"
description: "Directive Apache <IfModule> (core) — Contient des directives qui ne s'appliquent qu'en fonction de la présence ou de l'absence d'un module spécifique. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliquent qu'en fonction de la présence ou de l'absence d'un module spécifique |
| **Syntaxe** | `<IfModule [!]fichier module\|identificateur module> ... </IfModule>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Les identificateurs de modules sont disponibles dans les versions 2.1 et supérieures. |

## Utilisation

La section `<IfModule test>...</IfModule>` permet de conférer à des directives un caractère conditionnel basé sur la présence d'un module spécifique. Les directives situées dans une section `<IfModule>` ne s'appliquent que si *test* est vrai. Si *test* est faux, tout ce qui se trouve entre les balises de début et de fin est ignoré.

*test* peut se présenter sous deux formes :

- *module*
- !*module*

Dans le premier cas, les directives situées entre les balises de début et de fin ne s'appliquent que si le module *module* est présent -- soit compilé avec le binaire Apache httpd, soit chargé dynamiquement via la directive [[13-directives/loadmodule|LoadModule]]. Le second format inverse le test, et dans ce cas, les directives ne s'appliquent que si *module* n'est **pas** présent.

L'argument *module* peut contenir soit l'identificateur du module, soit le nom du fichier source du module. Par exemple, `rewrite_module` est un identificateur et `mod_rewrite.c` le nom du fichier source correspondant. Si un module comporte plusieurs fichiers sources, utilisez le nom du fichier qui contient la chaîne de caractères `STANDARD20_MODULE_STUFF`.

Les sections `<IfModule>` peuvent être imbriquées, ce qui permet d'implémenter des tests multi-modules simples.

> [!NOTE]
> Cette section ne doit être utilisée que si votre fichier de configuration ne fonctionne qu'en fonction de la présence ou de l'absence d'un module spécifique. D'une manière générale, il n'est pas nécessaire de placer les directives à l'intérieur de sections `<IfModule>`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
