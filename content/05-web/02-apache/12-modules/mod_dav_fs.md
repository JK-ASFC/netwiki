---
title: "mod_dav_fs"
description: "Module Apache mod_dav_fs — Implémente le fournisseur filesystem pour mod_dav. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dav_fs]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Implémente le fournisseur filesystem pour mod\_dav |
| **Statut** | Extension |
| **Identificateur** | `dav_fs_module` |
| **Fichier source** | `mod_dav_fs.c` |

## Sommaire

L'activation de ce module *nécessite* l'utilisation de [[12-modules/mod_dav|mod_dav]]. C'est un module de support pour [[12-modules/mod_dav|mod_dav]] et à ce titre, il permet l'accès à des ressources situées dans le système de fichiers du serveur. Le nom formel de ce fournisseur est `filesystem`. Les fournisseurs supports de [[12-modules/mod_dav|mod_dav]] sont invoqués via la directive [[13-directives/dav|Dav]] :

**Exemple**

```apache
Dav filesystem
```

Comme `filesystem` est le fournisseur par défaut de [[12-modules/mod_dav|mod_dav]], vous pouvez vous contenter d'utiliser la valeur `On` comme argument de Dav.

## Directives

- [[13-directives/davlockdb|DavLockDB]]
- [[13-directives/davlockdiscovery|DavLockDiscovery]]

## Voir aussi

- [[12-modules/mod_dav|mod_dav]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
