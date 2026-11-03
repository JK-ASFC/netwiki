---
title: "proxy_pass (ngx_http_proxy_module)"
description: "Directive nginx proxy_pass (ngx_http_proxy_module) — Définit le protocole et l'adresse d'un serveur mandaté, ainsi qu'un URI facultatif auquel le bloc location doit correspondre. Le protocole peut être « http » ou « https ». L'adresse peut être un nom…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit le protocole et l'adresse d'un serveur mandaté, ainsi qu'un URI facultatif auquel le bloc location doit correspondre. Le protocole peut être « `http` » ou « `https` ». L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif :

```nginx
proxy_pass http://localhost:8000/uri/;
```

ou le chemin d'un socket de domaine UNIX, indiqué après le mot « `unix` » et encadré de deux-points :

```nginx
proxy_pass http://unix:/tmp/backend.socket:/uri/;
```

Si un nom de domaine se résout en plusieurs adresses, elles sont toutes utilisées à tour de rôle. Une adresse peut aussi désigner un [[11-modules/02-http/ngx_http_upstream_module|groupe de serveurs]].

La valeur du paramètre peut contenir des variables. Dans ce cas, si l'adresse est un nom de domaine, le nom est recherché parmi les groupes de serveurs définis puis, s'il est introuvable, résolu à l'aide d'un [[12-directives/resolver-http-core|résolveur]].

L'URI de la requête est transmis au serveur de la façon suivante :

- Si la directive `proxy_pass` contient un URI, la partie de l'URI de requête [[12-directives/location|normalisé]] qui correspond au bloc location est remplacée par l'URI indiqué dans la directive :

  ```nginx
  location /name/ {
      proxy_pass http://127.0.0.1/remote/;
  }
  ```

- Si `proxy_pass` ne contient pas d'URI, l'URI de requête est transmis au serveur sous la forme envoyée par le client lors du traitement de la requête d'origine, ou l'URI normalisé complet est transmis lors du traitement d'un URI modifié :

  ```nginx
  location /some/path/ {
      proxy_pass http://127.0.0.1;
  }
  ```

  > [!NOTE]
  > Avant la version 1.1.12, si `proxy_pass` ne contenait pas d'URI, l'URI d'origine pouvait dans certains cas être transmis à la place de l'URI modifié.

Dans certains cas, la partie de l'URI de requête à remplacer ne peut pas être déterminée :

- Lorsque le bloc location est défini par une expression régulière, et dans les blocs location nommés.

  Dans ces cas, `proxy_pass` doit être indiqué sans URI.

- Lorsque l'URI est modifié dans un bloc location relayé par la directive [[12-directives/rewrite|rewrite]] et que cette même configuration sert à traiter la requête (`break`) :

  ```nginx
  location /name/ {
      rewrite    /name/([^/]+) /users?name=$1 break;
      proxy_pass http://127.0.0.1;
  }
  ```

  Dans ce cas, l'URI indiqué dans la directive est ignoré et l'URI de requête modifié complet est transmis au serveur.

- Lorsque des variables sont utilisées dans `proxy_pass` :

  ```nginx
  location /name/ {
      proxy_pass http://127.0.0.1$request_uri;
  }
  ```

  Dans ce cas, si la directive contient un URI, il est transmis tel quel au serveur, à la place de l'URI de la requête d'origine.

Le relais [[10-guides/02-http/websocket|WebSocket]] nécessite une configuration particulière ; il est pris en charge depuis la version 1.3.13.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
