---
title: "VHostSecure"
description: "Directive Apache VHostSecure (mod_privileges) — Détermine si le serveur s'exécute avec une sécurité avancée pour les serveurs virtuels. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le serveur s'exécute avec une sécurité avancée pour les serveurs virtuels. |
| **Syntaxe** | `VHostSecure On\|Off` |
| **Valeur par défaut** | `VHostSecure On` |
| **Contexte** | serveur virtuel |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | Disponible sous Solaris 10 et OpenSolaris avec les modules MPM non-threadés ([[12-modules/prefork\|prefork]] ou MPM personnalisé). |

## Utilisation

Détermine si les serveurs virtuels traitent les requêtes avec une sécurité avancée en supprimant les [Privilèges](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html) rarement requis par un serveur web, mais disponibles par défaut pour un utilisateur Unix standard, et donc susceptibles d'être demandés par des modules et des applications. Il est recommandé de conserver la définition par défaut (On), sauf si elle empêche une application de fonctionner. Comme la définition s'applique au *processus*, cette directive est incompatible avec les modules MPM threadés.

> [!NOTE]
> **Note**
>
> Le fait que la directive `VHostSecure` empêche une application de fonctionner peut constituer un signal d'avertissement indiquant que la sécurité de l'application doit être revue.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
