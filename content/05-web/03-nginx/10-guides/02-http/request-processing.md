---
title: "Comment nginx traite une requête"
description: "Nginx — Comment nginx traite une requête. nginx détermine d'abord quel serveur (server) doit traiter la requête. Commençons par une configuration simple où les trois serveurs virtuels écoutent sur le port :80 :"
tags: [nginx, guide]
icon: book-open
---

## Serveurs virtuels par nom

nginx détermine d'abord quel serveur (*server*) doit traiter la requête. Commençons par une configuration simple où les trois serveurs virtuels écoutent sur le port \*:80 :

```
server {
    listen      80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      80;
    server_name example.net www.example.net;
    ...
}

server {
    listen      80;
    server_name example.com www.example.com;
    ...
}
```

Dans cette configuration, nginx examine uniquement le champ d'en-tête `Host` de la requête pour déterminer vers quel serveur l'acheminer. Si sa valeur ne correspond à aucun nom de serveur, ou si la requête ne contient pas ce champ, nginx achemine la requête vers le serveur par défaut de ce port. Dans la configuration ci-dessus, le serveur par défaut est le premier, comportement standard de nginx. On peut aussi désigner explicitement le serveur par défaut avec le paramètre `default_server` de la directive [[12-directives/listen-http-core|listen]] :

```
server {
    listen      80 default_server;
    server_name example.net www.example.net;
    ...
}
```

> [!NOTE]
> Le paramètre `default_server` est disponible depuis la version 0.8.21. Dans les versions antérieures, il faut utiliser le paramètre `default`.

Le serveur par défaut est une propriété du port d'écoute, et non du nom de serveur. Nous y reviendrons.

## Empêcher le traitement des requêtes sans nom de serveur défini

Si les requêtes sans champ d'en-tête `Host` ne doivent pas être acceptées, on peut définir un serveur qui les rejette simplement :

```
server {
    listen      80;
    server_name "";
    return      444;
}
```

Ici, le nom de serveur est une chaîne vide, qui correspond aux requêtes sans champ `Host`, et le code non standard 444 de nginx est renvoyé, ce qui ferme la connexion.

> [!NOTE]
> Depuis la version 0.8.48, c'est le réglage par défaut du nom de serveur : `server_name ""` peut donc être omis. Dans les versions antérieures, le nom d'hôte (*hostname*) de la machine servait de nom de serveur par défaut.

## Serveurs virtuels mixtes, par nom et par adresse IP

Prenons une configuration plus complexe où certains serveurs virtuels écoutent sur des adresses différentes :

```
server {
    listen      192.168.1.1:80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      192.168.1.1:80;
    server_name example.net www.example.net;
    ...
}

server {
    listen      192.168.1.2:80;
    server_name example.com www.example.com;
    ...
}
```

Dans cette configuration, nginx compare d'abord l'adresse IP et le port de la requête aux directives [[12-directives/listen-http-core|listen]] des blocs [[12-directives/server-http-core|server]]. Il compare ensuite le champ `Host` de la requête aux entrées [[12-directives/server-name-http-core|server_name]] des blocs [[12-directives/server-http-core|server]] qui correspondent à cette adresse et à ce port. Si le nom de serveur n'est pas trouvé, la requête est traitée par le serveur par défaut. Par exemple, une requête pour `www.example.com` reçue sur le port 192.168.1.1:80 est traitée par le serveur par défaut de ce port, c'est-à-dire le premier, car aucun `www.example.com` n'est défini pour ce port.

Comme indiqué plus haut, le serveur par défaut est une propriété du port d'écoute, et des serveurs par défaut différents peuvent être définis pour des ports différents :

```
server {
    listen      192.168.1.1:80;
    server_name example.org www.example.org;
    ...
}

server {
    listen      192.168.1.1:80 default_server;
    server_name example.net www.example.net;
    ...
}

server {
    listen      192.168.1.2:80 default_server;
    server_name example.com www.example.com;
    ...
}
```

## Configuration d'un site PHP simple

Voyons maintenant comment nginx choisit le bloc *location* qui traite une requête pour un site PHP simple et typique :

```
server {
    listen      80;
    server_name example.org www.example.org;
    root        /data/www;

    location / {
        index   index.html index.php;
    }

    location ~* \.(gif|jpg|png)$ {
        expires 30d;
    }

    location ~ \.php$ {
        fastcgi_pass  localhost:9000;
        fastcgi_param SCRIPT_FILENAME
                      $document_root$fastcgi_script_name;
        include       fastcgi_params;
    }
}
```

nginx recherche d'abord le bloc location à préfixe littéral le plus précis, quel que soit l'ordre des blocs. Dans la configuration ci-dessus, le seul bloc à préfixe est « `/` » ; comme il correspond à toute requête, il sert en dernier recours. nginx examine ensuite les blocs location à expression régulière, dans l'ordre du fichier de configuration. La première expression correspondante arrête la recherche et nginx utilise ce bloc. Si aucune expression régulière ne correspond, nginx utilise le bloc à préfixe le plus précis trouvé auparavant.

Tous les types de blocs location ne testent que la partie URI de la ligne de requête, sans les arguments, car les arguments de la chaîne de requête peuvent s'écrire de plusieurs façons, par exemple :

```
/index.php?user=john&page=1
/index.php?page=1&user=john
```

De plus, n'importe qui peut demander n'importe quoi dans la chaîne de requête :

```
/index.php?page=1&something+else&user=john
```

Voyons maintenant comment les requêtes sont traitées dans la configuration ci-dessus :

- La requête « `/logo.gif` » correspond d'abord au bloc à préfixe « `/` », puis à l'expression régulière « `\.(gif|jpg|png)$` » : c'est donc ce dernier bloc qui la traite. Avec la directive « `root /data/www` », la requête est associée au fichier `/data/www/logo.gif`, qui est envoyé au client.

- La requête « `/index.php` » correspond aussi d'abord au bloc à préfixe « `/` », puis à l'expression régulière « `\.(php)$` » : elle est donc traitée par ce dernier bloc et transmise au serveur FastCGI qui écoute sur localhost:9000. La directive [[12-directives/fastcgi-param|fastcgi_param]] règle le paramètre FastCGI `SCRIPT_FILENAME` sur « `/data/www/index.php` », et le serveur FastCGI exécute le fichier. La variable `$document_root` vaut la valeur de la directive [[12-directives/root|root]], et `$fastcgi_script_name` l'URI de la requête, soit « `/index.php` ».

- La requête « `/about.html` » ne correspond qu'au bloc à préfixe « `/` » et est donc traitée par lui. Avec la directive « `root /data/www` », elle est associée au fichier `/data/www/about.html`, qui est envoyé au client.

- Le traitement de la requête « `/` » est plus complexe. Elle ne correspond qu'au bloc à préfixe « `/` » et est donc traitée par lui. La directive [[12-directives/index|index]] vérifie alors l'existence des fichiers d'index selon ses paramètres et la directive « `root /data/www` ». Si le fichier `/data/www/index.html` n'existe pas mais que `/data/www/index.php` existe, la directive effectue une redirection interne vers « `/index.php` », et nginx recherche de nouveau les blocs location comme si la requête venait du client. Comme vu plus haut, la requête redirigée finit par être traitée par le serveur FastCGI.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
