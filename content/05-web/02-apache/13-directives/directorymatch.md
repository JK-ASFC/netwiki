---
title: "<DirectoryMatch>"
description: "Directive Apache <DirectoryMatch> (core) — Regroupe des directives qui s'appliquent au contenu de répertoires du système de fichiers correspondant à une expression rationnelle. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Regroupe des directives qui s'appliquent au contenu de répertoires du système de fichiers correspondant à une expression rationnelle |
| **Syntaxe** | `<DirectoryMatch regex> ... </DirectoryMatch>` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Les balises `<DirectoryMatch>` et `</DirectoryMatch>` permettent de regrouper un ensemble de directives qui ne s'appliqueront qu’aux répertoires (et aux fichiers qu’ils contiennent) dont le chemin du système de fichiers correspond à l’expression rationnelle spécifiée. À la différence de [[13-directives/directory|<Directory>]], les directives ne s’appliqueront aux sous-répertoires que si le motif leur correspond aussi. Cette balise prend comme argument une expression rationnelle qui est comparée en tant que sous-chaîne (elle n’est pas ancrée au début ou à la fin, à moins que vous n’indiquiez explicitement `^` ou `$` dans le motif. Par exemple :

```apache
<DirectoryMatch "^/www/(.+/)?[0-9]{3}/">
    # ...
</DirectoryMatch>
```

convient pour les sous-répertoires de `/www/` dont le nom se compose de trois chiffres.

> [!NOTE]
> **Compatibilité**
>
> Avant la version 2.3.9, cette directive s'appliquait aussi aux sous-répertoires (comme la directive [[13-directives/directory|<Directory>]]), et ne tenait pas compte du symbole de fin de ligne ($). Depuis la version 2.3.9, seuls les répertoires qui correspondent à l'expression sont affectés par les directives contenues dans la section.

> [!NOTE]
> **slash de fin**
>
> Cette directive s'applique aux requêtes pour des répertoires avec ou sans slash de fin. Si vous ancrez votre motif avec `$`, vous devrez peut-être comparer les deux formes ; par exemple, `<DirectoryMatch "^/var/www/?$">`.

A partir de la version 2.4.8, les groupes nommés et les références arrières sont extraits et enregistrés dans l'environnement avec leur nom en majuscules et préfixé par "MATCH\_". Ceci permet de référencer des URLs dans des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] ou au sein de modules comme [[12-modules/mod_rewrite|mod_rewrite]]. Pour éviter toute confusion, les références arrières numérotées (non nommées) sont ignorées. Vous devez utiliser à la place des groupes nommés.

```apache
<DirectoryMatch "^/var/www/combined/(?<sitename>[^/]+)">
    Require ldap-group cn=%{env:MATCH_SITENAME},ou=combined,o=Example
</DirectoryMatch>
```

## Voir aussi

- [[13-directives/directory|<Directory>]]
- `<Directory>`

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
