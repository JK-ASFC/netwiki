---
title: "Hébergement virtuel de masse avec mod_rewrite"
description: "Apache HTTP Server — Hébergement virtuel de masse avec mod_rewrite. Ce document est un complément à la documentation de référence du module mod_rewrite. Il décrit comment créer des serveurs virtuels dynamiquement configurés en utilisant mod_rewrite. WARNING L'utilisation de mod_rewrite n'est en général pas"
tags: [apache, guide]
icon: book-open
---

Ce document est un complément à la [[12-modules/mod_rewrite|documentation de référence]] du module [[12-modules/mod_rewrite|mod_rewrite]]. Il décrit comment créer des serveurs virtuels dynamiquement configurés en utilisant [[12-modules/mod_rewrite|mod_rewrite]].

> [!WARNING]
> L'utilisation de [[12-modules/mod_rewrite|mod_rewrite]] n'est en général pas la meilleure méthode pour configurer des serveurs virtuels. Vous devez dans un premier temps tenter de résoudre votre problème via ces [[11-guides/03-serveurs-virtuels/hebergement-virtuel-de-masse-configure-dynamiquement|d'autres méthodes]] avant d'avoir recours à [[12-modules/mod_rewrite|mod_rewrite]]. Voir aussi le document [[11-guides/05-reecriture-mod-rewrite/quand-ne-pas-utiliser-mod-rewrite|Comment éviter il'utilisation de mod_rewrite]].

## Serveurs virtuels pour des noms d'hôtes arbitraires

**Description :**

Nous voulons créer automatiquement un serveur virtuel pour tout nom d'hôte qui peut être résolu dans notre domaine, sans avoir à créer de nouvelle section VirtualHost.

Dans cet exemple, nous supposons que nous utilisons le nom d'hôte `SITE.example.com` pour chaque utilisateur, et que nous servons leur contenu depuis `/home/SITE/www`. Nous souhaitons cependant que `www.example.com` n'apparaisse pas dans cette mise en correspondance.

**Solution :**

```apache
RewriteEngine on

RewriteMap    lowercase int:tolower

RewriteCond   %{HTTP_HOST} !^www\.
RewriteCond   ${lowercase:%{HTTP_HOST}}   ^([^.]+)\.example\.com$
RewriteRule   ^(.*)    /home/%1/www$1
```

**Discussion**

> [!WARNING]
> Vous devez vérifier le bon fonctionnement de la résolution DNS - Apache ne gère pas la résolution de nom. Vous devrez créer soit des enregistrements CNAME pour chaque nom d'hôte, soit un enregistrement DNS avec caractères génériques. La création des enregistrements DNS est en dehors du sujet de ce document.

La directive RewriteMap interne `tolower` permet de s'assurer que les noms d'hôtes utilisés seront tous en minuscules, de façon à éviter toute ambiguité dans la structure des répertoires qui doit être créée.

Les contenus des parenthèses utilisées dans une directive [[13-directives/rewritecond|RewriteCond]] sont enregistrés dans les références arrières `%1`, `%2`, etc..., alors que les contenus des parenthèses utilisées dans une directive [[13-directives/rewriterule|RewriteRule]] le sont dans les références arrières `$1`, `$2`, etc...

La première directive `RewriteCond` vérifie si le nom d'hôte commence par `www.` et si c'est le cas, la réécriture est annulée.

Comme c'est le cas pour de nombreuses techniques discutées dans ce document, [[12-modules/mod_rewrite|mod_rewrite]] n'est vraiment pas la meilleure méthode pour accomplir cette tâche. Vous devez plutôt vous tourner vers [[12-modules/mod_vhost_alias|mod_vhost_alias]], car ce dernier sera bien plus à même de gérer tout ce qui est au delà du domaine des fichiers statiques, comme les contenus dynamiques et la résolution des alias.

## Configuration dynamique de serveurs virtuels via [[12-modules/mod_rewrite|mod_rewrite]]

Cet extrait du fichier `httpd.conf` permet d'obtenir le même résultat que le premier exemple. La première moitié est très similaire à la partie correspondante ci-dessus, excepté quelques modifications requises à des fins de compatibilité ascendante et pour faire en sorte que la partie [[12-modules/mod_rewrite|mod_rewrite]] fonctionne correctement ; la seconde moitié configure [[12-modules/mod_rewrite|mod_rewrite]] pour effectuer le travail proprement dit.

Comme [[12-modules/mod_rewrite|mod_rewrite]] s'exécute avant tout autre module de traduction d'URI (comme `mod_alias`), il faut lui ordonner explicitement d'ignorer toute URL susceptible d'être traitée par ces autres modules. Et comme ces règles auraient sinon court-circuité toute directive `ScriptAlias`, nous devons faire en sorte que [[12-modules/mod_rewrite|mod_rewrite]] déclare explicitement ces correspondances.

```apache
# extrait le nom de serveur de l'en-tête Host:
UseCanonicalName Off

# journaux dissociables
LogFormat "%{Host}i %h %l %u %t \"%r\" %s %b" vcommon
CustomLog "logs/access_log" vcommon

<Directory "/www/hosts">
    # ExecCGI est nécessaire ici car on ne peut pas forcer l'exécution
    # des CGI à la manière de ScriptAlias
    Options FollowSymLinks ExecCGI
</Directory>

RewriteEngine On

# un nom de serveur extrait d'un en-tête Host: peut être dans n'importe
# quelle casse
RewriteMap  lowercase  "int:tolower"

## on s'occupe tout d'abord des documents normaux :
# permet à Alias /icons/ de fonctionner - répéter pour les autres
RewriteCond  "%{REQUEST_URI}"  "!^/icons/"
# permet aux CGIs de fonctionner
RewriteCond  "%{REQUEST_URI}"  "!^/cgi-bin/"
# le coeur du traitement
RewriteRule  "^/(.*)$"  "/www/hosts/${lowercase:%{SERVER_NAME}}/docs/$1"

## on s'occupe maintenant des CGIs - on doit forcer l'utilisation d'un
# gestionnaire
RewriteCond  "%{REQUEST_URI}"  "^/cgi-bin/"
RewriteRule  "^/(.*)$" "/www/hosts/${lowercase:%{SERVER_NAME}}/cgi-bin/$1"  [H=cgi-script]
```

## Utilisation d'un fichier de configuration du serveur virtuel séparé

Cette construction utilise des fonctionnalités plus avancées de [[12-modules/mod_rewrite|mod_rewrite]] pour effectuer la traduction depuis le serveur virtuel vers la racine des documents, à partir d'un fichier de configuration séparé. Elle est plus souple mais nécessite une configuration plus compliquée.

Le fichier `vhost.map` devrait ressembler à ceci :

```
www.client-1.example.com  /www/clients/1
www.client-2.example.com  /www/clients/2
# ...
www.client-N.example.com  /www/clients/N
```

On doit ajouter à `httpd.conf` :

```apache
RewriteEngine on

RewriteMap   lowercase  "int:tolower"

# définit le fichier de correspondances
RewriteMap   vhost      "txt:/www/conf/vhost.map"

# on s'occupe des alias comme ci-dessus
RewriteCond  "%{REQUEST_URI}"               "!^/icons/"
RewriteCond  "%{REQUEST_URI}"               "!^/cgi-bin/"
RewriteCond  "${lowercase:%{SERVER_NAME}}"  "^(.+)$"
# on effectue ici la remise en correspondance à base de fichier
RewriteCond  "${vhost:%1}"                  "^(/.*)$"
RewriteRule  "^/(.*)$"                      "%1/docs/$1"

RewriteCond  "%{REQUEST_URI}"               "^/cgi-bin/"
RewriteCond  "${lowercase:%{SERVER_NAME}}"  "^(.+)$"
RewriteCond  "${vhost:%1}"                  "^(/.*)$"
RewriteRule  "^/cgi-bin/(.*)$"              "%1/cgi-bin/$1" [H=cgi-script]
```

## Voir aussi

- [[12-modules/mod_rewrite|Documentation du module]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
