---
title: "secure_link_secret"
description: "Directive nginx secure_link_secret (ngx_http_secure_link_module) — Définit le mot secret (word) utilisé pour vérifier l'authenticité des liens demandés. L'URI complet d'un lien demandé a la forme suivante : nginx /prefix/hash/link où hash est la représentation…"
tags: [nginx, directive, ngx_http_secure_link_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `secure_link_secret word;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_secure_link_module\|ngx_http_secure_link_module]] |

## Utilisation

Définit le mot secret (*word*) utilisé pour vérifier l'authenticité des liens demandés.

L'URI complet d'un lien demandé a la forme suivante :

```nginx
/prefix/hash/link
```

où *hash* est la représentation hexadécimale de l'empreinte MD5 calculée sur la concaténation du lien et du mot secret, et *prefix* une chaîne quelconque sans barre oblique.

Si le lien demandé passe la vérification d'authenticité, la variable `$secure_link` reçoit le lien extrait de l'URI de la requête ; sinon, une chaîne vide.

Exemple :

```nginx
location /p/ {
    secure_link_secret secret;

    if ($secure_link = "") {
        return 403;
    }

    rewrite ^ /secure/$secure_link;
}

location /secure/ {
    internal;
}
```

Une requête « `/p/5e814704a28d9bc1914ff19fa0c4a00a/link` » est redirigée en interne vers « `/secure/link` ».

Sous UNIX, l'empreinte de cet exemple s'obtient ainsi :

```nginx
echo -n 'linksecret' | openssl md5 -hex
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
