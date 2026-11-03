---
title: "ProxyHTMLURLMap"
description: "Directive Apache ProxyHTMLURLMap (mod_proxy_html) — Définit une règle de réécriture des liens HTML. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une règle de réécriture des liens HTML |
| **Syntaxe** | `ProxyHTMLURLMap modèle-source modèle-cible [drapeaux] [cond]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Il s'agit de la directive la plus importante pour la réécriture des liens HTML. Lors de l'interprétation d'un document, chaque fois qu'un lien correspond à *modèle-source*, la partie du lien concernée sera réécrite en *modèle-cible*, en tenant compte des modifications induites par les drapeaux éventuellement spécifiés et par la directive [[13-directives/proxyhtmlextended|ProxyHTMLExtended]]. Ne seront considérés comme des liens HTML que les éléments spécifiés via la directive [[13-directives/proxyhtmllinks|ProxyHTMLLinks]].

Le troisième argument optionnel permet de définir un des drapeaux suivants (les drapeaux sont sensibles à la casse) :

**h**

Ignore les liens HTML (les traverse sans les modifier)

**e**

Ignore les évènements de scripting (les traverse sans les modifier)

**c**

Traverse les sections de type style ou script sans les modifier.

**L**

Last-match. Si cette règle s'applique, aucune autre règle ne sera prise en compte (notez qu'il s'agit du comportement automatique pour les liens HTML).

**l**

L'opposé de L. Passe outre le comportement par défaut du changement unique pour les liens HTML.

**R**

Utilise des expressions rationnelles pour les modèles. `modèle-source` est une expression rationnelle, et `modèle-cible` une chaîne de remplacement qui peut être basée elle aussi sur une expression rationnelle. La mémorisation dans les expressions rationnelles est supportée : vous pouvez utiliser des parenthèses () dans le `modèle-source`, et récupérer la correspondance de leur contenu via les variables $1 à $9 dans le `modèle-cible`.

Si le drapeau R n'est pas fourni, la directive utilisera des chaînes littérales pour les différents modèles de recherche/remplacement. La logique de recherche est *"commence par"* dans les liens HTML, et *"contient"* dans les évènements de scripting et les sections de type style ou script.

**x**

Utilise les expressions rationnelles étendues POSIX. Ne s'applique qu'avec R.

**i**

Recherche de correspondance sensible à la casse. Ne s'applique qu'avec R.

**n**

Désactive la mémorisation dans les expressions rationnelles (pour améliorer les performances). Ne s'applique qu'avec R.

**s**

Recherche de correspondance dans les expressions rationnelles basée sur la ligne. Ne s'applique qu'avec R.

**^**

Recherche de correspondance au début seulement. Ne concerne que les recherches de correspondance par rapport à des chaînes, et ne s'applique pas aux liens HTML.

**$**

Recherche de correspondance à la fin seulement. Ne concerne que les recherches de correspondance par rapport à des chaînes, et ne s'applique pas aux liens HTML.

**V**

Insère des variables d'environnement dans le `modèle-cible`. Un `modèle-cible` de la forme `${varname|default}` sera remplacé par la valeur de la variable d'environnement `varname`. Si cette dernière n'est pas définie, `modèle-cible` sera remplacé par `default`. La spécification de `|default` est facultative.

NOTE: l'insertion de variables d'environnement n'est possible que si la directive [[13-directives/proxyhtmlinterp|ProxyHTMLInterp]] a été définie à *On*.

**v**

Insère des variables d'environnement dans le `modèle-source`. La syntaxe du modèle est identique à la syntaxe précédente.

NOTE: l'insertion de variables d'environnement n'est possible que si la directive [[13-directives/proxyhtmlinterp|ProxyHTMLInterp]] a été définie à *On*.

Le quatrième argument optionnel **cond** définit une condition qui sera évaluée pour chaque requête, sous réserve que la directive [[13-directives/proxyhtmlinterp|ProxyHTMLInterp]] ait été définie à *On*. Si la condition est évaluée à FALSE, la règle ne sera pas appliquée à la requête. Si elle est évaluée à TRUE, ou si aucune condition n'est définie, la règle s'applique.

La **condition** est évaluée par l'[[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|interpréteur d'expression]]. La syntaxe simple des conditions dans mod\_proxy\_html 3.x pour HTTPD 2.0 et 2.2 est aussi supportée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
