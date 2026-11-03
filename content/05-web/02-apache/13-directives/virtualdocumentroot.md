---
title: "VirtualDocumentRoot"
description: "Directive Apache VirtualDocumentRoot (mod_vhost_alias) — Permet une configuration dynamique de la racine des documents d'un serveur virtuel donné. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_vhost_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet une configuration dynamique de la racine des documents d'un serveur virtuel donné |
| **Syntaxe** | `VirtualDocumentRoot répertoire-interpolé\|none` |
| **Valeur par défaut** | `VirtualDocumentRoot none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_vhost_alias\|mod_vhost_alias]] |

## Utilisation

La directive `VirtualDocumentRoot` vous permet de spécifier où le serveur HTTP Apache pourra trouver vos documents en se basant sur le nom du serveur. Le résultat de l'expansion du *répertoire-interpolé* est utilisé comme racine de l'arborescence des documents d'une manière similaire à l'argument de la directive [[13-directives/documentroot|DocumentRoot]]. Si *répertoire-interpolé* a pour valeur `none`, la directive `VirtualDocumentRoot` est désactivée. Cette directive ne peut pas être utilisée dans le même contexte que la directive [[13-directives/virtualdocumentrootip|VirtualDocumentRootIP]].

> [!WARNING]
> **Note**
>
> La directive `VirtualDocumentRoot` l'emporte sur toute directive [[13-directives/documentroot|DocumentRoot]] définie dans le même contexte ou dans des contextes enfants. Le fait de définir une directive `VirtualDocumentRoot` dans le contexte du serveur principal va effectivement l'emporter sur toute directive [[13-directives/documentroot|DocumentRoot]] définie dans un serveur virtuel quelconque, si vous n'avez pas défini `VirtualDocumentRoot` à `None` dans ce serveur virtuel.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
