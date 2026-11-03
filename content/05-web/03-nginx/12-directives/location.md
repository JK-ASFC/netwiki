---
title: "location"
description: "Directive nginx location (ngx_http_core_module) — Définit une configuration selon l'URI de la requête ou la valeur d'une variable (1.31.5). La correspondance porte sur l'URI normalisé, après décodage du texte encodé sous la forme « %XX », résolution…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `location [ = \| ~ \| ~* \| ^~ ] uri { ... }` ou `location $variable { ... }` ou `location @name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit une configuration selon l'URI de la requête ou la valeur d'une variable (1.31.5).

La correspondance porte sur l'URI normalisé, après décodage du texte encodé sous la forme « `%XX` », résolution des composantes relatives « `.` » et « `..` » et éventuelle [[12-directives/merge-slashes|fusion]] de plusieurs barres obliques consécutives en une seule.

Un bloc location peut être défini par une chaîne de préfixe, une expression régulière ou un prédicat (1.31.5). Les expressions régulières sont précédées du modificateur « `~*` » (correspondance insensible à la casse) ou « `~` » (sensible à la casse). Un prédicat est précédé de « `$` » et contient une variable évaluée pendant le traitement de la requête ; il correspond si la valeur de la variable n'est ni vide ni égale à « 0 ».

> [!NOTE]
> La valeur d'une variable mise en cache est évaluée une fois par requête ; elle sert aussi lors de la recherche des blocs location après une redirection interne et dans les sous-requêtes. Pour évaluer un prédicat à chaque recherche, on peut utiliser une variable non mise en cache, par exemple une variable [[12-directives/map-http-map|map]] avec le paramètre `volatile`.

Pour trouver le bloc location qui correspond à une requête, nginx examine d'abord les blocs définis par des chaînes de préfixe (blocs à préfixe). Parmi eux, celui dont le préfixe correspondant est le plus long est retenu et mémorisé. Ensuite, les expressions régulières sont examinées dans l'ordre d'apparition dans le fichier de configuration. La recherche s'arrête à la première correspondance, dont la configuration est utilisée. Si aucune expression régulière ne correspond, les blocs à prédicat sont examinés dans l'ordre d'apparition. Si aucun ne correspond, la configuration du bloc à préfixe mémorisé précédemment est utilisée.

Les blocs `location` peuvent être imbriqués, avec quelques exceptions décrites ci-dessous.

Sur les systèmes d'exploitation insensibles à la casse, comme macOS et Cygwin, la comparaison avec les chaînes de préfixe ignore la casse (0.7.7). Elle est toutefois limitée aux paramètres régionaux à un octet.

Les expressions régulières peuvent contenir des captures (0.7.40) réutilisables ensuite dans d'autres directives ; voir [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]].

Si le bloc à préfixe correspondant le plus long porte le modificateur « `^~` », les expressions régulières et les blocs à prédicat ne sont pas examinés.

Le modificateur « `=` » permet en outre de définir une correspondance exacte entre l'URI et le bloc location. Si une correspondance exacte est trouvée, la recherche s'arrête. Par exemple, si les requêtes « `/` » sont fréquentes, définir « `location = /` » accélère leur traitement, car la recherche s'arrête dès la première comparaison. Un tel bloc ne peut évidemment pas contenir de blocs imbriqués.

> [!NOTE]
> Dans les versions 0.7.1 à 0.8.41, si une requête correspondait à un bloc à préfixe sans les modificateurs « `=` » et « `^~` », la recherche s'arrêtait aussi et les expressions régulières n'étaient pas examinées.

Illustrons cela par un exemple :

```nginx
location = / {
    [ configuration A ]
}

location / {
    [ configuration B ]
}

location /documents/ {
    [ configuration C ]
}

location ^~ /images/ {
    [ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}

location $arg_pred {
    [ configuration F ]
}
```

La requête « `/` » correspond à la configuration A, « `/index.html` » à la configuration B, « `/documents/document.html` » à la configuration C, « `/images/1.gif` » à la configuration D, « `/documents/1.jpg` » à la configuration E et « `/documents/index.html?pred=1` » à la configuration F.

Le préfixe « `@` » définit un bloc location nommé. Un tel bloc ne sert pas au traitement normal des requêtes, mais à leur redirection. Ces blocs ne peuvent pas être imbriqués ni contenir de blocs imbriqués.

Si un bloc location est défini par une chaîne de préfixe terminée par une barre oblique et que les requêtes sont traitées par [[12-directives/proxy-pass-http-proxy|proxy_pass]], [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]], [[12-directives/scgi-pass|scgi_pass]], [[12-directives/memcached-pass|memcached_pass]] ou [[12-directives/grpc-pass|grpc_pass]], un traitement particulier s'applique : une requête dont l'URI est égal à cette chaîne, mais sans la barre oblique finale, reçoit une redirection permanente (code 301) vers l'URI demandé suivi de la barre oblique. Si ce n'est pas souhaité, on peut définir une correspondance exacte de l'URI et du bloc location, comme ceci :

```nginx
location /user/ {
    proxy_pass http://user.example.com;
}

location = /user {
    proxy_pass http://login.example.com;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
