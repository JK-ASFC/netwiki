---
title: "<Directory>"
description: "Directive Apache <Directory> (core) — Regroupe un ensemble de directives qui ne s'appliquent qu'au répertoire concerné du système de fichiers, à ses sous-répertoires, et à leur contenu. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe un ensemble de directives qui ne s'appliquent qu'au répertoire concerné du système de fichiers, à ses sous-répertoires, et à leur contenu. |
| **Syntaxe** | `<Directory chemin répertoire> ... </Directory>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Les balises `<Directory>` et `</Directory>` permettent de regrouper un ensemble de directives qui ne s'appliquent qu'au répertoire précisé, à ses sous-répertoires, et aux fichiers situés dans ces sous-répertoires. Toute directive autorisée dans un contexte de répertoire peut être utilisée. *chemin répertoire* est soit le chemin absolu d'un répertoire, soit une chaîne de caractères avec caractères génériques utilisant la comparaison Unix de style shell. Dans une chaîne de caractères avec caractères génériques, `?` correspond à un caractère quelconque, et `*` à toute chaîne de caractères. Les intervalles de caractères `[]` sont aussi autorisés. Aucun caractère générique ne peut remplacer le caractère \`/', si bien que l'expression `<Directory "/*/public_html">` ne conviendra pas pour le chemin \* `/home/user/public_html`, alors que `<Directory "/home/*/public_html">` conviendra. Exemple :

```apache
<Directory "/usr/local/httpd/htdocs">
  Options Indexes FollowSymLinks
</Directory>
```

Les chemins de répertoires contenant des espaces *doivent* être entourés de guillemets afin d'empêcher l'interprétation de ces espaces comme fins d'arguments.

> [!NOTE]
> Soyez prudent avec l'argument *chemin répertoire* : il doit correspondre exactement au chemin du système de fichier qu'Apache httpd utilise pour accéder aux fichiers. Les directives comprises dans une section `<Directory>` ne s'appliqueront pas aux fichiers du même répertoire auxquels on aura accédé via un chemin différent, per exemple via un lien symbolique.

Les Expressions rationnelles peuvent aussi être utilisées en ajoutant le caractère `~`. Par exemple :

```apache
<Directory ~ "^/www/[0-9]{3}">

</Directory>
```

pourra correspondre à tout répertoire situé dans /www/ et dont le nom se compose de trois chiffres.

Si plusieurs sections `<Directory>` (sans expression rationnelle) correspondent au répertoire (ou à un de ses parents) qui contient le document, les directives de la section `<Directory>` dont le chemin est le plus court sont appliquées en premier, en s'intercalant avec les directives des fichiers .htaccess. Par exemple, avec

```apache
<Directory "/">
  AllowOverride None
</Directory>

<Directory "/home">
  AllowOverride FileInfo
</Directory>
```

l'accès au document `/home/web/dir/doc.html` emprunte le chemin suivant :

- Aplication de la directive `AllowOverride None` (qui désactive les fichiers `.htaccess`).
- Application de la directive `AllowOverride FileInfo` (pour le répertoire `/home`).
- Application de toute directive `FileInfo` qui se trouverait dans d'éventuels fichiers `/home/.htaccess`, `/home/web/.htaccess` ou `/home/web/dir/.htaccess`, dans cet ordre.

Les directives associées aux répertoires sous forme d'expressions rationnelles ne sont prises en compte qu'une fois toutes les directives des sections sans expressions rationnelles appliquées. Alors, tous les répertoires avec expressions rationnelles sont testés selon l'ordre dans lequel ils apparaissent dans le fichier de configuration. Par exemple, avec

```apache
<Directory ~ "abc$">
  # ... directives ici ...
</Directory>
```

la section avec expression rationnelle ne sera prise en compte qu'après les sections `<Directory>` sans expression rationnelle et les fichiers `.htaccess`. Alors, l'expression rationnelle conviendra pour `/home/abc/public_html/abc` et la section `<Directory>` correspondante s'appliquera.

> [!WARNING]
> La politique d'accès par défaut dans les sections `<Directory "/">` consiste à autoriser tout accès sans restriction. Ceci signifie qu'Apache httpd va servir tout fichier correspondant à une URL. Il est recommandé de modifier cette situation à l'aide d'un bloc du style

```apache
<Directory "/">
  Require all denied
</Directory>
```

puis d'affiner la configuration pour les répertoires que vous voulez rendre accessibles. Voir la page [[11-guides/06-divers/conseils-sur-la-securite|Conseils à propos de sécurité]] pour plus de détails.

Les sections `<Directory>` se situent dans le fichier `httpd.conf`. Les directives `<Directory>` ne peuvent pas être imbriquées et ne sont pas autorisées dans les sections [[13-directives/limit|<Limit>]] ou [[13-directives/limitexcept|<LimitExcept>]].

## Voir aussi

- [[11-guides/01-generalites/sections-de-configuration|Comment fonctionnent les sections <Directory>, <Location> et <Files>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
