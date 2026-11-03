---
title: "VirtualDocumentRootIP"
description: "Directive Apache VirtualDocumentRootIP (mod_vhost_alias) — Configuration dynamique de la racine des documents pour un serveur virtuel donné. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_vhost_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration dynamique de la racine des documents pour un serveur virtuel donné |
| **Syntaxe** | `VirtualDocumentRootIP répertoire-interpolé\|none` |
| **Valeur par défaut** | `VirtualDocumentRootIP none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_vhost_alias\|mod_vhost_alias]] |

## Utilisation

La directive `VirtualDocumentRootIP` est identique à la directive [[13-directives/virtualdocumentroot|VirtualDocumentRoot]] à l'exception près qu'elle utilise l'adresse IP du serveur virtuel pour l'interpolation du répertoire à la place du nom du serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
