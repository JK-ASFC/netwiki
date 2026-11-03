---
title: "try_files"
description: "Directive nginx try_files (ngx_http_core_module) — Vérifie l'existence des fichiers dans l'ordre indiqué et utilise le premier trouvé pour traiter la requête ; le traitement a lieu dans le contexte courant. Le chemin du fichier est construit à partir…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `try_files file ... uri;` ou `try_files file ... =code;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Vérifie l'existence des fichiers dans l'ordre indiqué et utilise le premier trouvé pour traiter la requête ; le traitement a lieu dans le contexte courant. Le chemin du fichier est construit à partir du paramètre *file* selon les directives [[12-directives/root|root]] et [[12-directives/alias|alias]]. On peut vérifier l'existence d'un répertoire en terminant le nom par une barre oblique, par exemple « `$uri/` ». Si aucun fichier n'est trouvé, une redirection interne vers l'*uri* indiqué en dernier paramètre a lieu. Par exemple :

```nginx
location /images/ {
    try_files $uri /images/default.gif;
}

location = /images/default.gif {
    expires 30s;
}
```

Le dernier paramètre peut aussi désigner un bloc location nommé, comme dans les exemples ci-dessous. Depuis la version 0.7.51, il peut aussi être un code (*code*) :

```nginx
location / {
    try_files $uri $uri/index.html $uri.html =404;
}
```

Exemple de relais vers Mongrel :

```nginx
location / {
    try_files /system/maintenance.html
              $uri $uri/index.html $uri.html
              @mongrel;
}

location @mongrel {
    proxy_pass http://mongrel;
}
```

Exemple pour Drupal/FastCGI :

```nginx
location / {
    try_files $uri $uri/ @drupal;
}

location ~ \.php$ {
    try_files $uri @drupal;

    fastcgi_pass ...;

    fastcgi_param SCRIPT_FILENAME /path/to$fastcgi_script_name;
    fastcgi_param SCRIPT_NAME     $fastcgi_script_name;
    fastcgi_param QUERY_STRING    $args;

    ... other fastcgi_param's
}

location @drupal {
    fastcgi_pass ...;

    fastcgi_param SCRIPT_FILENAME /path/to/index.php;
    fastcgi_param SCRIPT_NAME     /index.php;
    fastcgi_param QUERY_STRING    q=$uri&$args;

    ... other fastcgi_param's
}
```

Dans l'exemple suivant,

```nginx
location / {
    try_files $uri $uri/ @drupal;
}
```

la directive `try_files` équivaut à

```nginx
location / {
    error_page 404 = @drupal;
    log_not_found off;
}
```

Et ici,

```nginx
location ~ \.php$ {
    try_files $uri @drupal;

    fastcgi_pass ...;

    fastcgi_param SCRIPT_FILENAME /path/to$fastcgi_script_name;

    ...
}
```

`try_files` vérifie l'existence du fichier PHP avant de transmettre la requête au serveur FastCGI.

Exemple pour WordPress et Joomla :

```nginx
location / {
    try_files $uri $uri/ @wordpress;
}

location ~ \.php$ {
    try_files $uri @wordpress;

    fastcgi_pass ...;

    fastcgi_param SCRIPT_FILENAME /path/to$fastcgi_script_name;
    ... other fastcgi_param's
}

location @wordpress {
    fastcgi_pass ...;

    fastcgi_param SCRIPT_FILENAME /path/to/index.php;
    ... other fastcgi_param's
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
