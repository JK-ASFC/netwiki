---
title: "ProxyFtpDirCharset"
description: "Directive Apache ProxyFtpDirCharset (mod_proxy_ftp) — Définit le jeu de caractères des listings FTP mandatés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_ftp]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le jeu de caractères des listings FTP mandatés |
| **Syntaxe** | `ProxyFtpDirCharset character_set` |
| **Valeur par défaut** | `ProxyFtpDirCharset ISO-8859-1` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_ftp\|mod_proxy_ftp]] |
| **Compatibilité** | Disponible à partir de la version 2.2.7 du serveur HTTP Apache. Déplacé depuis [[12-modules/mod_proxy\|mod_proxy]] à partir de la version 2.3.5 |

## Utilisation

La directive `ProxyFtpDirCharset` permet de définir le jeu de caractères à utiliser pour les listings FTP en HTML générés par [[12-modules/mod_proxy_ftp|mod_proxy_ftp]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
