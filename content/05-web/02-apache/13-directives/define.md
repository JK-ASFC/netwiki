---
title: "Define"
description: "Directive Apache Define (core) — Permet de définir une variable. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet de définir une variable |
| **Syntaxe** | `Define nom-paramètre [valeur-paramètre]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Avec un seul paramètre, l'effet de la directive `Define` est identique à celui de l'argument `-D` du programme [[10-commandes/httpd|httpd]]. Il permet de modifier le comportement des sections [[13-directives/ifdefine|<IfDefine>]] sans avoir à ajouter d'argument `-D` au sein des scripts de démarrage.

De plus, le second paramètre permet d'affecter une valeur à la variable définie par le premier. Cette variable peut être référencée dans le fichier de configuration via la syntaxe `${VAR}`. La portée de la variable est toujours globale, et n'est jamais limitée à la section de configuration courante.

```apache
<IfDefine TEST>
  Define servername test.example.com
</IfDefine>
<IfDefine !TEST>
  Define servername www.example.com
  Define SSL
</IfDefine>

DocumentRoot "/var/www/${servername}/htdocs"
```

Le caractère ":" est interdit dans les noms de variables afin d'éviter les conflits avec la syntaxe de la directive [[13-directives/rewritemap|RewriteMap]].

> [!NOTE]
> **Portée de la directive et pièges à éviter**
>
> Si cette directive est définie au sein d'un bloc VirtualHost, les changements qu'elle induit sont visibles de toute directive ultérieure, au delà de tout bloc VirtualHost.

## Voir aussi

- [[13-directives/undefine|UnDefine]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
