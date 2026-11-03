---
title: "Convertir des règles de réécriture"
description: "Nginx — Convertir des règles de réécriture. Ceux qui, du temps de l'hébergement mutualisé, configuraient tout uniquement avec les fichiers .htaccess d'Apache traduisent généralement les règles suivantes :"
tags: [nginx, guide]
icon: book-open
---

## Redirection vers un site principal

Ceux qui, du temps de l'hébergement mutualisé, configuraient *tout* *uniquement* avec les fichiers .htaccess d'Apache traduisent généralement les règles suivantes :

```c
RewriteCond  %{HTTP_HOST}  example.org
RewriteRule  (.*)          http://www.example.org$1
```

en quelque chose comme ceci :

```
server {
    listen       80;
    server_name  www.example.org  example.org;
    if ($http_host = example.org) {
        rewrite  (.*)  http://www.example.org$1;
    }
    ...
}
```

C'est une méthode incorrecte, lourde et inefficace. La bonne méthode consiste à définir un serveur distinct pour `example.org` :

```
server {
    listen       80;
    server_name  example.org;
    return       301 http://www.example.org$request_uri;
}

server {
    listen       80;
    server_name  www.example.org;
    ...
}
```

> [!NOTE]
> Dans les versions antérieures à 0.9.1, les redirections peuvent se faire avec :
>
> ```c
> rewrite      ^ http://www.example.org$request_uri?;
> ```

Autre exemple. Au lieu de la logique « à l'envers » « tout ce qui n'est ni `example.com` ni `www.example.com` » :

```c
RewriteCond  %{HTTP_HOST}  !example.com
RewriteCond  %{HTTP_HOST}  !www.example.com
RewriteRule  (.*)          http://www.example.com$1
```

il suffit de définir `example.com`, `www.example.com` et « tout le reste » :

```
server {
    listen       80;
    server_name  example.com www.example.com;
    ...
}

server {
    listen       80 default_server;
    server_name  _;
    return       301 http://example.com$request_uri;
}
```

> [!NOTE]
> Dans les versions antérieures à 0.9.1, les redirections peuvent se faire avec :
>
> ```c
> rewrite      ^ http://example.com$request_uri?;
> ```

## Convertir des règles Mongrel

Règles Mongrel typiques :

```c
DocumentRoot /var/www/myapp.com/current/public

RewriteCond %{DOCUMENT_ROOT}/system/maintenance.html -f
RewriteCond %{SCRIPT_FILENAME} !maintenance.html
RewriteRule ^.*$ %{DOCUMENT_ROOT}/system/maintenance.html [L]

RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.*)$ $1 [QSA,L]

RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [QSA,L]

RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [QSA,L]

RewriteRule ^/(.*)$ balancer://mongrel_cluster%{REQUEST_URI} [P,QSA,L]
```

à convertir en

```
location / {
    root       /var/www/myapp.com/current/public;

    try_files  /system/maintenance.html
               $uri  $uri/index.html $uri.html
               @mongrel;
}

location @mongrel {
    proxy_pass  http://mongrel;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
