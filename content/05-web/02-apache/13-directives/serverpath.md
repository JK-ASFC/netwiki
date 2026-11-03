---
title: "ServerPath"
description: "Directive Apache ServerPath (core) — Nom de chemin d'URL hérité pour un serveur virtuel à base de nom accédé par un navigateur incompatible. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom de chemin d'URL hérité pour un serveur virtuel à base de nom accédé par un navigateur incompatible |
| **Syntaxe** | `ServerPath chemin d'URL` |
| **Contexte** | serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerPath` permet de définir le nom de chemin d'URL hérité d'un hôte, à utiliser avec les [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de nom]].

> [!NOTE]
> Il s’agit d’une fonctionnalité patrimoniale qui permet d’assurer une compatibilité avec les clients HTTP/1.0 qui n’envoient pas d’en-tête `Host:`. Lorsqu’un tel client soumet un URL correspondant à la valeur de la directive `ServerPath` d’un serveur virtuel, la requête est servie depuis ce serveur virtuel. En pratique, tous les clients HTTP modernes envoient l’en-tête `Host:`, ce qui rend cette directive inutile.

## Voir aussi

- [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|Prise en charge des serveurs virtuels à base de nom]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
