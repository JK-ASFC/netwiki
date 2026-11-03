---
title: "AddIcon"
description: "Directive Apache AddIcon (mod_autoindex) — Icône à afficher pour un fichier en fonction de son nom. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Icône à afficher pour un fichier en fonction de son nom |
| **Syntaxe** | `AddIcon icône nom [nom] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

Cette directive permet de déterminer l'icône à afficher à côté d'un fichier dont le nom se termine par *nom*, dans le cas d'un affichage `FancyIndexing`. *icône* est une URL relative (échappée par des caractères '%') vers l'icône, une URL distante pleinement qualifiée, ou de la forme `(alttext,url)`, où *alttext* est le symbole texte correspondant à l'icône à afficher dans les navigateurs en mode texte.

*nom* correspond à `^^DIRECTORY^^` pour les répertoires, `^^BLANKICON^^` pour les lignes vides (pour personnaliser la présentation du listing), une extension de fichier, une expression avec caractères génériques, un nom de fichier partiel ou un nom de fichier complet.

`^^BLANKICON^^` n'est utilisé que pour le formatage, et n'est donc pas nécessaire si vous utilisez `IndexOptions HTMLTable`.

```apache
#Examples
AddIcon (IMG,/icons/image.png) .gif .jpg .png
AddIcon /icons/dir.png ^^DIRECTORY^^
AddIcon /icons/backup.png *~
```

Lorsque c'est possible, il est préférable d'utiliser [[13-directives/addiconbytype|AddIconByType]] plutôt que `AddIcon`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
