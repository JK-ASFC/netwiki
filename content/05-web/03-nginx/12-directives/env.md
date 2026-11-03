---
title: "env"
description: "Directive nginx env (ngx_core_module) — Par défaut, nginx supprime toutes les variables d'environnement héritées de son processus parent, sauf la variable TZ. Cette directive permet de conserver certaines variables héritées, de modifier…"
tags: [nginx, directive, ngx_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `env variable[=value];` |
| **Valeur par défaut** | `env TZ;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/ngx_core_module\|ngx_core_module]] |

## Utilisation

Par défaut, nginx supprime toutes les variables d'environnement héritées de son processus parent, sauf la variable TZ. Cette directive permet de conserver certaines variables héritées, de modifier leur valeur ou de créer de nouvelles variables d'environnement. Ces variables sont ensuite :

- héritées lors d'une [[10-guides/01-introduction/control|mise à jour à chaud]] de l'exécutable ;
- utilisées par le module [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]] ;
- utilisées par les processus de travail. Il faut garder à l'esprit qu'il n'est pas toujours possible de piloter ainsi les bibliothèques système, car elles ne lisent souvent les variables qu'à leur initialisation, bien avant que cette directive ne puisse les définir. La [[10-guides/01-introduction/control|mise à jour à chaud]] de l'exécutable, citée plus haut, fait exception.

La variable TZ est toujours héritée et disponible pour le module [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]], sauf si elle est configurée explicitement.

Exemple d'utilisation :

```nginx
env MALLOC_OPTIONS;
env PERL5LIB=/data/site/modules;
env OPENSSL_ALLOW_PROXY_CERTS=1;
```

> [!NOTE]
> La variable d'environnement NGINX est utilisée en interne par nginx et ne doit pas être définie directement par l'utilisateur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
