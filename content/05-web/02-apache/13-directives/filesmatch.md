---
title: "<FilesMatch>"
description: "Directive Apache <FilesMatch> (core) — Contient des directives qui s'appliquent à des fichiers spécifiés sous la forme d'expressions rationnelles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui s'appliquent à des fichiers spécifiés sous la forme d'expressions rationnelles |
| **Syntaxe** | `<FilesMatch expression rationnelle> ... </FilesMatch>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La section `<FilesMatch>` limite la portée des directives qu'elle contient aux fichiers spécifiés, tout comme le ferait une section [[13-directives/files|<Files>]]. Mais elle accepte aussi les expressions rationnelles. Par exemple :

```apache
<FilesMatch ".+\.(gif|jpe?g|png)$">
    # ...
</FilesMatch>
```

correspondrait à la plupart des formats graphiques de l'Internet.

> [!NOTE]
> Les caractères `.+` au début de l'expression rationnelle permettent de s'assurer que les fichiers de nom `.png`, ou `.gif`, par exemple, ne seront pas pris en compte.

A partir de la version 2.4.8, les groupes nommés et les références arrières sont extraits et enregistrés dans l'environnement avec leur nom en majuscules et préfixé par "MATCH\_". Ceci permet de référencer des URLs dans des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] ou au sein de modules comme [[12-modules/mod_rewrite|mod_rewrite]]. Pour éviter toute confusion, les références arrières numérotées (non nommées) sont ignorées. Vous devez utiliser à la place des groupes nommés.

```apache
<FilesMatch "^(?<sitename>[^/]+)">
    Require ldap-group cn=%{env:MATCH_SITENAME},ou=combined,o=Example
</FilesMatch>
```

## Voir aussi

- [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections <Directory>, <Location> et <Files>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
