---
title: "DavBasePath"
description: "Directive Apache DavBasePath (mod_dav) — Définir le chemin de la racine du répertoire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définir le chemin de la racine du répertoire |
| **Syntaxe** | `DavBasePath root-path` |
| **Valeur par défaut** | `None` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav\|mod_dav]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

Si le répertoire DAV est défini en utilisant une correspondance d'expression rationnelle (comme [[13-directives/locationmatch|<LocationMatch>]]), [[12-modules/mod_dav|mod_dav]] ne sera pas en mesure de déterminer de lui-même la racine du répertoire à partir du chemin seul. En conséquence, des fournisseurs tiers (par exemple le module [mod\_dav\_svn](https://svnbook.red-bean.com/en/1.7/svn.ref.mod_dav_svn.conf.html) de Subversion) pourront échouer à traiter des requêtes sans disposer de la valeur correcte de la racine du répertoire.

Pour permettre aux fournisseurs de travailler correctement en présence d'une telle configuration, vous devez utiliser `DavBasePath`.

```apache
<LocationMatch "^/repos/">
    Dav svn
    DavBasePath /repos
    SVNParentPath /var/svn
</LocationMatch>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
