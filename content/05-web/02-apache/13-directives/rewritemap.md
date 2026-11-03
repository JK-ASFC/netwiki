---
title: "RewriteMap"
description: "Directive Apache RewriteMap (mod_rewrite) — Définit une fonction de mise en correspondance pour la recherche de mots-clés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une fonction de mise en correspondance pour la recherche de mots-clés |
| **Syntaxe** | `RewriteMap MapName MapType:MapSource [MapTypeOptions]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |
| **Compatibilité** | Le troisième paramètre, MapTypeOptions, est disponible à partir de la version 2.4.29 du serveur HTTP Apache |

## Utilisation

La directive `RewriteMap` définit une *Table de correspondance pour la réécriture* que les fonctions de mise en correspondance peuvent utiliser dans les chaînes de substitution des règles pour insérer/substituer des champs en recherchant des mots-clés. La source utilisée pour cette recherche peut être de plusieurs types.

*MapName* est le nom de la table de correspondance et servira à spécifier une fonction de mise en correspondance pour les chaînes de substitution d'une règle de réécriture selon une des constructions suivantes :

**`${` *MapName* `:` *mot-clé* `}`
`${` *MapName* `:` *mot-clé* `|` *valeur par défaut* `}`**

Lorsqu'une telle construction est rencontrée, la table de correspondance *MapName* est consultée et la clé *mot-clé* recherchée. Si la clé est trouvée, la construction est remplacée par la *valeur de remplacement*. Si la clé n'est pas trouvée, elle est remplacée par la *valeur par défaut*, ou par une chaîne vide si aucune *valeur par défaut* n'est spécifiée. La valeur vide se comporte comme si la clé était absente ; il est donc impossible de distinguer une valeur vide d'une absence de clé.

Par exemple, vous pouvez définir une directive `RewriteMap` comme suit

```apache
RewriteMap map-exemple "txt:/chemin/vers/fichier/map.txt"
```

Vous pourrez ensuite utiliser cette table dans une directive [[13-directives/rewriterule|RewriteRule]] comme suit :

```apache
RewriteRule "^/ex/(.*)" "${map-exemple:$1}"
```

La signification de l'argument *MapTypeOptions* dépend du *MapType* spécifié. Veuillez vous référer au document [[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Utiliser RewriteMap]] pour plus de détails.

Les combinaisons suivantes pour *type de correspondance* et *MapSource* peuvent être utilisées :

**txt**

Un fichier texte contenant des paires clé-valeur séparées par des espaces, une paire par ligne ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

**rnd**

Sélection aléatoire d'une entrée depuis un fichier texte ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

**dbm**

Recherche une entrée dans un fichier dbm contenant des paires nom-valeur. Le condensé hash est élaboré à partir d'un format de fichier texte via l'utilitaire `httxt2dbm` ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

**int**

Une des quatre fonctions internes disponibles que fournit `RewriteMap`: toupper, tolower, escape ou unescape ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

**prg**

Appelle un programme externe ou un script pour effectuer la réécriture ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

**dbd or fastdbd**

Une commande SQL SELECT à exécuter pour rechercher la cible de réécriture ([[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Détails ...]]).

Vous trouverez plus de détails et de nombreux exemples dans le [[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|RewriteMap HowTo]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
