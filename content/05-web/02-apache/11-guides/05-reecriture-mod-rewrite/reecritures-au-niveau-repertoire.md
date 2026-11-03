---
title: "Réécritures au niveau répertoire"
description: "Apache HTTP Server — Réécritures au niveau répertoire. Utiliser mod_rewrite dans les fichiers .htaccess est une des configurations dans un contexte de répertoire les plus courantes — et les plus sujettes à confusion. Ce document expose les principales différences entre l’utilisation de règles d"
tags: [apache, guide]
icon: book-open
---

Utiliser [[12-modules/mod_rewrite|mod_rewrite]] dans les fichiers `.htaccess` est une des configurations dans un contexte de répertoire les plus courantes — et les plus sujettes à confusion. Ce document expose les principales différences entre l’utilisation de règles de réécriture dans un contexte global au serveur et leur utilisation dans les fichiers `.htaccess`, et fournit un guide pratique pour éviter les pièges les plus courants.

Pour des détails techniques de bas niveau à propos de la manière dont [[12-modules/mod_rewrite|mod_rewrite]] traite les règles dans un contexte de répertoire, voir le document [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Détails techniques]].

## Prérequis : AllowOverride

Pour que des directives de [[12-modules/mod_rewrite|mod_rewrite]] dans un fichier `.htaccess` puissent être traitées, la configuration du serveur doit tout d’abord les autoriser de la manière suivante :

```apache
<Directory "/var/www/htdocs">
    AllowOverride FileInfo
</Directory>
```

Si au minimum `AllowOverride FileInfo` (ou `AllowOverride All`) n’est pas présente, toute directive de [[12-modules/mod_rewrite|mod_rewrite]] dans les fichiers `.htaccess` sera silencieusement ignorée. Si vos règles semblent ne pas fonctionner, il s’agit de la première chose à vérifier.

En outre, soit `Options FollowSymLinks`, soit `Options SymLinksIfOwnerMatch` doit être activée pour le répertoire en question. Comme une règle [[13-directives/rewriterule|RewriteRule]] peut associer un URL à un chemin arbitraire du système de fichiers — fonctionnellement équivalent à un lien symbolique — [[12-modules/mod_rewrite|mod_rewrite]] refusera d’opérer dans un contexte de répertoire si aucune de ces options n’est définie. Vous verrez alors l’erreur suivante :

```
AH00670: Options FollowSymLinks and SymLinksIfOwnerMatch are both off,
so the RewriteRule directive is also forbidden due to its similar
ability to circumvent directory restrictions
```

Cette restriction s’applique aux fichiers `.htaccess` et aux sections [[13-directives/directory|<Directory>]].

## Quel URL la règle voit-elle ?

Dans un contexte de serveur virtuel ou global au serveur, le motif de la règle [[13-directives/rewriterule|RewriteRule]] est comparé à l’ensemble du chemin d’URL, en commençant par une barre oblique. Dans un contexte de fichier `.htaccess`, le préfixe du répertoire est **supprimé**.

Par exemple, si votre fichier `.htaccess` est dans `/var/www/htdocs/app/` et si une requête arrive pour `/app/products/widget`, la règle RewriteRule ne voit que `products/widget` — pas de barre oblique en tête, pas de préfixe `/app/`.

![Organigramme montrant la suppression du chemin, la substitution et le pipeline de RewriteBase dans un contexte de répertoire, avec trois résultats : un chemin relatif (préfixé par RewriteBase), un chemin absolu (utilisé tel quel) et un URI absolu (redirection externe)](_assets/rewrite_path_stripping.png)
*Figure :* Suppression du chemin dans un contexte de répertoire et pipeline de RewriteBase

Cela signifie que vous devez écrire vos motifs différemment en fonction de l’emplacement des règles :

| Emplacement de la règle | Règle |
| --- | --- |
| Section VirtualHost | `RewriteRule "^/app/products/(.+)$" "/app/shop.php?item=$1"` |
| .htaccess dans /var/www/htdocs/app/ | `RewriteRule "^products/(.+)$" "shop.php?item=$1"` |

Notez que la version pour `.htaccess` n’a de barre oblique de tête ni dans le motif, ni dans la substitution. Il s’agit de la source de confusion la plus courante avec la réécriture dans un contexte de répertoire.

Lorsqu’une substitution est effectuée dans un contexte de répertoire, httpd génère une nouvelle sous-requête interne avec l’URL réécrit en redémarrant le traitement de la requête depuis le début. Si la substitution est un chemin relatif, la directive [[13-directives/rewritebase|RewriteBase]] détermine le préfixe à ajouter au chemin d’URL. Ce mécanisme de sous-requête peut aussi être à l’origine d’un bouclage infini des règles — voir ci-après.

> [!WARNING]
> **Ne faites pas commencer vos motifs de .htaccess avec une barre oblique**
>
> Étant donné que le préfixe du répertoire (y compris la barre oblique de fin) est supprimé avant la mise en correspondance, les motifs dans un contexte de répertoire ne correspondront *jamais* avec une adresse commençant par une barre oblique. Un motif commençant par `^/` ne correspondra jamais dans ce contexte. Une règle telle que `RewriteRule "^/foo" ...` placée dans un fichier `.htaccess` échouera silencieusement à s’appliquer à quelque requête que ce soit.

Si vous devez faire une recherche de correspondance avec le chemin d’URL original complet (y compris le préfixe de répertoire), utilisez `%{REQUEST_URI}` dans une directive [[13-directives/rewritecond|RewriteCond]] :

```apache
RewriteCond "%{REQUEST_URI}" "^/admin/"
RewriteRule "^.*$" "-" [F]
```

## Quand avez-vous besoin de RewriteBase ?

Quand [[12-modules/mod_rewrite|mod_rewrite]] effectue une substitution dans un fichier `.htaccess`, il doit retransformer le résultat relatif en un chemin d’URL complet. La directive [[13-directives/rewritebase|RewriteBase]] lui indique quel préfixe il doit ajouter.

Par défaut, [[13-directives/rewritebase|RewriteBase]] est définie avec le chemin physique du fichier `.htaccess`. Dans la plupart des cas, cela correspond aux attentes, et vous n’avez pas besoin de la définir explicitement. Il y a cependant des situations où vous devrez le faire :

- **Alias ou lien symbolique :** Si le répertoire est atteint via une directive [[13-directives/alias|Alias]] ou un lien symbolique, le chemin d’URL et le chemin du système de fichiers diffèrent, et la directive [[13-directives/rewritebase|RewriteBase]] doit être définie avec le chemin d’URL.
- **Applications de sous-répertoire :** Avec les cadriciels PHP, il est courant de placer un fichier `.htaccess` dans un sous-répertoire (par exemple `/var/www/htdocs/myapp/`) et de router toutes les requêtes vers un contrôleur frontal :

```apache
# Dans /var/www/htdocs/myapp/.htaccess
RewriteEngine On
RewriteBase "/myapp/"
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "^(.*)$" "index.php" [L]
```

> [!NOTE]
> Dans ce cas particulier — routage de toutes les requêtes qui ne correspondent pas vers un contrôleur frontal — la directive [[11-guides/05-reecriture-mod-rewrite/quand-ne-pas-utiliser-mod-rewrite|FallbackResource]] est une alternative à mod\_rewrite plus simple et plus efficace.

Sans la ligne `RewriteBase "/myapp/"`, l’URL réécrit risque de se résoudre incorrectement, car [[12-modules/mod_rewrite|mod_rewrite]] ajouterait comme préfixe le chemin du système de fichiers au lieu du chemin d’URL.

Si vous utilisez des URLs absolus (commençant par `/` ou `http://`) dans vos substitutions, [[13-directives/rewritebase|RewriteBase]] n’aura aucun effet, car elle ne s’applique qu’aux substitutions relatives.

## Le drapeau \[L\] et les boucles infinies

Dans le contexte global du serveur, le drapeau `[L]` signifie « arrêter le traitement du jeu de règles ». Dans le contexte des fichiers `.htaccess`, il a une signification subtilement différente : « arrêter le traitement du jeu de règles *pour cette passe* ». Une fois la substitution effectuée, httpd traite à nouveau la requête depuis le début du jeu de règles — tout en appliquant à nouveau les règles du fichier `.htaccess`. Cela peut provoquer des boucles infinies.

![Organigramme montrant la manière dont le drapeau [L] provoque une boucle infinie dans un contexte de répertoire en déclenchant une sous-requête qui réexécute le jeu de règles](_assets/rewrite_l_flag_looping.png)
*Figure:* Risque de boucle infinie avec le drapeau \[L\] dans un contexte de répertoire

Considérez cette règle :

```apache
# Dans .htaccess - risque de boucle infinie !
RewriteRule "^(.*)$" "/index.php?q=$1" [L]
```

À la première passe, une requête pour `/hello` est réécrite en `/index.php?q=hello`. Puis la requête est traitée à nouveau, et là, `index.php` correspond encore à `^(.*)$`, et la requête est réécrite en `/index.php?q=index.php`. Ce processus continue jusqu’à ce que httpd atteigne sa limite de redirections internes et renvoie une erreur 500. Le message suivant sera alors enregistré dans le journal des erreurs :

```
AH00124: Request exceeded the limit of 10 internal redirects due to
probable configuration error. Use 'LimitInternalRecursion' to increase
the limit if necessary. Use 'LogLevel debug' to get a backtrace.
```

Il existe plusieurs méthodes pour interrompre la boucle infinie :

**Option 1 : utiliser le drapeau \[END\] (recommandé)**

```apache
RewriteRule "^(.*)$" "/index.php?q=$1" [END]
```

Le drapeau `[END]` (disponible depuis la version 2.3.9 de httpd) arrête *tout* processus de réécriture ultérieur, y compris les passes suivantes. Il s’agit de la méthode la plus propre pour prévenir les boucles infinies.

**Option 2 : ajouter une condition pour empêcher le traitement des URLs déjà réécrits**

```apache
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "^(.*)$" "/index.php?q=$1" [L]
```

Étant donné que `index.php` existe en tant que fichier, la condition `!-f` fait que la règle est sautée à la seconde passe.

**Option 3 : vérifier la variable THE\_REQUEST**

```apache
RewriteCond "%{THE_REQUEST}" "!index\.php"
RewriteRule "^(.*)$" "/index.php?q=$1" [L]
```

La variable `%{THE_REQUEST}` contient la requête originelle telle qu’elle a été envoyée par le client et non modifiée par [[12-modules/mod_rewrite|mod_rewrite]]. Sa vérification empêche la règle de s’appliquer aux URLs réécrits.

## RewriteMap ne peut pas être déclarée dans un fichier .htaccess

La directive [[13-directives/rewritemap|RewriteMap]] ne peut être déclarée que dans un contexte de serveur virtuel ou global au serveur, pas dans les fichiers `.htaccess` ou les sections [[13-directives/directory|<Directory>]]. Cependant, lorsqu’un mappage est déclaré dans la configuration globale du serveur, vous *pouvez* l’utiliser dans un fichier `.htaccess` :

```apache
# Dans httpd.conf ou dans un VirtualHost
RewriteMap product2id "txt:/etc/apache2/productmap.txt"
```

```apache
# Dans .htaccess - utilisation du mappage déclaré ci-avant
RewriteEngine On
RewriteRule "^product/(.+)$" "/prods.php?id=${product2id:$1|NOTFOUND}" [PT]
```

Cette restriction existe, car les fichiers `.htaccess` sont analysés pour chaque requête, et la répétition de l’initialisation du mappage (en particulier pour les types de mappage `dbm:`, `dbd:` et `prg:`) serait d’un coût prohibitif en ressources.

## Quels contextes peuvent accueillir des règles de réécriture ?

Les règles de réécriture sont prises en charge dans les contextes de répertoire (fichiers [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|.htaccess]] et sections [[13-directives/directory|<Directory>]] et [[13-directives/if|<If>]]).

Bien que les règles de réécriture soient syntaxiquement autorisées dans les sections [[13-directives/location|<Location>]] et [[13-directives/files|<Files>]] (et dans leurs équivalents avec expressions rationnelles), cela n’est pas pris en charge et ne devrait jamais être nécessaire. Les substitutions relatives, en particulier, sont susceptibles d’échouer dans ces contextes.

> [!WARNING]
> **Ces conteneurs modifient silencieusement le comportement des réécritures**
>
> Placer une règle [[13-directives/rewriterule|RewriteRule]] dans une section [[13-directives/directory|<Directory>]], [[13-directives/if|<If>]] ou [[13-directives/location|<Location>]] — même dans un [[13-directives/virtualhost|<VirtualHost>]] dans la configuration globale du serveur — fait silencieusement adopter un comportement de contexte de répertoire. Cela signifie que la barre oblique de tête est supprimée de l’URL avant la comparaison avec le motif, que les substitutions déclenchent une redirection interne (avec risque de boucle infinie), et que le drapeau [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[L)]] n’arrête plus strictement le traitement — utilisez plutôt le drapeau [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[END)]].

## Héritage des règles avec RewriteOptions

Par défaut, les règles de [[12-modules/mod_rewrite|mod_rewrite]] ne sont **pas héritées** par les sous-répertoires. Si vous définissez des règles dans `/var/www/htdocs/.htaccess`, elles ne s’appliqueront qu’au répertoire correspondant. Un fichier `.htaccess` dans un sous-répertoire contient initial un jeu de règles initial vide, à moins que vous n’activiez explicitement l’héritage.

La directive [[13-directives/rewriteoptions|RewriteOptions]] permet d’effectuer cette activation :

**`RewriteOptions Inherit`**

Les règles du contexte parent sont ajoutées à la fin du jeu de règles de l’enfant. Le traitement des règles de l’enfant est effectué en premier, suivi du traitement des règles du parent. Utilisez cette fonctionnalité lorsqu’un sous-répertoire doit ajouter ses propre règles, tout en gardant actives les règles du parent.

**`RewriteOptions InheritBefore`**

Identique à `Inherit`, excepté que les règles du parent sont traitées avant celles de l’enfant. Cela s’avère utile lorsque le parent définit un motif de contrôleur frontal et que l’enfant doit ajouter des exceptions. Disponible depuis la version 2.4.8 de httpd.

**`RewriteOptions InheritDown`**

Spécifiez cette option dans le parent pour que tous les contextes enfant héritent des règles du parent sans avoir à spécifier `Inherit`. Disponible depuis la version 2.4.8 de httpd.

**`RewriteOptions InheritDownBefore`**

Identique à `InheritDown`, excepté que les règles du parent sont traitées avant celles des enfants. Disponible depuis la version 2.4.8 de httpd.

**`RewriteOptions IgnoreInherit`**

Spécifiez cette option dans le contexte d’un enfant pour que ce dernier renonce à l’héritage qui avait été forcé par l’option `InheritDown` d’un parent. Disponible depuis la version 2.4.8 de httpd.

**`RewriteOptions MergeBase`**

Quand l’héritage est activé, la directive `RewriteBase` de chaque contexte s’applique aux règles définies dans ce contexte, au lieu que la directive `RewriteBase` de l’enfant s’applique à toutes les règles héritées. Disponible depuis la version 2.4.26 de httpd.

## Débogage des règles de réécriture dans les fichiers .htaccess

Lorsque les règles de réécriture dans les fichiers `.htaccess` ne fonctionnent pas comme vous le souhaitez, le journal des réécritures est votre meilleur ami. Activez-le avec le niveau approprié :

```apache
LogLevel alert rewrite:trace3
```

Avec cette directive, le journal des erreurs montre exactement comment chaque règle est traitée — à quoi les motifs ont été comparés, les conditions ont-elles été satisfaites ou non et quelles substitutions ont été effectuées. Le comportement du contexte de répertoire et la suppression d’une partie du chemin sera visible dans ces entrées du journal.

> [!WARNING]
> ne conservez pas à « trace » le niveau de journalisation sur un serveur en production. Il génère en effet un grand volume de données en sortie et affecte les performances.

## Mise en cache des « 301 redirects » au niveau du navigateur

Quand vous renvoyez une redirection `301 Moved Permanently` (via `[R=301]` ou `Redirect permanent`), le navigateur est autorisé à mettre en cache cette réponse indéfiniment. Cela signifie que même lorsque vous aurez corrigé une règle de redirection incorrecte dans votre configuration, les clients qui font à nouveau la même requête pourront se voir redirigés vers l’ancienne destination (incorrecte) sans jamais contacter à nouveau votre serveur.

Lors d’un débogage de règles de redirection, utilisez `[R=302]` (redirection temporaire) à la place de `[R=301]`. Ne repassez à 301 que lorsque vous avez confirmé que la règle est correcte. Si vous avez déjà renvoyé un code 301, les clients affectés devront vider le cache de leur navigateur (ou utiliser une fenêtre privée/incognito) pour voir un comportement correct.

> [!NOTE]
> Les moteurs de recherche mettent aussi en cache les redirections 301. Un code 301 incorrect peut prendre des jours ou des semaines avant d’être réexploré, même après que la configuration a été corrigée. C’est une autre raison pour laquelle il vaut mieux faire ses tests avec un code 302.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
