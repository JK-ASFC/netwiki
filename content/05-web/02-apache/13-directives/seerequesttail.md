---
title: "SeeRequestTail"
description: "Directive Apache SeeRequestTail (core) — Détermine si mod_status affiche les 63 premiers caractères d'une requête ou les 63 derniers, en supposant que la requête elle-même possède plus de 63 caractères. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si mod\_status affiche les 63 premiers caractères d'une requête ou les 63 derniers, en supposant que la requête elle-même possède plus de 63 caractères. |
| **Syntaxe** | `SeeRequestTail On\|Off` |
| **Valeur par défaut** | `SeeRequestTail Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.2.7 d'Apache httpd. |

## Utilisation

Avec `ExtendedStatus On`, [[12-modules/mod_status|mod_status]] affiche la véritable requête en cours de traitement. Pour des raisons historiques, seuls 63 caractères de la requête sont réellement stockés à des fins d'affichage. Cette directive permet de déterminer si ce sont les 63 premiers caractères qui seront stockés (c'est le comportement par défaut), ou si ce sont les 63 derniers. Ceci ne s'applique bien entendu que si la taille de la requête est de 64 caractères ou plus.

Si Apache httpd traite la requête `GET /disque1/stockage/apache/htdocs/images/rep-images1/nourriture/pommes.jpg HTTP/1.1` , l'affichage de la requête par [[12-modules/mod_status|mod_status]] se présentera comme suit :

| Off (défaut) | GET /disque1/stockage/apache/htdocs/images/rep-images1/nourritu |
| --- | --- |
| On | apache/htdocs/images/rep-images1/nourriture/pommes.jpg HTTP/1.1 |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
