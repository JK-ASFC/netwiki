---
title: "Introduction au module Apache mod_rewrite"
description: "Apache HTTP Server — Introduction au module Apache mod_rewrite. Ce document est un complément à la documentation de référence du module mod_rewrite. Il décrit les concepts de base dont la connaissance est nécessaire pour l'utilisation de mod_rewrite. D'autres documents entrent d'avantage dans les détail"
tags: [apache, guide]
icon: book-open
---

Ce document est un complément à la [[12-modules/mod_rewrite|documentation de référence]] du module [[12-modules/mod_rewrite|mod_rewrite]]. Il décrit les concepts de base dont la connaissance est nécessaire pour l'utilisation de [[12-modules/mod_rewrite|mod_rewrite]]. D'autres documents entrent d'avantage dans les détails, mais celui-ci devrait aider le débutant à se mouiller les pieds.

## Introduction

Le module Apache [[12-modules/mod_rewrite|mod_rewrite]] est un module puissant et sophistiqué qui permet la réécriture des URLs. Grâce à lui, vous pouvez effectuer quasiment tous les types de réécriture d'URLs dont vous avez besoin. Il est cependant assez complexe, et peut paraître intimidant au débutant. Certains ont aussi tendance à traiter les règles de réécriture comme des incantations magiques, et à les utiliser sans vraiment comprendre leur manière d'agir.

Ce document a pour ambition d'être suffisamment explicite pour permettre la compréhension, et non la copie en aveugle, de ce qui suit.

Gardez à l'esprit que de nombreuses tâches de manipulation d'URLs courantes n'ont pas besoin de la puissance et de la complexité de [[12-modules/mod_rewrite|mod_rewrite]]. Pour les tâches simples, voir [[12-modules/mod_alias|mod_alias]] et la documentation sur la [[11-guides/01-generalites/mise-en-correspondance-des-urls-avec-le-systeme-de-fichiers|Mise en correspondance des URLs avec le système de fichiers]].

Enfin, avant de procéder, assurez-vous d'avoir configuré le niveau de journalisation de [[12-modules/mod_rewrite|mod_rewrite]] à un des niveaux de trace via la directive [[13-directives/loglevel|LogLevel]]. Bien que ceci risque de vous submerger sous une énorme quantité d'informations, le débogage des problèmes avec la configuration de [[12-modules/mod_rewrite|mod_rewrite]] est à ce prix car vous verrez alors exactement comment chaque règle est traitée.

![Organigramme simplifié du fonctionnement de mod_rewrite : arrivée de la requête, vérification RewriteEngine On, traitement des règles dans l’ordre, test de correspondance du motif et des RewriteCond, application des substitutions si ces deux tests sont positifs, arrêt du traitement des règles si un drapeau L ou END est défini, sinon traitement de la règle suivante](_assets/rewrite_simplified_overview.png)
*Figure :* Présentation simplifiée de la manière dont [[12-modules/mod_rewrite|mod_rewrite]] traite une requête. Voir [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Détails techniques]] pour une description complète du traitement avec les phases, les drapeaux et le bouclage.

## Expressions rationnelles

[[12-modules/mod_rewrite|mod_rewrite]] utilise le vocabulaire des [Expressions rationnelles compatibles avec Perl](https://www.pcre.org/current/doc/html/pcre2syntax.html) à l’aide de la bibliothèque PCRE2. Ce document n'a pas pour prétention d'être une référence détaillée des expressions rationnelles. A cet effet, nous recommandons la [documentation de PCRE2](https://www.pcre.org/current/doc/html/pcre2syntax.html), la [page de manuel des expressions rationnelles de Perl](https://perldoc.perl.org/perlre.html), et l'ouvrage [Mastering Regular Expressions, par Jeffrey Friedl](https://www.oreilly.com/library/view/mastering-regular-expressions/0596528124/) (la troisième édition date de 2006, mais la syntaxe des expressions rationnelles n'a pas vraiment changé, et cet ouvrage reste la référence en la matière).

Dans ce document, nous avons pour but de vous fournir suffisamment de vocabulaire des expressions rationnelles pour vous mettre le pied à l'étrier, sans être dépassé, en espérant que les directives [[13-directives/rewriterule|RewriteRule]] vous apparaîtront comme des formules scientifiques, plutôt que comme des incantations magiques.

### Vocabulaire des expressions rationnelles

Vous trouverez dans ce qui suit le minimum à connaître pour être en mesure d'écrire des expressions rationnelles et des règles [[13-directives/rewriterule|RewriteRule]]. Ceci ne représente certainement pas un vocabulaire des expressions rationnelles complet, mais constitue un bon point de départ, et devrait vous aider à déchiffrer les expressions rationnelles simples, et à écrire vos propres expressions.

| Motif | Signification | Exemple |
| --- | --- | --- |
| `.` | Correspond à tout caractère unique | `c.t` correspondra à `cat`, `cot`, `cut`, etc. |
| `+` | Répète le caractère de correspondance précédent une ou plusieurs fois | `a+` correspond à `a`, `aa`, `aaa`, etc. |
| `*` | Répète le caractère de correspondance précédent zéro ou plusieurs fois | `a*` correspond à tout ce à quoi correspond `a+`, mais correspond aussi à la chaîne vide. |
| `?` | Rend la correspondance optionnelle. | `colou?r` correspondra à `color` et `colour`. |
| `\` | Échappe le caractère suivant | `\.` correspondra à `.` (point) et non pas à *tout caractère unique* comme expliqué ci-dessus |
| `^` | Appelé ancrage, correspond au début de la chaîne | `^a` correspond à une chaîne qui commence par `a` |
| `$` | L'autre ancrage, correspond à la fin de la chaîne. | `a$` correspond à une chaîne qui se termine par `a`. |
| `( )` | Regroupe plusieurs caractères en une seule entité, et conserve une correspondance à des fins d'utilisation dans une référence arrière. | `(ab)+` correspond à `ababab` - à savoir, le `+` s'applique au groupe. Pour plus de détails sur les références arrières, voir ci-dessous. |
| `[ ]` | Une classe de caractères - correspond à un des caractères de la classe | `c[uoa]t` correspond à `cut`, `cot` ou `cat`. |
| `[^ ]` | Négation de la classe de caractères - correspond à tout caractère ne faisant pas partie de la classe | `c[^/]t` correspond à `cat` ou `c=t` mais pas à `c/t` |

Le caractère `!` (Not) peut préfixer une expression rationnelle afin d'en exprimer la négation. Autrement dit, une chaîne ne correspondra que si elle ne correspond pas à l'expression située après le `!`.

Notez que lorsqu’on utilise `!` pour inverser un motif, les références arrières (par exemple `$1`, `$2`) ne sont pas disponibles, car le motif ne correspond plus.

La règle suivante, par exemple, redirige toute requête qui ne commence *pas* par `/admin`

```apache
RewriteRule "!^/admin" "/xyz.html" [R,L]
```

### Disponibilité des références arrières dans les expressions rationnelles

Vous devez vous souvenir d'une chose importante : chaque fois que vous utilisez des parenthèses dans un *Motif* ou dans un des *modèles de conditions*, des références arrières sont créées en interne et peuvent être rappelées via les chaînes `$N` et `%N` (voir ci-dessous). Ces références sont disponibles lors de la création de la chaîne de substitution d'une directive [[13-directives/rewriterule|RewriteRule]] ou de la chaîne de test d'une directive [[13-directives/rewritecond|RewriteCond]].

Les captures dans les modèles de directives [[13-directives/rewriterule|RewriteRule]] sont paradoxalement disponibles dans toutes les directives [[13-directives/rewritecond|RewriteCond]] qui précèdent, car les expressions des directives [[13-directives/rewriterule|RewriteRule]] sont évaluées avant les conditions individuelles.

La figure 1 montre à quels endroits les références arrières sont suceptibles d'être développées, et illustre le flux des comparaisons effectuées par les règles RewriteRule et RewriteCond. Dans les chapitres suivants, nous examinerons comment utiliser ces références arrières, donc ne vous affolez pas si elles vous paraissent un peu exotiques au premier abord.

![Diagramme montrant la manière dont les références arrières circulent entre les RewriteRule et les RewriteCond : $1-$9 capturent des groupes issus des motifs RewriteRule, %1-%9 capturent des groupes issus des motifs des chaînes à tester (ou TestStrings) de RewriteCond, les deux étant disponibles dans les chaînes de substitution et dans les chaînes à tester de RewriteCond subséquentes](_assets/rewrite_backreferences.png)
*Figure 1 :* Le cheminement d'une référence arrière à travers une règle.
Dans cet exemple, une requête pour `/test/1234` vers l’hôte `admin.example.com` serait transformée en `/admin.foo?page=test&id=1234&host=admin.example.com`, sous réserve que `%{DOCUMENT_ROOT}/test` ne soit pas un fichier existant.

Voir aussi [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Détails techniques]] pour un diagramme montrant le cheminement des références arrières avec des conditions multiples.

## Les bases des règles de réécriture

Une règle de réécriture [[13-directives/rewriterule|RewriteRule]] est constituée de trois arguments séparés par des espaces. Les arguments sont :

1. *Motif*: le motif des URLs auxquelles la règle doit s'appliquer;
2. *Substitution*: vers quoi la requête correspondante doit être transformée;
3. *\[drapeaux\]*: options affectant la requête réécrite.

Le *Motif* est une expression rationnelle. Dans un contexte de serveur virtuel ou de serveur global, il est comparé au chemin d’URL %-décodé de la requête entrante — la partie après le nom d’hôte et le port, en excluant la chaîne de paramètres (par exemple `/app/index.html`). Dans un contexte de répertoire, le motif est comparé au chemin de la requête relatif au répertoire pour lequel la règle est définie (avec le préfixe de répertoire supprimé — voir [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures par répertoire]] pour les détails).

Lorsqu’une substitution a été effectuée, toute règle qui suit est comparée à la valeur substituée.

Le *Motif* n’est comparé qu’au chemin d’URL — à l’exclusion des nom d’hôte, port ou chaîne de paramètres. Pour une comparaison incluant ces derniers, utilisez une condition [[13-directives/rewritecond|RewriteCond]] avec les variables `%{HTTP_HOST}`, `%{SERVER_PORT}` ou `%{QUERY_STRING}`, respectivement.

> [!NOTE]
> [[12-modules/mod_rewrite|mod_rewrite]] opère exclusivement sur le chemin d’URL et les en-têtes HTTP. Il ne peut pas inspecter le corps de la requête (par exemple, les données POST). Si vous devez prendre des décisions de routage en fonction du contenu du corps de la requête, traitez le problème à l’aide de la logique de votre application ou utilisez un module tel que [[12-modules/mod_request|mod_request]] associé à un filtre personnalisé.

![Diagramme annoté pour la syntaxe de la directive RewriteRule montrant trois composants : le motif (une expression rationnelle mise en correspondance avec le chemin d’URL, la substitution (l’URL ou le chemin de remplacement) et des drapeaux facultatifs entourés de crochets](_assets/syntax_rewriterule.png)
*Figure 2 :* Syntaxe de la directive RewriteRule.

La chaîne de *Substitution* peut, quant à elle, être de trois types :

**1. Un chemin complet du système de fichiers vers une ressource**

```apache
RewriteRule "^/games" "/usr/local/games/web/puzzles.html"
```

Ceci peut faire correspondre une requête à toute localisation voulue de votre système de fichiers, un peu comme la directive [[13-directives/alias|Alias]].

**2. Un chemin web vers une ressource**

```apache
RewriteRule "^/games$" "/puzzles.html"
```

Si la directive [[13-directives/documentroot|DocumentRoot]] a pour valeur `/usr/local/apache2/htdocs`, cette règle va faire correspondre les requêtes pour `http://example.com/games` au chemin `/usr/local/apache2/htdocs/puzzles.html`.

**3. Une URL absolue**

```apache
RewriteRule "^/product/view$" "http://site2.example.com/seeproduct.html" [R]
```

Ceci informe le client qu'il doit effectuer une nouvelle requête vers l'URL spécifiée.

> [!WARNING]
> Notez que **1** et **2** possèdent exactement la même syntaxe. Par contre, dans le cas de **1**, le niveau racine du chemin cible (par exemple `/usr/`) existe dans le système de fichiers, alors que ce n'est pas le cas avec **2** (par exemple, il n'y a pas de répertoire `/bar/` au niveau de la racine du système de fichiers).

La chaîne de *Substitution* peut aussi contenir des *références arrières* vers des parties du chemin d'URL entrant correspondant au *Motif*. Considérons ce qui suit :

```apache
RewriteRule "^/produits/(.*)/view$" "/var/web/produitsdb/$1"
```

La variable `$1` sera remplacée par tout texte correspondant à l'expression située entre les parenthèses dans le *Motif*. Par exemple, une requête pour `http://example.com/produits/r14df/vue` correspondra au chemin `/var/web/produitsdb/r14df`.

S'il y a plus d'une expression entre parenthèses, elle seront accessibles selon leur ordre d'apparition via les variables `$1`, `$2`, `$3`, etc...

## Drapeaux de réécriture

Le comportement d'une règle [[13-directives/rewriterule|RewriteRule]] peut être modifié par la présence d'un ou plusieurs drapeaux en fin de règle. Par exemple, les conditions de correspondance d'une règle peuvent être rendues insensibles à la casse par la présence du drapeau `[NC]` :

```apache
RewriteRule "^puppy.html" "petitchien.html" [NC]
```

Pour une liste des drapeaux disponibles, leurs significations, et des exemples, voir le document [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|Drapeaux de réécriture]].

## Conditions de réécriture

Il est possible d'utiliser une ou plusieurs directives [[13-directives/rewritecond|RewriteCond]] pour restreindre les types de requêtes auxquelles devra s'appliquer la règle [[13-directives/rewriterule|RewriteRule]] suivante. Le premier argument est une variable décrivant une caractéristique de la requête, le second argument est une expression rationnelle qui doit correspondre à la variable, et un troisième argument optionnel est une liste de drapeaux qui modifient la manière dont la correspondance est évaluée.

![Diagramme annoté pour la syntaxe de la directive RewriteCond montrant deux composants : la chaîne à tester ou TestString (une variable ou du texte à tester) et le motif de condition ou CondPattern (expression rationnelle ou comparaison à évaluer) avec des drapeaux facultatifs entourés de crochets](_assets/syntax_rewritecond.png)
*Figure 3 :* Syntaxe de la directive RewriteCond

Par exemple, pour renvoyer toutes les requêtes en provenance d'une certaine tranche d'adresses IP vers un autre serveur, vous pouvez utiliser :

```apache
RewriteCond "%{REMOTE_ADDR}" "^10\.2\."
RewriteRule "(.*)" "http://intranet.example.com$1"
```

Si vous spécifiez plus d'une directive [[13-directives/rewritecond|RewriteCond]], ces directives doivent toutes être satisfaites pour que la règle [[13-directives/rewriterule|RewriteRule]] suivante s'applique. Par exemple, pour interdire les requêtes qui contiennent le mot "hack" dans la chaîne de requête, sauf si elles contiennent aussi un cookie contenant le mot "go", vous pouvez utiliser :

```apache
RewriteCond "%{QUERY_STRING}" "hack"
RewriteCond "%{HTTP_COOKIE}" "!go"
RewriteRule "." "-" [F]
```

Notez que le point d'exclamation indique une correspondance négative ; ainsi, la règle n'est appliquée que si le cookie ne contient pas "go"

Les correspondances dans les expressions rationnelles contenues dans les directives [[13-directives/rewritecond|RewriteCond]] peuvent constituer des parties de la chaîne de *Substitution* de la règle [[13-directives/rewriterule|RewriteRule]] via les variables `%1`, `%2`, etc... Par exemple, ce qui suit va diriger la requête vers un répertoire différent en fonction du nom d'hôte utilisé pour accéder au site :

```apache
RewriteCond "%{HTTP_HOST}" "(.*)"
RewriteRule "^/(.*)" "/sites/%1/$1"
```

Si la requête concernait `http://example.com/foo/bar`, alors `%1` contiendrait `example.com` et `$1` contiendrait `foo/bar`.

## Tables de réécriture

La directive [[13-directives/rewritemap|RewriteMap]] permet en quelque sorte de faire appel à une fonction externe pour effectuer la réécriture à votre place. Tout ceci est décrit plus en détails dans la [[11-guides/05-reecriture-mod-rewrite/utilisation-de-rewritemap|Documentation supplémentaire sur RewriteMap]].

## Fichiers .htaccess

Il est possible d’utiliser des règles de réécriture dans un contexte de répertoire (fichiers [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|.htaccess]] et sections [[13-directives/directory|<Directory>]]), mais dans ce cas, les règles se comportent différemment — en particulier, le préfixe du répertoire est supprimé de l’URL avant la recherche de correspondance. Voir le document [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures dans un contexte de répertoire]] pour une explication détaillée. Notez que les sections [[13-directives/if|<If>]] et [[13-directives/location|<Location>]] adoptent aussi le comportement du contexte de répertoire — voir [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Quels contextes prennent en charge les règles de réécriture ?]].

## Considérations en matière de sécurité

[[12-modules/mod_rewrite|mod_rewrite]] est un outil de manipulation d’URL puissant, mais qui dit puissance dit risque d’erreurs liées à la sécurité. Cette section met en lumière les pièges en matière de sécurité courants à éviter lors de la rédaction de règles de réécritures.

### Redirections ouvertes

Si une règle [[13-directives/rewriterule|RewriteRule]] construit un URL de redirection en utilisant une entrée utilisateur non validée, un attaquant pourra fabriquer un lien qui redirige les visiteurs vers un site malveillant semblant provenir de votre domaine. Cette vulnérabilité est connue sous le nom de *redirection ouverte*.

Par exemple, cette règle est dangereuse :

```apache
# DANGEREUX - permet une redirection ouverte
RewriteRule "^/redirect" "%{QUERY_STRING}" [R,L]
```

Un attaquant pourrait en effet utiliser `https://yoursite.com/redirect?https://evil.com` pour rediriger les utilisateurs vers un site malveillant. Assurez vous de toujours valider ou contraindre les cibles de redirection. Si la destination doit être sur votre propre site, assurez vous que la substitution commence par `/` (un chemin relatif) plutôt que de permettre à l’utilisateur d’entrer un URL complet.

### Server-Side Request Forgery (SSRF)

Lorsqu’on utilise la drapeau [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[P) (proxy)]], [[12-modules/mod_rewrite|mod_rewrite]] fait que le serveur effectue une requête HTTP vers l’URL de substitution de la part du client. Si une partie de cet URL est dérivée de l’entrée du client — références arrières, chaînes de paramètres ou en-têtes — un attaquant pourrait faire que votre serveur effectue des requêtes vers des services internes arbitraires ou des hôtes externes.

Par exemple :

```apache
# DANGEREUX - l’utilisateur contrôle la cible du mandataire
RewriteCond "%{QUERY_STRING}" "target=(.+)"
RewriteRule "^/fetch" "http://%1" [P]
```

Un attaquant pourrait utiliser cette configuration pour tester des services réseau internes qui autrement ne seraient pas accessibles depuis l’Internet. Utilisez toujours un nom d’hôte fixe dans les cibles de mandataire et limitez les références arrières à la partie chemin seulement.

### Traversée de chemin

Des règles de réécriture qui associent directement des composants du chemin fournis par l’utilisateur au système de fichier ouvrent la voie à des attaques de traversée de chemin si l’entrée n’est pas correctement contrainte. Par exemple :

```apache
# DANGEREUX - permet une traversée de chemin
RewriteRule "^/files/(.+)" "/var/data/$1" [L]
```

Une requête pour `/files/../../etc/passwd` pourrait accéder à des fichiers en dehors du répertoire souhaité. Utilisez des motifs restreints dans votre règle [[13-directives/rewriterule|RewriteRule]] (par exemple `[a-zA-Z0-9_-]+` au lieu de `.+`), et utilisez les protections intégrées d’Apache httpd (restrictions [[13-directives/options|Options]] et [[13-directives/directory|<Directory>]]) pour une défense en profondeur.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
