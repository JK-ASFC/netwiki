---
title: "TraceEnable"
description: "Directive Apache TraceEnable (core) — Détermine le comportement des requêtes TRACE. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine le comportement des requêtes `TRACE` |
| **Syntaxe** | `TraceEnable [on\|off\|extended]` |
| **Valeur par défaut** | `TraceEnable on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive l'emporte sur le comportement de `TRACE` pour le noyau du serveur et [[12-modules/mod_proxy|mod_proxy]]. La définition par défaut `TraceEnable on` permet des requêtes `TRACE` selon la RFC 2616, qui interdit d'ajouter tout corps à la requête. La définition `TraceEnable off` indique au noyau du serveur et à [[12-modules/mod_proxy|mod_proxy]] de retourner un code d'erreur `405` (Méthode non autorisée) au client.

En fait, et à des fins de test et de diagnostic seulement, on peut autoriser l'ajout d'un corps de requête à l'aide de la définition non standard `TraceEnable extended`. Le noyau du serveur (dans le cas d'un serveur d'origine) va limiter la taille du corps de requête à 64Kb (plus 8Kb pour les en-têtes de fractionnement si `Transfer-Encoding: chunked` est utilisé). Le noyau du serveur va reproduire l'ensemble des en-têtes, y compris les en-têtes de fractionnement avec le corps de la réponse. Dans le cas d'un serveur mandataire, la taille du corps de requête n'est pas limitée à 64Kb.

Les directives [[13-directives/limit|<Limit>]] ou [[13-directives/limitexcept|<LimitExcept>]] ne permettent pas de restreindre la méthode `TRACE`. Pour ce faire, utilisez la directive `TraceEnable`.

> [!NOTE]
> **Note**
>
> Bien que certains prétendent le contraire, activer la méthode `TRACE` ne constitue pas un problème de sécurité dans Apache httpd. La méthode `TRACE` est définie par la spécification HTTP/1.1 et les différentes implémentations sont censées la supporter.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
