---
title: "aio"
description: "Directive nginx aio (ngx_http_core_module) — Active ou désactive l'utilisation des entrées-sorties asynchrones sur fichiers (AIO) sous FreeBSD et Linux : nginx location /video/ { aio on; output_buffers 1 64k; } Sous FreeBSD, AIO est utilisable…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `aio on \| off \| threads[=pool];` |
| **Valeur par défaut** | `aio off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.11 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'utilisation des entrées-sorties asynchrones sur fichiers (AIO) sous FreeBSD et Linux :

```nginx
location /video/ {
    aio            on;
    output_buffers 1 64k;
}
```

Sous FreeBSD, AIO est utilisable à partir de FreeBSD 4.3. Avant FreeBSD 11.0, AIO peut être soit intégré statiquement au noyau :

```nginx
options VFS_AIO
```

soit chargé dynamiquement comme module du noyau :

```nginx
kldload aio
```

Sous Linux, AIO est utilisable à partir du noyau 2.6.22. Il faut aussi activer [[12-directives/directio|directio]], sinon la lecture sera bloquante :

```nginx
location /video/ {
    aio            on;
    directio       512;
    output_buffers 1 128k;
}
```

Sous Linux, [[12-directives/directio|directio]] ne permet de lire que des blocs alignés sur 512 octets (ou 4K pour XFS). La fin non alignée du fichier est lue en mode bloquant. Il en va de même pour les requêtes de plages d'octets et pour les requêtes FLV qui ne partent pas du début du fichier : la lecture des données non alignées au début et à la fin du fichier est bloquante.

Lorsque AIO et [[12-directives/sendfile|sendfile]] sont tous deux activés sous Linux, AIO est utilisé pour les fichiers dont la taille est supérieure ou égale à celle indiquée dans la directive [[12-directives/directio|directio]], et [[12-directives/sendfile|sendfile]] pour les fichiers plus petits ou lorsque [[12-directives/directio|directio]] est désactivé.

```nginx
location /video/ {
    sendfile       on;
    aio            on;
    directio       8m;
}
```

Enfin, les fichiers peuvent être lus et [[12-directives/sendfile|envoyés]] en plusieurs threads (1.7.11), sans bloquer le processus de travail :

```nginx
location /video/ {
    sendfile       on;
    aio            threads;
}
```

Les opérations de lecture et d'envoi de fichiers sont confiées aux threads du [[12-directives/thread-pool|groupe]] indiqué. Si le nom du groupe est omis, le groupe nommé « `default` » est utilisé. Le nom du groupe peut aussi être défini par des variables :

```nginx
aio threads=pool$disk;
```

Par défaut, le multithreading est désactivé ; il doit être activé avec le paramètre de configuration `--with-threads`. Actuellement, il n'est compatible qu'avec les méthodes [[10-guides/01-introduction/events|epoll]], [[10-guides/01-introduction/events|kqueue]] et [[10-guides/01-introduction/events|eventport]]. L'envoi de fichiers en plusieurs threads n'est pris en charge que sous Linux.

Voir aussi la directive [[12-directives/sendfile|sendfile]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
