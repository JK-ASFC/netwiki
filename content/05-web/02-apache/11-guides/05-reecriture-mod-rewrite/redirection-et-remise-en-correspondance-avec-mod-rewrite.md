---
title: "Redirection et remise en correspondance avec mod_rewrite"
description: "Apache HTTP Server — Redirection et remise en correspondance avec mod_rewrite. Ce document est un complément à la Documentation de référence de mod_rewrite. Il montre comment utiliser mod_rewrite pour rediriger et remettre en correspondance une requête. Il contient de nombreux exemples d'utilisation courante de mod_re"
tags: [apache, guide]
icon: book-open
---

Ce document est un complément à la [[12-modules/mod_rewrite|Documentation de référence]] de [[12-modules/mod_rewrite|mod_rewrite]]. Il montre comment utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour rediriger et remettre en correspondance une requête. Il contient de nombreux exemples d'utilisation courante de [[12-modules/mod_rewrite|mod_rewrite]] avec une description détaillée de leur fonctionnement.

## De l'ancienne à la nouvelle URL (en interne)

**Description :**

Supposons que nous ayons récemment renommé la page `foo.html` en `bar.html`, et voulions maintenant que l'ancienne URL soit toujours valide à des fins de compatibilité ascendante. En fait, on voudrait que le changement de nom soit transparent aux utilisateurs de l'ancienne URL.

**Solution :**

On réécrit l'ancienne URL en interne vers la nouvelle via la règle suivante :

```apache
RewriteEngine  on
RewriteRule    "^/foo\.html$" "/bar.html" [PT]
```

## Forcer HTTPS

**Description :**

Rediriger toutes les requêtes HTTP vers HTTPS. C’est un des emplois les plus courants de [[12-modules/mod_rewrite|mod_rewrite]], mais dans la plupart des cas, on y parvient d’une meilleur façon sans lui.

**Solution :**

L’approche préférée utilise une directive [[13-directives/redirect|Redirect]] dans un serveur virtuel HTTP dédié :

```apache
<VirtualHost *:80>
    ServerName www.example.com
    Redirect permanent "/" "https://www.example.com/"
</VirtualHost>

<VirtualHost *:443>
    ServerName www.example.com
    # ... emplacement de la configuration SSL
</VirtualHost>
```

**Explication :**

Si vous n’avez pas accès à la configuration du serveur et devez utiliser un fichier `.htaccess`, [[12-modules/mod_rewrite|mod_rewrite]] sera l’outil approprié :

```apache
RewriteEngine On
RewriteCond "%{HTTPS}" !=on
RewriteRule "^(.*)" "https://%{SERVER_NAME}$1" [R=301,L]
```

La variable `%{HTTPS}` est définie à `on` si la connexion utilise SSL/TLS, et est vide ou à `off` dans le cas contraire. Utiliser `R=301` produit une redirection permanente qui signale aux moteurs de recherche qu’ils doivent mettre leur index à jour.

Voir aussi le document [[11-guides/05-reecriture-mod-rewrite/quand-ne-pas-utiliser-mod-rewrite|Quand ne pas utiliser mod_rewrite]] pour plus de discussions à propos de l’approche `Redirect`.

> [!NOTE]
> **Derrière un répartiteur de charge ou un terminateur SSL**
>
> La variable `%{HTTPS}` n’est pas une variable d’environnement à usage général — elle interroge directement [[12-modules/mod_ssl|mod_ssl]]. Si la terminaison SSL/TLS est effectuée au niveau d'un répartiteur de charge ou d'un mandataire inverse en amont, [[12-modules/mod_ssl|mod_ssl]] ne gère pas la connexion et `%{HTTPS}` indiquera toujours `off`, même si le client originel s’est connecté en HTTPS.
>
> Dans cette situation, il faut plutôt consulter l’en-tête défini par le mandataire en amont. La plupart des répartiteurs de charge définissent `X-Forwarded-Proto` :

```apache
RewriteEngine On
RewriteCond "%{HTTP:X-Forwarded-Proto}" =http [NC]
RewriteRule "^(.*)" "https://%{SERVER_NAME}$1" [R=301,L]
```

> [!WARNING]
> Ne faites confiance à `X-Forwarded-Proto` que si vous contrôlez le mandataire en amont et qu'il écrase l'en-tête à chaque requête. Un attaquant pourrait corrompre cet en-tête en se connectant directement à votre serveur. Assurez-vous de restreindre l’accès de façon que seul votre répartiteur de charge puisse atteindre le serveur dorsal, ou utilisez [[12-modules/mod_remoteip|mod_remoteip]] pour valider la source.

## Exempter les requêtes de défi ACME de la redirection HTTPS

**Description :**

Vous avez forcé tout le trafic à s’effectuer en HTTPS (comme ci-avant), mais votre client ACME (Let's Encrypt, Certbot, etc.) nécessite un accès en HTTP à `/.well-known/acme-challenge/` pour achever la validation du domaine.

**Solution :**

Placer une exception *avant* la règle de redirection HTTPS :

```apache
RewriteEngine On
RewriteRule "^/\.well-known/acme-challenge/" - [L]
RewriteCond "%{HTTPS}" !=on
RewriteRule "^(.*)" "https://%{SERVER_NAME}$1" [R=301,L]
```

**Explication :**

La substitution matérialisée par un tiret (`-`) signifie « ne pas réécrire ». En combinaison avec le drapeau `[L]`, elle arrête le traitement des règles pour toute requête correspondant au chemin du défi ACME, permettant à cette dernière d’être servie en HTTP. Le traitement de toutes les autres requêtes continue avec la règle suivante et les redirige vers HTTPS de la manière habituelle.

Si vous adoptez l’approche par la directive [[13-directives/redirect|Redirect]] dans un serveur virtuel dédié au port 80, utilisez les directives [[13-directives/alias|Alias]] et [[13-directives/redirectmatch|RedirectMatch]] à la place :

```apache
<VirtualHost *:80>
    ServerName www.example.com

    # Permettre les défis ACME sur HTTP
    Alias "/.well-known/acme-challenge/" "/var/www/acme/.well-known/acme-challenge/"
    <Directory "/var/www/acme/.well-known/acme-challenge">
        Require all granted
    </Directory>

    # Tout le reste est redirigé vers HTTPS
    RedirectMatch permanent "^/(?!\.well-known/acme-challenge/)(.*)$" "https://www.example.com/$1"
</VirtualHost>
```

## Normalisation de la barre oblique de fin

**Description :**

Vous souhaitez que les URLs pour des répertoires se terminent toujours par une barre oblique ou, au contraire, que ce ne soit jamais le cas. Il s’agit d’un prérequis courant pour SEO et pour la gestion cohérente des URLs par les applications web.

**Solution :**

Pour ajouter une barre oblique de fin aux URLs qui correspondent à des répertoires :

```apache
RewriteCond "%{REQUEST_FILENAME}" -d
RewriteCond "%{REQUEST_URI}" "!/$"
RewriteRule "^(.*)$" "$1/" [R=301,L]
```

Pour supprimer la barre oblique de fin (sauf pour les véritables répertoires) :

```apache
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteCond "%{REQUEST_URI}" "(.+)/$"
RewriteRule "^" "%1" [R=301,L]
```

**Explication :**

Le module [[12-modules/mod_dir|mod_dir]] de httpd gère déjà les redirections de barre oblique de fin pour les véritables répertoires lorsque la directive [[13-directives/directoryslash|DirectorySlash]] est activée (elle l’est par défaut). Vous n’avez besoin que d’une règle de [[12-modules/mod_rewrite|mod_rewrite]] si vous souhaitez imposer un comportement pour les barres obliques de fin pour les URLs qui ne correspondent pas à de véritables répertoires sur disque, ou si vous voulez supprimer des barres obliques de fin.

## Contrôleur frontal / Routage d’pplication

La plupart des cadriciels web modernes routent toutes les requêtes vers un seul point d’entrée : le contrôleur frontal (« front controller »). La directive [[13-directives/fallbackresource|FallbackResource]] gère cela plus simplement et efficacement que [[12-modules/mod_rewrite|mod_rewrite]]. Voir le document [[11-guides/05-reecriture-mod-rewrite/quand-ne-pas-utiliser-mod-rewrite|Quand ne pas utiliser mod_rewrite]] pour l’approche recommandée.

Si vous avez réellement besoin de [[12-modules/mod_rewrite|mod_rewrite]] pour cela (par exemple, pour ajouter des conditions plus complexes que « fichier non existant »), consultez le document [[11-guides/05-reecriture-mod-rewrite/reecritures-au-niveau-repertoire|Réécritures par répertoire]] pour un exemple annoté qui illustre aussi l’utilisation de la directive [[13-directives/rewritebase|RewriteBase]].

## De l'ancien au nouveau (en externe)

**Description :**

Supposons toujours que nous ayons récemment renommé la page `foo.html` en `bar.html`, et voulions maintenant que l'ancienne URL soit toujours valide à des fins de compatibilité ascendante. En revanche, nous voulons cette fois que la nouvelle URL soit suggérée aux utilisateurs de l'ancienne URL, c'est à dire que l'adresse vue depuis leur navigateur doit également être modifiée.

**Solution :**

On force une redirection HTTP vers la nouvelle URL, ce qui entraîne une modification de celle du navigateur et aussi de ce que voit l'utilisateur :

```apache
RewriteEngine  on
RewriteRule    "^foo\.html$"  "bar.html"  [R]
```

**Explication**

Dans l'exemple interne, on a utilisé [[12-modules/mod_rewrite|mod_rewrite]] afin de dissimuler la redirection au client. Dans cet exemple, en revanche, on aurait pu se contenter d'une directive Redirect :

```apache
Redirect "/foo.html" "/bar.html"
```

## Ressource déplacée vers un autre serveur

**Description :**

Si une ressource a été déplacée vers un autre serveur, vous pouvez faire en sorte que les URLs de l'ancien serveur continuent de fonctionner pendant un certain temps, afin de laisser au utilisateurs le temps de modifier leurs favoris.

**Solution :**

Vous pouvez utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour rediriger ces URLs vers le nouveau serveur, mais vous pouvez aussi utiliser les directives Redirect ou RedirectMatch.

```apache
#Avec mod_rewrite
RewriteEngine on
RewriteRule   "^/docs/(.+)"  "http://nouveau.example.com/docs/$1"  [R,L]
```

```apache
#Avec RedirectMatch
RedirectMatch "^/docs/(.*)" "http://nouveau.example.com/docs/$1"
```

```apache
#Avec Redirect
Redirect "/docs/" "http://nouveau.example.com/docs/"
```

**Explication :**

Pour une simple redirection vers un autre serveur, il est préférable d’utiliser les directives [[13-directives/redirect|Redirect]] ou [[13-directives/redirectmatch|RedirectMatch]], car elles sont plus simples et plus efficaces.

## Compatibilité ascendante dans le cadre d'une modification d'extension de nom de fichier

**Description :**

Comment conférer une compatibilité ascendante aux URLs (existant encore virtuellement) après avoir migré `document.YYYY` vers `document.XXXX`, c'est à dire après avoir par exemple traduit un lot de fichiers `.html` en fichiers `.php` ?

**Solution :**

L’URL n’est réécrite en remplaçant l’ancienne extension par la nouvelle que si le fichier cible avec la nouvelle extension existe et si le fichier originel avec l’ancienne extension n’existe pas. Sinon, l’URL reste inchangée.

```apache
#   jeu de règles assurant une compatibilité ascendante en réécrivant
#   document.html en document.php si et seulement si document.php
#   existe
<Directory "/var/www/htdocs">
    RewriteEngine on
    RewriteBase "/var/www/htdocs"

    RewriteCond "$1.php" -f
    RewriteCond "$1.html" !-f
    RewriteRule "^(.*).html$" "$1.php"
</Directory>
```

**Explication**

Cet exemple utilise une fonctionnalité souvent méconnue de [[12-modules/mod_rewrite|mod_rewrite]], en tirant avantage de l'ordre d'exécution du jeu de règles. En particulier, [[12-modules/mod_rewrite|mod_rewrite]] évalue la partie gauche des règles de réécriture avant d'évaluer les directives RewriteCond. En conséquence, $1 est déjà défini au moment où les directives RewriteCond sont évaluées. Ceci nous permet de tester l'existence du fichier original (`document.html`) et du fichier cible (`document.php`) en utilisant le même nom de base.

Ce jeu de règles est conçu pour une utilisation dans un contexte de répertoire (au sein d'une section \<Directory\> ou d'un fichier .htaccess), de façon à ce que les vérifications `-f` effectuent leurs recherches dans le bon répertoire. Vous serez peut-être amené à définir une directive [[13-directives/rewritebase|RewriteBase]] pour spécifier le répertoire de base à partir duquel vous travaillez.

## Noms d'hôtes canoniques

**Description :**

Le but de cette règle est de préférer l'utilisation d'un nom d'hôte particulier à d'autres noms d'hôte utilisables pour atteindre le même site. Par exemple, si vous voulez utiliser **www.example.com** à la place de **example.com**, vous pouvez utiliser une solution du style :

**Solution :**

Pour y parvenir, il vaut mieux se passer de [[12-modules/mod_rewrite|mod_rewrite]], et utiliser plutôt la directive [[13-directives/redirect|Redirect]] dans une section de serveur virtuel pour le/les noms d'hôte non canoniques.

```apache
<VirtualHost *:80>
  ServerName undesired.example.com
  ServerAlias example.com notthis.example.com

  Redirect "/" "http://www.example.com/"
</VirtualHost>

<VirtualHost *:80>
  ServerName www.example.com
</VirtualHost>
```

Vous pouvez aussi utiliser la directive [[13-directives/if|<If>]] (versions 2.4 et ultérieures) :

```apache
<If "%{HTTP_HOST} != 'www.example.com'">
    Redirect "/" "http://www.example.com/"
</If>
```

Ou, par exemple, pour rediriger une portion de votre site vers HTTPS :

```apache
<If "%{SERVER_PROTOCOL} != 'HTTPS'">
    Redirect "/admin/" "https://www.example.com/admin/"
</If>
```

Si, pour une raison particulière, vous voulez tout de même utiliser [[12-modules/mod_rewrite|mod_rewrite]] - dans le cas, par exemple, où vous avez besoin d'un jeu plus important de règles de réécritures - vous pouvez utiliser la recette suivante :

Pour les sites écoutant sur un port autre que 80:

```apache
RewriteCond "%{HTTP_HOST}"   "!^www\.example\.com" [NC]
RewriteCond "%{HTTP_HOST}"   "!^$"
RewriteCond "%{SERVER_PORT}" "!^80$"
RewriteRule "^/?(.*)"         "http://www.example.com:%{SERVER_PORT}/$1" [L,R,NE]
```

Et pour un site écoutant sur le port 80

```apache
RewriteCond "%{HTTP_HOST}"   "!^www\.example\.com" [NC]
RewriteCond "%{HTTP_HOST}"   "!^$"
RewriteRule "^/?(.*)"         "http://www.example.com/$1" [L,R,NE]
```

Si vous souhaitez que cette règle s'applique à tous les noms de domaine - en d'autres termes, si vous voulez rediriger **example.com** vers **www.example.com** pour toutes les valeurs possibles de **example.com**, vous pouvez utiliser le jeu de règles suivants :

Pour faire l’inverse — supprimer le préfixe `www.` — inversez la condition :

```apache
RewriteCond "%{HTTP_HOST}" "^www\.(.+)$"              [NC]
RewriteRule "^(.*)"        "http://%1/$1"             [L,R,NE]
```

Pour ajouter de manière générique `www.` à tout nom d’hôte :

```apache
RewriteCond "%{HTTP_HOST}" "!^www\." [NC]
RewriteCond "%{HTTP_HOST}" "!^$"
RewriteRule "^/?(.*)" "http://www.%{HTTP_HOST}/$1" [L,R,NE]
```

Vous pouvez utiliser ce jeu de règles aussi bien dans le fichier de configuration de votre serveur principal que dans un fichier `.htaccess` placé dans le répertoire défini par la directive [[13-directives/documentroot|DocumentRoot]] du serveur.

**Explication :**

Si vous avez accès à la configuration globale du serveur, une directive [[13-directives/redirect|Redirect]] dans un `<serveur virtuel>` dédié constitue l’approche la plus propre. Mettre sous forme canonique le nom d’hôte permet de s’assurer que les moteurs de recherche traiterons votre site comme une seule entité, et évite les problèmes de portée de cookie qui surviennent lorsqu’un même site est accessible sous plusieurs noms.

N’utilisez la directive [[13-directives/if|<If>]] et [[12-modules/mod_rewrite|mod_rewrite]] comme compromis que si vous êtes contraint d’utiliser un fichier `.htaccess`.

## Recherche de pages dans plus d'un répertoire

**Description:**

Une ressource peut exister dans plusieurs répertoires, et nous voulons rechercher cette ressource dans ces répertoires lorsqu'elle fait l'objet d'une requête. Il est possible que nous ayons récemment réorganisé la structure de notre site en répartissant son contenu dans plusieurs répertoires.

**Solution :**

Le jeu de règles suivant recherche la ressource dans deux répertoires, et s'il ne la trouve dans aucun des deux, il tentera simplement de la servir à partir de l'adresse fournie dans la requête.

```apache
RewriteEngine on

#   on cherche tout d'abord dans dir1/...
#   ... et si on trouve, on est content et on arrête :
RewriteCond         "%{DOCUMENT_ROOT}/dir1/%{REQUEST_URI}"  -f
RewriteRule  "^(.+)"  "%{DOCUMENT_ROOT}/dir1/$1"  [L]

#   on cherche ensuite dans dir2/...
#   ... et si on trouve, on est content et on arrête :
RewriteCond         "%{DOCUMENT_ROOT}/dir2/%{REQUEST_URI}"  -f
RewriteRule  "^(.+)"  "%{DOCUMENT_ROOT}/dir2/$1"  [L]

#   sinon, on continue la recherche avec d'autres directives Alias
#   ou ScriptAlias, etc...
RewriteRule   "^"  "-"  [PT]
```

**Explication :**

Ce qui précède s’avère utile pendant les migrations lorsque le contenu est déplacé d’un répertoire vers un autre. Pour une configuration permanente, utilisez plutôt la directive [[13-directives/alias|Alias]] ou des liens symboliques.

## URLs canoniques

**Description :**

Sur certains serveurs, une ressource peut posséder plusieurs URLs. Il y a en général les URLs canoniques (celles qui sont réellement distribuées et utilisées), et celles qui correspondent à des raccourcis, les URLs internes, etc... Quelle que soit l'adresse que l'utilisateur fournit dans la requête, il devrait finalement voir l'URL canonique dans la barre d'adresse de son navigateur.

**Solution :**

Nous effectuons une redirection HTTP externe pour toutes les URLs non canoniques afin de les corriger dans la barre d'adresse du navigateur, et ceci pour toutes les requêtes futures. Dans le jeu de règles suivant, nous remplaçons `/matous` et `/minettes` par le canonique `/chats`.

```apache
RewriteRule   "^/(matous|minettes)/(.*)"    "/chats/$2"  [R]
```

**Discussion :**

On serait mieux inspiré d'utiliser ici les directives Redirect ou RedirectMatch :

```apache
RedirectMatch "^/(matous|minettes)/(.*)" "/chats/$2"
```

## Déplacement du répertoire `DocumentRoot`

**Description :**

En général, le répertoire [[13-directives/documentroot|DocumentRoot]] du serveur web correspond à l'URL "`/`". Ce répertoire ne contient cependant pas forcément des ressources de première importance pour l'utilisateur. Par exemple, vous préférerez peut-être que le répertoire d'accueil d'un visiteur accédant pour la première fois à votre site soit un répertoire particulier `/a-propos-de/`. Pour y parvenir, utilisez le jeu de règles suivant :

**Solution :**

On redirige l'URL `/` vers `/a-propos-de/` :

```apache
RewriteEngine on
RewriteRule   "^/$"  "/a-propos-de/"  [R]
```

Notez que l'on peut aussi y parvenir en utilisant la directive [[13-directives/redirectmatch|RedirectMatch]] :

```apache
RedirectMatch "^/$" "http://example.com/a-propos-de/"
```

Notez aussi que cet exemple ne réécrit que l'URL racine. En d'autres termes, il réécrit une requête pour `http://example.com/`, mais pas pour une requête `http://example.com/page.html`. Si vous avez effectivement modifié la racine de vos documents - c'est à dire si **tous** vos contenus se trouvent dans un sous-répertoire, il est largement préférable de modifier simplement votre directive [[13-directives/documentroot|DocumentRoot]], ou de déplacer l'ensemble du contenu vers le répertoire supérieur, plutôt que de réécrire les URLs.

## Rewrite query string

**Description :**

Vous voulez extraire une valeur particulière d'une chaîne de paramètres d'une URL, et soit la remplacer, soit l'incorporer dans un autre composant de l'URL.

**Solutions :**

Dans la plupart des solutions de cette section, on utilise la même condition qui stocke la valeur recherchée dans la référence arrière %2. %1 est le début de la requête, et %3 ce qui reste. Cette condition est un peu complexe car elle introduit de la flexibilité et évite les doubles perluettes '&&' dans les substitutions.

- Cette solution supprime le couple clé/valeur recherché :

  ```apache
  # Remove mykey=???
  RewriteCond "%{QUERY_STRING}" "(.*(?:^|&))mykey=([^&]*)&?(.*)&?$"
  RewriteRule "(.*)" "$1?%1%3"
  ```
- Cette solution remplace la partie de l'URL qui suit la valeur recherchée par un '?' :

  ```apache
  # Copy from query string to PATH_INFO
  RewriteCond "%{QUERY_STRING}" "(.*(?:^|&))mykey=([^&]*)&?(.*)&?$"
  RewriteRule "(.*)" "$1/products/%2/?" [PT]
  ```
- Cette solution utilise la valeur recherchée dans une deuxième condition ::

  ```apache
  # Capture the value of mykey in the query string
  RewriteCond "%{QUERY_STRING}" "(.*(?:^|&))mykey=([^&]*)&?(.*)&?$""
  RewriteCond "%2" !=not-so-secret-value
  RewriteRule "(.*)" - [F]
  ```
- Cette solution produit l'effet inverse des précédentes ; elle copie des composantes du chemin (peut-être PATH\_INFO) depuis l'URL vers sa chaîne de paramètres :

  ```apache
  # The desired URL might be /products/kitchen-sink, and the script expects
  # /path?products=kitchen-sink.
  RewriteRule "^/?path/([^/]+)/([^/]+)" "/path?$1=$2" [PT]
  ```

**Explication :**

Voir aussi les drapeaux [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[QSA)]] et [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[QSD)]] qui permettent de contrôler si la chaîne de paramètres originelle est ajoutée à la fin de la substitution ou supprimée de cette dernière.

## Répertoires utilisateur structurés

**Description :**

Certains sites avec plusieurs milliers d’utilisateurs possèdent une organisation structurée des répertoires utilisateur, c’est-à-dire que chaque répertoire utilisateur est dans un sous-répertoire qui commence (par exemple) par le premier caractère du nom de l’utilisateur. Ainsi, `/~larry/anypath` correspond à `/home/l/larry/public_html/anypath` et `/~waldo/anypath` à `/home/w/waldo/public_html/anypath`.

**Solution :**

Nous utilisons le jeu de règles suivant pour développer les URLs avec tilde selon l’organisation ci-dessus.

```apache
RewriteEngine on
RewriteRule   "^/~(([a-z])[a-z0-9]+)(.*)"  "/home/$2/$1/public_html$3"
```

**Explication :**

Cette technique est principalement utile pour les environnements d’hébergement de grande capacité avec plusieurs milliers d’utilisateurs. Pour la plupart des sites, [[12-modules/mod_userdir|mod_userdir]] gère les URLs utilisateur avec tilde sans avoir besoin de [[12-modules/mod_rewrite|mod_rewrite]].

## Redirection vers une ancre

**Description :**

Par défaut, la redirection vers une ancre HTML ne fonctionne pas, car [[12-modules/mod_rewrite|mod_rewrite]] échappe le caractère `#` en le remplaçant par `%23`, ce qui casse la redirection.

**Solution :**

Utiliser le drapeau `[NE]` dans la règle `RewriteRule`. NE signifie « No Escape ».

**Explication :**

Bien entendu, cette technique fonctionne aussi pour d’autres caractères spéciaux que [[12-modules/mod_rewrite|mod_rewrite]] encode par défaut pour les URLs.

## Réécriture dépendant du temps

**Description :**

Nous voulons utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour servir des contenus différents en fonction de l’heure du jour.

**Solution :**

Il esixte de nombreuses variables nommées `TIME_xxx` à utiliser dans les conditions de réécriture. En combinaison avec les motifs de comparaison lexicographique spéciaux `<STRING`, `>STRING` et `=STRING`, nous pouvons configurer des redirections dépendant du temps :

```apache
RewriteEngine on
RewriteCond   "%{TIME_HOUR}%{TIME_MIN}" >0700
RewriteCond   "%{TIME_HOUR}%{TIME_MIN}" <1900
RewriteRule   "^foo\.html$"             "foo.day.html" [L]
RewriteRule   "^foo\.html$"             "foo.night.html"
```

Cette configuration sert le contenu de `foo.day.html` sous l’URL `foo.html` de `07:01` à `18:59` et le contenu de `foo.night.html` pendant le temps restant.

> [!WARNING]
> [[12-modules/mod_cache|mod_cache]], les mandataires intermédiaires et les navigateurs peuvent chacun mettre en cache les réponses et provoquer de ce fait l’affichage d’une page en dehors de la fenêtre de temps configurée. [[12-modules/mod_expires|mod_expires]] permet de contrôler cet effet. Il est bien entendu préférable de simplement servir le contenu de manière dynamique et de le personnaliser en fonction de l’heure du jour.

**Explication :**

Servir du contenu dynamique par l’intermédiaire de votre application constitue pratiquement toujours une meilleure approche. La mise en cache par les navigateurs, les mandataires et [[12-modules/mod_cache|mod_cache]] rend la réécriture en fonction du temps non fiable en pratique.

## Régénération du contenu à la volée

**Description :**

Nous voulons générer dynamiquement du contenu, mais le stocker ensuite statiquement. La règle suivante va vérifier si le fichier statique existe, et le générer dans le cas contraire. Les fichiers statiques peuvent être supprimés périodiquement, si souhaité (par exemple via cron) et seront régénérés à la demande.

**Solution :**

Pour ce faire, on utilise le jeu de règles suivant :

```apache
# Cet exemple n’est valable que dans un contexte de répertoire
RewriteCond "%{REQUEST_URI}"   !-U
RewriteRule "^(.+)\.html$"     "/regenerate_page.cgi"   [PT,L]
```

L’opérateur `-U` détermine si la chaîne de test (dans ce cas `REQUEST_URI`) est un URL valable. Il effectue cette opération via une sous-requête. Si cette sous-requête échoue — autrement dit, si la ressource demandée n’existe pas — cette règle invoque le programme CGI `/regenerate_page.cgi` qui va générer la ressource demandée et la sauvegarder dans le répertoire des documents de sorte qu’une copie statique puissent en être servie la prochaine fois qu’elle sera demandée.

Ainsi, les documents qui ne sont pas souvent mis à jour peuvent être servis sous forme statique. Si ces documents doivent être rafraîchis, ils peuvent être supprimés du répertoire des documents ; ils seront alors régénérés la prochaine fois qu’ils seront demandés.

**Explication :**

Les approches modernes telles que [[12-modules/mod_cache|mod_cache]], les couches de mise en cache CDN ou la mise en cache au niveau de l’application fournissent des solutions plus robustes et configurables pour servir du contenu statique pré-généré. Le test de la sous-requête de l’opérateur `-U` utilisé ici induit un coût en performance à chaque requête.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
