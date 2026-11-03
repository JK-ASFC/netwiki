---
title: "mod_userdir"
description: "Module Apache mod_userdir — Répertoires propres à un utilisateur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_userdir]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoires propres à un utilisateur |
| **Statut** | Base |
| **Identificateur** | `userdir_module` |
| **Fichier source** | `mod_userdir.c` |

## Sommaire

> [!WARNING]
> En activant ce module, vous permettez à plusieurs utilisateurs de stocker des contenus sous un seul noeud de l'arborescence. La politique de stockage sous un seul noeud de l'arborescence est un principe clé de Javascript et de la sécurité du web. En stockant des pages web sous un seul noeud de l'arborescence, celles-ci peuvent se lire et se contrôler mutuellement et d'éventuels problèmes de sécurité liés à une page peut affecter les autres. Ceci peut s'avérer particulièrement dangereux dans le cas des pages web mettant en oeuvre du contenu dynamique et de l'authentification et lorsque les utilisateurs ne se voient pas tous forcément d'un bon oeil.

Ce module permet l'accès aux répertoires propres à un utilisateur en utilisant la syntaxe `http://example.com/~utilisateur/`.

## Directives

- [[13-directives/userdir|UserDir]]

## Voir aussi

- [[11-guides/01-generalites/mise-en-correspondance-des-urls-avec-le-systeme-de-fichiers|Mise en correspondance des URLs avec le système de fichiers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
