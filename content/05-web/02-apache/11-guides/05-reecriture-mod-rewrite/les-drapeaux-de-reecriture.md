---
title: "Les drapeaux de réécriture"
description: "Apache HTTP Server — Les drapeaux de réécriture. Ce document décrit les drapeaux disponibles dans la directive RewriteRule, en fournissant des explications détaillées et des exemples."
tags: [apache, guide]
icon: book-open
---

Ce document décrit les drapeaux disponibles dans la directive [[13-directives/rewriterule|RewriteRule]], en fournissant des explications détaillées et des exemples.

## Introduction

Le comportement d'une directive [[13-directives/rewriterule|RewriteRule]] peut être modifié par un ou plusieurs drapeaux. Les drapeaux sont situés en fin de règle, entourés de crochets, et séparés le cas échéant par des virgules.

```apache
RewriteRule pattern target [Flag1,Flag2,Flag3]
```

Chaque drapeau (à quelques exceptions près) possède une forme courte, comme `CO`, ainsi qu'une forme longue, comme `cookie`. Bien que la forme courte soit la plus couramment utilisée, nous vous recommandons de vous familiariser avec les drapeaux sous leur forme longue, afin de bien mémoriser ce que chaque drapeau est supposé faire. Certains drapeaux acceptent un ou plusieurs arguments. Les drapeaux ne sont pas sensibles à la casse.

Les drapeaux qui modifient les métadonnées associées à la requête (T=, H=, E=) n'ont aucun effet dans un contexte de répertoire ou de fichier htaccess, lorsqu'une substitution (autre que '-') est effectuée au cours de la même passe du processus de réécriture.

Chaque drapeau disponible est présenté ici, avec un exemple d'utilisation.

## Référence rapide des drapeaux

Les drapeaux peuvent être combinés : `[R=301,L]`, `[P,QSA]`, `[E=VAR:val,L]`. Cette table les groupe par fonction et les trie selon la fréquence de leur utilisation.

| Drapeau | Fonction | Effet | Combinaisons courantes |
| --- | --- | --- | --- |
| ***Contrôle de flux*** |   |   |   |
| \[L\] | Dernière règle | Arrête le traitement des règles (pour cette passe) | \[R=301,L\] \[F\] \[G\] |
| \[END\] | Arrêt complet | Arrête tout le processus de réécriture (pas de réentrance dans .htaccess) | \[R=301,END\] |
| \[S=N\] | Saut | Sauter les N prochaines règles (logique if/else) |   |
| \[N\] | Instance suivante de la boucle | Redémarrer le traitement du jeu de règles à partir de la première (attention : risque de boucle infinie) |   |
| \[C\] | Chaînage | Chaîner la règle actuelle à la prochaine ; si la règle actuelle échoue, sauter les règles chaînées |   |
| ***Redirection et mandatement*** |   |   |   |
| \[R=code\] | Redirection | Redirection externe (par défaut 302). Utilisez Redirect/RedirectMatch pour les cas simple | \[R=301,L\] \[R=302,L\] |
| \[P\] | Mandatement | Mandatement inverse vers une cible (nécessite [[12-modules/mod_proxy\|mod_proxy]]) | \[P,QSA\] |
| ***Contrôle d’accès*** |   |   |   |
| \[F\] | Interdiction | Renvoie 403 (implique \[L\]) |   |
| \[G\] | Parti | Renvoie 410 (implique \[L\]) |   |
| ***URL / chaîne de paramètres*** |   |   |   |
| \[QSA\] | Ajout de la chaîne de paramètres | Ajout de la chaîne de paramètres originelle à la substitution | \[QSA,L\] \[P,QSA\] |
| \[QSD\] | Suppression de la chaîne de paramètres | Supprime entièrement la chaîne de paramètres | \[R=301,QSD,L\] |
| \[B\] | Échappement des références arrières | Réencode les caractères spéciaux dans les références arrières | \[B,PT\] |
| \[NE\] | Pas d’échappement | Pas d’échappement des caractères spéciaux dans la sortie (pass #, ? through) | \[R=301,NE,L\] |
| ***Metadonnées et gestionnaires*** |   |   |   |
| \[E\] | Définition d’une variable d’environnement | Définit une variable d’environnement | \[E=VAR:val,L\] |
| \[T\] | Type MIME | Forçage du type de contenu |   |
| \[H\] | Gestionnaire | Forçage d’un gestionnaire de contenu |   |
| \[PT\] | Transmission résultat | Transmission du résultat au gestionnaire suivant (requis pour Alias/ScriptAlias) | \[PT,L\] |
| ***Cookie*** |   |   |   |
| \[CO\] | Définir un cookie | Définir un cookie HTTP pour la réponse | \[CO=name:val:.domain,R=302,L\] |

## B (échappement dans les références arrières)

Avec le drapeau \[B\], la directive [[13-directives/rewriterule|RewriteRule]] échappe les caractères non-alphanumériques avant d'appliquer la transformation.

[[12-modules/mod_rewrite|mod_rewrite]] doit supprimer les séquences d'échappement des URLs avant leur mise en correspondance avec le système de fichiers ; les séquences d'échappement sont donc supprimées des références arrières au moment où ces dernières sont appliquées. Avec le drapeau B, les caractères non-alphanumériques des références arrières seront échappés. Considérons par exemple cette règle :

Pour un échappement similaire des variables du serveur, voir la fonction de mappage "escape".

```apache
RewriteRule "^search/(.*)$" "/search.php?term=$1"
```

Soit le terme de recherche 'x & y/z' ; un navigateur va le coder en 'x%20%26%20y%2Fz', transformant la requête en 'search/x%20%26%20y%2Fz'. Sans le drapeau B, cette règle de réécriture va réécrire la requête en 'search.php?term=x & y/z', ce qui ne correspond pas à une URL valide et cette dernière sera encodée en `search.php?term=x%20&y%2Fz=`, ce qui ne correspond pas à ce que l'on souhaitait.

Avec le drapeau B, les paramètres sont réencodés avant d'être passés à l'URL résultante, ce qui fournit une réécriture correcte en `/search.php?term=x%20%26%20y%2Fz`.

```apache
RewriteRule "^search/(.*)$" "/search.php?term=$1" [B,PT]
```

Notez que vous devrez peut-être aussi définir la directive [[13-directives/allowencodedslashes|AllowEncodedSlashes]] à `On` pour que cet exemple particulier fonctionne, car httpd ne permet pas les slashes encodés dans les URLs, et renvoie une erreur 404 s'il en rencontre un.

Ce processus d'échappement est en particulier nécessaire dans le contexte d'un mandataire, où l'accès au serveur d'arrière-plan échouera si on présente à ce dernier une URL non échappée.

Une alternative à ce drapeau consiste à utiliser une directive [[13-directives/rewritecond|RewriteCond]] pour capturer %{THE\_REQUEST}, les chaînes capturées se présentant alors sous la forme codée.

A partir de la version 2.4.26, vous pouvez limiter l'échappement dans les références arrières à une liste de caractères que vous pouvez spécifiez comme dans cet exemple : `[B=#?;]`. Notez que l'espace peut faire partie de la liste des caractères à échapper, mais que vous devez mettre entre guillemets le troisième argument de la directive [[13-directives/rewriterule|RewriteRule]] et que l'espace ne doit pas être le dernier caractère de cette liste.

```apache
# Échappement des espaces et des points d'interrogation. Les guillemets autour
# du dernier argument sont obligatoires lorsque l'espace est inclus.
RewriteRule "^search/(.*)$" "/search.php?term=$1" "[B= ?]"
```

Pour définir la liste des caractères à échapper de cette manière, voir #flag\_bne et #flag\_bctls

Voir [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Encodage et décodage des URLs]] pour une explication détaillée de la manière dont httpd décode les URIs avant la mise en correspondance des motifs.

## BNP|backrefnoplus (ne pas échapper l'espace en +)

Si le drapeau \[BNP\] est spécifié, la directive [[13-directives/rewriterule|RewriteRule]] échappera le caractère espace en %20 au lieu de '+' dans les références arrières. Ceci s'avère utile lorsque la référence arrière est utilisée dans la partie chemin, et non dans les paramètres de la requête.

```apache
# Échappe le caractère espace en %20 dans le chemin au lieu de + comme dans la
# soumission de formulaire à l'aide de la chaîne de paramètres
RewriteRule "^search/(.*)$" "/search.php/$1" "[B,BNP]"
```

Ce drapeau est disponible à partir de la version 2.4.26 du serveur HTTP Apache.

Voir [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Encodage et décodage des URLs]] pour découvrir la manière dont l’encodage est géré dans le tube (pipeline) de réécriture.

## BCTLS

Le drapeau \[BCTLS\] est similaire à \[B\], à la différence que seuls les espaces et les caractères de contrôle sont échappés. Il s'agit du même jeu de caractères rejetés lorsqu'ils sont copiés dans la chaîne de paramètres non codée.

```apache
# Échappe les espaces et les caractères de contrôle
RewriteRule "^search/(.*)$" "/search.php/$1" "[BCTLS]"
```

Ce drapeau est disponible à partir de la version 2.4.57 du serveur HTTP Apache.

## BNE

Les caractères listés dans \[BNE=...\] sont exclus des listes de caractères correspondant aux drapeaux \[B\] ou \[BCTLS\]. Ils ne seront donc pas échappés.

```apache
# Échappe les caractères par défaut, sauf /
RewriteRule "^search/(.*)$" "/search.php?term=$1" "[B,BNE=/]"
```

Ce drapeau est disponible à partir de la version 2.4.57 du serveur HTTP Apache.

## C|chain

Le drapeau \[C\] ou \[chain\] indique que la règle [[13-directives/rewriterule|RewriteRule]] est chaînée avec la suivante. Autrement dit, si la règle s'applique, elle est traitée normalement et passe le contrôle à la règle suivante. Par contre, si elle ne s'applique pas, la règle suivante, ainsi que toutes les règles chaînées qui suivent, seront sautées.

```apache
# Réécrire les URLs des anciens produits vers la nouvelle application du
# catalogue, et ajouter un paramètre de traçage — mais seulement pour ceux qui
# sont réécrits.
RewriteRule "^/products/([0-9]+)$" "/catalog/item/$1" [C]
RewriteRule "^/catalog/(.*)$" "/catalog/$1?via=legacy" [QSA]
```

Sans le drapeau \[C\], la seconde règle s’appliquerait aux requêtes qui arrivent directement à `/catalog/`. Le chaînage des deux règles permet de s’assurer que la seconde règle ne s’appliquera que si la première s’applique.

## CO|cookie

Le drapeau \[CO\], ou \[cookie\], vous permet de définir un cookie lorsqu'une règle [[13-directives/rewriterule|RewriteRule]] s'applique. Il possède trois arguments obligatoires et cinq arguments optionnels.

La syntaxe complète de ce drapeau, avec tous ses attributs, est la suivante :

```
[CO=NAME:VALUE:DOMAIN:lifetime:path:secure:httponly:samesite]
```

Si un caractère littéral ':' doit être insérer dans un des champs du cookie, une autre syntaxe est disponible. Pour utiliser cette syntaxe alternative, le contenu du champ "Name" doit être précédé du caractère ';', et les sépateurs de champs deviendront des ';'.

```
[CO=;NAME;VALUE:MOREVALUE;DOMAIN;lifetime;path;secure;httponly;samesite]
```

Vous devez déclarer un nom, une valeur et un domaine pour que le cookie puisse être défini.

**Domain**

Le domaine pour lequel vous souhaitez que le cookie soit valide. Ce peut être un nom de serveur, comme `www.example.com`, ou un domaine, comme `.example.com`. Il doit comporter au moins deux parties séparées par un point. C'est à dire que vous ne pouvez pas utiliser les valeurs `.com` ou `.net`. En effet, ce style de cookie est interdit par le modèle de sécurité des cookies.

Vous pouvez aussi définir les valeurs suivantes :

**Lifetime**

La durée de vie du cookie, en minutes.

Une valeur de 0 indique une durée de vie correspondant à lasession courante du navigateur. Il s'agit de la valeur par défaut.

Une valeur négative indique que la définition du cookie doit être annulée dans le navigateur.

**Path**

Le chemin, sur le site web concerné, pour lequel le cookie est valide, du style `/clients/` or `/fichiers/telechargement/`.

La valeur par défaut est `/` - c'est à dire l'ensemble du site web.

**Secure**

Si cet argument a pour valeur `secure`, `true`, ou `1`, le cookie ne pourra être transmis que dans le cadre d'une connexion sécurisée (https).

**httponly**

Si cet argument a pour valeur `HttpOnly`, `true`, ou `1`, le cookie aura son drapeau `HttpOnly` activé, ce qui signifie qu'il sera inaccessible au code JavaScript pour les navigateurs qui supportent cette fonctionnalité.

**samesite**

S'il est différent de `false` ou `0`, l'attribut `SameSite` est défini à la valeur spécifiée. Les valeurs typiques sont `None`, `Lax` et `Strict`. Disponible à partir de la version 2.4.47 du serveur HTTP Apache.

Voici un exemple :

```apache
RewriteEngine On
RewriteRule "^/index\.html" "-" [CO=frontdoor:yes:.example.org:1440:/]
```

Dans l'exemple ci-dessus, la règle ne réécrit pas la requête. La cible de réécriture "-" indique à [[12-modules/mod_rewrite|mod_rewrite]] de transmettre la requête sans modification. Par contre, il définit un cookie nommé 'frontdoor' avec une valeur 'yes'. Le cookie est valide pour tout hôte situé dans le domaine `.example.org`. Sa durée de vie est limitée à 1440 minutes (24 heures), et il sera renvoyé pour tous les URIs.

## DPI|discardpath

Avec le drapeau DPI, la partie PATH\_INFO qui a été ajoutée au chemin d’URL réécrit est supprimée.

Dans un contexte de répertoire, le chemin d’URL que compare chaque `RewriteRule` est la concaténation des valeurs courantes du chemin d’URL et de PATH\_INFO.

Le chemin d’URL actuel peut être le chemin initial tel qu'il a été fourni par le client, le résultat d'une passe précédente du processus de réécriture, ou le résultat de la règle précédente de la passe actuelle du processus de réécriture.

Par contre, la partie PATH\_INFO ajoutée au chemin d’URL avant chaque règle ne reflète que la valeur de PATH\_INFO avant la passe actuelle du processus de réécriture. En conséquence, si de larges portions du chemin d’URL correspondent et sont copiées dans une substitution via plusieurs directives `RewriteRule`, sans prendre en compte quelles parties du chemin d’URL provenaient du PATH\_INFO actuel, le chemin d’URL final pourra se voir ajouter plusieurs copies de PATH\_INFO.

Utilisez ce drapeau pour toute substitution où la présence du PATH\_INFO qui résultait de la mise en correspondance précédente de cette requête avec le système de fichier n'est pas nécessaire. Avec ce drapeau, le PATH\_INFO établi avant que cette passe du processus de réécriture ne débute est oublié. PATH\_INFO ne sera pas recalculé tant que la passe courante du processus de réécriture ne sera pas achevée. Les règles suivantes de cette passe ne verront que le résultat direct des substitutions, sans aucun PATH\_INFO ajouté.

```apache
# Requête : /app/script.php/extra/path (PATH_INFO contient /extra/path)
# Sans le drapeau DPI, la substitution serait "script.php/extra/path" et
# pourrait par accident copier PATH_INFO dans le résultat.
RewriteRule "^script\.php(.*)$" "/new-app/handler$1" [DPI]
```

Le drapeau DPI supprime `/extra/path`, de sorte que seul le résultat de la substitution est transmis aux règles suivantes ou à la requête finale.

## E|env

Avec le drapeau \[E\], ou \[env\], vous pouvez définir la valeur d'une variable d'environnement. Notez que certaines variables d'environnement peuvent être définies après le traitement de la règle, annulant par la-même ce que vous avez défini. Voir le [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|document sur les variables d'environnement]] pour plus de détails sur le fonctionnement des variables d'environnement.

La syntaxe complète pour ce drapeau est :

```apache
[E=!VAR]
```

`VAL` peut comporter des références arrières (`$N` ou `%N`) qui seront développées.

En utilisant la version courte

```
[E=VAR]
```

vous pouvez définir la variable d'environnement nommée `VAR` avec une valeur vide.

La forme

```
[E=!VAR]
```

permet d'annuler la définition de la variable `VAR`.

Les variables d'environnement s'emploient dans différents contextes, comme les programmes CGI, d'autres directives RewriteRule, ou des directives CustomLog.

L'exemple suivant définit une variable d'environnement nommée 'image' avec une valeur de '1' si le chemin d’URL de la requête correspond à un fichier image. Cette variable d'environnement est ensuite utilisée pour exclure une telle requête du journal des accès.

```apache
RewriteRule "\.(png|gif|jpg)" "-" [E=image:1]
CustomLog "logs/access_log" combined env=!image
```

Notez que le même effet peut être obtenu à l'aide de la directive [[13-directives/setenvif|SetEnvIf]]. Cette technique est présentée à titre d'exemple et non de recommandation.

**Définir des variables d’environnement pour tracer les réécritures**

Parfois, nous souhaitons être au courant de l’état de la situation lorsque nous effectuons une réécriture. Par exemple, vous voudriez prendre note que vous avez effectué cette réécriture, de sorte que vous pourriez ultérieurement voir si une requête est arrivée par l’intermédaire de cette réécriture. Une solution pour y parvenir est la définition d’une variable d’environnement.

```apache
RewriteEngine on
RewriteRule   "^/horse/(.*)"   "/pony/$1" [E=rewritten:1]
```

Dans la suite de votre jeu de règles, vous pouvez consulter cette variable d’environnement en utilisant une RewriteCond :

```apache
RewriteCond "%{ENV:rewritten}"  =1
```

Notez que les variables d’environnements ne survivent pas à une redirection externe. Vous devez alors utiliser le drapeau \[CO\] pour définir un cookie.

> [!NOTE]
> **Préfixe REDIRECT\_ après une redirection interne**
>
> Dans un contexte de répertoire, une substitution réussie déclenche une redirection interne. Lorsque cela se produit, toutes les variables d’environnement définies au cours de la passe précédente — y compris celles créées avec `[E=VAR:VAL]` — sont renommées par l’ajout du préfixe `REDIRECT_`. Une variable que vous avez nommée `rewritten` devient ainsi `REDIRECT_rewritten` dans la requête redirigée.
>
> Pour tester la variable renommée, référencez-la avec le préfixe :

```apache
RewriteRule   "^/horses/(.*)" "/ponies/$1" [E=rewritten:1]

# À la passe suivante, la variable a été renommée :
RewriteCond "%{ENV:REDIRECT_rewritten}" =1
RewriteRule "^/ponies/(.*)" "-" [E=seen_redirect:1,L]
```

Si la requête est redirigée plusieurs fois, le préfixe est empilé : `REDIRECT_REDIRECT_rewritten`, et ainsi de suite. Voir [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Variables REDIRECT_]] pour la description complète de ce mécanisme.

## END

L'utilisation du drapeau \[END\] permet non seulement de terminer le processus de réécriture en cours (comme \[L\]), mais aussi d'empêcher tout processus de réécriture ultérieur dans un contexte de répertoire, ce qui en fait le drapeau préféré pour la plupart des règles de niveau répertoire.

Dans un contexte de serveur virtuel ou global, \[END\] et \[L\] se comportent de manière identique. La différence entre les deux se situe dans un contexte de répertoire où \[L\] interrompt la passe actuelle, mais où le jeu de règles est à nouveau appliqué à l’URL réécrit. Cela peut provoquer des boucles infinies. \[END\] empêche tout processus de réécriture ultérieur en interrompant le cycle.

```apache
# Dans .htaccess : routage de toutes les requêtes vers un contrôleur frontal
# ici, [L] proquerait une boucle infine, pas [END]
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "^(.*)$" "/index.php" [END]
```

Ceci ne s'applique pas aux nouvelles requêtes résultant d'une redirection externe.

Voir la discussion [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures dans un contexte de répertoire]] pour une explication détaillée de la raison pour laquelle \[L\] se comporte différemment dans un contexte de répertoire, et des cas où \[END\] constitue le bon choix.

## F|forbidden

L'utilisation du drapeau \[F\] permet de faire envoyer par le serveur au client un code de statut "403 Forbidden". Le même effet peut être obtenu à l'aide de la directive [[13-directives/deny|Deny]], mais ce drapeau offre plus de souplesse dans l'attribution d'un statut Forbidden.

La règle suivante va interdire la téléchargement de fichiers `.exe` depuis votre serveur.

```apache
RewriteRule "\.exe" "-" [F]
```

Cet exemple utilise la syntaxe "-" pour la cible de réécriture, ce qui signifie que le chemin d’URL de la requête n'est pas modifié. Il n'y a aucune raison de réécrire un chemin d’URL, si vous avez l'intention d'interdire la requête.

Lorsqu'on utilise \[F\], \[L\] est implicite - c'est à dire que la réponse est renvoyée immédiatement, et aucune autre règle n'est évaluée.

## G|gone

Le drapeau \[G\] permet de faire envoyer par le serveur un code de statut "410 Gone" avec la réponse. Ce code indique qu'une ressource qui était disponible auparavant ne l'est plus actuellement.

Comme dans le cas du drapeau \[F\], on utilise en général la syntaxe "-" pour la cible de réécriture lorsqu'on utilise le drapeau \[G\] :

```apache
RewriteRule "oldproduct" "-" [G,NC]
```

Lorsqu'on utilise \[G\], \[L\] est implicite - c'est à dire que la réponse est renvoyée immédiatement, et aucune autre règle n'est évaluée.

## H|handler

Force le traitement de la requête résultante par le gestionnaire spécifié. Par exemple, on peut utiliser ce drapeau pour forcer l'interprétation de tous les fichiers sans extension par le gestionnaire php :

```apache
RewriteRule "!\." "-" [H=application/x-httpd-php]
```

L'expression rationnelle ci-dessus - `!\.` - correspond à toute requête qui ne contient pas le caractère `.`.

On peut aussi utiliser ce drapeau pour forcer l'utilisation d'un certain gestionnaire en fonction de certaines conditions. Par exemple, l'extrait suivant utilisé dans un contexte de niveau serveur permet de faire en sorte que les fichiers `.php` soient *affichés* par `mod_php` dans le cas où ils font l'objet d'une requête avec l'extension `.phps` :

```apache
RewriteRule "^(/source/.+\.php)s$" "$1" [H=application/x-httpd-php-source]
```

L'expression rationnelle ci-dessus - `^(/source/.+\.php)s$` - va correspondre à toute requête qui débutera par `/source/`, continuera par 1 ou n caractères puis par `.phps`. La référence arrière $1 fait référence à la correspondance capturée entre parenthèses de l'expression rationnelle.

## L|last

Lorsque le drapeau \[L\] est présent, [[12-modules/mod_rewrite|mod_rewrite]] arrête le traitement du jeu de règles. Cela signifie dans la plupart des situations que si la règle s'applique, aucune autre règle ne sera traitée. Ce drapeau correspond à la commande Perl `last`, ou à la commande `break` en C. Utilisez ce drapeau pour indiquer que la règle courante doit être appliquée immédiatement, sans tenir compte des règles ultérieures.

Dans un contexte de répertoire, \[L\] arrête la passe actuelle du jeu de règles, mais la requête réécrite peut être traitée à nouveau depuis le début du jeu de règles — ce qui peut provoquer des boucles infinies. Pour éviter ce problème, utilisez le drapeau \[END\], ou consultez le document [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures au niveau répertoire]] pour une description détaillée du problème et des solutions alternatives.

Dans l'exemple donné ici, toute requête est réécrite en `index.php`, la requête originale étant ajoutée comme chaîne de requête en argument à `index.php` ; cependant, la directive [[13-directives/rewritecond|RewriteCond]] permet de s'assurer que si la requête concerne déjà `index.php`, la directive [[13-directives/rewriterule|RewriteRule]] sera sautée.

```apache
RewriteBase "/"
RewriteCond "%{REQUEST_URI}" !=/index.php
RewriteRule "^(.*)" "/index.php?req=$1" [L,PT]
```

## N|next

Le drapeau \[N\] provoque un redémarrage du traitement des règles depuis le début, en utilisant le résultat du jeu de règles, sous réserve qu'il existe un point de démarrage ; à utiliser avec précautions car il peut provoquer un bouclage infini.

Le drapeau \[Next\] peut servir, par exemple, à remplacer de manière répétitive une chaîne de caractère ou une lettre dans une requête. Dans l'exemple suivant, chaque occurence de A sera remplacée par B dans la requête, et ceci jusqu'il n'y ait plus de A à remplacer.

```apache
RewriteRule "(.*)A(.*)" "$1B$2" [N]
```

Vous pouvez vous représenter ce traitement comme une boucle `while` : tant que le modèle de la règle correspond (c'est à dire, tant que le chemin d’URL contient un `A`), effectuer la substitution (c'est à dire, remplacer le `A` par un `B`).

À utiliser avec d’extrêmes précautions. Si aucune condition d’arrêt n’est définie, ce drapeau fait que la règle boucle à l’infini. Dans la plupart des cas, il est préférable d’utiliser \[L\] à la place de \[N\], à moins que vous n’ayez vraiment l’intention de configurer un traitement itératif.

## NC|nocase

Avec le drapeau \[NC\], le modèle de la règle [[13-directives/rewriterule|RewriteRule]] est comparé à la requête de manière insensible à la casse. C'est à dire que cette comparaison s'effectue sans tenir compte des majuscules/minuscules dans le chemin URL comparé.

Dans l'exemple suivant, toute requête pour un fichier image sera transmise par Apache à votre serveur d'images dédié. La correspondance est insensible à la casse, si bien que par exemple, `.jpg` aussi bien que `.JPG` seront acceptés.

```apache
RewriteRule "(.*\.(jpg|gif|png))$" "http://images.example.com$1" [P,NC]
```

## NE|noescape

Par défaut, lorsqu'une directive [[13-directives/rewriterule|RewriteRule]] résulte en une redirection externe, tout caractère dans la sortie qui ne fait pas partie de l'ensemble sûr suivant est converti en son code hexa (encodage avec caractère pourcentage) :

- Caractères alphanumériques : `A-Z`, `a-z`, `0-9`
- Caractères spéciaux : `$-_.+!*'(),:;@&=/~`

Par exemple, `#` est converti en `%23` et `?` en `%3F`. Le caractère `%` est aussi échappé (vers `%25`), ce qui signifie que tout caractère codé avec pourcentage déjà présent dans la substitution sera doublement encodé.

Utiliser le drapeau \[NE\] empêche cet échappement, ce qui permet de transmettre sans modification vers l'URL de redirection des caractères comme `#` et `?`.

```apache
RewriteRule "^/anchor/(.+)" "/bigpage.html#$1" [NE,R]
```

Dans l'exemple ci-dessus, `/anchor/xyz` est réécrit en `/bigpage.html#xyz`. En l'absence du drapeau \[NE\], le # aurait été converti en son équivalent hexadécimal, `%23`, ce qui aurait provoqué un code d'erreur "404 Not Found".

Voir [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Encodage et décodage des URLs]] pour une description complète de la manière dont httpd encode et décode les URLs lors de la réécriture.

## NS|nosubreq

Le drapeau \[NS\] empêche la règle de s'appliquer aux sous-requêtes. Par exemple, une page incluse au moyen d'une SSI (Server Side Include) est une sous-requête, et vous ne voudrez probablement pas que la réécriture s'applique à ces sous-requêtes. Ainsi, lorsque [[12-modules/mod_dir|mod_dir]] recherche des informations à propos des fichiers par défaut du répertoire (comme les fichiers `index.html`), il s'agit d'une sous-requête interne, et vous ne désirez en général pas que ces sous-requêtes soient réécrites. Cette réécriture n'est pas toujours utile pour les sous-requêtes, et peut même causer des erreurs si l'ensemble du jeu de règles est appliqué. L'utilisation de ce drapeau permet d'exclure les règles qui peuvent poser problème.

Comment déterminer si vous devez utiliser cette règle ou non : si vous préfixez les URLs avec des scripts CGI, afin de forcer leur traitement par le script CGI, vous vous exposez à des problèmes (ou du moins à une surcharge significative) avec les sous-requêtes. Dans ces cas, vous devez utiliser ce drapeau.

Les images, scripts java, ou fichiers css, chargés en tant que partie d'une page html, ne sont pas des sous-requêtes - le navigateur les appelle sous forme de requêtes HTTP à part entière.

```apache
# Ne réécrire que les requêtes directes vers le contrôleur frontal, pas les
# sous-requêtes des inclusions SSI ou de mod_dir.
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "^(.*)$" "/app/index.php?page=$1" [NS,L]
```

## P|proxy

L'utilisation du drapeau \[P\] entraîne le traitement de la requête par le module [[12-modules/mod_proxy|mod_proxy]], et ceci via une requête de mandataire. Par exemple, si vous voulez que toutes les requêtes d'images soient traitées par un serveur d'images annexe, vous pouvez utiliser une règle de ce style :

```apache
RewriteRule "/(.*)\.(jpg|gif|png)$" "http://images.example.com/$1.$2" [P]
```

L'utilisation du drapeau \[P\] provoque aussi l'effet du drapeau \[L\] - autrement dit, la requête est immédiatement envoyée au mandataire, et toute règle ultérieure sera ignorée.

Vous devez vous assurer que la chaîne de substitution soit un URL valide (commençant typiquement par `http://`*nom-serveur*) qui puisse être traitée par le module [[12-modules/mod_proxy|mod_proxy]]. Dans le cas contraire, le module mandataire vous renverra une erreur. L'utilisation de ce drapeau implémente de manière plus puissante la directive [[13-directives/proxypass|ProxyPass]], pour faire correspondre le contenu distant à l'espace de nommage du serveur local.

> [!WARNING]
> **Avertissement à propos de la sécurité**
>
> Lors de la construction de l'URL cible de la règle, il convient de prendre en compte l'impact en matière de sécurité qu'aura le fait de permettre au client d'influencer le jeu d'URLs pour lesquelles votre serveur agira en tant que mandataire. Si une partie de l’URL cible est dérivée de l’entrée de l’utilisateur (références arrières, chaînes de paramètres, etc.), un attaquant pourra être capable de faire que votre serveur génère des requêtes vers des hôtes internes ou externes arbitraires. Cette vulnérabilité est connue sous le nom de falsification de requête côté serveur (Server-Side Request Forgery — SSRF). Assurez-vous que la partie protocole://nom-serveur de l'URL soit fixe, ou ne permette pas au client de l'influencer indument.

> [!WARNING]
> **Avertissement au sujet des performances**
>
> Utiliser ce drapeau fait intervenir [[12-modules/mod_proxy|mod_proxy]] sans la gestion des connexions persistantes car dans ce cas, c'est le worker par défaut qui est utilisé, et ce dernier ne gère pas la mise en commun et la réutilisation des connexions.
>
> Pour utiliser les connexions persistantes, vous devez définir un bloc [[13-directives/proxy|<Proxy>]], au moins pour les parties protocole et hôte de l'URL cible, et contenant une directive [[13-directives/proxyset|ProxySet]] où vous définissez par exemple un délai.
>
> Si vous le définissez avec une directive [[13-directives/proxypass|ProxyPass]] ou [[13-directives/proxypassmatch|ProxyPassMatch]], les connexions persistantes seront automatiquement utilisées.

Note: [[12-modules/mod_proxy|mod_proxy]] doit être activé pour pouvoir utiliser ce drapeau.

## PT|passthrough

Par défaut, la cible (ou chaîne de substitution) d'une règle RewriteRule est sensée être un chemin de fichier. Avec le drapeau \[PT\], par contre, elle est traitée comme un chemin URL. Autrement dit, avec le drapeau \[PT\], le résultat de la règle [[13-directives/rewriterule|RewriteRule]] est passé à nouveau au système de mise en correspondance des URLs avec le système de fichiers, de façon à ce que les systèmes de mise en correspondance basés sur les chemins de fichiers, comme la directive [[13-directives/alias|Alias]], [[13-directives/redirect|Redirect]], ou [[13-directives/scriptalias|ScriptAlias]], par exemple, puissent avoir une chance d'accomplir leur tâche.

Si par exemple, vous avez un [[13-directives/alias|Alias]] pour /icons, et une règle [[13-directives/rewriterule|RewriteRule]] qui renvoie vers /icons, vous devez utiliser le drapeau \[PT\] pour être sûr que l'[[13-directives/alias|Alias]] sera bien évalué.

```apache
Alias "/icons" "/usr/local/apache/icons"
RewriteRule "/pics/(.+)\.jpg$" "/icons/$1.gif" [PT]
```

Dans l'exemple précédent, en l'absence du drapeau \[PT\], l'Alias aurait été ignoré, ce qui aurait provoqué une erreur 'File not found'.

Avec le drapeau `PT`, le drapeau `L` est implicite : la réécriture s'arrêtera afin de transmettre la requête à la phase suivante du traitement.

Notez que le drapeau `PT` est implicite dans des contextes de répertoire comme les sections [[13-directives/directory|<Directory>]] ou les fichiers `.htaccess`. Le seul moyen de contourner ceci consiste à réécrire vers `-`.

## QSA|qsappend

Quand l'URL de remplacement contient une chaîne de requête, le comportement par défaut de la règle [[13-directives/rewriterule|RewriteRule]] est de supprimer la `query string` (il s'agit des paramètres éventuellement passés dans l'URL après le caractère `?`, usuellement pour les formulaires traités par la méthode HTTP `GET`) existante, et de la remplacer par celle nouvellement créée. Avec le drapeau \[QSA\], les chaînes de requête peuvent être combinées.

Considérons la règle suivante :

```apache
RewriteRule "/pages/(.+)" "/page.php?page=$1" [QSA]
```

Avec le drapeau \[QSA\], une requête pour `/pages/123?one=two` sera réécrite en `/page.php?page=123&one=two`. Sans le drapeau \[QSA\], la même requête sera réécrite en `/page.php?page=123` - autrement dit, la chaîne de requête (`query string`) existante sera supprimée.

## QSD|qsdiscard

Lorsque l'URL de la requête contient une chaîne de paramètres, et si l'URI cible n'en contient pas, le comportement par défaut de la directive [[13-directives/rewriterule|RewriteRule]] consiste à copier cette chaîne de paramètres dans l'URL cible. Avec le drapeau \[QSD\], la chaîne de paramètres est supprimée.

Ce drapeau est disponible dans les versions 2.4.0 et supérieures.

Lorsque les drapeaux \[QSD\] et \[QSA\] sont utilisés ensemble, c'est le drapeau \[QSD\] qui l'emporte.

Si l'URL cible possède une chaîne de paramètres, le comportement par défaut sera respecté - c'est à dire que la chaîne de paramètres originale sera supprimée et remplacée par la chaîne de paramètres de l'URL cible.

```apache
# Redirection des anciens URLs « search » vers le nouveau chemin en supprimant
# la chaîne de paramètres. /search?q=term&page=2 devient /find (chaîne de
# paramètres supprimée)
RewriteRule "^/search" "/find" [QSD,R=301,L]
```

## QSL|qslast

Par défaut, le premier (le plus à gauche) point d'interrogation de la substitution sépare le chemin de la requête de sa chaîne de paramètres. Avec le drapeau \[QSL\] au contraire, les deux composants seront séparés en utilisant le dernier (le plus à droite) point d'interrogation.

Cela peut s'avérer utile lorsqu'on recherche un fichier dont le nom contient des points d'interrogation. Si aucune chaîne de paramètre n'est présente dans la substitution, il est alors possible d'ajouter un point d'interrogation à la fin et d'utiliser ce drapeau.

Par exemple, si une application patrimoniale attend une chaîne de paramètres qui contient elle-même un point d’interrogation :

```apache
# Associe /lookup/foo?bar à /app?type=foo?bar
# Sans [QSL], le premier ? dans la substitution couperait le chemin, en
# produisant incorrectement /app avec la chaîne de paramètres type=foo?bar.
# Avec [QSL], le DERNIER ? est utilisé comme délimiteur.
RewriteRule "^/lookup/(.*)" "/app?type=$1" [QSL,PT]
```

Sans \[QSL\], la substitution `/app?type=foo?bar` serait coupée au premier `?`, perdant de ce fait le point d’interrogation littéral de la valeur.

Ce drapeau est disponible à partir de la version 2.4.19 du serveur HTTP Apache.

## R|redirect

L'utilisation du drapeau \[R\] provoque l'envoi d'une redirection au navigateur. Si une URL pleinement qualifiée (FQDN - fully qualified domain name) est spécifiée (c'est à dire incluant `http://nom-du-serveur/`), une redirection sera effectuée vers cette adresse. Dans le cas contraire, le protocole courant, le nom du serveur et le numéro de port seront utilisés pour générer l'URL envoyée avec la redirection.

*Tout* code de statut de réponse HTTP valide peut être spécifié, en utilisant la syntaxe \[R=305\], le code de statut 302 étant utilisé par défaut si aucun code n'est spécifié. Le code de statut spécifié n'est pas nécessairement un code de statut de redirection (3xx). Cependant, si le code de statut est en dehors de la plage des codes de redirection (300-399), la chaîne de substitution est entièrement supprimée, et la réécriture s'arrête comme si le drapeau `L` était utilisé.

En plus des codes de statut de réponse, vous pouvez spécifier les codes de redirection en utilisant leurs noms symboliques : `temp` (défaut), `permanent`, ou `seeother`.

Vous utiliserez presque toujours \[R\] en conjonction avec \[L\] (c'est à dire \[R,L\]), car employé seul, le drapeau \[R\] préfixe le chemin URL avec `http://cet-hôte[:ce-port]`, mais passe ensuite cette adresse à la règle suivante, ce qui provoquera le plus souvent des avertissements 'Invalid URI in request'.

Remarque : httpd ne prend en charge que les codes d'état inclus dans la spécification de HTTP. Utiliser un code d'état non reconnu provoquera une erreur 500 et l'enregistrement d'un message dans le journal des erreurs.

> [!WARNING]
> **\[R=4xx\] ne sert pas la substitution**
>
> Lorsqu’un code d’état en dehors de l’intervalle 300-399 est spécifié (par exemple `[R=403]` ou `[R=410]`), la chaîne de substitution est ignorée. L’URL que vous avez saisi comme cible n’est pas servi au client. À la place, httpd renvoie le code d’état spécifié et le traite de la manière habituelle pour les réponses d'erreur (entre autres tout [[13-directives/errordocument|ErrorDocument]] configuré). Si vous souhaitez interdire l’accès, les drapeaux \[F\] et \[G\] sont des solutions plus adaptées pour exprimer la même intention.

```apache
# Redirection des requêtes pour l’ancien chemin de la documentation vers le
# nouvel emplacement.
RewriteRule "^/docs/(.*)$" "http://docs.example.com/$1" [R=301,L]
```

## S|skip

Le drapeau \[S\] sert à sauter des règles que vous ne voulez pas voir exécuter. La syntaxe du drapeau \[S\] est \[S=*N*\], où *N* correspond au nombre de règles à sauter (sous réserve que la règle [[13-directives/rewriterule|RewriteRule]] corresponde et qu'au moins une condition [[13-directives/rewritecond|RewriteCond]] préalable soit vérifiée). Ceci peut s'interpréter comme une instruction `goto` dans votre jeu de règles de réécriture. Dans l'exemple suivant, nous ne voulons exécuter la règle [[13-directives/rewriterule|RewriteRule]] que si le chemin URL demandé ne correspond pas à un fichier existant.

```apache
# La requête concerne-t-elle un fichier qui n'existe pas ?
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
# Si c'est la cas, on saute les deux règles de réécriture suivantes
RewriteRule ".?" "-" [S=2]

RewriteRule "(.*\.gif)" "images.php?$1"
RewriteRule "(.*\.html)" "docs.php?$1"
```

Cette technique trouve son utilité dans le fait qu'une directive [[13-directives/rewritecond|RewriteCond]] ne s'applique qu'à la règle qui la suit immédiatement. Ainsi, si vous voulez qu'une directive `RewriteCond` s'applique à plusieurs règles `RewriteRule`, une technique possible consiste à inverser ces conditions et ajouter une `RewriteRule` avec le drapeau \[Skip\]. Cette technique permet d'élaborer des pseudo-constructions if-then-else : la dernière règle du bloc then contiendra `skip=N`, où N est le nombre de règles contenues dans le bloc else :

```apache
# Est-ce que le fichier existe ?
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
# Créer une structure conditionnelle if-then-else en sautant 3 lignes si nous
# avions l'intention d'aller au bloc "else".
RewriteRule ".?" "-" [S=3]

# Si le fichier existe, alors :
RewriteRule "(.*\.gif)" "images.php?$1"
    RewriteRule "(.*\.html)" "docs.php?$1"
    # Passer le bloc "else".
    RewriteRule ".?" "-" [S=1]
# ELSE...
RewriteRule "(.*)" "404.php?file=$1"
# END
```

Il est probablement plus aisé de définir ce genre de configuration via les directives `<If>`, `<ElseIf>`, et `<Else>`.

## T|type

Définit le type MIME de la réponse résultante renvoyée. L'effet est identique à celui de la directive [[13-directives/addtype|AddType]].

Par exemple, vous pouvez utiliser la technique suivante pour servir du code source Perl en tant que plein texte, s'il est requis d'une certaine manière :

```apache
# Sert les fichier .pl en tant que plein texte
RewriteRule "\.pl$" "-" [T=text/plain]
```

Ou encore, si vous possédez une caméra qui produit des fichiers images jpeg sans extension, vous pouvez forcer le renvoi de ces images avec le type MIME correct en se basant sur le nom du fichier :

```apache
# Les fichiers dont le nom contient 'IMG' sont des images jpg.
RewriteRule "IMG" "-" [T=image/jpg]
```

Notez cependant qu'il s'agit d'un exemple trivial, et que le problème aurait pu être résolu en utilisant à la place la directive [[13-directives/filesmatch|<FilesMatch>]]. Il faut toujours envisager la possibilité d'une solution alternative à un problème avant d'avoir recours à la réécriture, qui sera toujours moins efficace qu'une solution alternative.

Dans un contexte de niveau répertoire, n'utilisez que `-` (tiret) comme substitution, *dans toute la séquence de réécriture de [[12-modules/mod_rewrite|mod_rewrite]]*, sinon le type MIME défini avec ce drapeau sera perdu suite à un retraitement interne (y compris les séquences de réécriture suivantes de [[12-modules/mod_rewrite|mod_rewrite]]). Dans ce contexte, vous pouvez utiliser le drapeau `L` pour terminer la séquence *courante* de réécriture de [[12-modules/mod_rewrite|mod_rewrite]].

## UnsafeAllow3F

Il est nécessaire de définir ce drapeau pour permettre à une réécriture de continuer si la requête HTTP en cours d'écriture possède un point d'interrogation encodé, « %3f », et si le résultat réécrit contient un « ? » dans la substitution. Cela protège d'une URL malveillante tirant avantage d'une capture et d'une resubstitution du point d'interrogation encodé.

```apache
# Un contrôleur frontal PHP qui route toutes les requêtes via un élément de la
# chaîne de paramètres.
# Sans UnsafeAllow3F, une requête comme /page%3Fname=test renverrait 403 Forbidden,
# car le substitution réécrite contient '?' alors que la requête originelle
# contient un caractère encodé '%3F'.
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "(.+)" "index.php?route=$1" [L,QSA,UnsafeAllow3F]
```

> [!WARNING]
> L’existence de ce drapeau est due à [CVE-2024-38474](https://www.cve.org/CVERecord?id=CVE-2024-38474). Ne l’utilisez que dans les règles pour lesquelles vous êtes certain qu’un `%3F` saisi par l’utilisateur dans la requête ne peut pas être exploité pour manipuler la chaîne de paramètres de la cible de substitution. Préférez autant que possible la restructuration des URLs pour éviter les points d’interrogation encodés.

## UnsafePrefixStat

La définition de ce drapeau est requise dans les substitutions à l'échelle du serveur qui commencent par une variable ou une référence arrière et se résolvent en un chemin du système de fichiers. Ces substitutions ne sont pas préfixées par la racine des documents. Cela protège d'un URL malveillant faisant correspondre la substitution développée à un emplacement non souhaité du système de fichiers.

2.4.60

```apache
# Cette règle lance la substitution avec une référence arrière.
# Depuis la version 2.4.60, cette opération est rejetée par défaut pour empêcher
# le chemin développé de s’échapper de la racine des documents (CVE-2024-38475).
# N’ajoutez UnsafePrefixStat qu’après avoir vérifié que la substitution ne peut
# pas se résoudre en un chemin du système de fichiers en dehors de la racine des
# documents de votre site.
RewriteRule "^/mirror/(.+)$" "$1" [PT,UnsafePrefixStat]
```

> [!WARNING]
> L’existence de ce drapeau est due à [CVE-2024-38475](https://www.cve.org/CVERecord?id=CVE-2024-38475). Sans lui, une substitution commençant par une référence arrière ou une variable qui correspond à un chemin existant du système de fichiers pourrait permettre à des requêtes de s’échapper de la racine des documents. N’utilisez ce drapeau qu’après avoir confirmé que la substitution est contrainte de manière adéquate.

## UNC

Définir ce drapeau empêche la fusion des slashes de début multiples tels que ceux utilisés dans les chemins UNC de Windows. Ce drapeau n'est pas nécessaire lorsque la substitution de la règle commence par des slashes multiples littéraux.

2.4.63

```apache
# Sous Windows, réécriture vers un partage de fichiers UNC
# en utilisant une variable
# Sans [UNC], les barres obliques de tête dans la substitution seraient
# fusionnées (//server/share deviendrait /server/share).
RewriteCond "%{HTTP_HOST}" "^(.+)\.internal$"
RewriteRule "^/shared/(.*)$" "//%1/fileshare/$1" [UNC]
```

Ce drapeau n’est pertinent que sous Windows. Il empêche httpd de fusionner les doubles barres obliques de tête (`//`) qui sont présentes dans un chemin UNC lorsque ce dernier a été construit à partir d’une référence arrière ou d’une variable. Si la substitution commence par des doubles barres obliques littérales, aucun drapeau n’est nécessaire.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
