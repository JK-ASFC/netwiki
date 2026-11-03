---
title: "ProxyBadHeader"
description: "Directive Apache ProxyBadHeader (mod_proxy) — Détermine la manière de traiter les lignes d'en-tête incorrectes d'une réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine la manière de traiter les lignes d'en-tête incorrectes d'une réponse |
| **Syntaxe** | `ProxyBadHeader IsError\|Ignore\|StartBody` |
| **Valeur par défaut** | `ProxyBadHeader IsError` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

La directive `ProxyBadHeader` permet de déterminer le comportement de [[12-modules/mod_proxy|mod_proxy]] lorsqu'il reçoit des lignes d'en-tête de réponse dont la syntaxe n'est pas valide (c'est à dire ne contenant pas de caractère ':') en provenance du serveur original. Les arguments disponibles sont :

**`IsError`**

Annule la requête et renvoie une réponse de code 502 (mauvaise passerelle). C'est le comportement par défaut.

**`Ignore`**

Traite les lignes d'en-tête incorrectes comme si elles n'avaient pas été envoyées.

**`StartBody`**

A la réception de la première ligne d'en-tête incorrecte, les autres en-têtes sont lus et ce qui reste est traité en tant que corps. Ceci facilite la prise en compte des serveurs d'arrière-plan bogués qui oublient d'insérer une ligne vide entre les en-têtes et le corps.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
