---
title: "mod_dav_lock"
description: "Module Apache mod_dav_lock — Module de verrouillage générique pour mod_dav. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dav_lock]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de verrouillage générique pour mod\_dav |
| **Statut** | Extension |
| **Identificateur** | `dav_lock_module` |
| **Fichier source** | `mod_dav_lock.c` |
| **Compatibilité** | Disponible depuis la version 2.1 d'Apache |

## Sommaire

ce module implémente une API de verrouillage générique que tout fournisseur support de [[12-modules/mod_dav|mod_dav]] peut utiliser. Son activation nécessite l'utilisation de [[12-modules/mod_dav|mod_dav]]. Mais sans fournisseur support pour l'utiliser, il n'est d'aucun service et ne doit pas être chargé dans le serveur. [mod\_dav\_svn](http://subversion.apache.org/), le module qui implémente le fournisseur subversion, est un exemple de module de support qui utilise effectivement [[12-modules/mod_dav_lock|mod_dav_lock]].

Notez que [[12-modules/mod_dav_fs|mod_dav_fs]] n'a *pas* besoin de ce module de verrouillage générique, car il utilise sa propre version plus spécifique.

Pour que [[12-modules/mod_dav_lock|mod_dav_lock]] puisse fonctionner, il vous suffit de spécifier le chemin de la base de données des verrous à l'aide de la directive [[13-directives/davgenericlockdb|DavGenericLockDB]] décrite ci-dessous.

> [!NOTE]
> **Note du développeur**
>
> Pour déterminer le pointeur de la fonction du fournisseur de verrouillage, vous devez utiliser l'API `ap_lookup_provider` avec les arguments `dav-lock`, `generic` et `0`.

## Directives

- [[13-directives/davgenericlockdb|DavGenericLockDB]]

## Voir aussi

- [[12-modules/mod_dav|mod_dav]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
