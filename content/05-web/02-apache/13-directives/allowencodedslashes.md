---
title: "AllowEncodedSlashes"
description: "Directive Apache AllowEncodedSlashes (core) — Détermine si les séparateurs de chemin encodés sont autorisés à transiter dans les URLs tels quels. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si les séparateurs de chemin encodés sont autorisés à transiter dans les URLs tels quels |
| **Syntaxe** | `AllowEncodedSlashes On\|Off\|NoDecode` |
| **Valeur par défaut** | `AllowEncodedSlashes Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | L'option NoDecode est disponible depuis la version 2.3.12. |

## Utilisation

La directive `AllowEncodedSlashes` permet l'utilisation des URLs contenant des séparateurs de chemin encodés dans la partie chemin (`%2F` pour `/` et même `%5C` pour `\` sur les systèmes concernés).

Avec la valeur par défaut, `Off`, de telles URLs sont refusées et provoquent le renvoi d'une erreur 404 (Not found).

Avec la valeur `On`, ces URLs sont acceptées, et les slashes encodés sont décodés comme tout autre caractère codé.

Avec la valeur `NoDecode`, ces URLs sont acceptées, mais les slashes codés ne sont pas décodés et laissés dans leur état codé.

Définir `AllowEncodedSlashes` à `On` est surtout utile en association avec `PATH_INFO`.

> [!NOTE]
> **Note**
>
> Si le codage des slashes dans la partie chemin est nécessaire, l'utilisation de l'option `NoDecode` est fortement recommandée par mesure de sécurité. Permettre le décodage des slashes pourrait éventuellement induire l'autorisation de chemins non sûrs.

## Voir aussi

- [[13-directives/acceptpathinfo|AcceptPathInfo]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
