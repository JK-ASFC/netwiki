---
title: "scgi_param"
description: "Directive nginx scgi_param (ngx_http_scgi_module) — Définit un paramètre (parameter) à transmettre au serveur SCGI. La valeur (value) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_param parameter value [if_not_empty];` |
| **Valeur par défaut** | `scgi_param HTTP_HOST $host$is_request_port$request_port;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit un paramètre (*parameter*) à transmettre au serveur SCGI. La valeur (*value*) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `scgi_param` n'est définie au niveau courant.

Les [variables d'environnement CGI](https://datatracker.ietf.org/doc/html/rfc3875#section-4.1) standard doivent être fournies sous forme d'en-têtes SCGI ; voir le fichier `scgi_params` fourni avec la distribution :

```nginx
location / {
    include scgi_params;
    ...
}
```

Si la directive porte `if_not_empty` (1.1.11), le paramètre n'est transmis au serveur que si sa valeur n'est pas vide :

```nginx
scgi_param HTTPS $https if_not_empty;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
