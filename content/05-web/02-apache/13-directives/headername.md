---
title: "HeaderName"
description: "Directive Apache HeaderName (mod_autoindex) — Nom du fichier qui sera inséré au début de la page contenant l'index. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom du fichier qui sera inséré au début de la page contenant l'index |
| **Syntaxe** | `HeaderName nom fichier` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `HeaderName` permet de définir le nom du fichier qui sera inséré au début de la page contenant l'index. *nom fichier* est le nom du fichier à inclure.

```apache
HeaderName HEADER.html
```

> [!NOTE]
> Les deux directives HeaderName et [[13-directives/readmename|ReadmeName]] traitent maintenant *nom fichier* comme un chemin URI relatif au chemin utilisé pour accéder au répertoire faisant l'objet de l'index. Si *nom fichier* commence par un slash '/', il sera considéré comme relatif au répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]].
>
> ```apache
> HeaderName /include/HEADER.html
> ```
>
> *nom fichier* doit correspondre à un document dont le type MIME est du style `text/*` (*par exemple* `text/html`, `text/plain`, etc...). Cela signifie que *nom fichier* peut faire référence à un script CGI si le véritable type MIME du script (et non celui de sa sortie) est marqué comme `text/html` par exemple à l'aide d'une directive comme :
>
> ```apache
> AddType text/html .cgi
> ```
>
> Une [[11-guides/01-generalites/negociation-de-contenu|négociation de contenu]] sera effectuée si [[13-directives/options|Options]] `MultiViews` a été précisé. Si *nom fichier* correspond à un document statique `text/html` (et non à un script CGI), et une des deux [[13-directives/options|options]] `Includes` ou `IncludesNOEXEC` est activée, le fichier sera traité en tant qu'inclusion côté serveur (Server Side Include) (voir la documentation de [[12-modules/mod_include|mod_include]]).

Si le fichier spécifié par la directive `HeaderName` contient les en-têtes d'un document HTML (\<html\>, \<head\>, etc...), vous serez probablement amenés à définir `IndexOptions +SuppressHTMLPreamble`, de manière à ce que ces balises ne soient pas répétées.

## Voir aussi

- [[13-directives/readmename|ReadmeName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
