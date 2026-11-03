---
title: "UnDefine"
description: "Directive Apache UnDefine (core) — Invalide la définition d'une variable. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Invalide la définition d'une variable |
| **Syntaxe** | `UnDefine nom-variable` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Annule l'effet d'une directive [[13-directives/define|Define]] ou d'un argument `-D` de [[10-commandes/httpd|httpd]] en invalidant l'existence de la variable correspondante.

On peut utiliser cette directive pour inverser l'effet d'une section [[13-directives/ifdefine|<IfDefine>]] sans avoir à modifier les arguments `-D` dans les scripts de démarrage.

Afin d'éviter tout risque de collision avec la syntaxe de la directive [[13-directives/rewritemap|RewriteMap]], les noms de variables ne doivent pas contenir de caractère ":".

> [!NOTE]
> **Piège de la portée de cette directive**
>
> Si cette directive est définie au sein d'un bloc VirtualHost, les changements qu'elle induit sont visibles de toute directive ultérieure, au delà de tout bloc VirtualHost.

## Voir aussi

- [[13-directives/define|Define]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
