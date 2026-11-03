---
title: "sticky"
description: "Directive nginx sticky (ngx_http_upstream_module) — Active l'affinité de session : les requêtes d'un même client sont transmises au même serveur du groupe. Trois méthodes sont disponibles : - cookie Avec la méthode cookie, l'information sur le serveur…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sticky cookie name [expires=time] [domain=domain] [httponly] [samesite=strict\|lax\|none\|$variable] [secure] [path=path];` ou `sticky route $variable ...;` ou `sticky learn create=$variable lookup=$variable zone=name:size [timeout=time] [header] [sync];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Active l'affinité de session : les requêtes d'un même client sont transmises au même serveur du groupe. Trois méthodes sont disponibles :

- **`cookie`**

  Avec la méthode `cookie`, l'information sur le serveur désigné est transmise dans un cookie HTTP généré par nginx :

  ```nginx
  upstream backend {
      server backend1.example.com;
      server backend2.example.com;

      sticky cookie srv_id expires=1h domain=.example.com path=/;
  }
  ```

  Une requête d'un client qui n'est pas encore lié à un serveur est transmise au serveur choisi par la méthode de répartition configurée. Les requêtes suivantes portant ce cookie sont transmises au serveur désigné. Si celui-ci ne peut pas traiter une requête, un nouveau serveur est choisi comme si le client n'était pas encore lié.

  > [!NOTE]
  > Comme la méthode de répartition cherche toujours à équilibrer la charge en tenant compte des requêtes déjà liées, un serveur ayant davantage de requêtes liées actives a moins de chances de recevoir de nouvelles requêtes non liées.

  Le premier paramètre définit le nom du cookie à créer ou à examiner. La valeur du cookie est la représentation hexadécimale de l'empreinte MD5 de l'adresse IP et du port, ou du chemin du socket de domaine UNIX. Toutefois, si le paramètre « `route` » de la directive [[12-directives/server-http-upstream|server]] est indiqué, la valeur du cookie est celle de ce paramètre :

  ```nginx
  upstream backend {
      server backend1.example.com route=a;
      server backend2.example.com route=b;

      sticky cookie srv_id expires=1h domain=.example.com path=/;
  }
  ```

  Dans ce cas, la valeur du cookie « `srv_id` » est *a* ou *b*.

  Les paramètres supplémentaires peuvent être :

  - **`expires=`*time***

    Définit la durée (*time*) pendant laquelle le navigateur doit conserver le cookie. La valeur spéciale `max` fait expirer le cookie le « `31 Dec 2037 23:55:55 GMT` ». Sans ce paramètre, le cookie expire à la fin de la session du navigateur.

  - **`domain=`*domain***

    Définit le domaine (*domain*) pour lequel le cookie est défini. La valeur du paramètre peut contenir des variables (1.11.5).

  - **`httponly`**

    Ajoute l'attribut `HttpOnly` au cookie (1.7.11).

  - **`samesite=``strict` | `lax` | `none` | *$variable***

    Ajoute au cookie l'attribut `SameSite` (1.19.4) avec l'une des valeurs `Strict`, `Lax` ou `None`, ou à l'aide de variables (1.23.3). Dans ce dernier cas, si la valeur de la variable est vide, l'attribut `SameSite` n'est pas ajouté ; si elle vaut `Strict`, `Lax` ou `None`, cette valeur est utilisée ; sinon, la valeur `Strict` est attribuée.

  - **`secure`**

    Ajoute l'attribut `Secure` au cookie (1.7.11).

  - **`path=`*path***

    Définit le chemin (*path*) pour lequel le cookie est défini.

  Si des paramètres sont omis, les champs correspondants du cookie ne sont pas définis.

- **`route`**

  Avec la méthode `route`, le serveur mandaté attribue une route au client dès la première requête. Toutes les requêtes suivantes de ce client portent l'information de routage dans un cookie ou dans l'URI. Cette information est comparée au paramètre « `route` » de la directive [[12-directives/server-http-upstream|server]] pour déterminer le serveur auquel transmettre la requête. Si le paramètre « `route` » n'est pas indiqué, le nom de route est la représentation hexadécimale de l'empreinte MD5 de l'adresse IP et du port, ou du chemin du socket de domaine UNIX. Si le serveur désigné ne peut pas traiter une requête, un nouveau serveur est choisi par la méthode de répartition configurée, comme si la requête ne contenait aucune information de routage.

  Les paramètres de la méthode `route` indiquent les variables pouvant contenir l'information de routage. La première variable non vide sert à trouver le serveur correspondant.

  Exemple :

  ```nginx
  map $cookie_jsessionid $route_cookie {
      ~.+\.(?P<route>\w+)$ $route;
  }

  map $request_uri $route_uri {
      ~jsessionid=.+\.(?P<route>\w+)$ $route;
  }

  upstream backend {
      server backend1.example.com route=a;
      server backend2.example.com route=b;

      sticky route $route_cookie $route_uri;
  }
  ```

  Ici, la route est prise dans le cookie « `JSESSIONID` » s'il est présent dans la requête ; sinon, la route de l'URI est utilisée.

- **`learn`**

  Avec la méthode `learn` (1.7.1), nginx analyse les réponses du serveur amont et apprend les sessions créées par le serveur, généralement transmises dans un cookie HTTP.

  ```nginx
  upstream backend {
     server backend1.example.com:8080;
     server backend2.example.com:8081;

     sticky learn
            create=$upstream_cookie_examplecookie
            lookup=$cookie_examplecookie
            zone=client_sessions:1m;
  }
  ```

  Dans l'exemple, le serveur amont crée une session en définissant le cookie « `EXAMPLECOOKIE` » dans sa réponse. Les requêtes suivantes portant ce cookie sont transmises au même serveur. Si celui-ci ne peut pas traiter la requête, un nouveau serveur est choisi comme si le client n'était pas encore lié.

  Les paramètres `create` et `lookup` indiquent les variables qui précisent respectivement comment créer les nouvelles sessions et rechercher les sessions existantes. Ils peuvent être indiqués plusieurs fois ; la première variable non vide est alors utilisée.

  Les sessions sont conservées dans une zone de mémoire partagée dont le nom (*name*) et la taille (*size*) se règlent avec le paramètre `zone`. Une zone d'un mégaoctet peut contenir environ 4000 sessions sur une plate-forme 64 bits. Les sessions non consultées pendant la durée indiquée par le paramètre `timeout` sont supprimées de la zone. Par défaut, `timeout` vaut 10 minutes.

  Le paramètre `header` (1.13.1) permet de créer une session dès la réception des en-têtes de réponse du serveur amont.

  Le paramètre `sync` (1.13.8) active la [[12-directives/zone-sync|synchronisation]] de la zone de mémoire partagée. Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

> [!NOTE]
> Avant la version 1.29.6, cette directive n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
