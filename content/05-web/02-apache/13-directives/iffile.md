---
title: "<IfFile>"
description: "Directive Apache <IfFile> (core) — Regroupe des directives qui ne seront traitées que si un fichier existe au démarrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives qui ne seront traitées que si un fichier existe au démarrage |
| **Syntaxe** | `<IfFile [!]filename> ... </IfFile>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.34 du serveur HTTP Apache |

## Utilisation

La section `<IfFile filename>...</IfFile>` permet de conditionner le traitement de directives à l'existence d'un fichier sur disque. Ainsi, les directives définies au sein d'une section `<IfFile>` ne seront traitées que si le fichier *filename* existe. Si le fichier *filename* n'existe pas, tout ce qui se trouve entre les marqueurs start et end sera ignoré. *filename* peut être un chemin absolu ou relatif au chemin défini par la directive ServerRoot.

Le paramètre *filename* de l'en-tête d'une section `<IfFile>` peut prendre la même forme que la variable *test* de la section [[13-directives/ifdefine|<IfDefine>]] ; à ce titre, le résultat du test peut être inversé en plaçant le caractère `!` juste avant *filename*.

Si *filename* est un chemin relatif, il sera généré par rapport au chemin défini par la directive [[13-directives/serverroot|ServerRoot]]. Lorsque la directive `<IfFile>` intervient avant la définition de la directive [[13-directives/serverroot|ServerRoot]], *filename* sera relatif au répertoire racine par défaut du serveur ou au répertoire racine passé dans la ligne de commande via l'option `-d`.

> [!WARNING]
> **Avertissement**
>
> Avec la version 2.4.34, il est interdit de spécifier un *filename* entouré de guillemets. Ceci provoquerait une erreur de syntaxe au démarrage. Il est donc impossible de spécifier des noms de fichiers contenant des espaces, mais ce défaut a été corrigé à partir de la version 2.4.35.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
