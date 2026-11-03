---
title: "User"
description: "Directive Apache User (mod_unixd) — L'utilisateur sous lequel le serveur va traiter les requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_unixd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'utilisateur sous lequel le serveur va traiter les requêtes |
| **Syntaxe** | `User utilisateur unix` |
| **Valeur par défaut** | `User #-1` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_unixd\|mod_unixd]] |

## Utilisation

La directive `User` permet de définir l'utilisateur sous lequel le serveur va traiter les requêtes. Pour utiliser cette directive, le serveur doit avoir été démarré par `root`. Si vous démarrez le serveur en tant qu'utilisateur non root, celui-ci ne pourra pas adopter l'utilisateur avec privilèges restreints comme utilisateur d'exécution, et continuera à s'exécuter sous l'utilisateur qui l'aura lancé. Si vous démarrez le serveur en tant que `root`, il est normal que le processus parent continue à s'exécuter sous root. *utilisateur unix* peut se présenter sous la forme :

**d'un nom d'utilisateur**

Référence l'utilisateur spécifié par son nom.

**le caractère # suivi d'un numéro d'utilisateur.**

Référence l'utilisateur spécifié par son numéro.

L'utilisateur ne doit pas posséder de privilèges qui lui permettraient d'accéder à des fichiers non destinés au monde extérieur, et parallèlement, l'utilisateur ne doit pas exécuter de code dont l'usage soit destiné à un usage autre que les requêtes HTTP. Il est conseillé de créer un utilisateur et un groupe dédiés à l'exécution du serveur. Certains administrateurs utilisent l'utilisateur `nobody`, mais ce n'est pas toujours souhaitable, car l'utilisateur `nobody` peut avoir diverses utilisations dans le système.

> [!WARNING]
> **Sécurité**
>
> Ne définissez pas la directive `Group` (ou [[13-directives/user|User]]) à `root` à moins de savoir exactement ce que vous faites ainsi que les dangers encourus.

## Voir aussi

- [[13-directives/vhostuser|VHostUser]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
