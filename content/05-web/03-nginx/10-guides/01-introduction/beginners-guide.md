---
title: "Guide du débutant"
description: "Nginx — Guide du débutant. Ce guide présente les bases de nginx et décrit quelques tâches simples. On suppose que nginx est déjà installé sur la machine ; sinon, voir la page Installer nginx. Il explique comment démarrer et arrêter nginx et…"
tags: [nginx, guide]
icon: book-open
---

Ce guide présente les bases de nginx et décrit quelques tâches simples. On suppose que nginx est déjà installé sur la machine ; sinon, voir la page [[10-guides/01-introduction/install|Installer nginx]]. Il explique comment démarrer et arrêter nginx et recharger sa configuration, décrit la structure du fichier de configuration et montre comment servir du contenu statique, configurer nginx comme serveur mandataire et le relier à une application FastCGI.

nginx comporte un processus maître et plusieurs processus de travail. Le rôle principal du processus maître est de lire et d'évaluer la configuration et de gérer les processus de travail, qui traitent réellement les requêtes. nginx utilise un modèle événementiel et des mécanismes propres au système d'exploitation pour répartir efficacement les requêtes entre les processus de travail. Leur nombre est défini dans le fichier de configuration ; il peut être fixe ou ajusté automatiquement au nombre de cœurs disponibles (voir [[12-directives/worker-processes|worker_processes]]).

Le fonctionnement de nginx et de ses modules est défini dans le fichier de configuration. Par défaut, il s'appelle `nginx.conf` et se trouve dans le répertoire `/usr/local/nginx/conf`, `/etc/nginx` ou `/usr/local/etc/nginx`.

## Démarrer, arrêter et recharger la configuration

Pour démarrer nginx, lancez l'exécutable. Une fois nginx démarré, on le contrôle en appelant l'exécutable avec le paramètre `-s`, selon la syntaxe suivante :

```
nginx -s signal
```

où *signal* peut être :

- `stop` : arrêt rapide
- `quit` : arrêt en douceur
- `reload` : rechargement du fichier de configuration
- `reopen` : réouverture des fichiers journaux

Par exemple, pour arrêter les processus nginx en attendant que les processus de travail aient fini de servir les requêtes en cours, on peut exécuter :

```
nginx -s quit
```

> [!NOTE]
> Cette commande doit être exécutée par l'utilisateur qui a démarré nginx.

Les modifications du fichier de configuration ne s'appliquent qu'après l'envoi à nginx de la commande de rechargement ou un redémarrage. Pour recharger la configuration, exécutez :

```
nginx -s reload
```

Lorsque le processus maître reçoit le signal de rechargement, il vérifie la syntaxe du nouveau fichier de configuration et tente d'appliquer la configuration qu'il contient. En cas de succès, il démarre de nouveaux processus de travail et demande aux anciens de s'arrêter. Sinon, il annule les modifications et continue avec l'ancienne configuration. Les anciens processus de travail qui reçoivent l'ordre de s'arrêter n'acceptent plus de nouvelles connexions et continuent de servir les requêtes en cours jusqu'à les avoir toutes traitées, puis ils se terminent.

Un signal peut aussi être envoyé aux processus nginx avec les outils Unix, comme la commande `kill`. Le signal est alors envoyé directement au processus d'identifiant donné. L'identifiant du processus maître est écrit par défaut dans le fichier `nginx.pid` du répertoire `/usr/local/nginx/logs` ou `/var/run`. Par exemple, si l'identifiant du processus maître est 1628, pour envoyer le signal QUIT qui provoque l'arrêt en douceur de nginx, exécutez :

```
kill -s QUIT 1628
```

Pour obtenir la liste de tous les processus nginx en cours d'exécution, on peut utiliser la commande `ps`, par exemple ainsi :

```
ps -ax | grep nginx
```

Pour en savoir plus sur l'envoi de signaux à nginx, voir [[10-guides/01-introduction/control|Contrôler nginx]].

## Structure du fichier de configuration

nginx est composé de modules pilotés par des directives indiquées dans le fichier de configuration. On distingue les directives simples et les directives de bloc. Une directive simple se compose d'un nom et de paramètres séparés par des espaces, et se termine par un point-virgule (`;`). Une directive de bloc a la même structure, mais se termine par un ensemble d'instructions entre accolades (`{` et `}`) au lieu du point-virgule. Si une directive de bloc peut contenir d'autres directives entre ses accolades, on l'appelle un contexte (exemples : [[12-directives/events|events]], [[12-directives/http|http]], [[12-directives/server-http-core|server]] et [[12-directives/location|location]]).

Les directives placées dans le fichier de configuration en dehors de tout contexte sont considérées comme appartenant au contexte [[11-modules/01-coeur/ngx_core_module|main]]. Les directives `events` et `http` se trouvent dans le contexte `main`, `server` dans `http`, et `location` dans `server`.

Le reste d'une ligne après le signe `#` est un commentaire.

## Servir du contenu statique

Une tâche importante d'un serveur web est de servir des fichiers (images, pages HTML statiques…). Vous allez mettre en place un exemple où, selon la requête, les fichiers sont servis depuis différents répertoires locaux : `/data/www` (qui peut contenir des fichiers HTML) et `/data/images` (qui contient des images). Il faut pour cela modifier le fichier de configuration et créer, dans le bloc [[12-directives/http|http]], un bloc [[12-directives/server-http-core|server]] contenant deux blocs [[12-directives/location|location]].

Créez d'abord le répertoire `/data/www` et placez-y un fichier `index.html` contenant n'importe quel texte, puis créez le répertoire `/data/images` et placez-y quelques images.

Ouvrez ensuite le fichier de configuration. Le fichier par défaut contient déjà plusieurs exemples de bloc `server`, pour la plupart en commentaire. Pour l'instant, mettez tous ces blocs en commentaire et commencez un nouveau bloc `server` :

```
http {
    server {
    }
}
```

En général, le fichier de configuration peut contenir plusieurs blocs `server`, [[10-guides/02-http/request-processing|distingués]] par les ports sur lesquels ils [[12-directives/listen-http-core|écoutent]] et par les [[10-guides/02-http/server-names|noms de serveurs]]. Une fois que nginx a choisi le bloc `server` qui traite une requête, il compare l'URI indiqué dans l'en-tête de la requête aux paramètres des directives `location` définies dans ce bloc `server`.

Ajoutez le bloc `location` suivant au bloc `server` :

```
location / {
    root /data/www;
}
```

Ce bloc `location` indique le préfixe « `/` », comparé à l'URI de la requête. Pour les requêtes correspondantes, l'URI est ajouté au chemin indiqué dans la directive [[12-directives/root|root]], c'est-à-dire `/data/www`, pour former le chemin du fichier demandé sur le système de fichiers local. Si plusieurs blocs `location` correspondent, nginx choisit celui dont le préfixe est le plus long. Le bloc ci-dessus a le préfixe le plus court, d'une longueur de un : il n'est donc utilisé que si aucun autre bloc `location` ne correspond.

Ajoutez ensuite le second bloc `location` :

```
location /images/ {
    root /data;
}
```

Il correspond aux requêtes commençant par `/images/` (`location /` correspond aussi à ces requêtes, mais avec un préfixe plus court).

La configuration du bloc `server` doit maintenant ressembler à ceci :

```
server {
    location / {
        root /data/www;
    }

    location /images/ {
        root /data;
    }
}
```

C'est déjà la configuration fonctionnelle d'un serveur qui écoute sur le port standard 80 et est accessible sur la machine locale à l'adresse `http://localhost/`. En réponse aux requêtes dont l'URI commence par `/images/`, le serveur envoie les fichiers du répertoire `/data/images`. Par exemple, à la requête `http://localhost/images/example.png`, nginx envoie le fichier `/data/images/example.png`. Si ce fichier n'existe pas, nginx renvoie une réponse d'erreur 404. Les requêtes dont l'URI ne commence pas par `/images/` sont associées au répertoire `/data/www`. Par exemple, à la requête `http://localhost/some/example.html`, nginx envoie le fichier `/data/www/some/example.html`.

Pour appliquer la nouvelle configuration, démarrez nginx s'il ne l'est pas encore, ou envoyez le signal `reload` au processus maître de nginx en exécutant :

```
nginx -s reload
```

> [!NOTE]
> Si quelque chose ne fonctionne pas comme prévu, cherchez la cause dans les fichiers `access.log` et `error.log` du répertoire `/usr/local/nginx/logs` ou `/var/log/nginx`.

## Mettre en place un serveur mandataire simple

Un usage fréquent de nginx est de le configurer comme serveur mandataire (*proxy*) : un serveur qui reçoit les requêtes, les transmet aux serveurs mandatés, récupère leurs réponses et les envoie aux clients.

Nous allons configurer un mandataire simple qui sert les requêtes d'images avec les fichiers d'un répertoire local et envoie toutes les autres requêtes à un serveur mandaté. Dans cet exemple, les deux serveurs sont définis dans une même instance de nginx.

Définissez d'abord le serveur mandaté en ajoutant au fichier de configuration de nginx un autre bloc `server` avec le contenu suivant :

```
server {
    listen 8080;
    root /data/up1;

    location / {
    }
}
```

C'est un serveur simple qui écoute sur le port 8080 (jusqu'ici, la directive `listen` n'était pas indiquée car le port standard 80 était utilisé) et associe toutes les requêtes au répertoire `/data/up1` du système de fichiers local. Créez ce répertoire et placez-y le fichier `index.html`. Notez que la directive `root` est placée dans le contexte `server` : elle est utilisée lorsque le bloc `location` choisi pour servir une requête ne contient pas sa propre directive `root`.

Reprenez ensuite la configuration de serveur de la section précédente et transformez-la en configuration de mandataire. Dans le premier bloc `location`, placez la directive [[12-directives/proxy-pass-http-proxy|proxy_pass]] avec, en paramètre, le protocole, le nom et le port du serveur mandaté (ici, `http://localhost:8080`) :

```
server {
    location / {
        proxy_pass http://localhost:8080;
    }

    location /images/ {
        root /data;
    }
}
```

Nous allons modifier le second bloc `location`, qui associe actuellement les requêtes de préfixe `/images/` aux fichiers du répertoire `/data/images`, pour qu'il corresponde aux requêtes d'images ayant les extensions de fichier habituelles. Le bloc `location` modifié ressemble à ceci :

```
location ~ \.(gif|jpg|png)$ {
    root /data/images;
}
```

Le paramètre est une expression régulière qui correspond à tous les URI se terminant par `.gif`, `.jpg` ou `.png`. Une expression régulière doit être précédée de `~`. Les requêtes correspondantes sont associées au répertoire `/data/images`.

Lorsque nginx choisit le bloc `location` qui servira une requête, il examine d'abord les directives [[12-directives/location|location]] à préfixe, mémorise celle dont le préfixe est le plus long, puis examine les expressions régulières. S'il y a une correspondance avec une expression régulière, nginx choisit ce bloc `location` ; sinon, il choisit celui mémorisé précédemment.

La configuration complète du mandataire ressemble à ceci :

```
server {
    location / {
        proxy_pass http://localhost:8080/;
    }

    location ~ \.(gif|jpg|png)$ {
        root /data/images;
    }
}
```

Ce serveur filtre les requêtes se terminant par `.gif`, `.jpg` ou `.png`, les associe au répertoire `/data/images` (en ajoutant l'URI au paramètre de la directive `root`) et transmet toutes les autres requêtes au serveur mandaté configuré plus haut.

Pour appliquer la nouvelle configuration, envoyez le signal `reload` à nginx comme décrit dans les sections précédentes.

Il existe de nombreuses [[11-modules/02-http/ngx_http_proxy_module|autres]] directives pour affiner la configuration d'une connexion mandatée.

## Mettre en place un relais FastCGI

nginx peut acheminer les requêtes vers des serveurs FastCGI qui exécutent des applications écrites avec divers frameworks et langages, comme PHP.

La configuration de base de nginx pour travailler avec un serveur FastCGI utilise la directive [[12-directives/fastcgi-pass|fastcgi_pass]] au lieu de `proxy_pass`, et des directives [[12-directives/fastcgi-param|fastcgi_param]] pour définir les paramètres transmis au serveur FastCGI. Supposons que le serveur FastCGI soit accessible sur `localhost:9000`. En partant de la configuration de mandataire de la section précédente, remplacez la directive `proxy_pass` par `fastcgi_pass` et changez le paramètre en `localhost:9000`. En PHP, le paramètre `SCRIPT_FILENAME` sert à déterminer le nom du script, et le paramètre `QUERY_STRING` à transmettre les paramètres de la requête. La configuration obtenue est :

```
server {
    location / {
        fastcgi_pass  localhost:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param QUERY_STRING    $query_string;
    }

    location ~ \.(gif|jpg|png)$ {
        root /data/images;
    }
}
```

Cela met en place un serveur qui achemine toutes les requêtes, sauf celles d'images statiques, vers le serveur mandaté fonctionnant sur `localhost:9000` via le protocole FastCGI.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
