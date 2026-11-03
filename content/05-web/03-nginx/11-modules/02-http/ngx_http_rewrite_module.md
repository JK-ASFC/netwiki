---
title: "ngx_http_rewrite_module"
description: "Module nginx ngx_http_rewrite_module — Le module ngx_http_rewrite_module sert à modifier l'URI de la requête à l'aide d'expressions régulières PCRE, à renvoyer des redirections et à choisir une configuration selon des conditions."
tags: [nginx, module, ngx_http_rewrite_module]
icon: puzzle
---

Le module `ngx_http_rewrite_module` sert à modifier l'URI de la requête à l'aide d'expressions régulières PCRE, à renvoyer des redirections et à choisir une configuration selon des conditions.

Les directives [[12-directives/break|break]], [[12-directives/if|if]], [[12-directives/return-http-rewrite|return]], [[12-directives/rewrite|rewrite]] et [[12-directives/set-http-rewrite|set]] sont traitées dans l'ordre suivant :

- les directives de ce module indiquées au niveau [[12-directives/server-http-core|server]] sont exécutées dans l'ordre ;
- puis, de façon répétée :

  - un bloc [[12-directives/location|location]] est recherché d'après l'URI de la requête ;
  - les directives de ce module indiquées dans le bloc location trouvé sont exécutées dans l'ordre ;
  - la boucle recommence si l'URI de la requête a été [[12-directives/rewrite|réécrite]], mais pas plus de [[12-directives/internal|10 fois]].

## Fonctionnement interne

Les directives du module `ngx_http_rewrite_module` sont compilées, lors de la lecture de la configuration, en instructions internes interprétées pendant le traitement de la requête. L'interpréteur est une simple machine virtuelle à pile.

Par exemple, les directives

```nginx
location /download/ {
    if ($forbidden) {
        return 403;
    }

    if ($slow) {
        limit_rate 10k;
    }

    rewrite ^/(download/.*)/media/(.*)\..*$ /$1/mp3/$2.mp3 break;
}
```

sont traduites en ces instructions :

```nginx
variable $forbidden
check against zero
    return 403
    end of code
variable $slow
check against zero
match of regular expression
copy "/"
copy $1
copy "/mp3/"
copy $2
copy ".mp3"
end of regular expression
end of code
```

Il n'y a pas d'instruction pour la directive [[12-directives/limit-rate|limit_rate]] ci-dessus, car elle ne relève pas du module `ngx_http_rewrite_module`. Une configuration distincte est créée pour le bloc [[12-directives/if|if]]. Si la condition est vraie, la requête reçoit cette configuration, dans laquelle `limit_rate` vaut 10k.

La directive

```nginx
rewrite ^/(download/.*)/media/(.*)\..*$ /$1/mp3/$2.mp3 break;
```

peut compter une instruction de moins si la première barre oblique de l'expression régulière est placée entre les parenthèses :

```nginx
rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 break;
```

Les instructions correspondantes sont alors :

```nginx
match of regular expression
copy $1
copy "/mp3/"
copy $2
copy ".mp3"
end of regular expression
end of code
```

## Directives

- [[12-directives/break|break]]
- [[12-directives/if|if]]
- [[12-directives/return-http-rewrite|return]]
- [[12-directives/rewrite|rewrite]]
- [[12-directives/rewrite-log|rewrite_log]]
- [[12-directives/set-http-rewrite|set]]
- [[12-directives/uninitialized-variable-warn|uninitialized_variable_warn]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
