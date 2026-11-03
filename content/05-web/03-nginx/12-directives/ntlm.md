---
title: "ntlm"
description: "Directive nginx ntlm (ngx_http_upstream_module) — Permet de relayer les requêtes utilisant l'authentification NTLM. La connexion amont est liée à la connexion du client dès que celui-ci envoie une requête dont le champ d'en-tête Authorization…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ntlm;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Permet de relayer les requêtes utilisant l'[authentification NTLM](https://en.wikipedia.org/wiki/Integrated_Windows_Authentication). La connexion amont est liée à la connexion du client dès que celui-ci envoie une requête dont le champ d'en-tête `Authorization` commence par « `Negotiate` » ou « `NTLM` ». Les requêtes suivantes du client passent par la même connexion amont, ce qui conserve le contexte d'authentification.

Pour que l'authentification NTLM fonctionne, il faut activer les connexions persistantes vers les serveurs amont. La directive [[12-directives/proxy-http-version|proxy_http_version]] doit valoir « `1.1` » (valeur par défaut depuis 1.29.7) ou « `2` », et le champ d'en-tête `Connection` doit être vidé. Cet exemple concerne les versions antérieures à 1.29.7 :

```nginx
upstream http_backend {
    server 127.0.0.1:8080;

    ntlm;
}

server {
    ...

    location /http/ {
        proxy_pass http://http_backend;
        # proxy_http_version 1.1; # before version 1.29.7
        # proxy_set_header Connection ""; # before version 1.29.7
        ...
    }
}
```

> [!NOTE]
> Avec une méthode de répartition autre que le tourniquet par défaut, il faut l'activer avant la directive `ntlm`.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
