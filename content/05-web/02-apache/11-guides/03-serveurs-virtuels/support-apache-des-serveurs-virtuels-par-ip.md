---
title: "Support Apache des serveurs virtuels par IP"
description: "Apache HTTP Server — Support Apache des serveurs virtuels par IP."
tags: [apache, guide]
icon: book-open
---

## Système requis

Comme l'indique le terme *par IP*, le serveur **doit disposer de différentes paires adresses IP/port pour chaque serveur virtuel par IP**. La machine peut posséder plusieurs connexions physiques au réseau, ou utiliser des interfaces virtuelles qui sont supportées par la plupart des systèmes d'exploitation modernes (Consultez la documentation des systèmes d'exploitation pour plus de détails, notamment les "alias IP" et la commande "ifconfig" pour les activer), et/ou utiliser plusieurs numéros de port.

Selon la terminologie du serveur HTTP Apache, l'utilisation d'une seule adresse IP avec plusieurs ports TCP s'apparente aussi à de l'hébergement virtuel basé sur IP.

## Comment configurer Apache

Il y a deux manières de configurer Apache pour le support de multiples serveurs virtuels. Il suffit soit de faire tourner un processus résident [[10-commandes/httpd|httpd]] pour chaque nom de domaine, soit de faire tourner un unique processus résident qui gère tous les serveurs virtuels.

Utilisez des processus résidents multiples lorsque :

- il y a des problèmes de répartition de sécurité, tels qu'une entreprise1 ne souhaite que personne d'une entreprise2 ne puisse lire ses données excepté via le Web. Dans ce cas, vous aurez besoin de deux processus résidents, chacun fonctionnant avec des paramètres [[13-directives/user|User]], [[13-directives/group|Group]], [[13-directives/listen|Listen]], et [[13-directives/serverroot|ServerRoot]] différents.
- vous disposez suffisamment de mémoire et de descripteurs de fichiers pour l'écoute de chaque alias IP de la machine. Il est seulement possible d'appliquer la directive [[13-directives/listen|Listen]], soit sur toutes les adresses avec le joker "\*", soit uniquement sur des adresses spécifiques. Donc, si vous avez besoin d'écouter une adresse en particulier, vous devrez le faire pour l'ensemble des autres adresses (Bien qu'il soit plus simple de lancer un processus [[10-commandes/httpd|httpd]] pour écouter N-1 adresses, et un autre pour l'adresse restante).

Utilisez un unique processus résident lorsque :

- le partage de la configuration httpd entre les serveurs virtuels est acceptable.
- la machine assume déjà une grande quantité de requêtes, et que l'ajout de processus résidents supplémentaires en affecterait les performances.

## Configuration de processus multiples

Créez une installation indépendante du programme [[10-commandes/httpd|httpd]] pour chaque serveur virtuel. Pour chacune d'elle, utilisez la directive [[13-directives/listen|Listen]] dans le fichier de configuration pour définir l'adresse IP (ou serveur virtuel) que le processus résident doit gérer. Par exemple :

```apache
Listen 192.0.2.100:80
```

Il est recommandé d'utiliser une adresse IP plutôt qu'un nom de domaine (consultez [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|Problèmes DNS avec Apache]]).

## Configuration d'un unique processus résident pour des serveurs virtuels

Dans ce cas, un unique processus httpd va gérer les requêtes pour le serveur principal et tous les serveurs virtuels. Dans le fichier de configuration, la directive [[13-directives/virtualhost|<VirtualHost>]] va servir à définir les autres directives [[13-directives/serveradmin|ServerAdmin]], [[13-directives/servername|ServerName]], [[13-directives/documentroot|DocumentRoot]], [[13-directives/errorlog|ErrorLog]] et [[13-directives/transferlog|TransferLog]] ou [[13-directives/customlog|CustomLog]] avec des valeurs différentes pour chaque serveur virtuel. Par exemple :

```apache
<VirtualHost 172.20.30.40:80>
    ServerAdmin webmaster@www1.example.com
    DocumentRoot "/www/vhosts/www1"
    ServerName www1.example.com
    ErrorLog "/www/logs/www1/error_log"
    CustomLog "/www/logs/www1/access_log" combined
</VirtualHost>

<VirtualHost 172.20.30.50:80>
    ServerAdmin webmaster@www2.example.org
    DocumentRoot "/www/vhosts/www2"
    ServerName www2.example.org
    ErrorLog "/www/logs/www2/error_log"
    CustomLog "/www/logs/www2/access_log" combined
</VirtualHost>
```

Il est recommandé d'utiliser une adresse IP plutôt qu'un nom de domaine comme argument à la directive \<VirtualHost\> (consultez [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|Problèmes DNS avec Apache]]).

Presque **toutes** les directives de configuration peuvent être employées dans une directive VirtualHost, à l'exception des directives qui contrôlent la création du processus et de quelques autres. Pour connaître celles utilisables dans une directive VirtualHost, vérifiez leur Contexte en utilisant l'directive index.

[[13-directives/suexecusergroup|SuexecUserGroup]] peut être utilisées à l'intérieur d'une directive VirtualHost si l'exécution se fait sous suEXEC. (Voir [[11-guides/01-generalites/support-suexec|suEXEC]]).

*SÉCURITÉ :* lorsque vous spécifiez où écrire les fichiers journaux, soyez attentif aux risques si quelqu'un d'autre que celui qui a démarré Apache dispose des droits d'écriture sur l'emplacement de ces fichiers. Consultez les [[11-guides/06-divers/conseils-sur-la-securite|Conseils sur la sécurité]] pour plus de détails.

## Voir aussi

- [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|Support Apache des serveurs virtuels par nom]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
