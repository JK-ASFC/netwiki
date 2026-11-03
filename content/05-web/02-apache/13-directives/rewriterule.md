---
title: "RewriteRule"
description: "Directive Apache RewriteRule (mod_rewrite) — Définit les règles pour le moteur de réécriture. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_rewrite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les règles pour le moteur de réécriture |
| **Syntaxe** | `RewriteRule [!]Pattern Substitution [flags]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_rewrite\|mod_rewrite]] |

## Utilisation

La directive `RewriteRule` est le véritable cheval de trait de la réécriture. La directive peut apparaître plusieurs fois, chaque instance définissant une règle de réécriture particulière. L'ordre dans lequel ces règles sont définies est important - il s'agit de l'ordre dans lequel les règles seront appliquées au cours du processus de réécriture.

*Pattern* est une expression rationnelle. Ce avec quoi ce modèle est comparé dépend de l'endroit où la directive `RewriteRule` est définie.

Si le motif est précédé d’un `!`, la substitution ne sera effectuée que si le *pattern* ne correspond pas.

> [!NOTE]
> **Qu'est-ce qui est comparé ?**
>
> - Dans un contexte de serveur virtuel [[13-directives/virtualhost|<VirtualHost>]], le *modèle* est tout d'abord comparé à la portion de l'URL située entre le nom d'hôte éventuellement accompagné du port, et la chaîne de paramètres (par exemple "/app1/index.html"). Il s'agit du URL-path décodé de sa valeur "%xx".
> - Dans un contexte de répertoire (sections [[13-directives/directory|<Directory>]] et fichiers .htaccess), le *Pattern* est comparé avec une partie de chemin ; par exemple une requête pour "/app1/index.html" entraînera une comparaison avec "app1/index.html" ou "index.html" selon le chemin de répertoire où la directive `RewriteRule` est définie.
>
>   Le chemin de répertoire auquel la règle s’applique est supprimé du chemin correspondant du système de fichiers avant comparaison (jusqu'au slash final compris). En conséquence de cette suppression, les règles définies dans ce contexte n'effectuent des comparaisons qu'avec la portion du chemin du système de fichiers "en dessous" du chemin de répertoire auquel la règle s’applique.
>
>   Le chemin correspondant actuel du système de fichiers est déterminé par des directives telles que [[13-directives/documentroot|DocumentRoot]] et [[13-directives/alias|Alias]], ou même le résultat de substitutions dans des règles `RewriteRule` précédentes.
> - Si vous souhaitez faire une comparaison sur le nom d'hôte, le port, ou la chaîne de requête, utilisez une directive [[13-directives/rewritecond|RewriteCond]] comportant respectivement les variables `%{HTTP_HOST}`, `%{SERVER_PORT}`, ou `%{QUERY_STRING}`.

> [!NOTE]
> **Réécritures dans un contexte de répertoire**
>
> - L'utilisation du moteur de réécriture dans les fichiers [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|.htaccess]] et les sections [[13-directives/directory|<Directory>]] est un peu plus complexe.
> - Pour activer le moteur de réécriture dans ces contextes, vous devez définir `RewriteEngine On` **et** au moins une des [[13-directives/options|Options]] `FollowSymLinks` ou `SymLinksIfOwnerMatch` doit être activée. Notez que ces options ne peuvent être définies dans un fichier de configuration distribué (`.htaccess`) que si une directive [[13-directives/allowoverride|AllowOverride]] le permet dans la configuration du serveur.
> - Voir la directive [[13-directives/rewritebase|RewriteBase]] pour plus de détails à propos de l'ajout du préfixe après les substitutions relatives.
> - Si vous souhaitez effectuer une comparaison en prenant en compte l'intégralité du chemin de l'URL dans un contexte de répertoire (htaccess), vous devez utiliser la variable `%{REQUEST_URI}` dans la directive [[13-directives/rewritecond|RewriteCond]].
> - Le prefixe supprimé se termine toujours par un slash, ce qui signifie que la comparaison s'effectue avec une chaîne qui ne comporte *jamais* de slash de début. Ainsi, un *modèle* contenant `^/` ne correspondra jamais dans un contexte de répertoire.
> - Bien que les règles de réécriture soient permises du point de vue de la syntaxe dans les sections [[13-directives/location|<Location>]] et [[13-directives/files|<Files>]] (y compris leurs versions sous forme d'expression rationnelle), elles n'y sont pas prises en compte, et n'y sont à priori d'aucune utilité. Les substitutions relatives sont une fonctionnalité qui n'est, elle non-plus pas supportée dans ce genre de contexte.
> - Les blocs [[13-directives/if|<If>]] suivent les règles du contexte de *répertoire*.
> - Par défaut, mod\_rewrite écrase les règles précédentes au sein de [[11-guides/01-generalites/sections-de-configuration|sections combinées]] appartenant au même contexte. Pour modifier ce comportement, on peut utiliser la directive [[13-directives/rewriteoptions|RewriteOptions]] pour définir par exemple l'option *Inherit*.
> - La directive [[13-directives/rewriteoptions|RewriteOptions]] permet aussi de contrôler le comportement des sections définies au même niveau d'imbrication dans la configuration. Dans l'exemple suivant, par défaut seule la règle RewriteRules définie dans le second bloc [[13-directives/if|<If>]] est prise en compte car celle définie dans le premier bloc est écrasée. Définir [[13-directives/rewriteoptions|RewriteOptions]] Inherit force mod\_rewrite à combiner les deux sections en prenant en compte les deux règles et pas seulement la dernière.
>
> ```apache
> <If "true">
>   # Sans RewriteOptions Inherit, cette règle est écrasée par celle de la section
>   # suivante et aucune redirection ne sera effectuée pour les URIs contenant
>   # 'foo'
>   RewriteRule foo http://example.com/foo [R]
> </If>
> <If "true">
>   RewriteRule bar http://example.com/bar [R]
> </If>
> ```

Pour des informations à propos des expressions rationnelles, y compris l’utilisation du préfixe `!` pour inverser un motif, voir la section [[11-guides/05-reecriture-mod-rewrite/introduction-au-module-apache-mod-rewrite|Expressions rationnelles]] de l’introduction à mod\_rewrite.

Dans une règle de réécriture, *Substitution* est la chaîne de caractères qui remplace le chemin de l'URL (voir "Qu’est-ce qui est comparé ?" ci-avant) lorsque les conditions de la règle sont satisfaites. *Substitution* peut être :

**un chemin du système de fichiers**

Il indique alors la localisation dans le système de fichiers de la ressource qui doit être envoyée au client. Une substitution commençant par `/` n’est traitée comme un chemin du système de fichiers que dans un contexte de serveur virtuel ou de serveur global, et seulement si le premier composant du chemin existe dans le système de fichiers. Dans un contexte de répertoire, la question ne se pose pas.

**chemin d'URL**

Un chemin relatif à la valeur de [[13-directives/documentroot|DocumentRoot]] vers la ressource qui doit être servie. Dans un contexte de serveur virtuel ou de serveur global, si le premier composant du chemin existe à la racine du système de fichiers, la substitution est traitée comme un chemin du système de fichiers. Par exemple, `/www/file.html` est un chemin d’URL, sauf si un répertoire nommé `www` existe à la racine du système de fichiers. Si vous désirez que d'autres directives de correspondance d'URL (comme la directive [[13-directives/alias|Alias]]) soient appliquées au chemin d'URL résultant, utilisez le drapeau `[PT]` comme décrit ci-dessous.

**URL absolue**

Si une URL absolue est spécifiée, [[12-modules/mod_rewrite|mod_rewrite]] vérifie si le nom d'hôte correspond à celui de l'hôte local. Si c'est le cas, le protocole et le nom d'hôte sont supprimés, et ce qui reste est traité comme un chemin d'URL. Dans le cas contraire, une redirection externe vers l'URL indiquée est effectuée. Pour forcer une redirection externe vers l'hôte local, voir le drapeau `[R]` ci-dessous.

Notez qu'une redirection (implicite ou non) qui utilise une URI absolue inclura la chaîne de paramètres de la requête ; pour éviter ceci, voir le drapeau `[QSD]` ci-dessous.

**`-` (tiret)**

Un tiret indique qu'aucune substitution ne doit être effectuée (le chemin considéré est transmis sans changement). Ceci est utile quand un drapeau doit être appliqué sans modifier le chemin (voir ci-dessous).

> [!NOTE]
> **Comment sont interprétées les substitutions de chemin**
>
> En fonction du contexte et si elle commence ou non par un slash, une substitution sera traitée comme un chemin du système de fichiers ou comme un chemin d’URL :
>
> - **Commence par un `/`, contexte de serveur virtuel ou de serveur global :** Traitée comme un chemin du système de fichiers si le premier composant du chemin existe sur disque ; sinon, traitée comme un chemin d’URL.
> - **Commence par un `/`, contexte de répertoire :** Toujours traitée comme un chemin d’URL. Pas de vérification sur le système de fichiers.
> - **Ne commence pas par un `/` (chemin relatif), contexte de serveur virtuel ou de serveur global :** Traitée comme un chemin d’URL relatif à l’URI de la requête actuelle.
> - **Ne commence pas par un `/` (chemin relatif), contexte de répertoire :** Traitée comme un chemin d’URL relatif au chemin de répertoire auquel la directive [[13-directives/directory|<Directory>]] ou le fichier `.htaccess` s’appliquent. Voir `RewriteBase` pour le contrôle du préfixe ajouté aux substitutions relatives.

En plus du texte, la chaîne *Substitution* peut comporter :

1. des références arrières (`$N`) vers le modèle d'une directive RewriteRule
2. des références arrières (`%N`) vers le dernier modèle d'une directive RewriteCond qui correspondait
3. des variables du serveur comme dans les chaînes de test de condition d'une règle (`%{VARNAME}`)
4. des appels de fonctions de mappage (`${nom correspondance:clé|défaut}`)

Les références arrières sont des identificateurs de la forme `$`**N** (**N**=0..9). `$0` correspond à la chaîne entière correspondant au *motif*, alors que `$1`..`$9` correspondent aux groupes correspondants capturés depuis le *motif* correspondant. De même, les références arrières `%0`..`%9` correspondent aux *motifs de condition* de [[13-directives/rewritecond|RewriteCond]] correspondants les plus récents : `%0` représente une correspondance complète et `%1`..`%9` les groupes capturés. Les variables du serveur sont les mêmes que dans la *Chaîne\_de\_test* d'une directive [[13-directives/rewritecond|RewriteCond]]. Les fonctions de comparaison sont issues de la directive [[13-directives/rewritemap|RewriteMap]] dans la section de laquelle elles sont décrites. Ces trois types de variables sont évaluées dans l'ordre ci-dessus.

Chaque règle de réécriture s'applique au résultat de la règle précédente, selon l'ordre dans lequel elles ont été définies dans le fichier de configuration. Le chemin de l'URL ou du système de fichier (voir ci-dessus Qu'est-ce qui est comparé ?) est **intégralement remplacée** par la chaîne de *Substitution* et le processus de réécriture se poursuit jusqu'à ce que toutes les règles aient été appliquées, ou qu'il soit explicitement stoppé par un drapeau [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|L]], ou par un autre drapeau qui implique un arrêt immédiat, comme `END` ou `F`.

> [!NOTE]
> **Modifier la chaîne de requête**
>
> Par défaut, la chaîne de requête est transmise sans modification. Vous pouvez cependant créer dans la chaîne de substitution des URLs dont une partie constitue une chaîne de requête. Pour cela, ajoutez simplement un point d'interrogation dans la chaîne de substitution pour indiquer que le texte qui suit doit être réinjecté dans la chaîne de requête. Pour supprimer une chaîne de requête, terminez simplement la chaîne de substitution par un point d'interrogation. Pour combiner les nouvelles chaînes de requête avec les anciennes, utilisez le drapeau `[QSA]`.

En outre, vous pouvez spécifier des actions spéciales à effectuer en ajoutant des **`[`*flags*`]`** comme troisième argument de la directive `RewriteRule`. Séparés par des virgules au sein d'une liste encadrée par des crochets, les *flags* peuvent être choisis dans la table suivante. Vous trouverez plus de détails, et des exemples pour chaque drapeau dans le [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|document à propos des drapeaux de réécriture.]]

| Drapeaux et syntaxe | Fonction |
| --- | --- |
| B | Echappe les caractères non-alphanumériques dans les références arrières *avant* d'appliquer la transformation. Pour un échappement similaire des variables du serveur, voir la fonction de mappage "escape".*[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| BCTLS | Identique à \[B\], mais n'échappe que les espaces et les caractères de contrôle. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| BNE | Les caractères de \[B\] ou \[BCTLS\] qui **ne doivent pas** être échappés. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| backrefnoplus\|BNP | Avec ce drapeau, si les références arrières sont échappées, les espaces seront échappés en %20 au lieu de +. Ceci s'avère utile lorsqu'une référence arrière est utilisée dans la partie chemin, et non dans la chaîne de paramètres de la requête ; pour plus de détails, voir *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|ici.]]* |
| chain\|C | La règle est chaînée avec la règle suivante. Si la règle échoue, la ou les règles avec lesquelles elle est est chaînée seront sautées. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| cookie\|CO=*NAME*:*VAL* | Définit un cookie au niveau du navigateur client. La syntaxe complète est : CO=*NAME*:*VAL*:*domain*\[:*lifetime*\[:*path*\[:*secure*\[:*httponly*\[*samesite*\]\]\]\]\] *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|details ...]]* *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| discardpath\|DPI | Supprime la partie PATH\_INFO de l'URI réécrit. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| END | Stoppe le processus de réécriture immédiatement et n'applique plus aucune règle. Empêche aussi l'application ultérieure de règles de réécriture dans les contextes de répertoire et de fichier .htaccess (disponible à partir de la version 2.3.9 du serveur HTTP Apache). *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| env\|E=\[!\]*VAR*\[:*VAL*\] | Définit la variable d'environnement *VAR* (à la valeur *VAL* si elle est fournie). La variante !*VAR* annule la définition de la variable *VAR*.*[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| forbidden\|F | Renvoie une réponse 403 FORBIDDEN au navigateur client. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| gone\|G | Renvoie un message d'erreur 410 GONE au navigateur client. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| Handler\|H=*Gestionnaire de contenu* | L'URI résultant est envoyé au *Gestionnaire de contenu* pour traitement. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| last\|L | Arrête le processus de réécriture immédiatement et n'applique plus aucune règle. Prêtez une attention particulière aux mises en garde concernant les contextes de niveau répertoire (voir aussi le drapeau END). *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| next\|N | Réexécute le processus de réécriture à partir de la première règle, en utilisant le résultat du jeu de règles, sous réserve qu'il y ait un point de départ. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| nocase\|NC | Rend la comparaison entre modèles insensible à la casse. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| noescape\|NE | Empêche mod\_rewrite d'effectuer un échappement hexadécimal des caractères spéciaux dans le résultat des réécritures qui aboutissent à une redirection. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| nosubreq\|NS | La règle est sautée si la requête courante est une sous-requête interne. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| proxy\|P | Force l'envoi en interne de l'URL de substitution en tant que requête mandataire. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| passthrough\|PT | L'URI résultant est repassé au moteur de mise en correspondance des URLs pour y être traité par d'autres traducteurs URI-vers-nom de fichier, comme `Alias` ou `Redirect`. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| qsappend\|QSA | Ajoute toute chaîne de paramètres présente dans l'URL de la requête originale à toute chaîne de paramètres créée dans la cible de réécriture. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| qsdiscard\|QSD | Supprime toute chaîne de paramètres de l'URI entrant. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| qslast\|QSL | Interprète le dernier (le plus à droite) point d'interrogation comme le délimiteur de la chaîne de paramètres de la requête, au lieu du premier (le plus à gauche) comme c'est le cas habituellement. Disponble à partir de la version 2.4.19 du serveur HTTP Apache. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| redirect\|R\[=*code*\] | Force une redirection externe, avec un code de statut HTTP optionnel. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| skip\|S=*nombre* | Si la règle courante s'applique, le moteur de réécriture doit sauter les *nombre* règles suivantes. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| type\|T=*MIME-type* | Force l'attribution du Type-MIME spécifié au fichier cible. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| UnsafeAllow3F | Autorise les substitutions à partir d’URL potentiellement non fiables. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* |
| UnsafePrefixStat | Autorise les substitutions potentiellement non fiables à partir d’une variable de tête ou d’une référence arrière vers un chemin du système de fichiers. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|détails ...]]* 2.4.60 |
| UNC | Empêche la fusion des slashes de début multiples tels que ceux utilisés dans les chemins UNC de Windows. *[[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture\|details ...]]* 2.4.62 |

> [!NOTE]
> **Développement du répertoire home**
>
> Quand la chaîne de substitution commence par quelque chose comme "/~user" (de manière explicite ou par références arrières), [[12-modules/mod_rewrite|mod_rewrite]] développe le répertoire home sans tenir compte de la présence ou de la configuration du module [[12-modules/mod_userdir|mod_userdir]].
>
> Ce développement n'est pas effectué si le drapeau *PT* est utilisé dans la directive [[13-directives/rewriterule|RewriteRule]]

Voici toutes les combinaisons de substitution et leurs significations :

**En dehors de la configuration au niveau du répertoire pour la requête \`\``GET /chemin/infochemin`'':**

| Règle | Résultat de la substitution |
| --- | --- |
| ^/un\_chemin(.\*) autre\_chemin$1 | invalide, non supporté |
| ^/un\_chemin(.\*) autre\_chemin$1 \[R\] | invalide, non supporté |
| ^/un\_chemin(.\*) autre\_chemin$1 \[P\] | invalide, non supporté |
| ^/un\_chemin(.\*) /autre\_chemin$1 | /autre\_chemin/info\_chemin |
| ^/un\_chemin(.\*) /autre\_chemin$1 \[R\] | http://cet\_hote/autre\_chemin/info\_chemin via une redirection externe |
| ^/un\_chemin(.\*) /autre\_chemin$1 \[P\] | sans objet, non supporté |
| ^/un\_chemin(.\*) http://cet\_hote/autre\_chemin$1 | /autre\_chemin/info\_chemin |
| ^/un\_chemin(.\*) http://cet\_hote/autre\_chemin$1 \[R\] | http://cet\_hote/autre\_chemin/info\_chemin via une redirection externe |
| ^/un\_chemin(.\*) http://cet\_hote/autre\_chemin$1 \[P\] | sans objet, non supporté |
| ^/un\_chemin(.\*) http://autre\_hote/autre\_chemin$1 | http://autre\_hote/autre\_chemin/info\_chemin via une redirection externe |
| ^/un\_chemin(.\*) http://autre\_hote/autre\_chemin$1 \[R\] | http://autre\_hote/autre\_chemin/info\_chemin (le drapeau \[R\] est redondant) |
| ^/somepath(.\*) http://otherhost/otherpath$1 \[P\] | http://otherhost/otherpath/pathinfo via internal proxy |

**Dans une configuration de niveau répertoire pour `/chemin`
(par exemple, `.htaccess` ou `<Directory>`, avec `RewriteBase "/chemin"`)
pour la requête \`\``GET /chemin/chemin-local/infochemin`'':**

| Règle | Résultat de la substitution |
| --- | --- |
| ^chemin-local(.\*) autre-chemin$1 | /chemin/autre-chemin/infochemin |
| ^chemin-local(.\*) autre-chemin$1 \[R\] | http://cet-hôte/chemin/autre-chemin/infochemin via redirection externe |
| ^chemin-local(.\*) autre-chemin$1 \[P\] | n'a pas lieu d'être, non supporté |
| ^chemin-local(.\*) /autre-chemin$1 | /autre-chemin/infochemin |
| ^chemin-local(.\*) /autre-chemin$1 \[R\] | http://cet-hôte/autre-chemin/infochemin via redirection externe |
| ^chemin-local(.\*) /autre-chemin$1 \[P\] | n'a pas lieu d'être, non supporté |
| ^chemin-local(.\*) http://cet-hôte/autre-chemin$1 | /autre-chemin/infochemin |
| ^chemin-local(.\*) http://cet-hôte/autre-chemin$1 \[R\] | http://cet-hôte/autre-chemin/infochemin via redirection externe |
| ^chemin-local(.\*) http://cet-hôte/autre-chemin$1 \[P\] | n'a pas lieu d'être, non supporté |
| ^chemin-local(.\*) http://autre hôte/autre-chemin$1 | http://autre hôte/autre-chemin/infochemin via redirection externe |
| ^chemin-local(.\*) http://autre hôte/autre-chemin$1 \[R\] | http://autre hôte/autre-chemin/infochemin via redirection externe (le drapeau \[R\] est redondant) |
| ^chemin-local(.\*) http://autre hôte/autre-chemin$1 \[P\] | http://autre hôte/autre-chemin/infochemin via un mandataire interne |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
