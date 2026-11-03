---
title: "mod_autoindex"
description: "Module Apache mod_autoindex — Génère automatiquement des index de répertoires d'une manière similaire à la commande Unix ls, ou à la commande shell Win32 dir. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_autoindex]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Génère automatiquement des index de répertoires d'une manière similaire à la commande Unix ls, ou à la commande shell Win32 dir |
| **Statut** | Base |
| **Identificateur** | `autoindex_module` |
| **Fichier source** | `mod_autoindex.c` |

## Sommaire

L'index d'un répertoire peut être généré de deux manières :

- Un fichier situé dans ce répertoire, en général appelé `index.html`, mais dont le nom de ce ou ces fichiers peut être défini par la directive [[13-directives/directoryindex|DirectoryIndex]]. C'est le module [[12-modules/mod_dir|mod_dir]] qui traite alors cet index.
- Un listing généré par le serveur, dont le format est contrôlé par un certain nombre de directives. Les directives [[13-directives/addicon|AddIcon]], [[13-directives/addiconbyencoding|AddIconByEncoding]] et [[13-directives/addiconbytype|AddIconByType]] permettent de définir une liste d'icônes à afficher en fonction des différents types de fichiers ; pour chaque fichier listé, le premier icône qui correspond au type du fichier est affiché. C'est le module [[12-modules/mod_autoindex|mod_autoindex]] qui traite alors cet index.

Les deux fonctions sont séparées, si bien que vous pouvez entièrement supprimer (ou remplacer) la génération automatique d'index, si vous le souhaitez.

On active la génération automatique d'index en spécifiant `Options +Indexes`. Voir la directive [[13-directives/options|Options]] pour plus de détails.

Si la directive [[13-directives/indexoptions|IndexOptions]] est spécifiée avec l'option `FancyIndexing`, les en-têtes de colonnes sont des liens qui permettent de contrôler l'ordre de tri de l'affichage. Si vous actionnez le lien d'un en-tête, le listing sera généré à nouveau, trié en fonction des valeurs de la colonne concernée. Si l'on actionne de manière répétitive le même en-tête, l'ordre de tri est commuté entre les ordres croissant et décroissant. On peut supprimer ces liens d'en-têtes de colonnes à l'aide de l'option `SuppressColumnSorting` de la directive [[13-directives/indexoptions|IndexOptions]].

Notez que lorsque l'affichage est trié en fonction de la taille, c'est la taille *réelle* qui est prise en compte, et non la valeur affichée - ainsi, un fichier de 1010 octets sera toujours affiché avant un fichier de 1011 octets (en ordre croissant), même si la taille affichée des deux fichiers est "1K".

## Arguments de la requête d'autoindexation

La chaîne de paramètres de la requête peut contenir de nombreux arguments permettant dans une certaine mesure au client de contrôler l'ordre de l'index du répertoire, ainsi que la liste des fichiers à afficher. Si vous souhaitez désactiver cette fonctionnalité, utilisez l'option `IndexOptions IgnoreClient`.

Les en-têtes de tri des colonnes eux-mêmes sont des hyper-liens auto-référant qui ajoutent les options de tri à la requête énumérées ci-dessous qui peuvent être ajoutées à toute requête concernant la ressource répertoire.

- `C=N` trie l'affichage en fonction du nom de fichier
- `C=M` trie l'affichage en fonction de la date de dernière modification, puis du nom de fichier
- `C=S` trie l'affichage en fonction de la taille, puis du nom de fichier
- `C=D` trie l'affichage en fonction de la description, puis du nom de fichier
- `O=A` trie l'affichage selon l'ordre croissant
- `O=D` trie l'affichage selon l'ordre décroissant
- `F=0` affiche le listing sous la forme d'une simple liste (sans FancyIndex)
- `F=1` affiche le listing avec en-têtes de colonnes sous forme de liens hyper-textes (FancyIndexed)
- `F=2` affiche le listing sous forme de table HTML avec en-têtes de colonnes contenant des liens hyper-textes (FancyIndexed)
- `V=0` désactive le tri en fonction de la version
- `V=1` active le tri en fonction de la version
- `P=modèle` n'affiche que les fichiers correspondant au *modèle* spécifié

Notez que l'argument 'P' (pour Pattern) n'est testé qu'*après* que les directives habituelles [[13-directives/indexignore|IndexIgnore]] ont été traitées, et que tous les noms de fichiers sont encore assujettis aux mêmes critères que pour tout autre listing auto-indexé. L'interpréteur d'arguments de requête de [[12-modules/mod_autoindex|mod_autoindex]] s'arrête immédiatement s'il rencontre une option non reconnue. Les arguments de requête doivent être bien formés, selon la table ci-dessus.

Les options de requêtes sont illustrées par l'exemple ci-dessous, qui peut être copié et collé dans un fichier header.html. Notez que l'argument inconnu "X", pour le bouton submit, est introduit en dernier afin de s'assurer que tous les arguments ont été interprétés avant que [[12-modules/mod_autoindex|mod_autoindex]] ne rencontre l'entrée X=Go.

**Exemple**

```xml
<form action="" method="get">
    Show me a <select name="F">
        <option value="0"> Plain list</option>
        <option value="1" selected="selected"> Fancy list</option>
        <option value="2"> Table list</option>
    </select>
    Sorted by <select name="C">
        <option value="N" selected="selected"> Name</option>
        <option value="M"> Date Modified</option>
        <option value="S"> Size</option>
        <option value="D"> Description</option>
    </select>
    <select name="O">
        <option value="A" selected="selected"> Ascending</option>
        <option value="D"> Descending</option>
    </select>
    <select name="V">
        <option value="0" selected="selected"> in Normal order</option>
        <option value="1"> in Version order</option>
    </select>
    Matching <input type="text" name="P" value="*" />
    <input type="submit" name="X" value="Go" />
</form>
```

## Directives

- [[13-directives/addalt|AddAlt]]
- [[13-directives/addaltbyencoding|AddAltByEncoding]]
- [[13-directives/addaltbytype|AddAltByType]]
- [[13-directives/adddescription|AddDescription]]
- [[13-directives/addicon|AddIcon]]
- [[13-directives/addiconbyencoding|AddIconByEncoding]]
- [[13-directives/addiconbytype|AddIconByType]]
- [[13-directives/defaulticon|DefaultIcon]]
- [[13-directives/headername|HeaderName]]
- [[13-directives/indexignore|IndexIgnore]]
- [[13-directives/indexignorereset|IndexIgnoreReset]]
- [[13-directives/indexoptions|IndexOptions]]
- [[13-directives/indexorderdefault|IndexOrderDefault]]
- [[13-directives/indexstylesheet|IndexStyleSheet]]
- [[13-directives/indexheadinsert|IndexHeadInsert]]
- [[13-directives/readmename|ReadmeName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
