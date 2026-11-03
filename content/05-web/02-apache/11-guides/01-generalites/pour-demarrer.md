---
title: "Pour démarrer"
description: "Apache HTTP Server — Pour démarrer. Si vous ne connaissez rien au serveur HTTP Apache, ou même au fonctionnement d'un site web, vous vous demandez probablement par où commencer et quelles questions poser. Ce document vous permettra de parcourir les bases du sujet."
tags: [apache, guide]
icon: book-open
---

Si vous ne connaissez rien au serveur HTTP Apache, ou même au fonctionnement d'un site web, vous vous demandez probablement par où commencer et quelles questions poser. Ce document vous permettra de parcourir les bases du sujet.

## Clients, serveurs et URLs

Les adresses des pages web sur la Toile se présentent sous forme d'URLs - Uniform Resource Locators - qui comportent un protocole (par exemple `http`), un nom de serveur (par exemple `www.apache.org`), un chemin (par exemple `/docs/current/getting-started.html`), et le cas échéant une chaîne de paramètres (query string) (par exemple `?arg=value`) permettant de transmettre des informations supplémentaires au serveur.

Un client (par exemple un navigateur web) se connecte à un serveur (par exemple votre serveur HTTP Apache) avec un protocole spécifique, et effectue une **requête** pour une ressource en spécifiant son chemin.

Un chemin peut représenter plusieurs types de ressources sur le serveur. Il peut s'agir d'un fichier (comme `getting-started.html`), d'un gestionnaire (comme [[12-modules/mod_status|server-status]]) ou d'une sorte quelconque de programme (comme `index.php`). Nous décrirons tout cela plus en détails ci-dessous dans la section Contenu d'un site web.

Le serveur envoie alors une **réponse** comportant un code d'état, et éventuellement un corps de réponse. Le code d'état indique si la requête a été traitée avec succès, ou dans la négative, quel type d'erreur a été rencontré. Le client est alors censé savoir quoi faire de la réponse. Vous pouvez vous familiariser avec les différents codes d'état en consultant le [Wiki du serveur HTTP Apache](https://cwiki.apache.org/confluence/display/httpd/CommonHTTPStatusCodes).

Les détails de la transaction, ainsi que les erreurs rencontrées, sont enregistrés dans des fichiers journaux. Tout cela est décrit en détails ci-dessous dans la section Débogage et fichiers journaux.

## Noms d'hôte et DNS

Pour se connecter à un serveur, le client doit tout d'abord traduire le nom du serveur en adresse IP, cette dernière permettant de localiser le serveur sur Internet. Ainsi, pour que votre serveur web soit accessible, son nom doit être enregistré dans le DNS.

Si vous ne savez pas comment effectuer cet enregistrement, vous devez contacter votre administrateur réseau ou votre fournisseur d'accès à Internet afin qu'il effectue cette opération pour vous.

Plusieurs noms d'hôte peuvent pointer vers la même adresse IP, et plusieurs adresses IP peuvent être attachées au même serveur physique. Vous pouvez ainsi héberger plusieurs serveurs web sur le même serveur physique grâce au mécanisme des [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|serveurs virtuels]].

Pour tester un serveur non encore accessible sur Internet, vous pouvez renseigner son nom d'hôte dans votre fichier hosts afin d'effectuer une résolution de nom locale. Par exemple, pour tester le serveur web `www.example.com` depuis le serveur physique qui l'héberge, vous pouvez ajouter la ligne suivante au fichier hosts de ce dernier :

```
127.0.0.1 www.example.com
```

En général, le fichier hosts se trouve dans le répertoire `/etc` sur les systèmes de style Unix, ou `C:\Windows\system32\drivers\etc` sous Windows.

Vous trouverez plus de détails à propos du fichier hosts à [Wikipedia.org/wiki/Hosts\_(file)](http://en.wikipedia.org/wiki/Hosts_(file)), et à propos du DNS à [Wikipedia.org/wiki/Domain\_Name\_System](http://en.wikipedia.org/wiki/Domain_Name_System).

## Fichiers de configuration et directives

La configuration du serveur HTTP Apache s'effectue via de simples fichiers texte. Ces fichiers peuvent se trouver dans de nombreux endroits différents en fonction du mode d'installation du serveur. Vous trouverez les positions courantes de ces fichiers dans le [wiki httpd](https://cwiki.apache.org/confluence/display/httpd/DistrosDefaultLayout). Si vous installez httpd depuis le code source, le répertoire par défaut des fichiers de configuration est `/usr/local/apache2/conf`. Le nom du fichier de configuration par défaut est en général `httpd.conf`, mais peut aussi varier en fonction des distributions tierces du serveur.

L'ensemble de la configuration est en général divisé en plusieurs fichiers afin d'en faciliter la gestion. Ces fichiers sont inclus dans le fichier de configuration principal via la directive [[13-directives/include|Include]]. Les noms ou positions de ces fichiers ne sont pas figés et peuvent varier considérablement d'une distribution à l'autre. N'hésitez pas à les arranger et subdiviser selon **vos** goûts et besoins, quitte à en modifier l'organisation par défaut.

La configuration du serveur s'effectue via des directives de configuration que l'on insère dans les fichiers de configuration. Une directive se compose d'un mot-clé suivi d'un ou plusieurs arguments qui définissent sa valeur.

La réponse à la question "*Où dois-je placer cette directive ?*" dépend en général du niveau auquel cette directive doit être prise en compte. S'il s'agit du niveau global, elle doit être placée dans le fichier de configuration principal, et en dehors de toute section [[13-directives/directory|<Directory>]], [[13-directives/location|<Location>]], [[13-directives/virtualhost|<VirtualHost>]] ou de toute autre section. Sinon, si par exemple elle ne doit s'appliquer qu'à un répertoire particulier, elle doit être placée dans la section [[13-directives/directory|<Directory>]] qui fait référence à ce répertoire. Voir la documentation sur les [[11-guides/01-generalites/sections-de-configuration|Sections de configuration]] pour plus de détails.

En complément des fichiers de configuration principaux, certaines directives peuvent être insérées dans des fichiers `.htaccess` que l'on place directement dans le répertoire concerné. Les fichiers `.htaccess` sont essentiellement destinés aux personnes qui n'ont pas accès aux fichiers de configuration du serveur. Vous trouverez plus de détails à propos des fichiers `.htaccess` dans ce [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|.htaccesshowto]].

## Contenu du site web

Si le contenu du site web peut se présenter sous de nombreuses formes, il en existe deux principales : les contenus statiques et les contenus dynamiques.

Les contenus statiques sont par exemple les fichiers HTML, les images, les fichiers CSS et tout autre fichier résidant dans le système de fichiers. La directive [[13-directives/documentroot|DocumentRoot]] permet de définir la position dans l'arborescence du site où vous devez placer ces fichiers. Cette directive peut être définie au niveau global, ou au niveau de chaque serveur virtuel. Vous pouvez consulter vos fichiers de configuration pour vérifier la manière dont cette directive est définie pour votre serveur.

En général, et si aucun nom de fichier n'est spécifié dans la requête, c'est une page de nom `index.html` qui sera renvoyée. Par exemple, si la directive `DocumentRoot` est définie à `/var/www/html`, et si une requête est effectuée pour l'adresse `http://www.example.com/work/`, c'est le fichier `/var/www/html/work/index.html` qui sera envoyé au client par le serveur.

Un contenu dynamique est un contenu qui est généré au moment du traitement de la requête, et qui peut différer d'une requête à l'autre. Ces contenus dynamiques peuvent être générés de nombreuses manières par l'intermédiaire de [[11-guides/01-generalites/utilisation-des-gestionnaires-d-apache-handlers|gestionnaires de contenu]] ou "handlers". Il est aussi possible de créer des [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|programmes CGI]] pour générer le contenu de votre site.

Enfin, on peut utiliser des modules tiers comme mod\_php pour écrire du code permettant d'effectuer de nombreuses choses. De nombreuses applications tierces écrites à partir de divers langages ou outils sont disponibles en téléchargement et peuvent être installées sur votre serveur HTTP Apache. Le support de ces applications est en dehors du sujet de ce document, et nous vous invitons à consulter le site de leur éditeur pour accéder à leur documentation.

## Fichiers journaux et résolution des problèmes

En tant qu'administrateur d'un serveur HTTP Apache, vos sources d'informations principales sont les fichiers journaux, et en particulier le journal des erreurs. Toute tentative de résolution d'un problème sans consulter le journal des erreurs revient à essayer de conduire les yeux fermés.

La position dans le système de fichiers du journal des erreurs est spécifiée par la directive [[13-directives/errorlog|ErrorLog]] qui peut être définie au niveau global, ou au niveau de chaque serveur virtuel. Chaque entrée du journal des erreurs vous informe sur la nature des problèmes et le moment de leur survenue. En outre, elle vous indique souvent comment résoudre le problème. Chaque message d'erreur contient un code d'erreur que vous pouvez utiliser pour effectuer une recherche en ligne afin d'obtenir une description plus détaillée de la manière de résoudre le problème. Vous pouvez aussi configurer votre journal des erreurs de manière à ce qu'il enregistre un identifiant d'erreur que vous pourrez ensuite utiliser pour effectuer une corrélation avec le journal des accès afin de déterminer quelle requête est à l'origine de l'erreur.

Vous trouverez plus de détails à ce sujet dans la [[11-guides/01-generalites/fichiers-journaux|Documentation sur la journalisation]].

## Et maintenant, comment faire pour aller plus loin ?

La question des prérequis étant réglée, il est temps de passer aux choses sérieuses.

Ce document ne couvre que les notions de base. Nous espérons qu'il vous permettra de mettre le pied à l'étrier, mais il y a encore de nombreuses choses que vous devez savoir.

- [Téléchargement](http://httpd.apache.org/download.cgi)
- [[11-guides/01-generalites/compilation-et-installation|Installation]]
- [[11-guides/01-generalites/fichiers-de-configuration|Configuration]]
- [[11-guides/01-generalites/demarrage-d-apache|Démarrage du serveur]]
- [Foire aux questions](https://cwiki.apache.org/confluence/display/httpd/FAQ)

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
