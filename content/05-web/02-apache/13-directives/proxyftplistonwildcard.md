---
title: "ProxyFtpListOnWildcard"
description: "Directive Apache ProxyFtpListOnWildcard (mod_proxy_ftp) — Les caractères génériques dans les noms de fichiers demandés doivent-ils déclencher l'affichage d'un listing ? Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_ftp]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les caractères génériques dans les noms de fichiers demandés doivent-ils déclencher l'affichage d'un listing ? |
| **Syntaxe** | `ProxyFtpListOnWildcard on\|off` |
| **Valeur par défaut** | `ProxyFtpListOnWildcard on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_ftp\|mod_proxy_ftp]] |
| **Compatibilité** | Disponible depuis la version 2.3.3 du serveur HTTP Apache |

## Utilisation

La directive `ProxyFtpListOnWildcard` permet de déterminer si les caractères génériques ("\*?\[{~") que contiennent les noms de fichiers demandés provoquent l'affichage d'un listing de fichiers par [[12-modules/mod_proxy_ftp|mod_proxy_ftp]] au lieu de télécharger un fichier. Il s'agit de leur comportement par défaut (valeur on).

Définissez cette directive à "off" pour permettre le téléchargement de fichiers même si leur nom contient des caractères génériques.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
