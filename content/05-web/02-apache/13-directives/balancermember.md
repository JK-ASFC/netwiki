---
title: "BalancerMember"
description: "Directive Apache BalancerMember (mod_proxy) — Ajoute un membre à un groupe de répartition de charge. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un membre à un groupe de répartition de charge |
| **Syntaxe** | `BalancerMember [balancerurl] url [clé=valeur [clé=valeur ...]]` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible depuis la version 2.2 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'ajouter un membre à un groupe de répartition de charge. Elle peut se trouver dans un conteneur `<Proxy balancer://...>`, et accepte tous les paramètres de paires clé/valeur que supporte la directive [[13-directives/proxypass|ProxyPass]].

La directive `BalancerMember` accepte un paramètre supplémentaire : *loadfactor*. Il s'agit du facteur de charge du membre - un nombre décimal entre 1.0 (valeur par défaut) et 100.0, qui définit la charge à appliquer au membre en question.

L'argument *balancerurl* n'est requis que s'il ne se trouve pas dèjà dans la directive de conteneur `<Proxy balancer://...>`. Il correspond à l'URL d'un répartiteur de charge défini par une directive [[13-directives/proxypass|ProxyPass]].

La partie chemin de l'URL du répartiteur dans toute directive de conteneur `<Proxy balancer://...>` est ignorée.

En particulier, le slash de fin de l'URL d'un `BalancerMember` doit être supprimé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
