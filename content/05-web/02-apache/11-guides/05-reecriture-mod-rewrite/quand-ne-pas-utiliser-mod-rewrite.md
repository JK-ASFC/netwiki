---
title: "Quand ne pas utiliser mod_rewrite"
description: "Apache HTTP Server — Quand ne pas utiliser mod_rewrite. Ce document est un complément à la Documentation de référence de mod_rewrite. Il décrit peut-être un des concepts les plus importants à propos de mod_rewrite - à savoir, quand doit-on éviter de l'utiliser. mod_rewrite doit être considéré co"
tags: [apache, guide]
icon: book-open
---

Ce document est un complément à la [[12-modules/mod_rewrite|Documentation de référence]] de [[12-modules/mod_rewrite|mod_rewrite]]. Il décrit peut-être un des concepts les plus importants à propos de [[12-modules/mod_rewrite|mod_rewrite]] - à savoir, quand doit-on éviter de l'utiliser.

[[12-modules/mod_rewrite|mod_rewrite]] doit être considéré comme un dernier recours, lorsqu'aucune alternative n'est possible. Utiliser mod\_rewrite lorsqu'il existe des alternatives plus simples conduit à des configurations confuses, fragiles, et difficiles à maintenir. La compréhension des autres alternatives disponibles est une étape très importante sur le chemin de la maîtrise de [[12-modules/mod_rewrite|mod_rewrite]].

Vous devez vous attacher à comprendre le fonctionnement des exemples, car la plupart d'entre eux ne fonctionneront pas sur votre système si vous vous contentez de les copier/coller dans vos fichiers de configuration.

Le cas le plus courant dans lequel [[12-modules/mod_rewrite|mod_rewrite]] est l'outil approprié est la situation où la seule solution envisageable nécessite l'accès aux fichiers de configuration du serveur, alors que cet accès ne vous est pas accordé. Certaines directives de configuration ne sont disponibles que dans le fichier de configuration du serveur. Si vous ne pouvez agir que sur les fichiers .htaccess, vous devrez donc vous tourner vers [[12-modules/mod_rewrite|mod_rewrite]].

## Redirection simple

[[12-modules/mod_alias|mod_alias]] fournit les directives [[13-directives/redirect|Redirect]] et [[13-directives/redirectmatch|RedirectMatch]] qui permettent de rediriger une URL vers une autre. Plutôt que d'utiliser la directive [[13-directives/rewriterule|RewriteRule]] pour ce genre de redirection simple d'une URL ou d'une classe d'URLs vers une autre, on préfèrera l'utilisation de ces directives. En outre, avec `RedirectMatch`, vous pouvez inclure une expression rationnelle dans votre critère de redirection, ce qui vous permet de bénéficier de nombreux avantages de la directive `RewriteRule`.

Une utilisation courante de la directive `RewriteRule` est la redirection de toute une classe d'URLs. Par exemple, toutes les URLs faisant référence au répertoire `/un` doivent être redirigées vers `http://un.example.com/`, ou toutes les requêtes `http` doivent être redirigées vers `https`.

Pour ce faire, il est préférable d'utiliser la directive `Redirect`. Souvenez-vous que la directive `Redirect` conserve les informations relatives au chemin. En d'autres termes, la redirection d'une URL `/un` va aussi rediriger toutes les URLs de niveaux inférieurs comme `/un/deux.html` et `/un/trois/quatre.html`.

Pour rediriger les URLs sous `/un` vers `http://un.example.com/`, utilisez cette définition :

```apache
Redirect "/one/" "http://one.example.com/"
```

Pour rediriger un nom d'hôte vers un autre nom d'hôte, par exemple `example.com` vers `www.example.com`, voir la méthode [[11-guides/05-reecriture-mod-rewrite/redirection-et-remise-en-correspondance-avec-mod-rewrite|Noms d'hôtes canoniques]].

Pour rediriger les URLs `http` vers `https`, une directive [[13-directives/redirect|Redirect]] dans un serveur virtuel HTTP dédié est l’approche la plus propre. Voir la recette [[11-guides/05-reecriture-mod-rewrite/redirection-et-remise-en-correspondance-avec-mod-rewrite|Forcer HTTPS]] pour la configuration recommandée et l’alternative de [[12-modules/mod_rewrite|mod_rewrite]] pour l’utilisation des fichiers `.htaccess`.

> [!NOTE]
> **Ordre de traitement**
>
> Si vous mélangez des directives [[13-directives/redirect|Redirect]] et [[13-directives/rewriterule|RewriteRule]] dans le même contexte, sachez que leur ordre d’exécution dépend de l’emplacement où elles apparaissent. Dans un contexte de serveur virtuel ou global, c’est [[12-modules/mod_rewrite|mod_rewrite]] qui agit en premier, alors que dans un contexte de répertoire (fichiers `.htaccess`), c’est [[12-modules/mod_alias|mod_alias]]. Voir [[11-guides/05-reecriture-mod-rewrite/details-techniques-sur-le-module-apache-mod-rewrite|Ordre de traitement des modules]] pour les détails.

## Alias d'URL

La directive [[13-directives/alias|Alias]] permet de mettre en correspondance un chemin d’URL avec un répertoire, ce dernier étant en général situé en dehors de l'arborescence définie par la directive [[13-directives/documentroot|DocumentRoot]]. Bien qu'il soit possible d'effectuer cette mise en correspondance avec [[12-modules/mod_rewrite|mod_rewrite]], il est préférable d'utiliser la directive [[13-directives/alias|Alias]] pour des raisons de simplicité et de performances.

**Utilisation de la directive Alias**

```apache
Alias "/cats" "/var/www/virtualhosts/felines/htdocs"
```

Pour effectuer cette mise en correspondance, [[12-modules/mod_rewrite|mod_rewrite]] s'impose si vous n'avez pas accès aux fichiers de configuration du serveur. En effet, la directive Alias ne peut pas être utilisée dans un fichier `.htaccess`, mais seulement dans un contexte de serveur principal ou de serveur virtuel.

En outre, vous pouvez arriver au même résultat avec les liens symboliques, pourvu que `Options FollowSymLinks` soit activé sur votre serveur.

## Mandat simple

La directive [[13-directives/rewriterule|RewriteRule]] fournit le drapeau [[11-guides/05-reecriture-mod-rewrite/les-drapeaux-de-reecriture|[P)]] qui permet de faire passer les URIs réécrits par [[12-modules/mod_proxy|mod_proxy]].

```apache
RewriteRule "^/?images(.*)" "http://serveur-images.local/images$1" [P]
```

Cependant, dans les nombreux cas où aucune correspondance au modèle n'est vraiment nécessaire, comme dans l'exemple ci-dessus, il est préférable d'utiliser la directive [[13-directives/proxypass|ProxyPass]]. L'exemple précédent pourrait être remplacé par :

```apache
ProxyPass "/images/" "http://serveur-images.local/images/"
```

Que vous utilisiez [[13-directives/rewriterule|RewriteRule]] ou [[13-directives/proxypass|ProxyPass]], vous devrez dans tous les cas utiliser aussi la directive [[13-directives/proxypassreverse|ProxyPassReverse]] pour intercepter les redirections en provenance du serveur d'arrière-plan :

```apache
ProxyPassReverse "/images/" "http://serveur-images.local/images/"
```

Vous devrez cependant tout de même utiliser `RewriteRule` lorsque d'autres `RewriteRule`s se trouvent dans la même portée, car elles agissent en général avant les directives `ProxyPass`, et peuvent ainsi les court-circuiter.

[[13-directives/rewriterule|RewriteRule]] s’avère vraiment utile pour ne mandater les requêtes que si le contenu n’existe pas localement — par exemple, lors de la migration d’un serveur vers un autre :

```apache
RewriteCond "%{REQUEST_FILENAME}"       !-f
RewriteCond "%{REQUEST_FILENAME}"       !-d
RewriteRule "^/(.*)"                    "http://old.example.com/$1" [P]
ProxyPassReverse "/" "http://old.example.com/"
```

Dans cet exemple, les requêtes pour des ressources qui n’ont pas encore été migrées sont mandatées silencieusement vers l’ancien serveur. Lors de la migration du contenu, les fichiers locaux ont la priorité. N’oubliez pas de toujours inclure une directive [[13-directives/proxypassreverse|ProxyPassReverse]] pour être sûr que toute redirection effectuée par le serveur dorsal est correctement transmise au client.

## Test de variables d'environnement

[[12-modules/mod_rewrite|mod_rewrite]] est souvent utilisé pour effectuer une action en fonction de la présence ou de l'absence d'une variable d'environnement particulière ou d'un en-tête de requête, ce qui peut être accompli de manière plus efficace via la directive [[13-directives/if|<If>]].

Considérons par exemple le scénario courant où la directive `RewriteRule` est utilisée pour forcer un nom d'hôte canonique, tel que `www.example.com` au lieu de `example.com`. Il est possible d'utiliser à la place la directive [[13-directives/if|<If>]] comme suit :

```apache
<If "req('Host') != 'www.example.com'">
    Redirect "/" "http://www.example.com/"
</If>
```

On peut utiliser cette technique dans de nombreux scénarios courant pour remplacer [[12-modules/mod_rewrite|mod_rewrite]] pour effectuer des actions en fonction d'en-têtes de requêtes ou de réponses, ou de variables d'environnement.

Voir en particulier la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation sur l'évaluation des expressions]] pour une vue d'ensemble des types d'expressions que vous pouvez utiliser dans les sections [[13-directives/if|<If>]], ainsi que dans certaines directives.

## Contrôleur frontal / Routage des ressources

Une utilisation très courante de [[12-modules/mod_rewrite|mod_rewrite]] consiste à router toutes les requêtes pour des ressources non existantes vers un seul script de contrôle frontal (par exemple `index.php`). Il s’agit de la base du routage dans le cadre de la plus grande partie du web moderne.

L’approche typique avec [[12-modules/mod_rewrite|mod_rewrite]] est :

```apache
RewriteEngine On
RewriteCond "%{REQUEST_FILENAME}" !-f
RewriteCond "%{REQUEST_FILENAME}" !-d
RewriteRule "^(.*)$" "/index.php" [L]
```

Cette opération peut être effectuée beaucoup plus simplement avec la directive [[13-directives/fallbackresource|FallbackResource]] :

```apache
FallbackResource /index.php
```

La directive [[13-directives/fallbackresource|FallbackResource]] fait la même chose — les requêtes pour des fichiers et répertoires existants sont traitées normalement, toutes les autres étant routées vers la ressource spécifiée — mais sans la surcharge de travail et la complexité du moteur de réécriture. Elle fonctionne dans les deux contextes de configuration globale du serveur et des fichiers `.htaccess`.

Pour désactiver une `FallbackResource` définie dans un répertoire parent :

```apache
FallbackResource disabled
```

## Configuration conditionnelle avec des expressions rationnelles

Dans de nombreux cas, l’utilisation de [[13-directives/rewritecond|RewriteCond]] peut être remplacée par la directive [[13-directives/if|<If>]] qui prend en charge une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|syntaxe des expressions]] riche et s’intègre parfaitement avec les autres directives de httpd.

Redirection basée sur un élément de la chaîne de paramètres :

```apache
<If "%{QUERY_STRING} =~ /lang=fr/">
    Redirect "/welcome" "/bienvenue"
</If>
```

Restriction d’accès en fonction de la méthode de la requête :

```apache
<If "%{REQUEST_METHOD} IN {'DELETE', 'PUT', 'PATCH'}">
    Require ip 10.0.0.0/8
</If>
```

Blocage des requêtes qui ne comportent pas d’en-tête Host (clients HTTP/1.0) :

```apache
<If "-z req('Host')">
    Require all denied
</If>
```

Voir la [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|documentation sur l’évaluation des expressions]] pour une description complète de la syntaxe disponible dans les blocs [[13-directives/if|<If>]].

## Blocage du référencement à chaud (Hotlinking) d'images

**Description :**

Le référencement à chaud consiste pour les autres sites à inclure directement vos images dans leurs pages en utilisant votre bande passante pour servir des contenus pour le site de quelqu'un d'autre. Vous pouvez empêcher cela sans utiliser [[12-modules/mod_rewrite|mod_rewrite]].

**Solution :**

Utilisez la directive [[13-directives/setenvif|SetEnvIf]] avec la directive [[13-directives/require|Require]] :

```apache
SetEnvIf Referer example\.com localreferer
<FilesMatch "\.(jpg|png|gif)$">
    Require env localreferer
</FilesMatch>
```

**Discussion :**

Si vous avez besoin d’une logique plus complexe — comme servir une autre image aux référenceurs à chaud au lieu de rejeter la requête — vous aurez peut-être besoin de [[12-modules/mod_rewrite|mod_rewrite]]. Les exemples suivants s’appuient sur l’en-tête `HTTP_REFERER` qui est facultatif et peut être usurpé. La condition `!^$` autorise les requêtes qui ne comportent aucun en-tête Referer, de sorte que les utilisateurs qui saisissent l’URL directement, ou dont les navigateurs suppriment cet en-tête ne soient pas bloqués.

Rejeter purement et simplement la requête :

```apache
RewriteCond "%{HTTP_REFERER}"  "!^$"
RewriteCond "%{HTTP_REFERER}"  "!www.example.com" [NC]
RewriteRule "\.(gif|jpg|png)$" "-"                [F,NC]
```

Servir une image alternative :

```apache
RewriteCond "%{HTTP_REFERER}"  "!^$"
RewriteCond "%{HTTP_REFERER}"  "!www.example.com"      [NC]
RewriteRule "\.(gif|jpg|png)$" "/images/go-away.png"   [R,NC]
```

## Blocage des robots

**Description :**

Vous voulez bloquer les requêtes persistantes d’un robot particulier ou d’un agent utilisateur qui ignore votre `/robots.txt`.

**Solution :**

Utilisez la directive [[13-directives/setenvifnocase|SetEnvIfNoCase]] avec la directive [[13-directives/require|Require]] :

```apache
SetEnvIfNoCase User-Agent ^NameOfBadRobot goaway
<Location "/secret/files">
    <RequireAll>
        Require all granted
        Require not env goaway
    </RequireAll>
</Location>
```

**Discussion :**

Toute technique qui s’appuie sur la chaîne `USER_AGENT` peut être facilement contournée, car cette chaîne peut être modifiée par le client. Si vous subissez une attaque soutenue, vous devez la traiter à un niveau supérieur, par exemple au niveau de votre pare-feu.

Si vous devez combiner la recherche de correspondance par agent utilisateur et par adresse IP, [[12-modules/mod_rewrite|mod_rewrite]] peut être utilisé en remplacement :

```apache
RewriteCond "%{HTTP_USER_AGENT}"   "^NameOfBadRobot"
RewriteCond "%{REMOTE_ADDR}"       "=123\.45\.67\.[8-9]"
RewriteRule "^/secret/files/"      "-"                   [F]
```

## Interdire des hôtes dans une liste de rejets

**Description :**

Nous souhaitons établir une liste des hôtes auxquels nous voulons interdire l’accès à notre serveur.

**Solution :**

Pour un simple blocage basé sur l’adresse IP, utilisez la directive [[13-directives/require|Require]] directement :

```apache
<Location "/">
    Require all granted
    Require not ip 193.102.180.41
    Require not ip 192.76.162.40
</Location>
```

**Discussion :**

Si vous avez besoin d’une liste d’interdiction dynamique basée sur un fichier (plutôt que d’énumérer des adresses IP dans la configuration), vous pouvez utiliser [[12-modules/mod_rewrite|mod_rewrite]] et sa directive [[13-directives/rewritemap|RewriteMap]] :

```apache
RewriteEngine on
RewriteMap    hosts-deny  "txt:/path/to/hosts.deny"
RewriteCond   "${hosts-deny:%{REMOTE_ADDR}|NOT-FOUND}" "!=NOT-FOUND" [OR]
RewriteCond   "${hosts-deny:%{REMOTE_HOST}|NOT-FOUND}" "!=NOT-FOUND"
RewriteRule   "^"                                      "-"           [F]
```

Le fichier de mappage contient une entrée par ligne, avec une adresse IP ou un nom d’hôte comme clé et une valeur factice (parce que la directive [[13-directives/rewritemap|RewriteMap]] requiert des paires clé/valeur) :

```
##  hosts.deny
193.102.180.41 -
192.76.162.40  -
```

La seconde directive [[13-directives/rewritecond|RewriteCond]] présuppose que `HostnameLookups` est activé. Dans le cas contraire, supprimer-la, ainsi que le drapeau `[OR]` de la première condition.

## Serveurs virtuels

Bien qu’il soit possible de gérer les [[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|serveurs virtuels avec mod_rewrite]], il s’agit rarement de la bonne méthode. Le bon choix consiste pratiquement toujours à créer des blocs [[13-directives/virtualhost|<VirtualHost>]] individuels. Si vous devez gérer un très grand nombre de serveurs virtuels, choisissez plutôt d’utiliser [[12-modules/mod_vhost_alias|mod_vhost_alias]] pour créer ces hôtes automatiquement.

Des modules tels que [[12-modules/mod_macro|mod_macro]] permettent aussi de créer un grand nombre de serveurs virtuels dynamiquement.

Utiliser [[12-modules/mod_rewrite|mod_rewrite]] pour la création de serveurs virtuels peut convenir si vous utilisez un service d’hébergement qui ne vous permet pas d’accéder aux fichiers de configuration du serveur, et que vous soyez par conséquent contraint d’utiliser des fichiers `.htaccess`.

Voir le document [[11-guides/05-reecriture-mod-rewrite/hebergement-virtuel-de-masse-avec-mod-rewrite|les serveurs virtuels avec mod_rewrite]] pour plus de détails sur la manière de procéder si cette approche vous semble encore être la bonne.

## Répartition de charge

**Description :**

Nous souhaitons répartir la charge entre plusieurs serveurs dorsaux.

**Solution :**

Utilisez le module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] qui fournit une solution de répartition de charge flexible et totalement fonctionnelle. Il prend en charge plusieurs algorithmes de répartition, la persistance de session, les contrôles de bon fonctionnement et une configuration dynamique avec le gestionnaire de répartition de charge (Balancer Manager) — toutes choses impossibles avec l’approche de [[12-modules/mod_rewrite|mod_rewrite]].

```apache
<Proxy "balancer://mycluster">
    BalancerMember "http://one.example.com"
    BalancerMember "http://two.example.com"
    BalancerMember "http://three.example.com"
</Proxy>
ProxyPass        "/"  "balancer://mycluster/"
ProxyPassReverse "/"  "balancer://mycluster/"
```

**Discussion :**

Il est possible de mettre en œuvre une répartition de charge aléatoire rudimentaire en utilisant [[12-modules/mod_rewrite|mod_rewrite]] et une directive [[13-directives/rewritemap|RewriteMap]] de type `rnd` :

```apache
RewriteEngine on
RewriteMap  lb       "rnd:/path/to/serverlist.txt"
RewriteRule "^/(.*)" "http://${lb:servers}/$1"     [P,L]
```

[[12-modules/mod_proxy_balancer|mod_proxy_balancer]] est cependant beaucoup plus flexible et fonctionnel que tout ce que vous pourrez « bricoler » en utilisant [[12-modules/mod_rewrite|mod_rewrite]], et correspond à l’approche recommandée.

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module mod_rewrite]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
