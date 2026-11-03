---
title: "VirtualScriptAlias"
description: "Directive Apache VirtualScriptAlias (mod_vhost_alias) — Configuration dynamique du répertoire des scripts CGI pour un serveur virtuel donné. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_vhost_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration dynamique du répertoire des scripts CGI pour un serveur virtuel donné |
| **Syntaxe** | `VirtualScriptAlias répertoire-interpolé\|none` |
| **Valeur par défaut** | `VirtualScriptAlias none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_vhost_alias\|mod_vhost_alias]] |

## Utilisation

La directive `VirtualScriptAlias` vous permet de spécifier où Apache httpd pourra trouver les scripts CGI selon une méthode similaire à celle qu'utilise la directive [[13-directives/virtualdocumentroot|VirtualDocumentRoot]] pour les autres documents. Elle recherche des requêtes dont l'URI commence par `/cgi-bin/`, comme le ferait la directive [[13-directives/scriptalias|ScriptAlias]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
