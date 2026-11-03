---
title: "ImapMenu"
description: "Directive Apache ImapMenu (mod_imagemap) — Action à entreprendre si aucune coordonnée n'est fournie lorsqu'on invoque un fichier imagemap. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_imagemap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Action à entreprendre si aucune coordonnée n'est fournie lorsqu'on invoque un fichier imagemap |
| **Syntaxe** | `ImapMenu none\|formatted\|semiformatted\|unformatted` |
| **Valeur par défaut** | `ImapMenu formatted` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_imagemap\|mod_imagemap]] |

## Utilisation

La directive `ImapMenu` permet de spécifier l'action à entreprendre lorsqu'un fichier imagemap est invoqué sans coordonnées valides.

**`none`**

Si l'argument d'ImapMenu est `none`, aucun menu n'est généré, et l'action `default` est effectuée.

**`formatted`**

Le menu `formatted` est le menu le plus simple. Les commentaires du fichier imagemap sont ignorés. Un en-tête de niveau un est affiché, puis un séparateur horizontal, puis chacun des liens sur une ligne séparée. L'aspect du menu est similaire à celui d'un listing de répertoire.

**`semiformatted`**

Dans le menu `semiformatted`, les commentaires sont affichés au moment où ils apparaissent dans le fichier imagemap. Les lignes vides sont interprètées comme des lignes de séparation HTML. Aucun en-tête ni séparateur horizontal n'est affiché. À part ces différences, le menu `semiformatted` est identique au menu `formatted`.

**`unformatted`**

Les commentaires sont affichés et les lignes vides sont ignorées. N'est affiché que ce qui apparait dans le fichier imagemap. Toutes les lignes de séparation HTML et les en-têtes doivent être inclus en tant que commentaires dans le fichier imagemap. Cela vous procure une grande souplesse pour définir l'apparence de vos menus, mais vous oblige à rédiger vos fichiers imagemap en HTML, et non en texte plat.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
