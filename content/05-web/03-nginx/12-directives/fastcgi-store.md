---
title: "fastcgi_store"
description: "Directive nginx fastcgi_store (ngx_http_fastcgi_module) — Active l'enregistrement des fichiers sur le disque. Le paramètre on enregistre les fichiers avec les chemins correspondant aux directives alias ou root. Le paramètre off désactive l'enregistrement.…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_store on \| off \| string;` |
| **Valeur par défaut** | `fastcgi_store off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Active l'enregistrement des fichiers sur le disque. Le paramètre `on` enregistre les fichiers avec les chemins correspondant aux directives [[12-directives/alias|alias]] ou [[12-directives/root|root]]. Le paramètre `off` désactive l'enregistrement. Le nom de fichier peut aussi être défini explicitement par une chaîne (*string*) avec variables :

```nginx
fastcgi_store /data/www$original_uri;
```

The modification time of files is set according to the received `Last-Modified` response header field. The response is first written to a temporary file, and then the file is renamed. Starting from version 0.8.9, temporary files and the persistent store can be put on different file systems. However, be aware that in this case a file is copied across two file systems instead of the cheap renaming operation. It is thus recommended that for any given location both saved files and a directory holding temporary files, set by the [[12-directives/fastcgi-temp-path|fastcgi_temp_path]] directive, are put on the same file system.

Cette directive permet de créer des copies locales de fichiers statiques qui ne changent pas, par exemple :

```nginx
location /images/ {
    root                 /data/www;
    error_page           404 = /fetch$uri;
}

location /fetch/ {
    internal;

    fastcgi_pass         backend:9000;
    ...

    fastcgi_store        on;
    fastcgi_store_access user:rw group:rw all:r;
    fastcgi_temp_path    /data/temp;

    alias                /data/www/;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
