---
title: "VirtualScriptAliasIP"
description: "Directive Apache VirtualScriptAliasIP (mod_vhost_alias) — Configuration dynamique du répertoire des scripts CGI pour un serveur virtuel donné. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_vhost_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration dynamique du répertoire des scripts CGI pour un serveur virtuel donné |
| **Syntaxe** | `VirtualScriptAliasIP répertoire-interpolé\|none` |
| **Valeur par défaut** | `VirtualScriptAliasIP none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_vhost_alias\|mod_vhost_alias]] |

## Utilisation

La directive `VirtualScriptAliasIP` est identique à la directive [[13-directives/virtualscriptalias|VirtualScriptAlias]] à l'exception près qu'elle utilise l'adresse IP du serveur virtuel pour l'interpolation du répertoire à la place du nom du serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
