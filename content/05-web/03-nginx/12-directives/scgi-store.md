---
title: "scgi_store"
description: "Directive nginx scgi_store (ngx_http_scgi_module) — Active l'enregistrement des fichiers sur le disque. Le paramètre on enregistre les fichiers avec les chemins correspondant aux directives alias ou root. Le paramètre off désactive l'enregistrement.…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_store on \| off \| string;` |
| **Valeur par défaut** | `scgi_store off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active l'enregistrement des fichiers sur le disque. Le paramètre `on` enregistre les fichiers avec les chemins correspondant aux directives [[12-directives/alias|alias]] ou [[12-directives/root|root]]. Le paramètre `off` désactive l'enregistrement. Le nom de fichier peut aussi être défini explicitement par une chaîne (*string*) avec variables :

```nginx
scgi_store /data/www$original_uri;
```

La date de modification des fichiers est fixée d'après le champ d'en-tête de réponse `Last-Modified` reçu. La réponse est d'abord écrite dans un fichier temporaire, puis le fichier est renommé. Depuis la version 0.8.9, les fichiers temporaires et le stockage permanent peuvent se trouver sur des systèmes de fichiers différents ; mais le fichier est alors copié d'un système de fichiers à l'autre au lieu d'un simple renommage, peu coûteux. Il est donc recommandé, pour un bloc location donné, de placer les fichiers enregistrés et le répertoire des fichiers temporaires, défini par la directive [[12-directives/scgi-temp-path|scgi_temp_path]], sur le même système de fichiers.

Cette directive permet de créer des copies locales de fichiers statiques qui ne changent pas, par exemple :

```nginx
location /images/ {
    root              /data/www;
    error_page        404 = /fetch$uri;
}

location /fetch/ {
    internal;

    scgi_pass         backend:9000;
    ...

    scgi_store        on;
    scgi_store_access user:rw group:rw all:r;
    scgi_temp_path    /data/temp;

    alias             /data/www/;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
