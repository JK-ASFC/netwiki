---
title: "mod_cern_meta"
description: "Module Apache mod_cern_meta — La sémantique des métafichiers du serveur httpd du CERN. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cern_meta]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La sémantique des métafichiers du serveur httpd du CERN |
| **Statut** | Deprecated |
| **Identificateur** | `cern_meta_module` |
| **Fichier source** | `mod_cern_meta.c` |

## Sommaire

Il s'agit d'une émulation de la sémantique des métafichiers du serveur httpd du CERN. Les métafichiers consistent en en-têtes HTTP qui peuvent s'ajouter au jeu d'en-têtes habituels pour chaque fichier accédé. Ils ressemblent beaucoup aux fichiers .asis d'Apache, et permettent d'influencer de manière rudimentaire l'en-tête Expires:, ainsi que d'autres curiosités. Il existe de nombreuses méthodes pour gérer les métainformations, mais le choix s'est porté sur celle-ci car il existe déjà un grand nombre d'utilisateurs du CERN qui peuvent exploiter ce module.

Pour plus d'information, voir le document sur la [sémantique des métafichiers du CERN](https://www.w3.org/Daemon/User/Config/General.html#MetaDir).

## Directives

- [[13-directives/metafiles|MetaFiles]]
- [[13-directives/metadir|MetaDir]]
- [[13-directives/metasuffix|MetaSuffix]]

## Voir aussi

- [[12-modules/mod_headers|mod_headers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
