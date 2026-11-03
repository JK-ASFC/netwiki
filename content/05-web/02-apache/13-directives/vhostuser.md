---
title: "VHostUser"
description: "Directive Apache VHostUser (mod_privileges) — Définit l'identifiant utilisateur sous lequel s'exécute un serveur virtuel. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'identifiant utilisateur sous lequel s'exécute un serveur virtuel. |
| **Syntaxe** | `VHostUser identifiant-utilisateur-unix` |
| **Valeur par défaut** | `Hérite de l'identifiant utilisateur spécifié par la directive User` |
| **Contexte** | serveur virtuel |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | Disponible sous Solaris 10 et OpenSolaris avec les modules MPM non-threadés ([[12-modules/prefork\|prefork]] ou MPM personnalisé). |

## Utilisation

La directive `VHostUser` permet de définir l'identifiant utilisateur unix sous lequel le serveur va traiter les requêtes par l'intermédiaire d'un serveur virtuel. L'identifiant utilisateur est défini avant le traitement de la requête, puis restauré à sa valeur de départ via les [Privilèges Solaris](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html). Comme la définition s'applique au *processus*, cette directive est incompatible avec les modules MPM threadés.

*identifiant-utilisateur-unix* peut être :

**Un nom d'utilisateur**

Fait référence à l'utilisateur donné par son nom.

**`#` suivi d'un numéro d'utilisateur.**

Fait référence à l'utilisateur donné par son numéro.

> [!WARNING]
> **Sécurité**
>
> Cette directive ne peut pas être utilisée pour exécuter Apache en tant que root ! Elle est tout de même susceptible de poser des problèmes de sécurité similaires à ceux décrits dans la documentation de [[11-guides/01-generalites/support-suexec|suexec]].

## Voir aussi

- [[13-directives/user|User]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
