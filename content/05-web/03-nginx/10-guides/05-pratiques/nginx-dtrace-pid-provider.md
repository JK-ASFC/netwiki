---
title: "Déboguer nginx avec le fournisseur pid de DTrace"
description: "Nginx — Déboguer nginx avec le fournisseur pid de DTrace. Cet article suppose une connaissance générale du fonctionnement interne de nginx et de DTrace."
tags: [nginx, guide]
icon: book-open
---

Cet article suppose une connaissance générale du fonctionnement interne de nginx et de DTrace.

Même si nginx compilé avec l'option [[10-guides/01-introduction/debugging-log|--with-debug]] fournit déjà beaucoup d'informations sur le traitement des requêtes, il est parfois souhaitable de tracer plus finement certaines parties du code tout en omettant le reste de la sortie de débogage. Le fournisseur pid de DTrace (disponible sous Solaris et macOS) est un outil utile pour explorer le fonctionnement interne des programmes utilisateur, car il ne nécessite aucune modification du code. Un script DTrace simple qui trace et affiche les appels de fonctions de nginx peut ressembler à ceci :

```c
#pragma D option flowindent

pid$target:nginx::entry {
}

pid$target:nginx::return {
}
```

Le traçage des appels de fonctions de DTrace ne fournit toutefois qu'une quantité limitée d'informations utiles. L'inspection en temps réel des arguments des fonctions est généralement plus intéressante, mais un peu plus complexe. Les exemples ci-dessous visent à familiariser le lecteur avec DTrace et l'analyse du comportement de nginx avec cet outil.

Un scénario courant consiste à se rattacher au processus de travail de nginx pour journaliser les lignes de requête et leur heure de début. La fonction à instrumenter est `ngx_http_process_request`, et l'argument concerné est un pointeur vers la structure `ngx_http_request_t`. Le script DTrace de journalisation des requêtes peut être aussi simple que :

```c
pid$target::*ngx_http_process_request:entry
{
    this->request = (ngx_http_request_t *)copyin(arg0, sizeof(ngx_http_request_t));
    this->request_line = stringof(copyin((uintptr_t)this->request->request_line.data,
                                         this->request->request_line.len));
    printf("request line = %s\n", this->request_line);
    printf("request start sec = %d\n", this->request->start_sec);
}
```

Dans l'exemple ci-dessus, DTrace doit connaître la structure `ngx_http_request_t`. On pourrait utiliser une directive `#include` dans le script DTrace et le passer au préprocesseur C (option `-C`), mais cela ne fonctionne pas vraiment : en raison des nombreuses dépendances croisées, il faudrait inclure presque tous les fichiers d'en-tête de nginx, qui incluent à leur tour, selon les réglages de `configure`, PCRE, OpenSSL et divers en-têtes système. En théorie, tous ces fichiers liés à une compilation donnée de nginx pourraient être inclus dans le prétraitement et la compilation du script DTrace ; en pratique, le script ne compilera très probablement pas à cause d'une syntaxe inconnue dans certains en-têtes.

On résout ce problème en n'incluant dans le script DTrace que les définitions de structures et de types pertinentes et nécessaires. DTrace doit connaître la taille des structures et des types ainsi que les décalages des champs. On peut donc réduire encore les dépendances en optimisant manuellement les définitions de structures pour DTrace.

Reprenons l'exemple de script DTrace ci-dessus et voyons de quelles définitions de structures il a besoin.

Il faut d'abord inclure le fichier `objs/ngx_auto_config.h` généré par configure, car il définit plusieurs constantes qui influencent divers `#ifdef`. Ensuite, quelques types et définitions de base comme `ngx_str_t`, `ngx_table_elt_t`, `ngx_uint_t`, etc. doivent être placés au début du script DTrace. Ces définitions sont compactes, très utilisées et peu susceptibles de changer souvent.

Vient ensuite la structure `ngx_http_request_t`, qui contient de nombreux pointeurs vers d'autres structures. Comme ces pointeurs sont sans intérêt pour ce script et ont tous la même taille, on peut les remplacer par des pointeurs void. Plutôt que de modifier les définitions, il vaut mieux ajouter des typedef appropriés :

```c
typedef ngx_http_upstream_t     void;
typedef ngx_http_request_body_t void;
```

Enfin, il faut ajouter les définitions de deux structures membres (`ngx_http_headers_in_t`, `ngx_http_headers_out_t`), les déclarations des fonctions de rappel et les définitions des constantes.

Le script DTrace final peut être téléchargé [ici](http://nginx.org/download/trace_process_request.d).

L'exemple suivant montre la sortie de l'exécution de ce script :

```c
# dtrace -C -I ./objs -s trace_process_request.d -p 4848
dtrace: script 'trace_process_request.d' matched 1 probe
CPU     ID                    FUNCTION:NAME
  1      4 .XAbmO.ngx_http_process_request:entry request line = GET / HTTP/1.1
request start sec = 1349162898

  0      4 .XAbmO.ngx_http_process_request:entry request line = GET /en/docs/nginx_dtrace_pid_provider.html HTTP/1.1
request start sec = 1349162899
```

Avec des techniques similaires, le lecteur devrait pouvoir tracer d'autres appels de fonctions de nginx.

## Voir aussi

- [Solaris Dynamic Tracing Guide](http://docs.oracle.com/cd/E19253-01/817-6223/index.html)
- [Article d'introduction au fournisseur pid de DTrace](http://dtrace.org/blogs/brendan/2011/02/09/dtrace-pid-provider/)

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
