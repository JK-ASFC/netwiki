---
title: "fastcgi_param"
description: "Directive nginx fastcgi_param (ngx_http_fastcgi_module) — Définit un paramètre (parameter) à transmettre au serveur FastCGI. La valeur (value) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_param parameter value [if_not_empty];` |
| **Valeur par défaut** | `fastcgi_param HTTP_HOST $host$is_request_port$request_port;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Définit un paramètre (*parameter*) à transmettre au serveur FastCGI. La valeur (*value*) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `fastcgi_param` n'est définie au niveau courant.

L'exemple suivant montre les réglages minimaux nécessaires pour PHP :

```nginx
fastcgi_param SCRIPT_FILENAME /home/www/scripts/php$fastcgi_script_name;
fastcgi_param QUERY_STRING    $query_string;
```

Le paramètre `SCRIPT_FILENAME` sert à PHP pour déterminer le nom du script, et le paramètre `QUERY_STRING` à transmettre les paramètres de la requête.

Pour les scripts qui traitent des requêtes `POST`, les trois paramètres suivants sont aussi nécessaires :

```nginx
fastcgi_param REQUEST_METHOD  $request_method;
fastcgi_param CONTENT_TYPE    $content_type;
fastcgi_param CONTENT_LENGTH  $content_length;
```

Si PHP a été compilé avec le paramètre de configuration `--enable-force-cgi-redirect`, il faut aussi transmettre le paramètre `REDIRECT_STATUS` avec la valeur « 200 » :

```nginx
fastcgi_param REDIRECT_STATUS 200;
```

Si la directive porte `if_not_empty` (1.1.11), le paramètre n'est transmis au serveur que si sa valeur n'est pas vide :

```nginx
fastcgi_param HTTPS           $https if_not_empty;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
