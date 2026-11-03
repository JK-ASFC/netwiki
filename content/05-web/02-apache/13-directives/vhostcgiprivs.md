---
title: "VHostCGIPrivs"
description: "Directive Apache VHostCGIPrivs (mod_privileges) — Assigne des privilèges au choix aux sous-processus créés par un serveur virtuel. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_privileges]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Assigne des privilèges au choix aux sous-processus créés par un serveur virtuel. |
| **Syntaxe** | `VHostCGIPrivs [+-]?privilege-name [[+-]?privilege-name] ...` |
| **Valeur par défaut** | `Aucun` |
| **Contexte** | serveur virtuel |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_privileges\|mod_privileges]] |
| **Compatibilité** | Disponible sous Solaris 10 et OpenSolaris avec les modules MPM non-threadés ([[12-modules/prefork\|prefork]] ou MPM personnalisé) et lorsque [[12-modules/mod_privileges\|mod_privileges]] est construit avec l'option de compilation *BIG\_SECURITY\_HOLE*. |

## Utilisation

La directive `VHostCGIPrivs` permet d'assigner des [privilèges](https://docs.oracle.com/cd/E19253-01/816-4863/6mb20lvfd/index.html) au choix aux sous-processus créés par un serveur virtuel, comme décrit dans la directive `VHostCGIMode`. Chaque *nom-privilège* correspond à un privilège Solaris tel que *file\_setid* ou *sys\_nfs*.

*privilege-name* peut être éventuellement préfixé par + ou -, ce qui va respectivement accorder ou refuser le privilège. Si *privilege-name* est spécifié sans + ni -, tous les autres privilèges préalablement assignés au serveur virtuel seront refusés. Cette directive permet de construire aisément votre propre jeu de privilèges en annulant tout réglage par défaut.

> [!WARNING]
> **Sécurité**
>
> L'utilisation de cette directive peut ouvrir d'immenses trous de sécurité dans les sous-processus Apache, jusqu'à leur exécution avec les droits de root. Ne l'utilisez que si vous êtes absolument sûr de comprendre ce que vous faites !

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
