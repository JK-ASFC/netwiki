---
title: "ReadmeName"
description: "Directive Apache ReadmeName (mod_autoindex) — Nom du fichier dont le contenu sera inséré à la fin de l'index. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom du fichier dont le contenu sera inséré à la fin de l'index |
| **Syntaxe** | `ReadmeName nom-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |

## Utilisation

La directive `ReadmeName` permet de définir le nom du fichier dont le contenu sera ajouté à la fin de l'index. *nom-fichier* est le nom du fichier à inclure, et est considéré comme relatif au répertoire faisant l'objet de l'index. Si *nom-fichier* commence par un slash '/', comme dans l'exemple 2, il sera considéré comme relatif au répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]].

```apache
# Example 1
ReadmeName FOOTER.html
```

```apache
# Example 2
ReadmeName /include/FOOTER.html
```

Voir aussi la directive [[13-directives/headername|HeaderName]], où cette fonctionnalité est décrite plus en détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
