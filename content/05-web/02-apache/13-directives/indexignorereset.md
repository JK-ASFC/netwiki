---
title: "IndexIgnoreReset"
description: "Directive Apache IndexIgnoreReset (mod_autoindex) — Vide la liste des fichiers à cacher lors de l'affichage du contenu d'un répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_autoindex]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vide la liste des fichiers à cacher lors de l'affichage du contenu d'un répertoire |
| **Syntaxe** | `IndexIgnoreReset ON\|OFF` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_autoindex\|mod_autoindex]] |
| **Compatibilité** | Versions 2.3.10 et supérieures |

## Utilisation

La directive `IndexIgnoreReset` supprime toute liste de fichiers définie par la directive [[13-directives/indexignore|IndexIgnore]] et héritée par ailleurs d'autres sections de configuration.

```apache
<Directory "/var/www">
    IndexIgnore *.bak .??* *~ *# HEADER* README* RCS CVS *,v *,t
</Directory>
<Directory "/var/www/backups">
    IndexIgnoreReset ON
    IndexIgnore .??* *# HEADER* README* RCS CVS *,v *,t
</Directory>
```

> [!WARNING]
> Revoyez la configuration par défaut pour une liste de modèles que vous voulez ignorer explicitement après usage de cette directive.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
