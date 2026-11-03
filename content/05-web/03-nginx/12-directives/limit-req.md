---
title: "limit_req"
description: "Directive nginx limit_req (ngx_http_limit_req_module) — Définit la zone de mémoire partagée et la taille maximale des rafales de requêtes. Si le débit des requêtes dépasse celui configuré pour la zone, leur traitement est retardé pour respecter le débit…"
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req zone=name [burst=number] [nodelay \| delay=number];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Définit la zone de mémoire partagée et la taille maximale des rafales de requêtes. Si le débit des requêtes dépasse celui configuré pour la zone, leur traitement est retardé pour respecter le débit défini. Les requêtes excédentaires sont retardées jusqu'à ce que leur nombre dépasse la taille maximale de rafale ; la requête est alors terminée avec une [[12-directives/limit-req-status|erreur]]. Par défaut, la taille maximale de rafale est nulle. Par exemple, les directives

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

server {
    location /search/ {
        limit_req zone=one burst=5;
    }
```

autorisent au plus 1 requête par seconde en moyenne, avec des rafales d'au plus 5 requêtes.

Si l'on ne souhaite pas retarder les requêtes excédentaires pendant la limitation, utiliser le paramètre `nodelay` :

```nginx
limit_req zone=one burst=5 nodelay;
```

Le paramètre `delay` (1.15.7) indique le seuil à partir duquel les requêtes excédentaires sont retardées. La valeur par défaut est zéro : toutes les requêtes excédentaires sont retardées.

Il peut y avoir plusieurs directives `limit_req`. Par exemple, la configuration suivante limite le débit des requêtes provenant d'une même adresse IP et, en même temps, le débit des requêtes traitées par le serveur virtuel :

```nginx
limit_req_zone $binary_remote_addr zone=perip:10m rate=1r/s;
limit_req_zone $server_name zone=perserver:10m rate=10r/s;

server {
    ...
    limit_req zone=perip burst=5 nodelay;
    limit_req zone=perserver burst=10;
}
```

Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `limit_req` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
