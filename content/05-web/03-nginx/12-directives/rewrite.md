---
title: "rewrite"
description: "Directive nginx rewrite (ngx_http_rewrite_module) — Si l'expression régulière indiquée correspond à l'URI de la requête, l'URI est modifié selon la chaîne de remplacement (replacement). Les directives rewrite sont exécutées dans l'ordre où elles…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `rewrite regex replacement [flag];` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Si l'expression régulière indiquée correspond à l'URI de la requête, l'URI est modifié selon la chaîne de remplacement (*replacement*). Les directives `rewrite` sont exécutées dans l'ordre où elles apparaissent dans le fichier de configuration. Des drapeaux permettent d'interrompre le traitement des directives suivantes. Si la chaîne de remplacement commence par « `http://` », « `https://` » ou « `$scheme` », le traitement s'arrête et la redirection est renvoyée au client.

Le paramètre facultatif *flag* peut valoir :

- **`last`**

  arrête le traitement de l'ensemble courant de directives `ngx_http_rewrite_module` et lance la recherche d'un nouveau bloc location correspondant à l'URI modifié ;

- **`break`**

  arrête le traitement de l'ensemble courant de directives `ngx_http_rewrite_module`, comme la directive [[12-directives/break|break]] ;

- **`redirect`**

  renvoie une redirection temporaire avec le code 302 ; utilisé si la chaîne de remplacement ne commence pas par « `http://` », « `https://` » ou « `$scheme` » ;

- **`permanent`**

  renvoie une redirection permanente avec le code 301.

L'URL de redirection complète est formée d'après le schéma de la requête (`$scheme`) et les directives [[12-directives/server-name-in-redirect|server_name_in_redirect]] et [[12-directives/port-in-redirect|port_in_redirect]].

Exemple :

```nginx
server {
    ...
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 last;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra  last;
    return  403;
    ...
}
```

Mais si ces directives sont placées dans le bloc location « `/download/` », le drapeau `last` doit être remplacé par `break` ; sinon nginx effectuera 10 cycles et renverra une erreur 500 :

```nginx
location /download/ {
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 break;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra  break;
    return  403;
}
```

Si la chaîne de remplacement (*replacement*) contient de nouveaux arguments de requête, les arguments précédents sont ajoutés après eux. Pour éviter cet ajout, placer un point d'interrogation à la fin de la chaîne de remplacement, par exemple :

```nginx
rewrite ^/users/(.*)$ /show?user=$1? last;
```

Si une expression régulière contient les caractères « `}` » ou « `;` », l'expression entière doit être placée entre guillemets simples ou doubles.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
