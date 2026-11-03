---
title: "ProxyFtpEscapeWildcards"
description: "Directive Apache ProxyFtpEscapeWildcards (mod_proxy_ftp) — Les caractères génériques dans les noms de fichiers doivent-ils être échappés lorsqu'ils sont envoyés au serveur FTP ? Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_ftp]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les caractères génériques dans les noms de fichiers doivent-ils être échappés lorsqu'ils sont envoyés au serveur FTP ? |
| **Syntaxe** | `ProxyFtpEscapeWildcards on\|off` |
| **Valeur par défaut** | `ProxyFtpEscapeWildcards on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_ftp\|mod_proxy_ftp]] |
| **Compatibilité** | Disponible depuis la version 2.3.3 du serveur HTTP Apache |

## Utilisation

La directive `ProxyFtpEscapeWildcards` permet de déterminer si les caractères génériques ("\*?\[{~") que contiennent les noms de fichiers demandés doivent être échappés pas un slash inversé avant d'être envoyés au serveur FTP. Il s'agit du comportement par défaut ; cependant, de nombreux serveurs FTP n'ont aucune connaissance de la notion d'échappement, et tentent de servir le fichier demandé sous sa forme littérale, en incluant les slashes inversés dans son nom.

Définissez cette directive à "off" pour permettre le téléchargement de fichiers dont les noms contiennent des caractères génériques depuis des serveurs FTP qui ne connaissent pas l'échappement des caractères génériques.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
