---
title: "secure_link_md5"
description: "Directive nginx secure_link_md5 (ngx_http_secure_link_module) — Définit l'expression dont l'empreinte MD5 est calculée et comparée à la valeur transmise dans la requête. L'expression doit contenir la partie protégée du lien (la ressource) et un ingrédient secret.…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link_md5 expression;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Définit l'expression dont l'empreinte MD5 est calculée et comparée à la valeur transmise dans la requête.

L'expression doit contenir la partie protégée du lien (la ressource) et un ingrédient secret. Si le lien a une durée de vie limitée, elle doit aussi contenir `$secure_link_expires`.

Pour empêcher les accès non autorisés, l'expression peut contenir des informations sur le client, comme son adresse et la version de son navigateur.

Exemple :

```nginx
location /s/ {
    secure_link $arg_md5,$arg_expires;
    secure_link_md5 "$secure_link_expires$uri$remote_addr secret";

    if ($secure_link = "") {
        return 403;
    }

    if ($secure_link = "0") {
        return 410;
    }

    ...
}
```

Le lien « `/s/link?md5=_e4Nc3iduzkWRm01TBBNYw&expires=2147483647` » restreint l'accès à « `/s/link` » au client d'adresse IP 127.0.0.1. Sa durée de vie est limitée au 19 janvier 2038 (GMT).

Sous UNIX, la valeur de l'argument *md5* s'obtient ainsi :

```nginx
echo -n '2147483647/s/link127.0.0.1 secret' | \
    openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
