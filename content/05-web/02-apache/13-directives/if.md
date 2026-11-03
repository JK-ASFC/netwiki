---
title: "<If>"
description: "Directive Apache <If> (core) — Contient des directives qui ne s'appliquent que si une condition est satisfaite au cours du traitement d'une requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliquent que si une condition est satisfaite au cours du traitement d'une requête |
| **Syntaxe** | `<If expression> ... </If>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Les conditions imbriquées sont supportées à partir de la version 2.4.26 du serveur HTTP Apache |

## Utilisation

La directive `<If>` évalue une expression à la volée, et applique les directives qu'elle contient si et seulement si l'expression renvoie la valeur "vrai". Par exemple :

```apache
<If "-z req('Host')">
```

serait satisfaite pour les requêtes HTTP/1.0 sans en-tête *Host:*. Les expressions peuvent contenir différents opérateurs de type shell pour la comparaison de chaînes (`==`, `!=`, `<`, ...), la comparaison d'entiers (`-eq`, `-ne`, ...), ou à usages divers (`-n`, `-z`, `-f`, ...). Les expressions rationnelles sont aussi supportées,

```apache
<If "%{QUERY_STRING} =~ /(delete|commit)=.*?elem/">
```

ainsi que les comparaison de modèles de type shell et de nombreuses autres opérations. Ces opérations peuvent être effectuées sur les en-têtes de requêtes (`req`), les variables d'environnement (`env`), et un grand nombre d'autres propriétés. La documentation complète est disponible dans [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]].

Cette section de configuration ne peut contenir que des directives qui supportent le contexte de répertoire.

> [!WARNING]
> Certain variables, such as `CONTENT_TYPE` and other response headers, are set after \<If\> conditions have already been evaluated, and so will not be available to use in this directive.

> [!WARNING]
> Les directives qui sont évaluées lors du traitement de la configuration comme `Define`, `Include` et `Error` ne peuvent pas être traitées de manière conditionnelle en les incluant dans une section de configuration `<If>`. Ces sections font en effet toujours partie de la configuration, quelle soit la manière dont elles sont évaluées à l'exécution.

## Voir aussi

- [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
