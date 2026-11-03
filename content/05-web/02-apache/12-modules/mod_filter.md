---
title: "mod_filter"
description: "Module Apache mod_filter — Module de configuration de filtre intelligent sensible au contexte. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_filter]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de configuration de filtre intelligent sensible au contexte |
| **Statut** | Base |
| **Identificateur** | `filter_module` |
| **Fichier source** | `mod_filter.c` |
| **Compatibilité** | Versions 2.1 et supérieures |

## Sommaire

Ce module permet une configuration intelligente et dépendant du contexte des filtres de contenu en sortie. Par exemple, Apache peut être configuré pour faire traiter différents types de contenus par différents filtres, même lorsque le type de contenu n'est pas connu à l'avance (par exemple dans un serveur mandataire).

Le fonctionnement de [[12-modules/mod_filter|mod_filter]] consiste à introduire des branchements dans la chaîne de filtrage. Plutôt que d'insérer directement des filtres dans la chaîne, on insère un sélecteur de filtre qui va effectuer un branchement conditionnel vers un fournisseur de filtre. [[12-modules/mod_filter|mod_filter]] peut utiliser tout filtre de contenu comme fournisseur ; aucune modification des modules de filtrage existants n'est nécessaire (bien qu'il soit tout de même possible de les simplifier).

## Filtrage intelligent

Dans le modèle de filtrage traditionnel, les filtres sont insérés sans condition à l'aide de la directive [[13-directives/addoutputfilter|AddOutputFilter]] et des directives apparentées. Chaque filtre doit ensuite déterminer s'il doit s'exécuter ou non, et les administrateurs du serveur disposent de peu de souplesse pour faire en sorte que la chaîne soit traitée de manière dynamique.

[[12-modules/mod_filter|mod_filter]], à l'opposé, fournit aux administrateurs du serveur un grand degré de souplesse pour configurer la chaîne de filtrage. Concrètement, la décision d'insérer un filtre peut être prise en fonction d'une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] booléenne complexe. Ceci généralise le fonctionnement relativement souple de la directive `AddOutputFilterByType`.

## Déclarations de filtres, fournisseurs et chaînes

*Figure 1:* Le modèle de filtrage traditionnel

Dans le modèle traditionnel, les filtres en sortie constituent une simple chaîne s'étendant depuis le générateur de contenu (ou gestionnaire) jusqu'au client. Ce fonctionnement peut convenir s'il permet d'atteindre le but recherché, mais pose problème lorsque cette chaîne doit être configurée dynamiquement en fonction de la sortie du gestionnaire.

*Figure 2:* Le modèle de fonctionnement de [[12-modules/mod_filter|mod_filter]]

Le fonctionnement de [[12-modules/mod_filter|mod_filter]] consiste à introduire des branchements dans la chaîne de filtrage. Plutôt que d'insérer directement des filtres dans la chaîne, on insère un sélecteur de filtre qui va effectuer un branchement conditionnel vers un fournisseur de filtre. [[12-modules/mod_filter|mod_filter]] peut utiliser tout filtre de contenu comme fournisseur ; aucune modification des modules de filtrage existants n'est nécessaire (bien qu'il soit tout de même possible de les simplifier). Il peut y avoir plusieurs fournisseurs pour un seul filtre, mais un seul fournisseur sera choisi pour chaque requête.

Une chaîne de filtrage peut comporter autant d'instances du sélecteur de filtre que l'on souhaite, chacune d'entre elles pouvant disposer de plusieurs fournisseurs. Un sélecteur de filtre possédant un seul fournisseur dont le choix est inconditionnel constitue un cas particulier : cette situation est équivalente à l'insertion directe du filtre dans la chaîne.

## Configuration de la chaîne de filtrage

Trois étapes sont nécessaires pour configurer une chaîne de filtrage avec [[12-modules/mod_filter|mod_filter]]. Voir ci-dessous la description détaillée des directives.

**Déclaration des filtres**

La directive [[13-directives/filterdeclare|FilterDeclare]] permet de déclarer un filtre en lui assignant un nom et un type. Elle n'est obligatoire que si le filtre n'est pas du type par défaut AP\_FTYPE\_RESOURCE.

**Enregistrement des fournisseurs**

La directive [[13-directives/filterprovider|FilterProvider]] permet d'associer un fournisseur à un filtre. Le filtre a été éventuellement déclaré à l'aide de la directive [[13-directives/filterdeclare|FilterDeclare]] ; si ce n'est pas le cas, FilterProvider va le déclarer implicitement avec le type par défaut AP\_FTYPE\_RESOURCE. Le fournisseur doit avoir été enregistré à l'aide de `ap_register_output_filter` par un module quelconque. Le dernier argument de la directive [[13-directives/filterprovider|FilterProvider]] est une expression : le fournisseur s'exécutera pour une requête si et seulement si l'expression est évaluée vraie. L'expression peut évaluer une requête HTTP ou les en-têtes de la réponse, des variables d'environnement, ou le gestionnaire utilisé par cette requête. À la différence des version précédentes, mod\_filter supporte désormais les expressions complexes associant des critères multiples au moyen d'une logique AND / OR (&& / ||) et de parenthèses. Pour les détails sur la syntaxe de l'expression, voir la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation sur ap_expr]].

**Configuration de la chaîne de filtrage**

Les directives ci-dessus permettent d'élaborer les éléments d'une chaîne de filtrage intelligente, mais pas de les configurer en vue de leur exécution. La directive [[13-directives/filterchain|FilterChain]] élabore une chaîne de filtrage à partir de filtres intelligents déclarés, permettant avec souplesse d'insérer des filtres au début ou à la fin de la chaîne, de supprimer un filtre ou même la chaîne complète.

## Filtrage et statut de la réponse

Normalement, mod\_filter n'applique les filtres qu'aux réponses possédant un statut HTTP 200 (OK). Pour pouvoir filtrer des documents possédant un autre statut, vous devez définir la variable d'environnement *filter-errordocs*, les réponses étant alors filtrées sans se préoccuper de leur statut. Pour définir ce comportement de manière plus fine, vous pouvez utiliser des conditions dans la directive `FilterProvider`.

## Mise à jour depuis une configuration du serveur HTTP Apache 2.2

La directive [[13-directives/filterprovider|FilterProvider]] a été modifiée par rapport à httpd 2.2 : les arguments *match* et *dispatch* ont été remplacés par l'argument unique *expression* plus polyvalent. En général, il est possible de convertir une paire match/dispatch vers les deux côtés d'une expression, de la manière suivante :

```
"dispatch = 'match'"
```

Les en-têtes de requête et de réponse et les variables d'environnement sont maintenant interprétés selon les syntaxes respectives *%{req:foo}*, *%{resp:foo}* et *%{env:foo}*. Les variables *%{HANDLER}* et *%{CONTENT\_TYPE}* sont également supportées.

Notez que l'évaluation de l'expression ne supporte plus les comparaisons de sous-chaînes. Ces dernières peuvent être remplacées par des comparaisons d'expressions rationnelles.

## Exemples

**Inclusions côté serveur (SSI)**

Un exemple simple de remplacement de la directive [[13-directives/addoutputfilterbytype|AddOutputFilterByType]]

```apache
FilterDeclare SSI
FilterProvider SSI INCLUDES "%{CONTENT_TYPE} =~ m|^text/html|"
FilterChain SSI
```

**Inclusions côté serveur (SSI)**

Même exemple que ci-dessus, mais envoi vers un gestionnaire (comportement classique des SSI ; les fichiers .shtml sont traités).

```apache
FilterProvider SSI INCLUDES "%{HANDLER} = 'server-parsed'"
FilterChain SSI
```

**Émulation de mod\_gzip avec mod\_deflate**

Insertion du filtre INFLATE seulement si l'en-tête Accept-Encoding a une valeur autre que "gzip". Ce filtre s'exécute avec le type ftype CONTENT\_SET.

```apache
FilterDeclare gzip CONTENT_SET
FilterProvider gzip inflate "%{req:Accept-Encoding} !~ /gzip/"
FilterChain gzip
```

**Diminution de la résolution d'une image**

Supposons que nous voulions réduire la résolution de toutes les images web, et que nous disposions de filtres pour les images GIF, JPEG et PNG.

```apache
FilterProvider unpack jpeg_unpack "%{CONTENT_TYPE} = 'image/jpeg'"
FilterProvider unpack gif_unpack  "%{CONTENT_TYPE} = 'image/gif'"
FilterProvider unpack png_unpack  "%{CONTENT_TYPE} = 'image/png'"

FilterProvider downsample downsample_filter "%{CONTENT_TYPE} = m|^image/(jpeg|gif|png)|"
FilterProtocol downsample "change=yes"

FilterProvider repack jpeg_pack "%{CONTENT_TYPE} = 'image/jpeg'"
FilterProvider repack gif_pack  "%{CONTENT_TYPE} = 'image/gif'"
FilterProvider repack png_pack  "%{CONTENT_TYPE} = 'image/png'"
<Location "/image-filter">
    FilterChain unpack downsample repack
</Location>
```

## Gestion de protocole

Historiquement, tout filtre doit s'assurer que toute modification qu'il effectue est correctement représentée dans les en-têtes de la réponse HTTP, et qu'il ne s'exécutera pas si cette exécution résultait en une modification interdite. Ceci impose aux auteurs de filtres la corvée de réimplémenter certaines fonctionnalités communes dans chaque filtre :

- De nombreux filtres modifient les contenus, et de ce fait invalident les balises de ces contenus, leur somme de contrôle, leur condensé (hash) existant, ainsi que leur taille.
- Les filtres qui nécessitent une réponse entière et non tronquée en entrée, doivent s'assurer qu'il n'ont pas reçu une réponse à une requête partielle.
- Les filtres qui modifient la sortie d'un autre filtre doivent s'assurer qu'ils ne violent pas la directive d'un en-tête `Cache-Control: no-transform` éventuel.
- Les filtres peuvent agir sur des réponses de façon à ce qu'elles ne puissent plus être mises en cache.

[[12-modules/mod_filter|mod_filter]] a pour but de gérer de manière générale ces détails de l'implémentation des filtres, réduisant par là-même la complexité des modules de filtrage de contenu. Le travail permettant d'atteindre ce but est cependant toujours en cours ; la directive [[13-directives/filterprotocol|FilterProtocol]] implémente certaines de ces fonctionnalités à des fins de compatibilité ascendante avec les modules d'Apache 2.0. Pour les versions 2.1 et supérieures de httpd, les API `ap_register_output_filter_protocol` et `ap_filter_protocol` permettent aux modules de filtrage de définir leurs propres comportements.

Cependant, [[12-modules/mod_filter|mod_filter]] ne doit pas interférer avec un filtre qui gère déjà tous les aspects du protocole. Par défaut (c'est à dire en l'absence de toute directive [[13-directives/filterprotocol|FilterProtocol]]), [[12-modules/mod_filter|mod_filter]] ne modifiera donc pas les en-têtes.

Au moment où ces lignes sont écrites, cette fonctionnalité a été très peu testée, car les modules d'usage courant ont été conçus pour fonctionner avec httpd 2.0. Les modules qui l'utilisent devront donc l'expérimenter avec précautions.

## Directives

- [[13-directives/addoutputfilterbytype|AddOutputFilterByType]]
- [[13-directives/filterdeclare|FilterDeclare]]
- [[13-directives/filterprovider|FilterProvider]]
- [[13-directives/filterchain|FilterChain]]
- [[13-directives/filterprotocol|FilterProtocol]]
- [[13-directives/filtertrace|FilterTrace]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
