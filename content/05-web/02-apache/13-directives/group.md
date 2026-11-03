---
title: "Group"
description: "Directive Apache Group (mod_unixd) — Groupe sous lequel le serveur va traiter les requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_unixd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Groupe sous lequel le serveur va traiter les requêtes |
| **Syntaxe** | `Group groupe unix` |
| **Valeur par défaut** | `Group #-1` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_unixd\|mod_unixd]] |

## Utilisation

La directive `Group` permet de définir le groupe sous lequel le serveur va traiter les requêtes. Pour utiliser cette directive, le serveur doit avoir été démarré par `root`. Si vous démarrez le serveur en tant qu'utilisateur non root, celui-ci ne pourra pas adopter le groupe spécifié comme groupe d'exécution, et continuera à s'exécuter sous le groupe de l'utilisateur qui l'aura lancé. *groupe unix* peut se présenter sous la forme :

**d'un nom de groupe**

Référence le groupe spécifié par son nom.

**du caractère `#` suivi d'un numéro de groupe.**

Référence le groupe spécifié par son numéro.

**Exemple**

```apache
Group www-group
```

Il est conseillé de créer un groupe dédié à l'exécution du serveur. Certains administrateurs utilisent l'utilisateur `nobody`, mais ce n'est pas toujours souhaitable ou même possible.

> [!WARNING]
> **Sécurité**
>
> Ne définissez pas la directive `Group` (ou [[13-directives/user|User]]) à `root` à moins de savoir exactement ce que vous faites ainsi que les dangers encourus.

## Voir aussi

- [[13-directives/vhostgroup|VHostGroup]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
