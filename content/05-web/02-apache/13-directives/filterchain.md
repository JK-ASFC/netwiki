---
title: "FilterChain"
description: "Directive Apache FilterChain (mod_filter) — Configure la chaîne de filtrage. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure la chaîne de filtrage |
| **Syntaxe** | `FilterChain [+=-@!]nom_filtre ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |

## Utilisation

Cette directive permet de configurer une chaîne de filtrage composée de filtres déclarés. `FilterChain` accepte un nombre illimité d'arguments, chacun d'entre eux étant précédé d'un caractère de contrôle unique qui détermine l'action à entreprendre :

**`+nom filtre`**

Ajoute*nom filtre* à la fin de la chaîne de filtrage

**`@nom filtre`**

Ajoute *nom filtre* au début de la chaîne de filtrage

**`-nom filtre`**

Supprime *nom filtre* de la chaîne de filtrage

**`=nom filtre`**

Supprime tous les filtres de la chaîne de filtrage existante et les remplace par *nom filtre*

**`!`**

Supprime tous les filtres de la chaîne de filtrage existante

**`nom filtre`**

Équivalent à `+nom filtre`

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
