---
title: "AddDescription"
description: "Directive Apache AddDescription (mod_autoindex) — Afficher la description d'un fichier. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Afficher la description d'un fichier |
| **Syntaxe** | `AddDescription texte [fichier] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

Cette directive permet d'afficher une description pour un fichier, dans le cas d'un affichage `FancyIndexing`. *fichier* est une extension de fichier, un nom de fichier partiel, une expression avec caractères génériques ou un nom de fichier complet permettant de caractériser le fichier. *texte* doit être entouré de guillemets (`"`).

```apache
AddDescription "The planet Mars" mars.gif
AddDescription "My friend Marshall" friends/mars.gif
```

La taille par défaut, habituelle du champ de description est de 23 octets. L'option `IndexOptions SuppressIcon` ajoute 6 octets, l'option `IndexOptions SuppressSize` en ajoute 7 et l'option `IndexOptions SuppressLastModified` en ajoute 19. Ainsi, la plus grande taille par défaut qui peut être assignée à la colonne description est de 55 octets.

Comme l'argument *fichier* peut être un nom de fichier partiel, vous devez garder à l'esprit qu'un nom de fichier partiel trop court pourra correspondre à des fichiers non voulus. Par exemple, `le.html` correspondra au fichier `le.html`, mais aussi au fichier `example.html`. En cas d'ambiguïté, utilisez un nom de fichier aussi complet que possible, et ordonnez votre liste de directives `AddDescription` en conséquence.

Voir le mot-clé DescriptionWidth de la directive [[13-directives/indexoptions|IndexOptions]] pour plus de détails sur la manière d'augmenter la taille de cette colonne, ou pour permettre des descriptions de taille illimitée.

> [!NOTE]
> **Avertissement**
>
> Le texte descriptif défini par la directive `AddDescription` peut contenir des marquages HTML, comme des balises ou des entités caractères. Si la limite de taille de la colonne description venait à tronquer une balise (par exemple couper la fin d'une phrase en caractères gras), le résultat pourrait en affecter toute la suite du listing du répertoire.

> [!NOTE]
> **Arguments avec chemins**
>
> Les chemins absolus ne sont actuellement pas supportés et ne peuvent correspondre à aucun chemin réel à l'exécution. Les arguments contenant des chemins relatifs, qui ne devraient être normalement utilisés que dans les fichiers htaccess, sont implicitement préfixés par '\*/' afin d'éviter toute association avec des noms de répertoires partiels.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
