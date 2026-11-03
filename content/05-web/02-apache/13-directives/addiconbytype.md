---
title: "AddIconByType"
description: "Directive Apache AddIconByType (mod_autoindex) — Icône à afficher à côté d'un fichier en fonction de son type MIME. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Icône à afficher à côté d'un fichier en fonction de son type MIME |
| **Syntaxe** | `AddIconByType icône type MIME [type MIME] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

Cette directive permet de déterminer l'icône à afficher à côté d'un fichier de type MIME *type MIME* dans le cas d'un affichage `FancyIndexing`. *icône* est une URL relative (échappée par des caractères '%') vers l'icône, une URL pleinement qualifiée, ou de la forme `(alttext,url)`, où *alttext* est le symbole texte correspondant à l'icône à afficher dans les navigateurs en mode texte.

*type MIME* est une expression avec caractères génériques représentant le type MIME.

```apache
AddIconByType (IMG,/icons/image.png) image/*
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
