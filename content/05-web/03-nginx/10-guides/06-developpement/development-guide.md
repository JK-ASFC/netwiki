---
title: "Guide du développeur"
description: "Nginx — Guide du développeur. nginx ne sépare pas formellement son interface de programmation en parties publique et privée. Tous les fichiers d'en-tête de l'arborescence des sources peuvent être inclus par les modules standard comme par les modules…"
tags: [nginx, guide]
icon: book-open
---

## Introduction

### API publique et privée

nginx ne sépare pas formellement son interface de programmation en parties publique et privée. Tous les fichiers d'en-tête de l'arborescence des sources peuvent être inclus par les modules standard comme par les modules tiers. Les définitions de structures, références de données externes, macros et fonctions qu'ils déclarent sont disponibles pour un usage public. Certaines existent toutefois pour la commodité interne de nginx, et les auteurs de modules devraient éviter d'en dépendre. Le meilleur moyen de rester dans la partie publique de l'API est de suivre ce guide.

Il est fortement déconseillé d'accéder aux données privées de nginx définies dans les fichiers source C et non exportées par les fichiers d'en-tête, tout comme de copier des fonctions standard de nginx pour en modifier le comportement. Un tel code est fragile : il peut devenir binairement incompatible avec une version ultérieure, et les correctifs de sécurité appliqués aux fonctions d'origine n'atteindront pas les copies.

### Organisation du code

- `auto` — Scripts de compilation
- `src`

  - `core` — Types et fonctions de base : chaînes, tableaux, journal, pool, etc.
  - `event` — Cœur des événements

    - `modules` — Modules de notification d'événements : `epoll`, `kqueue`, `select`, etc.
  - `http` — Module HTTP principal et code commun

    - `modules` — Autres modules HTTP
    - `v2` — HTTP/2
  - `mail` — Modules mail
  - `os` — Code propre à chaque plate-forme

    - `unix`
    - `win32`
  - `stream` — Modules stream

### Fichiers d'inclusion

Les deux instructions `#include` suivantes doivent figurer au début de chaque fichier nginx :

```c
#include <ngx_config.h>
#include <ngx_core.h>
```

En outre, le code HTTP doit inclure

```c
#include <ngx_http.h>
```

Le code mail doit inclure

```c
#include <ngx_mail.h>
```

Le code stream doit inclure

```c
#include <ngx_stream.h>
```

### Entiers

Pour un usage général, le code de nginx utilise deux types entiers, `ngx_int_t` et `ngx_uint_t`, qui sont des typedefs de `intptr_t` et `uintptr_t` respectivement.

### Codes de retour courants

La plupart des fonctions de nginx renvoient les codes suivants :

- `NGX_OK` — L'opération a réussi.
- `NGX_ERROR` — L'opération a échoué.
- `NGX_AGAIN` — L'opération est incomplète ; rappelez la fonction.
- `NGX_DECLINED` — L'opération est refusée, par exemple parce qu'elle est désactivée dans la configuration. Ce n'est jamais une erreur.
- `NGX_BUSY` — La ressource n'est pas disponible.
- `NGX_DONE` — L'opération est terminée ou se poursuit ailleurs. Sert aussi de code de succès alternatif.
- `NGX_ABORT` — La fonction a été interrompue. Sert aussi de code d'erreur alternatif.

### Gestion des erreurs

La macro `ngx_errno` renvoie le dernier code d'erreur système. Elle correspond à `errno` sur les plates-formes POSIX et à l'appel `GetLastError()` sous Windows. La macro `ngx_socket_errno` renvoie le dernier numéro d'erreur de socket. Comme `ngx_errno`, elle correspond à `errno` sur les plates-formes POSIX, et à l'appel `WSAGetLastError()` sous Windows. Lire `ngx_errno` ou `ngx_socket_errno` plusieurs fois de suite peut nuire aux performances. Si la valeur d'erreur doit servir plusieurs fois, stockez-la dans une variable locale de type `ngx_err_t`. Pour définir des erreurs, utilisez les macros `ngx_set_errno(errno)` et `ngx_set_socket_errno(errno)`.

Les valeurs de `ngx_errno` et `ngx_socket_errno` peuvent être passées aux fonctions de journalisation `ngx_log_error()` et `ngx_log_debugX()`, auquel cas le texte de l'erreur système est ajouté au message.

Exemple d'utilisation de `ngx_errno` :

```c
ngx_int_t
ngx_my_kill(ngx_pid_t pid, ngx_log_t *log, int signo)
{
    ngx_err_t  err;

    if (kill(pid, signo) == -1) {
        err = ngx_errno;

        ngx_log_error(NGX_LOG_ALERT, log, err, "kill(%P, %d) failed", pid, signo);

        if (err == NGX_ESRCH) {
            return 2;
        }

        return 1;
    }

    return 0;
}
```

## Chaînes

### Présentation

Pour les chaînes C, nginx utilise le pointeur de type caractère non signé `u_char *`.

Le type de chaîne de nginx, `ngx_str_t`, est défini ainsi :

```c
typedef struct {
    size_t      len;
    u_char     *data;
} ngx_str_t;
```

Le champ `len` contient la longueur de la chaîne et `data` ses données. La chaîne contenue dans `ngx_str_t` peut être ou non terminée par un octet nul après les `len` octets ; le plus souvent, elle ne l'est pas. Dans certaines parties du code (par exemple l'analyse de la configuration), les objets `ngx_str_t` sont toutefois connus pour être terminés par un octet nul, ce qui simplifie la comparaison des chaînes et leur passage aux appels système.

Les opérations sur les chaînes sont déclarées dans `src/core/ngx_string.h`. Certaines enrobent des fonctions C standard :

- `ngx_strcmp()`
- `ngx_strncmp()`
- `ngx_strstr()`
- `ngx_strlen()`
- `ngx_strchr()`
- `ngx_memcmp()`
- `ngx_memset()`
- `ngx_memcpy()`
- `ngx_memmove()`

D'autres fonctions de chaînes sont propres à nginx

- `ngx_memzero()` — Remplit la mémoire de zéros.
- `ngx_explicit_memzero()` — Fait la même chose que `ngx_memzero()`, mais cet appel n'est jamais supprimé par l'optimisation d'élimination des écritures mortes du compilateur. Utile pour effacer des données sensibles comme des mots de passe et des clés.
- `ngx_cpymem()` — Fait la même chose que `ngx_memcpy()`, mais renvoie l'adresse de destination finale. Pratique pour concaténer plusieurs chaînes à la suite.
- `ngx_movemem()` — Fait la même chose que `ngx_memmove()`, mais renvoie l'adresse de destination finale.
- `ngx_strlchr()` — Recherche un caractère dans une chaîne délimitée par deux pointeurs.

Les fonctions suivantes effectuent la conversion de casse et la comparaison :

- `ngx_tolower()`
- `ngx_toupper()`
- `ngx_strlow()`
- `ngx_strcasecmp()`
- `ngx_strncasecmp()`

Les macros suivantes simplifient l'initialisation des chaînes :

- `ngx_string(text)` — initialiseur statique du type `ngx_str_t` à partir du littéral de chaîne C `text`
- `ngx_null_string` — initialiseur statique de chaîne vide pour le type `ngx_str_t`
- `ngx_str_set(str, text)` — initialise la chaîne `str` de type `ngx_str_t *` avec le littéral de chaîne C `text`
- `ngx_str_null(str)` — initialise la chaîne `str` de type `ngx_str_t *` avec la chaîne vide

### Formatage

Les fonctions de formatage suivantes prennent en charge les types propres à nginx :

- `ngx_sprintf(buf, fmt, ...)`
- `ngx_snprintf(buf, max, fmt, ...)`
- `ngx_slprintf(buf, last, fmt, ...)`
- `ngx_vslprintf(buf, last, fmt, args)`
- `ngx_vsnprintf(buf, max, fmt, args)`

La liste complète des options de formatage prises en charge figure dans `src/core/ngx_string.c`. En voici quelques-unes :

- `%O` — `off_t`
- `%T` — `time_t`
- `%z` — `ssize_t`
- `%i` — `ngx_int_t`
- `%p` — `void *`
- `%V` — `ngx_str_t *`
- `%s` — `u_char *` (terminée par un octet nul)
- `%*s` — `size_t + u_char *`

On peut préfixer la plupart des types par `u` pour les rendre non signés. Pour une sortie en hexadécimal, utilisez `X` ou `x`.

Par exemple :

```c
u_char      buf[NGX_INT_T_LEN];
size_t      len;
ngx_uint_t  n;

/* set n here */

len = ngx_sprintf(buf, "%ui", n) — buf;
```

### Conversion numérique

nginx met en œuvre plusieurs fonctions de conversion numérique. Les quatre premières convertissent chacune une chaîne de longueur donnée en entier positif du type indiqué. Elles renvoient `NGX_ERROR` en cas d'erreur.

- `ngx_atoi(line, n)` — `ngx_int_t`
- `ngx_atosz(line, n)` — `ssize_t`
- `ngx_atoof(line, n)` — `off_t`
- `ngx_atotm(line, n)` — `time_t`

Il existe deux autres fonctions de conversion numérique. Comme les quatre premières, elles renvoient `NGX_ERROR` en cas d'erreur.

- `ngx_atofp(line, n, point)` — Convertit un nombre à virgule fixe de longueur donnée en entier positif de type `ngx_int_t`. Le résultat est décalé de `point` positions décimales vers la gauche. La représentation textuelle du nombre ne doit pas avoir plus de `points` chiffres après la virgule. Par exemple, `ngx_atofp("10.5", 4, 2)` renvoie `1050`.
- `ngx_hextoi(line, n)` — Convertit la représentation hexadécimale d'un entier positif en `ngx_int_t`.

### Expressions régulières

L'interface des expressions régulières de nginx enrobe la bibliothèque [PCRE](http://www.pcre.org). Le fichier d'en-tête correspondant est `src/core/ngx_regex.h`.

Pour comparer une chaîne à une expression régulière, il faut d'abord compiler celle-ci, généralement pendant la phase de configuration. La prise en charge de PCRE étant facultative, tout code utilisant l'interface doit être protégé par la macro `NGX_PCRE` :

```c
#if (NGX_PCRE)
ngx_regex_t          *re;
ngx_regex_compile_t   rc;

u_char                errstr[NGX_MAX_CONF_ERRSTR];

ngx_str_t  value = ngx_string("message (\\d\\d\\d).*Codeword is '(?<cw>\\w+)'");

ngx_memzero(&rc, sizeof(ngx_regex_compile_t));

rc.pattern = value;
rc.pool = cf->pool;
rc.err.len = NGX_MAX_CONF_ERRSTR;
rc.err.data = errstr;
/* rc.options can be set to NGX_REGEX_CASELESS */

if (ngx_regex_compile(&rc) != NGX_OK) {
    ngx_conf_log_error(NGX_LOG_EMERG, cf, 0, "%V", &rc.err);
    return NGX_CONF_ERROR;
}

re = rc.regex;
#endif
```

Après une compilation réussie, les champs `captures` et `named_captures` de la structure `ngx_regex_compile_t` contiennent respectivement le nombre de captures et de captures nommées trouvées dans l'expression.

L'expression compilée peut ensuite servir à tester des chaînes :

```c
ngx_int_t  n;
int        captures[(1 + rc.captures) * 3];

ngx_str_t input = ngx_string("This is message 123. Codeword is 'foobar'.");

n = ngx_regex_exec(re, &input, captures, (1 + rc.captures) * 3);
if (n >= 0) {
    /* string matches expression */

} else if (n == NGX_REGEX_NO_MATCHED) {
    /* no match was found */

} else {
    /* some error */
    ngx_log_error(NGX_LOG_ALERT, log, 0, ngx_regex_exec_n " failed: %i", n);
}
```

Les arguments de `ngx_regex_exec()` sont l'expression compilée `re`, la chaîne à tester `input`, un tableau facultatif d'entiers pour recevoir les `captures` trouvées et la `size` du tableau. La taille du tableau `captures` doit être un multiple de trois, comme l'exige l'[API PCRE](http://www.pcre.org/original/doc/html/pcreapi.html). Dans l'exemple, elle est calculée à partir du nombre total de captures, plus un pour la chaîne correspondante elle-même.

En cas de correspondance, les captures sont accessibles ainsi :

```c
u_char     *p;
size_t      size;
ngx_str_t   name, value;

/* all captures */
for (i = 0; i < n * 2; i += 2) {
    value.data = input.data + captures[i];
    value.len = captures[i + 1] — captures[i];
}

/* accessing named captures */

size = rc.name_size;
p = rc.names;

for (i = 0; i < rc.named_captures; i++, p += size) {

    /* capture name */
    name.data = &p[2];
    name.len = ngx_strlen(name.data);

    n = 2 * ((p[0] << 8) + p[1]);

    /* captured value */
    value.data = &input.data[captures[n]];
    value.len = captures[n + 1] — captures[n];
}
```

La fonction `ngx_regex_exec_array()` accepte le tableau d'éléments `ngx_regex_elt_t` (des expressions compilées associées à des noms), une chaîne à tester et un journal. Elle applique les expressions du tableau à la chaîne jusqu'à trouver une correspondance ou épuiser les expressions. Elle renvoie `NGX_OK` en cas de correspondance, `NGX_DECLINED` sinon, ou `NGX_ERROR` en cas d'erreur.

## Temps

La structure `ngx_time_t` représente le temps avec trois types distincts pour les secondes, les millisecondes et le décalage GMT :

```c
typedef struct {
    time_t      sec;
    ngx_uint_t  msec;
    ngx_int_t   gmtoff;
} ngx_time_t;
```

La structure `ngx_tm_t` est un alias de `struct tm` sur les plates-formes UNIX et de `SYSTEMTIME` sous Windows.

Pour obtenir l'heure courante, il suffit généralement de lire l'une des variables globales disponibles, qui contiennent la valeur du temps mise en cache dans le format voulu.

Représentations textuelles disponibles :

- `ngx_cached_err_log_time` — Utilisée dans les entrées du journal d'erreurs : `"1970/09/28 12:00:00"`
- `ngx_cached_http_log_time` — Utilisée dans les entrées du journal d'accès HTTP : `"28/Sep/1970:12:00:00 +0600"`
- `ngx_cached_syslog_time` — Utilisée dans les entrées syslog : `"Sep 28 12:00:00"`
- `ngx_cached_http_time` — Utilisée dans les en-têtes HTTP : `"Mon, 28 Sep 1970 06:00:00 GMT"`
- `ngx_cached_http_log_iso8601` — Format standard ISO 8601 : `"1970-09-28T12:00:00+06:00"`

Les macros `ngx_time()` et `ngx_timeofday()` renvoient l'heure courante en secondes et sont le moyen privilégié d'accéder à la valeur mise en cache.

Pour obtenir l'heure explicitement, utilisez `ngx_gettimeofday()`, qui met à jour son argument (pointeur vers `struct timeval`). L'heure est toujours mise à jour quand nginx revient à la boucle d'événements après des appels système. Pour la mettre à jour immédiatement, appelez `ngx_time_update()`, ou `ngx_time_sigsafe_update()` dans le contexte d'un gestionnaire de signal.

Les fonctions suivantes convertissent `time_t` dans la représentation décomposée indiquée. La première de chaque paire convertit `time_t` en `ngx_tm_t`, la seconde (avec l'infixe `_libc_`) en `struct tm` :

- `ngx_gmtime(), ngx_libc_gmtime()` — Heure exprimée en UTC
- `ngx_localtime(), ngx_libc_localtime()` — Heure exprimée selon le fuseau horaire local

La fonction `ngx_http_time(buf, time)` renvoie une représentation textuelle adaptée aux en-têtes HTTP (par exemple `"Mon, 28 Sep 1970 06:00:00 GMT"`). La fonction `ngx_http_cookie_time(buf, time)` renvoie une représentation adaptée aux cookies HTTP (`"Thu, 31-Dec-37 23:55:55 GMT"`).

## Conteneurs

### Tableau

Le type tableau de nginx, `ngx_array_t`, est défini ainsi

```c
typedef struct {
    void        *elts;
    ngx_uint_t   nelts;
    size_t       size;
    ngx_uint_t   nalloc;
    ngx_pool_t  *pool;
} ngx_array_t;
```

Les éléments du tableau sont disponibles dans le champ `elts`. Le champ `nelts` contient le nombre d'éléments. Le champ `size` contient la taille d'un élément ; il est fixé à l'initialisation du tableau.

Utilisez l'appel `ngx_array_create(pool, n, size)` pour créer un tableau dans un pool, et `ngx_array_init(array, pool, n, size)` pour initialiser un objet tableau déjà alloué.

```c
ngx_array_t  *a, b;

/* create an array of strings with preallocated memory for 10 elements */
a = ngx_array_create(pool, 10, sizeof(ngx_str_t));

/* initialize string array for 10 elements */
ngx_array_init(&b, pool, 10, sizeof(ngx_str_t));
```

Utilisez les fonctions suivantes pour ajouter des éléments à un tableau :

- `ngx_array_push(a)` ajoute un élément en fin de tableau et renvoie un pointeur vers lui
- `ngx_array_push_n(a, n)` ajoute `n` éléments en fin de tableau et renvoie un pointeur vers le premier

Si la mémoire allouée ne suffit pas pour les nouveaux éléments, un nouveau bloc est alloué et les éléments existants y sont copiés. Le nouveau bloc est normalement deux fois plus grand que l'ancien.

```c
s = ngx_array_push(a);
ss = ngx_array_push_n(&b, 3);
```

### Liste

Dans nginx, une liste est une suite de tableaux, optimisée pour insérer un nombre potentiellement élevé d'éléments. Le type liste `ngx_list_t` est défini ainsi :

```c
typedef struct {
    ngx_list_part_t  *last;
    ngx_list_part_t   part;
    size_t            size;
    ngx_uint_t        nalloc;
    ngx_pool_t       *pool;
} ngx_list_t;
```

Les éléments sont stockés dans des parties de liste, définies ainsi :

```c
typedef struct ngx_list_part_s  ngx_list_part_t;

struct ngx_list_part_s {
    void             *elts;
    ngx_uint_t        nelts;
    ngx_list_part_t  *next;
};
```

Avant utilisation, une liste doit être initialisée par `ngx_list_init(list, pool, n, size)` ou créée par `ngx_list_create(pool, n, size)`. Les deux fonctions prennent en argument la taille d'un élément et le nombre d'éléments par partie de liste. Pour ajouter un élément, utilisez la fonction `ngx_list_push(list)`. Pour parcourir les éléments, accédez directement aux champs de la liste comme dans l'exemple :

```c
ngx_str_t        *v;
ngx_uint_t        i;
ngx_list_t       *list;
ngx_list_part_t  *part;

list = ngx_list_create(pool, 100, sizeof(ngx_str_t));
if (list == NULL) { /* error */ }

/* add items to the list */

v = ngx_list_push(list);
if (v == NULL) { /* error */ }
ngx_str_set(v, "foo");

v = ngx_list_push(list);
if (v == NULL) { /* error */ }
ngx_str_set(v, "bar");

/* iterate over the list */

part = &list->part;
v = part->elts;

for (i = 0; /* void */; i++) {

    if (i >= part->nelts) {
        if (part->next == NULL) {
            break;
        }

        part = part->next;
        v = part->elts;
        i = 0;
    }

    ngx_do_smth(&v[i]);
}
```

Les listes servent surtout aux en-têtes HTTP d'entrée et de sortie.

Les listes ne permettent pas de supprimer des éléments. Au besoin, on peut toutefois marquer des éléments comme absents sans les retirer réellement. Par exemple, pour marquer comme absents des en-têtes HTTP de sortie (stockés sous forme d'objets `ngx_table_elt_t`), mettez à zéro le champ `hash` de `ngx_table_elt_t`. Les éléments ainsi marqués sont explicitement ignorés lors du parcours des en-têtes.

### File

Dans nginx, une file est une liste doublement chaînée intrusive, dont chaque nœud est défini ainsi :

```c
typedef struct ngx_queue_s  ngx_queue_t;

struct ngx_queue_s {
    ngx_queue_t  *prev;
    ngx_queue_t  *next;
};
```

Le nœud de tête n'est lié à aucune donnée. Initialisez la tête avec l'appel `ngx_queue_init(q)` avant utilisation. Les files prennent en charge les opérations suivantes :

- `ngx_queue_insert_head(h, x)`, `ngx_queue_insert_tail(h, x)` — Insère un nouveau nœud
- `ngx_queue_remove(x)` — Retire un nœud de la file
- `ngx_queue_split(h, q, n)` — Coupe une file à un nœud et renvoie la fin dans une file distincte
- `ngx_queue_add(h, n)` — Ajoute une seconde file à la première
- `ngx_queue_head(h)`, `ngx_queue_last(h)` — Renvoie le premier ou le dernier nœud
- `ngx_queue_sentinel(h)` - Renvoie l'objet sentinelle de la file, où arrêter le parcours
- `ngx_queue_data(q, type, link)` — Renvoie une référence au début de la structure de données d'un nœud, compte tenu du décalage du champ de file dans celle-ci

Exemple :

```c
typedef struct {
    ngx_str_t    value;
    ngx_queue_t  queue;
} ngx_foo_t;

ngx_foo_t    *f;
ngx_queue_t   values, *q;

ngx_queue_init(&values);

f = ngx_palloc(pool, sizeof(ngx_foo_t));
if (f == NULL) { /* error */ }
ngx_str_set(&f->value, "foo");

ngx_queue_insert_tail(&values, &f->queue);

/* insert more nodes here */

for (q = ngx_queue_head(&values);
     q != ngx_queue_sentinel(&values);
     q = ngx_queue_next(q))
{
    f = ngx_queue_data(q, ngx_foo_t, queue);

    ngx_do_smth(&f->value);
}
```

### Arbre rouge-noir

Le fichier d'en-tête `src/core/ngx_rbtree.h` donne accès à une implémentation efficace des arbres rouge-noir.

```c
typedef struct {
    ngx_rbtree_t       rbtree;
    ngx_rbtree_node_t  sentinel;

    /* custom per-tree data here */
} my_tree_t;

typedef struct {
    ngx_rbtree_node_t  rbnode;

    /* custom per-node data */
    foo_t              val;
} my_node_t;
```

Pour manipuler un arbre dans son ensemble, il faut deux nœuds : la racine et la sentinelle. On les ajoute généralement à une structure personnalisée, ce qui permet d'organiser les données en arbre dont les feuilles contiennent un lien vers les données ou les intègrent.

Pour initialiser un arbre :

```c
my_tree_t  root;

ngx_rbtree_init(&root.rbtree, &root.sentinel, insert_value_function);
```

Pour parcourir un arbre et insérer de nouvelles valeurs, utilisez les fonctions « `insert_value` ». Par exemple, la fonction `ngx_str_rbtree_insert_value` traite le type `ngx_str_t`. Ses arguments sont des pointeurs vers le nœud racine de l'insertion, le nouveau nœud à ajouter et la sentinelle de l'arbre.

```c
void ngx_str_rbtree_insert_value(ngx_rbtree_node_t *temp,
                                 ngx_rbtree_node_t *node,
                                 ngx_rbtree_node_t *sentinel)
```

Le parcours est assez simple et peut être illustré par le modèle de fonction de recherche suivant :

```c
my_node_t *
my_rbtree_lookup(ngx_rbtree_t *rbtree, foo_t *val, uint32_t hash)
{
    ngx_int_t           rc;
    my_node_t          *n;
    ngx_rbtree_node_t  *node, *sentinel;

    node = rbtree->root;
    sentinel = rbtree->sentinel;

    while (node != sentinel) {

        n = (my_node_t *) node;

        if (hash != node->key) {
            node = (hash < node->key) ? node->left : node->right;
            continue;
        }

        rc = compare(val, node->val);

        if (rc < 0) {
            node = node->left;
            continue;
        }

        if (rc > 0) {
            node = node->right;
            continue;
        }

        return n;
    }

    return NULL;
}
```

La fonction `compare()` est un comparateur classique qui renvoie une valeur négative, nulle ou positive. Pour accélérer les recherches et éviter de comparer des objets utilisateur potentiellement volumineux, un champ de hachage entier est utilisé.

Pour ajouter un nœud à un arbre, allouez un nouveau nœud, initialisez-le et appelez `ngx_rbtree_insert()` :

```c
my_node_t          *my_node;
ngx_rbtree_node_t  *node;

my_node = ngx_palloc(...);
init_custom_data(&my_node->val);

node = &my_node->rbnode;
node->key = create_key(my_node->val);

ngx_rbtree_insert(&root->rbtree, node);
```

Pour retirer un nœud, appelez la fonction `ngx_rbtree_delete()` :

```c
ngx_rbtree_delete(&root->rbtree, node);
```

### Table de hachage

Les fonctions de table de hachage sont déclarées dans `src/core/ngx_hash.h`. Les correspondances exactes et avec jokers sont prises en charge. Ces dernières nécessitent une configuration supplémentaire, décrite dans une section séparée ci-dessous.

Avant d'initialiser une table de hachage, il faut connaître le nombre d'éléments qu'elle contiendra pour que nginx puisse la construire de façon optimale. Deux paramètres doivent être configurés, `max_size` et `bucket_size`, comme détaillé dans un [[10-guides/01-introduction/hash|document]] séparé. Ils sont généralement configurables par l'utilisateur. Les paramètres d'initialisation sont stockés dans le type `ngx_hash_init_t`, et la table elle-même dans `ngx_hash_t` :

```c
ngx_hash_t       foo_hash;
ngx_hash_init_t  hash;

hash.hash = &foo_hash;
hash.key = ngx_hash_key;
hash.max_size = 512;
hash.bucket_size = ngx_align(64, ngx_cacheline_size);
hash.name = "foo_hash";
hash.pool = cf->pool;
hash.temp_pool = cf->temp_pool;
```

`key` est un pointeur vers une fonction qui crée la clé de hachage entière à partir d'une chaîne. Il existe deux fonctions génériques de création de clé : `ngx_hash_key(data, len)` et `ngx_hash_key_lc(data, len)`. La seconde convertit la chaîne en minuscules ; celle-ci doit donc être modifiable. Sinon, passez l'indicateur `NGX_HASH_READONLY_KEY` à la fonction en initialisant le tableau de clés (voir ci-dessous).

Les clés de hachage sont stockées dans `ngx_hash_keys_arrays_t` et initialisées avec `ngx_hash_keys_array_init(arr, type)`. Le second paramètre (`type`) contrôle la quantité de ressources préallouées pour la table et vaut `NGX_HASH_SMALL` ou `NGX_HASH_LARGE`. Le second convient si la table doit contenir des milliers d'éléments.

```c
ngx_hash_keys_arrays_t  foo_keys;

foo_keys.pool = cf->pool;
foo_keys.temp_pool = cf->temp_pool;

ngx_hash_keys_array_init(&foo_keys, NGX_HASH_SMALL);
```

Pour insérer des clés dans un tableau de clés de hachage, utilisez la fonction `ngx_hash_add_key(keys_array, key, value, flags)` :

```c
ngx_str_t k1 = ngx_string("key1");
ngx_str_t k2 = ngx_string("key2");

ngx_hash_add_key(&foo_keys, &k1, &my_data_ptr_1, NGX_HASH_READONLY_KEY);
ngx_hash_add_key(&foo_keys, &k2, &my_data_ptr_2, NGX_HASH_READONLY_KEY);
```

Pour construire la table de hachage, appelez la fonction `ngx_hash_init(hinit, key_names, nelts)` :

```c
ngx_hash_init(&hash, foo_keys.keys.elts, foo_keys.keys.nelts);
```

La fonction échoue si les paramètres `max_size` ou `bucket_size` sont trop petits.

Une fois la table construite, utilisez la fonction `ngx_hash_find(hash, key, name, len)` pour rechercher des éléments :

```c
my_data_t   *data;
ngx_uint_t   key;

key = ngx_hash_key(k1.data, k1.len);

data = ngx_hash_find(&foo_hash, key, k1.data, k1.len);
if (data == NULL) {
    /* key not found */
}
```

#### Correspondance avec jokers

Pour créer une table de hachage qui gère les jokers, utilisez le type `ngx_hash_combined_t`. Il comprend le type de table décrit ci-dessus et deux tableaux de clés supplémentaires : `dns_wc_head` et `dns_wc_tail`. L'initialisation des propriétés de base est semblable à celle d'une table ordinaire :

```c
ngx_hash_init_t      hash
ngx_hash_combined_t  foo_hash;

hash.hash = &foo_hash.hash;
hash.key = ...;
```

On peut ajouter des clés avec jokers grâce à l'indicateur `NGX_HASH_WILDCARD_KEY` :

```c
/* k1 = ".example.org"; */
/* k2 = "foo.*";        */
ngx_hash_add_key(&foo_keys, &k1, &data1, NGX_HASH_WILDCARD_KEY);
ngx_hash_add_key(&foo_keys, &k2, &data2, NGX_HASH_WILDCARD_KEY);
```

La fonction reconnaît les jokers et ajoute les clés dans les tableaux correspondants. Voir la documentation du module [[12-directives/map-http-map|map]] pour la syntaxe des jokers et l'algorithme de correspondance.

Selon le contenu des clés ajoutées, il peut falloir initialiser jusqu'à trois tableaux de clés : un pour la correspondance exacte (décrit plus haut) et deux autres pour la correspondance à partir du début ou de la fin d'une chaîne :

```c
if (foo_keys.dns_wc_head.nelts) {

    ngx_qsort(foo_keys.dns_wc_head.elts,
              (size_t) foo_keys.dns_wc_head.nelts,
              sizeof(ngx_hash_key_t),
              cmp_dns_wildcards);

    hash.hash = NULL;
    hash.temp_pool = pool;

    if (ngx_hash_wildcard_init(&hash, foo_keys.dns_wc_head.elts,
                               foo_keys.dns_wc_head.nelts)
        != NGX_OK)
    {
        return NGX_ERROR;
    }

    foo_hash.wc_head = (ngx_hash_wildcard_t *) hash.hash;
}
```

Le tableau de clés doit être trié, et les résultats de l'initialisation ajoutés à la table combinée. Le tableau `dns_wc_tail` s'initialise de la même façon.

La recherche dans une table combinée se fait avec `ngx_hash_find_combined(chash, key, name, len)` :

```c
/* key = "bar.example.org"; — will match ".example.org" */
/* key = "foo.example.com"; — will match "foo.*"        */

hkey = ngx_hash_key(key.data, key.len);
res = ngx_hash_find_combined(&foo_hash, hkey, key.data, key.len);
```

## Gestion de la mémoire

### Tas

Pour allouer de la mémoire sur le tas système, utilisez les fonctions suivantes :

- `ngx_alloc(size, log)` — Alloue de la mémoire sur le tas système. Enrobe `malloc()` avec prise en charge de la journalisation. Les erreurs d'allocation et les informations de débogage sont écrites dans `log`.
- `ngx_calloc(size, log)` — Alloue de la mémoire sur le tas système comme `ngx_alloc()`, puis la remplit de zéros.
- `ngx_memalign(alignment, size, log)` — Alloue de la mémoire alignée sur le tas système. Enrobe `posix_memalign()` sur les plates-formes qui la fournissent ; sinon, se rabat sur `ngx_alloc()`, qui fournit l'alignement maximal.
- `ngx_free(p)` — Libère la mémoire allouée. Enrobe `free()`

### Pool

La plupart des allocations de nginx se font dans des pools. La mémoire allouée dans un pool est libérée automatiquement à la destruction de celui-ci. Cela offre de bonnes performances d'allocation et facilite le contrôle de la mémoire.

Un pool alloue en interne les objets dans des blocs de mémoire contigus. Quand un bloc est plein, un nouveau est alloué et ajouté à la liste des blocs du pool. Si l'allocation demandée est trop grande pour tenir dans un bloc, la demande est transmise à l'allocateur système et le pointeur renvoyé est conservé dans le pool pour être libéré plus tard.

Le type des pools nginx est `ngx_pool_t`. Opérations prises en charge :

- `ngx_create_pool(size, log)` — Crée un pool avec la taille de bloc indiquée. L'objet pool renvoyé est lui aussi alloué dans le pool. `size` doit valoir au moins `NGX_MIN_POOL_SIZE` et être un multiple de `NGX_POOL_ALIGNMENT`.
- `ngx_destroy_pool(pool)` — Libère toute la mémoire du pool, y compris l'objet pool lui-même.
- `ngx_palloc(pool, size)` — Alloue de la mémoire alignée dans le pool indiqué.
- `ngx_pcalloc(pool, size)` — Alloue de la mémoire alignée dans le pool indiqué et la remplit de zéros.
- `ngx_pnalloc(pool, size)` — Alloue de la mémoire non alignée dans le pool indiqué. Sert surtout à allouer des chaînes.
- `ngx_pfree(pool, p)` — Libère de la mémoire allouée auparavant dans le pool indiqué. Seules les allocations transmises à l'allocateur système peuvent être libérées.

```c
u_char      *p;
ngx_str_t   *s;
ngx_pool_t  *pool;

pool = ngx_create_pool(1024, log);
if (pool == NULL) { /* error */ }

s = ngx_palloc(pool, sizeof(ngx_str_t));
if (s == NULL) { /* error */ }
ngx_str_set(s, "foo");

p = ngx_pnalloc(pool, 3);
if (p == NULL) { /* error */ }
ngx_memcpy(p, "foo", 3);
```

Les maillons de chaîne (`ngx_chain_t`) sont très utilisés dans nginx ; l'implémentation des pools permet donc de les réutiliser. Le champ `chain` de `ngx_pool_t` conserve une liste de maillons déjà alloués prêts à être réutilisés. Pour allouer efficacement un maillon dans un pool, utilisez la fonction `ngx_alloc_chain_link(pool)`. Elle cherche un maillon libre dans la liste du pool et en alloue un nouveau si la liste est vide. Pour libérer un maillon, appelez `ngx_free_chain(pool, cl)`.

Des gestionnaires de nettoyage peuvent être enregistrés dans un pool. Un gestionnaire de nettoyage est une fonction de rappel avec un argument, appelée à la destruction du pool. Un pool est généralement lié à un objet nginx précis (comme une requête HTTP) et détruit quand l'objet arrive en fin de vie. Enregistrer un nettoyage de pool est un moyen pratique de libérer des ressources, fermer des descripteurs de fichiers ou apporter des ajustements finaux aux données partagées associées à l'objet principal.

Pour enregistrer un nettoyage de pool, appelez `ngx_pool_cleanup_add(pool, size)`, qui renvoie un pointeur `ngx_pool_cleanup_t` que l'appelant doit remplir. L'argument `size` permet d'allouer un contexte pour le gestionnaire de nettoyage.

```c
ngx_pool_cleanup_t  *cln;

cln = ngx_pool_cleanup_add(pool, 0);
if (cln == NULL) { /* error */ }

cln->handler = ngx_my_cleanup;
cln->data = "foo";

...

static void
ngx_my_cleanup(void *data)
{
    u_char  *msg = data;

    ngx_do_smth(msg);
}
```

### Mémoire partagée

nginx utilise la mémoire partagée pour partager des données communes entre processus. La fonction `ngx_shared_memory_add(cf, name, size, tag)` ajoute une nouvelle entrée de mémoire partagée `ngx_shm_zone_t` à un cycle. Elle reçoit le `name` et la `size` de la zone. Chaque zone partagée doit avoir un nom unique. Si une entrée avec les mêmes `name` et `tag` existe déjà, elle est réutilisée. La fonction échoue si une entrée existante de même nom a un tag différent. On passe généralement l'adresse de la structure du module comme `tag`, ce qui permet de réutiliser les zones partagées par nom au sein d'un même module nginx.

La structure d'entrée de mémoire partagée `ngx_shm_zone_t` a les champs suivants :

- `init` — Fonction de rappel d'initialisation, appelée une fois la zone partagée projetée en mémoire réelle
- `data` — Contexte de données, utilisé pour passer des données arbitraires à la fonction de rappel `init`
- `noreuse` — Indicateur qui désactive la réutilisation d'une zone partagée de l'ancien cycle
- `tag` — Tag de la zone partagée
- `shm` — Objet propre à la plate-forme, de type `ngx_shm_t`, ayant au moins les champs suivants :

  - `addr` — Adresse de la mémoire partagée projetée, NULL au départ
  - `size` — Taille de la mémoire partagée
  - `name` — Nom de la mémoire partagée
  - `log` — Journal de la mémoire partagée
  - `exists` — Indicateur signalant que la mémoire partagée a été héritée du processus maître (propre à Windows)

Les entrées de zones partagées sont projetées en mémoire réelle dans `ngx_init_cycle()`, après l'analyse de la configuration. Sur les systèmes POSIX, l'appel système `mmap()` crée la projection anonyme partagée. Sous Windows, c'est la paire `CreateFileMapping()`/ `MapViewOfFileEx()` qui est utilisée.

Pour allouer en mémoire partagée, nginx fournit le type de pool slab `ngx_slab_pool_t`. Un pool slab est créé automatiquement dans chaque zone partagée de nginx. Il se trouve au début de la zone et est accessible par l'expression `(ngx_slab_pool_t *) shm_zone->shm.addr`. Pour allouer de la mémoire dans une zone partagée, appelez `ngx_slab_alloc(pool, size)` ou `ngx_slab_calloc(pool, size)`. Pour la libérer, appelez `ngx_slab_free(pool, p)`.

Le pool slab divise toute la zone partagée en pages. Chaque page sert à allouer des objets de même taille. La taille indiquée doit être une puissance de 2 supérieure à la taille minimale de 8 octets ; les valeurs non conformes sont arrondies au-dessus. Un masque de bits par page indique quels blocs sont utilisés et lesquels sont libres. Pour les tailles supérieures à une demi-page (généralement 2048 octets), l'allocation se fait page entière par page entière

Pour protéger les données en mémoire partagée contre les accès concurrents, utilisez le mutex disponible dans le champ `mutex` de `ngx_slab_pool_t`. Le mutex est surtout utilisé par le pool slab lors de l'allocation et de la libération, mais il peut protéger n'importe quelle autre structure de données utilisateur allouée dans la zone partagée. Pour verrouiller ou déverrouiller un mutex, appelez `ngx_shmtx_lock(&shpool->mutex)` ou `ngx_shmtx_unlock(&shpool->mutex)`.

```c
ngx_str_t        name;
ngx_foo_ctx_t   *ctx;
ngx_shm_zone_t  *shm_zone;

ngx_str_set(&name, "foo");

/* allocate shared zone context */
ctx = ngx_pcalloc(cf->pool, sizeof(ngx_foo_ctx_t));
if (ctx == NULL) {
    /* error */
}

/* add an entry for 64k shared zone */
shm_zone = ngx_shared_memory_add(cf, &name, 65536, &ngx_foo_module);
if (shm_zone == NULL) {
    /* error */
}

/* register init callback and context */
shm_zone->init = ngx_foo_init_zone;
shm_zone->data = ctx;


...


static ngx_int_t
ngx_foo_init_zone(ngx_shm_zone_t *shm_zone, void *data)
{
    ngx_foo_ctx_t  *octx = data;

    size_t            len;
    ngx_foo_ctx_t    *ctx;
    ngx_slab_pool_t  *shpool;

    value = shm_zone->data;

    if (octx) {
        /* reusing a shared zone from old cycle */
        ctx->value = octx->value;
        return NGX_OK;
    }

    shpool = (ngx_slab_pool_t *) shm_zone->shm.addr;

    if (shm_zone->shm.exists) {
        /* initialize shared zone context in Windows nginx worker */
        ctx->value = shpool->data;
        return NGX_OK;
    }

    /* initialize shared zone */

    ctx->value = ngx_slab_alloc(shpool, sizeof(ngx_uint_t));
    if (ctx->value == NULL) {
        return NGX_ERROR;
    }

    shpool->data = ctx->value;

    return NGX_OK;
}
```

## Journalisation

Pour journaliser, nginx utilise des objets `ngx_log_t`. Le journaliseur de nginx prend en charge plusieurs types de sortie :

- stderr — Journalisation vers la sortie d'erreur standard (stderr)
- file — Journalisation vers un fichier
- syslog — Journalisation vers syslog
- memory — Journalisation dans une zone mémoire interne, à des fins de développement ; la mémoire peut être consultée ensuite avec un débogueur

Une instance de journaliseur peut être une chaîne de journaliseurs reliés par le champ `next`. Chaque message est alors écrit dans tous les journaliseurs de la chaîne.

Pour chaque journaliseur, un niveau de gravité détermine les messages écrits dans le journal (seuls les événements de ce niveau ou d'un niveau supérieur sont journalisés). Niveaux de gravité pris en charge :

- `NGX_LOG_EMERG`
- `NGX_LOG_ALERT`
- `NGX_LOG_CRIT`
- `NGX_LOG_ERR`
- `NGX_LOG_WARN`
- `NGX_LOG_NOTICE`
- `NGX_LOG_INFO`
- `NGX_LOG_DEBUG`

Pour la journalisation de débogage, le masque de débogage est aussi vérifié. Masques de débogage :

- `NGX_LOG_DEBUG_CORE`
- `NGX_LOG_DEBUG_ALLOC`
- `NGX_LOG_DEBUG_MUTEX`
- `NGX_LOG_DEBUG_EVENT`
- `NGX_LOG_DEBUG_HTTP`
- `NGX_LOG_DEBUG_MAIL`
- `NGX_LOG_DEBUG_STREAM`

Normalement, les journaliseurs sont créés par le code existant de nginx à partir des directives `error_log` et sont disponibles à presque toutes les étapes du traitement, dans le cycle, la configuration, la connexion client et d'autres objets.

nginx fournit les macros de journalisation suivantes :

- `ngx_log_error(level, log, err, fmt, ...)` — Journalisation des erreurs
- `ngx_log_debug0(level, log, err, fmt)`, `ngx_log_debug1(level, log, err, fmt, arg1)`, etc. — Journalisation de débogage avec jusqu'à huit arguments de formatage

Un message de journal est formaté dans un tampon de taille `NGX_MAX_ERROR_STR` (actuellement 2048 octets) sur la pile. Il est précédé du niveau de gravité, de l'identifiant de processus (PID), de l'identifiant de connexion (stocké dans `log->connection`) et du texte de l'erreur système. Pour les messages hors débogage, `log->handler` est aussi appelé pour ajouter en tête des informations plus spécifiques. Le module HTTP définit la fonction `ngx_http_log_error()` comme gestionnaire de journal, pour consigner les adresses du client et du serveur, l'action en cours (stockée dans `log->action`), la ligne de requête du client, le nom du serveur, etc.

```c
/* specify what is currently done */
log->action = "sending mp4 to client";

/* error and debug log */
ngx_log_error(NGX_LOG_INFO, c->log, 0, "client prematurely
              closed connection");

ngx_log_debug2(NGX_LOG_DEBUG_HTTP, mp4->file.log, 0,
               "mp4 start:%ui, length:%ui", mp4->start, mp4->length);
```

L'exemple ci-dessus produit des entrées de journal comme celles-ci :

```
2016/09/16 22:08:52 [info] 17445#0: *1 client prematurely closed connection while
sending mp4 to client, client: 127.0.0.1, server: , request: "GET /file.mp4 HTTP/1.1"
2016/09/16 23:28:33 [debug] 22140#0: *1 mp4 start:0, length:10000
```

## Cycle

Un objet cycle stocke le contexte d'exécution de nginx créé à partir d'une configuration donnée. Son type est `ngx_cycle_t`. Le cycle courant est référencé par la variable globale `ngx_cycle` et hérité par les processus de travail à leur démarrage. À chaque rechargement de la configuration, un nouveau cycle est créé à partir de la nouvelle configuration ; l'ancien est généralement supprimé une fois le nouveau créé avec succès.

Un cycle est créé par la fonction `ngx_init_cycle()`, qui prend le cycle précédent en argument. Elle localise le fichier de configuration du cycle précédent et hérite d'autant de ressources que possible de celui-ci. Un cycle provisoire appelé « init cycle » est créé au démarrage de nginx, puis remplacé par un vrai cycle construit à partir de la configuration.

Membres du cycle :

- `pool` — Pool du cycle. Créé pour chaque nouveau cycle.
- `log` — Journal du cycle. Hérité au départ de l'ancien cycle, il pointe vers `new_log` après la lecture de la configuration.
- `new_log` — Journal du cycle, créé par la configuration. Il dépend de la directive `error_log` de portée racine.
- `connections`, `connection_n` — Tableau de connexions de type `ngx_connection_t`, créé par le module d'événements à l'initialisation de chaque processus de travail. La directive `worker_connections` de la configuration fixe le nombre de connexions `connection_n`.
- `free_connections`, `free_connection_n` — Liste et nombre de connexions actuellement disponibles. S'il n'y en a plus, le processus de travail refuse d'accepter de nouveaux clients ou de se connecter aux serveurs amont.
- `files`, `files_n` — Tableau associant les descripteurs de fichiers aux connexions nginx. Cette association est utilisée par les modules d'événements ayant l'indicateur `NGX_USE_FD_EVENT` (actuellement `poll` et `devpoll`).
- `conf_ctx` — Tableau des configurations des modules du cœur. Les configurations sont créées et remplies pendant la lecture des fichiers de configuration.
- `modules`, `modules_n` — Tableau des modules de type `ngx_module_t`, statiques comme dynamiques, chargés par la configuration courante.
- `listening` — Tableau d'objets d'écoute de type `ngx_listening_t`. Ces objets sont normalement ajoutés par la directive `listen` de différents modules, qui appellent la fonction `ngx_create_listening()`. Les sockets d'écoute sont créées à partir de ces objets.
- `paths` — Tableau de chemins de type `ngx_path_t`. Les chemins sont ajoutés en appelant la fonction `ngx_add_path()` depuis les modules qui vont travailler sur certains répertoires. nginx crée ces répertoires après la lecture de la configuration s'ils n'existent pas. Deux gestionnaires peuvent en outre être ajoutés pour chaque chemin :

  - chargeur de chemin — S'exécute une seule fois, 60 secondes après le démarrage ou le rechargement de nginx. Normalement, il lit le répertoire et stocke des données en mémoire partagée. Il est appelé depuis le processus dédié « nginx cache loader ».
  - gestionnaire de chemin — S'exécute périodiquement. Normalement, il supprime les anciens fichiers du répertoire et met à jour la mémoire de nginx en conséquence. Il est appelé depuis le processus dédié « nginx cache manager ».
- `open_files` — Liste d'objets fichier ouvert de type `ngx_open_file_t`, créés en appelant la fonction `ngx_conf_open_file()`. nginx utilise actuellement ce type de fichiers ouverts pour la journalisation. Après la lecture de la configuration, nginx ouvre tous les fichiers de la liste `open_files` et stocke chaque descripteur dans le champ `fd` de l'objet. Les fichiers sont ouverts en mode ajout et créés s'ils n'existent pas. Ils sont rouverts par les processus de travail à la réception du signal de réouverture (le plus souvent `USR1`) ; le descripteur du champ `fd` prend alors une nouvelle valeur.
- `shared_memory` — Liste des zones de mémoire partagée, chacune ajoutée en appelant la fonction `ngx_shared_memory_add()`. Les zones partagées sont projetées sur la même plage d'adresses dans tous les processus nginx et servent à partager des données communes, par exemple l'arbre en mémoire du cache HTTP.

## Tampon

Pour les opérations d'entrée/sortie, nginx fournit le type tampon `ngx_buf_t`. Il contient normalement des données à écrire vers une destination ou lues depuis une source. Un tampon peut référencer des données en mémoire ou dans un fichier, et techniquement les deux à la fois. La mémoire du tampon est allouée séparément et n'est pas liée à la structure `ngx_buf_t`.

La structure `ngx_buf_t` a les champs suivants :

- `start`, `end` — Limites du bloc mémoire alloué au tampon.
- `pos`, `last` — Limites du tampon mémoire ; normalement une sous-plage de `start` .. `end`.
- `file_pos`, `file_last` — Limites d'un tampon fichier, exprimées en décalages depuis le début du fichier.
- `tag` — Valeur unique servant à distinguer les tampons ; créée par différents modules nginx, généralement pour réutiliser les tampons.
- `file` — Objet fichier.
- `temporary` — Indique que le tampon référence de la mémoire modifiable.
- `memory` — Indique que le tampon référence de la mémoire en lecture seule.
- `in_file` — Indique que le tampon référence des données dans un fichier.
- `flush` — Indique que toutes les données précédant le tampon doivent être vidées.
- `recycled` — Indique que le tampon peut être réutilisé et doit être consommé au plus vite.
- `sync` — Indique que le tampon ne porte pas de données ni de signal spécial comme `flush` ou `last_buf`. Par défaut, nginx considère de tels tampons comme une erreur, mais cet indicateur lui demande de sauter la vérification.
- `last_buf` — Indique que le tampon est le dernier de la sortie.
- `last_in_chain` — Indique qu'il n'y a plus de tampons de données dans une requête ou une sous-requête.
- `shadow` — Référence vers un autre tampon (« ombre ») lié au tampon courant, généralement au sens où celui-ci utilise les données de l'ombre. Quand le tampon est consommé, l'ombre est normalement marquée comme consommée elle aussi.
- `last_shadow` — Indique que le tampon est le dernier à référencer un tampon ombre donné.
- `temp_file` — Indique que le tampon se trouve dans un fichier temporaire.

Pour les opérations d'entrée et de sortie, les tampons sont reliés en chaînes. Une chaîne est une suite de maillons de type `ngx_chain_t`, défini ainsi :

```c
typedef struct ngx_chain_s  ngx_chain_t;

struct ngx_chain_s {
    ngx_buf_t    *buf;
    ngx_chain_t  *next;
};
```

Chaque maillon conserve une référence vers son tampon et une référence vers le maillon suivant.

Exemple d'utilisation des tampons et des chaînes :

```c
ngx_chain_t *
ngx_get_my_chain(ngx_pool_t *pool)
{
    ngx_buf_t    *b;
    ngx_chain_t  *out, *cl, **ll;

    /* first buf */
    cl = ngx_alloc_chain_link(pool);
    if (cl == NULL) { /* error */ }

    b = ngx_calloc_buf(pool);
    if (b == NULL) { /* error */ }

    b->start = (u_char *) "foo";
    b->pos = b->start;
    b->end = b->start + 3;
    b->last = b->end;
    b->memory = 1; /* read-only memory */

    cl->buf = b;
    out = cl;
    ll = &cl->next;

    /* second buf */
    cl = ngx_alloc_chain_link(pool);
    if (cl == NULL) { /* error */ }

    b = ngx_create_temp_buf(pool, 3);
    if (b == NULL) { /* error */ }

    b->last = ngx_cpymem(b->last, "foo", 3);

    cl->buf = b;
    cl->next = NULL;
    *ll = cl;

    return out;
}
```

## Réseau

### Connexion

Le type connexion `ngx_connection_t` enrobe un descripteur de socket. Il comprend les champs suivants :

- `fd` — Descripteur de socket
- `data` — Contexte arbitraire de la connexion. Normalement, un pointeur vers un objet de plus haut niveau construit sur la connexion, comme une requête HTTP ou une session Stream.
- `read`, `write` — Événements de lecture et d'écriture de la connexion.
- `recv`, `send`, `recv_chain`, `send_chain` — Opérations d'E/S de la connexion.
- `pool` — Pool de la connexion.
- `log` — Journal de la connexion.
- `sockaddr`, `socklen`, `addr_text` — Adresse de la socket distante, sous forme binaire et textuelle.
- `local_sockaddr`, `local_socklen` — Adresse de la socket locale sous forme binaire. Ces champs sont vides au départ. Utilisez la fonction `ngx_connection_local_sockaddr()` pour obtenir l'adresse locale.
- `proxy_protocol_addr`, `proxy_protocol_port` - Adresse et port du client fournis par le protocole PROXY, s'il est activé pour la connexion.
- `ssl` — Contexte SSL de la connexion.
- `reusable` — Indique que la connexion est dans un état qui la rend réutilisable.
- `close` — Indique que la connexion est en cours de réutilisation et doit être fermée.

Une connexion nginx peut encapsuler la couche SSL de façon transparente. Le champ `ssl` contient alors un pointeur vers une structure `ngx_ssl_connection_t` qui conserve toutes les données SSL de la connexion, dont `SSL_CTX` et `SSL`. Les gestionnaires `recv`, `send`, `recv_chain` et `send_chain` pointent alors aussi vers des fonctions compatibles SSL.

La directive `worker_connections` limite le nombre de connexions par processus de travail. Toutes les structures de connexion sont créées à l'avance au démarrage du processus et stockées dans le champ `connections` de l'objet cycle. Pour obtenir une structure de connexion, utilisez la fonction `ngx_get_connection(s, log)`. Elle prend en argument `s` un descripteur de socket, qui doit être enrobé dans une structure de connexion.

Comme le nombre de connexions par processus est limité, nginx permet de récupérer des connexions en cours d'utilisation. Pour activer ou désactiver la réutilisation d'une connexion, appelez la fonction `ngx_reusable_connection(c, reusable)`. L'appel `ngx_reusable_connection(c, 1)` positionne l'indicateur `reuse` dans la structure de connexion et insère la connexion dans la file `reusable_connections_queue` du cycle. Quand `ngx_get_connection()` constate qu'il n'y a plus de connexion disponible dans la liste `free_connections` du cycle, elle appelle `ngx_drain_connections()` pour libérer un certain nombre de connexions réutilisables. Pour chacune, l'indicateur `close` est positionné et son gestionnaire de lecture est appelé ; celui-ci doit libérer la connexion en appelant `ngx_close_connection(c)` et la rendre disponible. Pour sortir de l'état réutilisable, on appelle `ngx_reusable_connection(c, 0)`. Les connexions client HTTP sont un exemple de connexions réutilisables : elles sont marquées comme telles jusqu'à la réception du premier octet de requête.

## Événements

### Événement

L'objet événement `ngx_event_t` fournit un mécanisme de notification de la survenue d'un événement précis.

Champs de `ngx_event_t` :

- `data` — Contexte arbitraire de l'événement, utilisé dans les gestionnaires, généralement un pointeur vers la connexion concernée.
- `handler` — Fonction de rappel appelée quand l'événement se produit.
- `write` — Indique un événement d'écriture. Son absence indique un événement de lecture.
- `active` — Indique que l'événement est enregistré pour recevoir des notifications d'E/S, normalement de mécanismes comme `epoll`, `kqueue`, `poll`.
- `ready` — Indique que l'événement a reçu une notification d'E/S.
- `delayed` — Indique que l'E/S est retardée à cause d'une limitation de débit.
- `timer` — Nœud d'arbre rouge-noir pour insérer l'événement dans l'arbre des minuteurs.
- `timer_set` — Indique que le minuteur de l'événement est armé et n'a pas encore expiré.
- `timedout` — Indique que le minuteur de l'événement a expiré.
- `eof` — Indique qu'une fin de fichier (EOF) a été rencontrée lors de la lecture.
- `pending_eof` — Indique qu'une fin de fichier est en attente sur la socket, même si des données peuvent encore la précéder. L'indicateur est fourni par l'événement `epoll` `EPOLLRDHUP` ou l'indicateur `kqueue` `EV_EOF`.
- `error` — Indique qu'une erreur s'est produite pendant la lecture (événement de lecture) ou l'écriture (événement d'écriture).
- `cancelable` — Indicateur d'événement minuteur signalant que l'événement doit être ignoré pendant l'arrêt du processus de travail. L'arrêt propre est retardé tant que des événements minuteurs non annulables sont programmés.
- `posted` — Indique que l'événement est posté dans une file.
- `queue` — Nœud de file pour poster l'événement dans une file.

### Événements d'E/S

Chaque connexion obtenue par `ngx_get_connection()` a deux événements associés, `c->read` et `c->write`, qui servent à être notifié que la socket est prête en lecture ou en écriture. Tous ces événements fonctionnent en mode déclenché sur front (Edge-Triggered) : ils ne notifient que lors d'un changement d'état de la socket. Par exemple, une lecture partielle ne provoque pas de nouvelle notification de lecture tant que d'autres données n'arrivent pas. Même quand le mécanisme sous-jacent est déclenché sur niveau (`poll`, `select`, etc.), nginx convertit les notifications en mode sur front. Pour que les notifications soient cohérentes entre tous les systèmes de notification des différentes plates-formes, les fonctions `ngx_handle_read_event(rev, flags)` et `ngx_handle_write_event(wev, lowat)` doivent être appelées après le traitement d'une notification d'E/S ou l'appel de toute fonction d'E/S sur la socket. Normalement, elles sont appelées une fois à la fin de chaque gestionnaire d'événement de lecture ou d'écriture.

### Événements minuteurs

Un événement peut être configuré pour notifier l'expiration d'un délai. Le minuteur des événements compte les millisecondes depuis un instant passé non spécifié, tronqué au type `ngx_msec_t`. Sa valeur courante est disponible dans la variable `ngx_current_msec`.

La fonction `ngx_add_timer(ev, timer)` arme un délai pour un événement, `ngx_del_timer(ev)` supprime un délai armé auparavant. L'arbre rouge-noir global `ngx_event_timer_rbtree` stocke tous les délais armés. La clé de l'arbre est de type `ngx_msec_t` et correspond à l'instant de survenue de l'événement. Cette structure permet des insertions et suppressions rapides, ainsi qu'un accès aux délais les plus proches, que nginx utilise pour savoir combien de temps attendre les événements d'E/S et faire expirer les événements minuteurs.

### Événements postés

Un événement peut être posté, c'est-à-dire que son gestionnaire sera appelé plus tard dans l'itération courante de la boucle d'événements. Poster des événements est une bonne pratique pour simplifier le code et éviter les débordements de pile. Les événements postés sont conservés dans une file. La macro `ngx_post_event(ev, q)` poste l'événement `ev` dans la file `q`. La macro `ngx_delete_posted_event(ev)` retire l'événement `ev` de la file où il est posté. Normalement, les événements sont postés dans la file `ngx_posted_events`, traitée tard dans la boucle — après tous les événements d'E/S et de minuteurs. La fonction `ngx_event_process_posted()` traite une file d'événements : elle appelle les gestionnaires jusqu'à ce que la file soit vide. Un gestionnaire d'événement posté peut donc poster d'autres événements à traiter dans l'itération courante.

Exemple :

```c
void
ngx_my_connection_read(ngx_connection_t *c)
{
    ngx_event_t  *rev;

    rev = c->read;

    ngx_add_timer(rev, 1000);

    rev->handler = ngx_my_read_handler;

    ngx_my_read(rev);
}


void
ngx_my_read_handler(ngx_event_t *rev)
{
    ssize_t            n;
    ngx_connection_t  *c;
    u_char             buf[256];

    if (rev->timedout) { /* timeout expired */ }

    c = rev->data;

    while (rev->ready) {
        n = c->recv(c, buf, sizeof(buf));

        if (n == NGX_AGAIN) {
            break;
        }

        if (n == NGX_ERROR) { /* error */ }

        /* process buf */
    }

    if (ngx_handle_read_event(rev, 0) != NGX_OK) { /* error */ }
}
```

### Boucle d'événements

À part le processus maître, tous les processus nginx font des E/S et ont donc une boucle d'événements. (Le processus maître passe l'essentiel de son temps dans l'appel `sigsuspend()` à attendre des signaux.) La boucle d'événements est mise en œuvre dans la fonction `ngx_process_events_and_timers()`, appelée en boucle jusqu'à la fin du processus.

La boucle d'événements comporte les étapes suivantes :

- Trouver le délai le plus proche de l'expiration en appelant `ngx_event_find_timer()`. Cette fonction trouve le nœud le plus à gauche de l'arbre des minuteurs et renvoie le nombre de millisecondes avant son expiration.
- Traiter les événements d'E/S en appelant un gestionnaire propre au mécanisme de notification choisi par la configuration. Ce gestionnaire attend au moins un événement d'E/S, mais seulement jusqu'à l'expiration du prochain délai. Quand un événement de lecture ou d'écriture survient, l'indicateur `ready` est positionné et le gestionnaire de l'événement est appelé. Sous Linux, c'est normalement le gestionnaire `ngx_epoll_process_events()` qui est utilisé ; il appelle `epoll_wait()` pour attendre les événements d'E/S.
- Faire expirer les minuteurs en appelant `ngx_event_expire_timers()`. L'arbre des minuteurs est parcouru de l'élément le plus à gauche vers la droite jusqu'à trouver un délai non expiré. Pour chaque nœud expiré, l'indicateur `timedout` est positionné, l'indicateur `timer_set` est remis à zéro et le gestionnaire de l'événement est appelé
- Traiter les événements postés en appelant `ngx_event_process_posted()`. La fonction retire successivement le premier élément de la file des événements postés et appelle son gestionnaire, jusqu'à ce que la file soit vide.

Tous les processus nginx gèrent aussi les signaux. Les gestionnaires de signaux ne font que positionner des variables globales, vérifiées après l'appel à `ngx_process_events_and_timers()`.

## Processus

nginx comporte plusieurs types de processus. Le type d'un processus est conservé dans la variable globale `ngx_process` et vaut l'une des valeurs suivantes :

- `NGX_PROCESS_MASTER` — Le processus maître, qui lit la configuration de NGINX, crée les cycles, démarre et contrôle les processus fils. Il ne fait aucune E/S et ne répond qu'aux signaux. Sa fonction de cycle est `ngx_master_process_cycle()`.
- `NGX_PROCESS_WORKER` — Le processus de travail, qui traite les connexions client. Il est démarré par le processus maître et répond à ses signaux et à ses commandes de canal. Sa fonction de cycle est `ngx_worker_process_cycle()`. Il peut y avoir plusieurs processus de travail, selon la directive `worker_processes`.
- `NGX_PROCESS_SINGLE` — Le processus unique, qui n'existe qu'en mode `master_process off` et y est le seul processus. Il crée les cycles (comme le maître) et traite les connexions client (comme un processus de travail). Sa fonction de cycle est `ngx_single_process_cycle()`.
- `NGX_PROCESS_HELPER` — Le processus auxiliaire, dont il existe actuellement deux types : gestionnaire de cache et chargeur de cache. Leur fonction de cycle commune est `ngx_cache_manager_process_cycle()`.

Les processus nginx gèrent les signaux suivants :

- `NGX_SHUTDOWN_SIGNAL` (`SIGQUIT` sur la plupart des systèmes) — Arrêt propre. À la réception de ce signal, le processus maître envoie un signal d'arrêt à tous ses fils. Quand il n'en reste plus, il détruit le pool du cycle et se termine. Un processus de travail qui reçoit ce signal ferme toutes ses sockets d'écoute, attend qu'il n'y ait plus d'événements non annulables programmés, puis détruit le pool du cycle et se termine. Le gestionnaire ou le chargeur de cache se termine immédiatement. La variable `ngx_quit` passe à `1` à la réception du signal et est remise à zéro aussitôt après traitement. La variable `ngx_exiting` vaut `1` tant qu'un processus de travail est en cours d'arrêt.
- `NGX_TERMINATE_SIGNAL` (`SIGTERM` sur la plupart des systèmes) — Terminaison. À la réception de ce signal, le processus maître envoie un signal de terminaison à tous ses fils. Si un fils ne se termine pas dans la seconde, le maître lui envoie `SIGKILL`. Quand il n'y a plus de fils, le maître détruit le pool du cycle et se termine. Un processus de travail, le gestionnaire ou le chargeur de cache qui reçoit ce signal détruit le pool du cycle et se termine. La variable `ngx_terminate` passe à `1` à la réception de ce signal.
- `NGX_NOACCEPT_SIGNAL` (`SIGWINCH` sur la plupart des systèmes) - Arrête tous les processus de travail et auxiliaires. À la réception de ce signal, le processus maître arrête ses fils. Si un nouveau binaire nginx démarré auparavant se termine, les fils de l'ancien maître sont redémarrés. Un processus de travail qui reçoit ce signal s'arrête dans le mode de débogage fixé par la directive `debug_points`.
- `NGX_RECONFIGURE_SIGNAL` (`SIGHUP` sur la plupart des systèmes) - Reconfiguration. À la réception de ce signal, le processus maître relit la configuration et crée un nouveau cycle à partir d'elle. Si la création réussit, l'ancien cycle est supprimé et de nouveaux fils sont démarrés, tandis que les anciens reçoivent le signal `NGX_SHUTDOWN_SIGNAL`. En mode processus unique, nginx crée un nouveau cycle mais conserve l'ancien tant que des clients ont des connexions actives qui y sont liées. Les processus de travail et auxiliaires ignorent ce signal.
- `NGX_REOPEN_SIGNAL` (`SIGUSR1` sur la plupart des systèmes) — Réouverture des fichiers. Le processus maître envoie ce signal aux processus de travail, qui rouvrent tous les `open_files` liés au cycle.
- `NGX_CHANGEBIN_SIGNAL` (`SIGUSR2` sur la plupart des systèmes) — Changement du binaire nginx. Le processus maître démarre un nouveau binaire nginx et lui transmet la liste de toutes les sockets d'écoute. Cette liste textuelle, passée dans la variable d'environnement `“NGINX”`, est formée de numéros de descripteurs séparés par des points-virgules. Le nouveau binaire lit la variable `“NGINX”` et ajoute les sockets à son cycle initial. Les autres processus ignorent ce signal.

Bien que tous les processus de travail puissent recevoir et traiter correctement les signaux POSIX, le processus maître n'utilise pas l'appel système standard `kill()` pour transmettre des signaux aux processus de travail et auxiliaires. nginx utilise plutôt des paires de sockets interprocessus qui permettent d'échanger des messages entre tous ses processus. Actuellement, les messages ne vont toutefois que du maître vers ses fils. Ils transportent les signaux standard.

## Threads

On peut déporter dans un thread séparé des tâches qui bloqueraient sinon le processus de travail. Par exemple, nginx peut être configuré pour utiliser des threads pour les [[12-directives/aio|E/S fichier]]. Autre cas d'usage : une bibliothèque sans interface asynchrone, donc normalement inutilisable avec nginx. Gardez à l'esprit que l'interface des threads complète l'approche asynchrone existante du traitement des connexions client et n'est en aucun cas destinée à la remplacer.

Pour la synchronisation, les enrobages suivants des primitives `pthreads` sont disponibles :

- `typedef pthread_mutex_t ngx_thread_mutex_t;`

  - `ngx_int_t ngx_thread_mutex_create(ngx_thread_mutex_t *mtx, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_mutex_destroy(ngx_thread_mutex_t *mtx, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_mutex_lock(ngx_thread_mutex_t *mtx, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_mutex_unlock(ngx_thread_mutex_t *mtx, ngx_log_t *log);`
- `typedef pthread_cond_t ngx_thread_cond_t;`

  - `ngx_int_t ngx_thread_cond_create(ngx_thread_cond_t *cond, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_cond_destroy(ngx_thread_cond_t *cond, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_cond_signal(ngx_thread_cond_t *cond, ngx_log_t *log);`
  - `ngx_int_t ngx_thread_cond_wait(ngx_thread_cond_t *cond, ngx_thread_mutex_t *mtx, ngx_log_t *log);`

Au lieu de créer un thread par tâche, nginx met en œuvre une stratégie de [[12-directives/thread-pool|thread_pool]]. Plusieurs pools de threads peuvent être configurés pour des usages différents (par exemple des E/S sur différents ensembles de disques). Chaque pool est créé au démarrage et contient un nombre limité de threads qui traitent une file de tâches. Quand une tâche est terminée, un gestionnaire de fin prédéfini est appelé.

Le fichier d'en-tête `src/core/ngx_thread_pool.h` contient les définitions utiles :

```c
struct ngx_thread_task_s {
    ngx_thread_task_t   *next;
    ngx_uint_t           id;
    void                *ctx;
    void               (*handler)(void *data, ngx_log_t *log);
    ngx_event_t          event;
};

typedef struct ngx_thread_pool_s  ngx_thread_pool_t;

ngx_thread_pool_t *ngx_thread_pool_add(ngx_conf_t *cf, ngx_str_t *name);
ngx_thread_pool_t *ngx_thread_pool_get(ngx_cycle_t *cycle, ngx_str_t *name);

ngx_thread_task_t *ngx_thread_task_alloc(ngx_pool_t *pool, size_t size);
ngx_int_t ngx_thread_task_post(ngx_thread_pool_t *tp, ngx_thread_task_t *task);
```

Lors de la configuration, un module qui veut utiliser des threads doit obtenir une référence à un pool de threads en appelant `ngx_thread_pool_add(cf, name)`, qui crée un nouveau pool avec le `name` donné ou renvoie une référence au pool de ce nom s'il existe déjà.

Pour ajouter une tâche `task` dans la file d'un pool `tp` à l'exécution, utilisez la fonction `ngx_thread_task_post(tp, task)`. Pour exécuter une fonction dans un thread, passez les paramètres et définissez un gestionnaire de fin via la structure `ngx_thread_task_t` :

```c
typedef struct {
    int    foo;
} my_thread_ctx_t;


static void
my_thread_func(void *data, ngx_log_t *log)
{
    my_thread_ctx_t *ctx = data;

    /* this function is executed in a separate thread */
}


static void
my_thread_completion(ngx_event_t *ev)
{
    my_thread_ctx_t *ctx = ev->data;

    /* executed in nginx event loop */
}


ngx_int_t
my_task_offload(my_conf_t *conf)
{
    my_thread_ctx_t    *ctx;
    ngx_thread_task_t  *task;

    task = ngx_thread_task_alloc(conf->pool, sizeof(my_thread_ctx_t));
    if (task == NULL) {
        return NGX_ERROR;
    }

    ctx = task->ctx;

    ctx->foo = 42;

    task->handler = my_thread_func;
    task->event.handler = my_thread_completion;
    task->event.data = ctx;

    if (ngx_thread_task_post(conf->thread_pool, task) != NGX_OK) {
        return NGX_ERROR;
    }

    return NGX_OK;
}
```

## Modules

### Ajouter de nouveaux modules

Chaque module nginx autonome se trouve dans un répertoire distinct contenant au moins deux fichiers : `config` et un fichier contenant le code source du module. Le fichier `config` contient toutes les informations dont nginx a besoin pour intégrer le module, par exemple :

```c
ngx_module_type=CORE
ngx_module_name=ngx_foo_module
ngx_module_srcs="$ngx_addon_dir/ngx_foo_module.c"

. auto/module

ngx_addon_name=$ngx_module_name
```

Le fichier `config` est un script shell POSIX qui peut définir et lire les variables suivantes :

- `ngx_module_type` — Type de module à compiler. Valeurs possibles : `CORE`, `HTTP`, `HTTP_FILTER`, `HTTP_INIT_FILTER`, `HTTP_AUX_FILTER`, `MAIL`, `STREAM` ou `MISC`.
- `ngx_module_name` — Noms des modules. Pour compiler plusieurs modules à partir d'un ensemble de fichiers source, indiquez une liste de noms séparés par des espaces. Le premier nom donne le nom du binaire produit pour le module dynamique. Les noms de la liste doivent correspondre à ceux utilisés dans le code source.
- `ngx_addon_name` — Nom du module tel qu'il apparaît dans la sortie console du script configure.
- `ngx_module_srcs` — Liste, séparée par des espaces, des fichiers source compilés pour le module. La variable `$ngx_addon_dir` peut représenter le chemin du répertoire du module.
- `ngx_module_incs` — Chemins d'inclusion nécessaires à la compilation du module
- `ngx_module_deps` — Liste, séparée par des espaces, des dépendances du module. Généralement la liste des fichiers d'en-tête.
- `ngx_module_libs` — Liste, séparée par des espaces, des bibliothèques à lier avec le module. Par exemple, `ngx_module_libs=-lpthread` lie la bibliothèque `libpthread`. Les macros suivantes permettent de lier les mêmes bibliothèques que nginx : `LIBXSLT`, `LIBGD`, `GEOIP`, `PCRE`, `OPENSSL`, `MD5`, `SHA1`, `ZLIB` et `PERL`.
- `ngx_module_link` — Variable fixée par le système de compilation à `DYNAMIC` pour un module dynamique ou `ADDON` pour un module statique, et utilisée pour choisir les actions selon le type de liaison.
- `ngx_module_order` — Ordre de chargement du module ; utile pour les types `HTTP_FILTER` et `HTTP_AUX_FILTER`. Le format est une liste de modules séparés par des espaces. Tous les modules qui suivent le nom du module courant dans la liste se retrouvent après lui dans la liste globale des modules, qui fixe l'ordre d'initialisation. Pour les modules de filtre, une initialisation plus tardive signifie une exécution plus précoce.

  Les modules suivants servent généralement de repères. `ngx_http_copy_filter_module` lit les données pour les autres modules de filtre et se place vers le bas de la liste, pour être parmi les premiers exécutés. `ngx_http_write_filter_module` écrit les données sur la socket client, se place vers le haut de la liste et s'exécute en dernier.

  Par défaut, les modules de filtre sont placés avant `ngx_http_copy_filter` dans la liste, de sorte que leur gestionnaire s'exécute après celui du filtre de copie. Pour les autres types de modules, la valeur par défaut est la chaîne vide.

Pour compiler un module statiquement dans nginx, passez l'argument `--add-module=/path/to/module` au script configure. Pour le compiler en vue d'un chargement dynamique ultérieur, utilisez `--add-dynamic-module=/path/to/module`.

### Modules du cœur

Les modules sont les briques de base de nginx, et la plupart de ses fonctions sont mises en œuvre sous forme de modules. Le fichier source d'un module doit contenir une variable globale de type `ngx_module_t`, définie ainsi :

```c
struct ngx_module_s {

    /* private part is omitted */

    void                 *ctx;
    ngx_command_t        *commands;
    ngx_uint_t            type;

    ngx_int_t           (*init_master)(ngx_log_t *log);

    ngx_int_t           (*init_module)(ngx_cycle_t *cycle);

    ngx_int_t           (*init_process)(ngx_cycle_t *cycle);
    ngx_int_t           (*init_thread)(ngx_cycle_t *cycle);
    void                (*exit_thread)(ngx_cycle_t *cycle);
    void                (*exit_process)(ngx_cycle_t *cycle);

    void                (*exit_master)(ngx_cycle_t *cycle);

    /* stubs for future extensions are omitted */
};
```

La partie privée omise contient la version du module et une signature ; elle est remplie avec la macro prédéfinie `NGX_MODULE_V1`.

Chaque module conserve ses données privées dans le champ `ctx`, reconnaît les directives de configuration indiquées dans le tableau `commands` et peut être appelé à certaines étapes du cycle de vie de nginx. Le cycle de vie d'un module comprend les événements suivants :

- Les gestionnaires de directives de configuration sont appelés au fil de leur apparition dans les fichiers de configuration, dans le contexte du processus maître.
- Après l'analyse réussie de la configuration, le gestionnaire `init_module` est appelé dans le contexte du processus maître, à chaque chargement d'une configuration.
- Le processus maître crée un ou plusieurs processus de travail, et le gestionnaire `init_process` est appelé dans chacun d'eux.
- Quand un processus de travail reçoit du maître la commande d'arrêt ou de terminaison, il appelle le gestionnaire `exit_process`.
- Le processus maître appelle le gestionnaire `exit_master` avant de se terminer.

Comme nginx n'utilise les threads que comme moyen d'E/S complémentaire doté de sa propre API, les gestionnaires `init_thread` et `exit_thread` ne sont actuellement pas appelés. Il n'y a pas non plus de gestionnaire `init_master`, qui serait un surcoût inutile.

Le `type` du module définit exactement ce qui est stocké dans le champ `ctx`. Sa valeur est l'un des types suivants :

- `NGX_CORE_MODULE`
- `NGX_EVENT_MODULE`
- `NGX_HTTP_MODULE`
- `NGX_MAIL_MODULE`
- `NGX_STREAM_MODULE`

`NGX_CORE_MODULE` est le type de module le plus élémentaire, donc le plus générique et le plus bas niveau. Les autres types sont construits dessus et offrent un moyen plus pratique de traiter leurs domaines, comme les événements ou les requêtes HTTP.

Les modules du cœur comprennent `ngx_core_module`, `ngx_errlog_module`, `ngx_regex_module`, `ngx_thread_pool_module` et `ngx_openssl_module`. Les modules HTTP, stream, mail et d'événements sont aussi des modules du cœur. Le contexte d'un module du cœur est défini ainsi :

```c
typedef struct {
    ngx_str_t             name;
    void               *(*create_conf)(ngx_cycle_t *cycle);
    char               *(*init_conf)(ngx_cycle_t *cycle, void *conf);
} ngx_core_module_t;
```

où `name` est le nom du module, `create_conf` et `init_conf` des pointeurs vers des fonctions qui créent et initialisent respectivement la configuration du module. Pour les modules du cœur, nginx appelle `create_conf` avant d'analyser une nouvelle configuration et `init_conf` une fois toute la configuration analysée avec succès. La fonction `create_conf` type alloue la mémoire de la configuration et fixe les valeurs par défaut.

Par exemple, un module simpliste appelé `ngx_foo_module` pourrait ressembler à ceci :

```c
/*
 * Copyright (C) Author.
 */


#include <ngx_config.h>
#include <ngx_core.h>


typedef struct {
    ngx_flag_t  enable;
} ngx_foo_conf_t;


static void *ngx_foo_create_conf(ngx_cycle_t *cycle);
static char *ngx_foo_init_conf(ngx_cycle_t *cycle, void *conf);

static char *ngx_foo_enable(ngx_conf_t *cf, void *post, void *data);
static ngx_conf_post_t  ngx_foo_enable_post = { ngx_foo_enable };


static ngx_command_t  ngx_foo_commands[] = {

    { ngx_string("foo_enabled"),
      NGX_MAIN_CONF|NGX_DIRECT_CONF|NGX_CONF_FLAG,
      ngx_conf_set_flag_slot,
      0,
      offsetof(ngx_foo_conf_t, enable),
      &ngx_foo_enable_post },

      ngx_null_command
};


static ngx_core_module_t  ngx_foo_module_ctx = {
    ngx_string("foo"),
    ngx_foo_create_conf,
    ngx_foo_init_conf
};


ngx_module_t  ngx_foo_module = {
    NGX_MODULE_V1,
    &ngx_foo_module_ctx,                   /* module context */
    ngx_foo_commands,                      /* module directives */
    NGX_CORE_MODULE,                       /* module type */
    NULL,                                  /* init master */
    NULL,                                  /* init module */
    NULL,                                  /* init process */
    NULL,                                  /* init thread */
    NULL,                                  /* exit thread */
    NULL,                                  /* exit process */
    NULL,                                  /* exit master */
    NGX_MODULE_V1_PADDING
};


static void *
ngx_foo_create_conf(ngx_cycle_t *cycle)
{
    ngx_foo_conf_t  *fcf;

    fcf = ngx_pcalloc(cycle->pool, sizeof(ngx_foo_conf_t));
    if (fcf == NULL) {
        return NULL;
    }

    fcf->enable = NGX_CONF_UNSET;

    return fcf;
}


static char *
ngx_foo_init_conf(ngx_cycle_t *cycle, void *conf)
{
    ngx_foo_conf_t *fcf = conf;

    ngx_conf_init_value(fcf->enable, 0);

    return NGX_CONF_OK;
}


static char *
ngx_foo_enable(ngx_conf_t *cf, void *post, void *data)
{
    ngx_flag_t  *fp = data;

    if (*fp == 0) {
        return NGX_CONF_OK;
    }

    ngx_log_error(NGX_LOG_NOTICE, cf->log, 0, "Foo Module is enabled");

    return NGX_CONF_OK;
}
```

### Directives de configuration

Le type `ngx_command_t` définit une directive de configuration. Chaque module qui prend en charge une configuration fournit un tableau de ces structures, qui décrivent comment traiter les arguments et quels gestionnaires appeler :

```c
typedef struct ngx_command_s  ngx_command_t;

struct ngx_command_s {
    ngx_str_t             name;
    ngx_uint_t            type;
    char               *(*set)(ngx_conf_t *cf, ngx_command_t *cmd, void *conf);
    ngx_uint_t            conf;
    ngx_uint_t            offset;
    void                 *post;
};
```

Terminez le tableau par la valeur spéciale `ngx_null_command`. `name` est le nom de la directive tel qu'il apparaît dans le fichier de configuration, par exemple « worker\_processes » ou « listen ». `type` est un champ de bits d'indicateurs qui précisent le nombre d'arguments de la directive, son type et le contexte où elle apparaît. Indicateurs :

- `NGX_CONF_NOARGS` — La directive ne prend pas d'argument.
- `NGX_CONF_1MORE` — La directive prend un ou plusieurs arguments.
- `NGX_CONF_2MORE` — La directive prend deux arguments ou plus.
- `NGX_CONF_TAKE1`..`NGX_CONF_TAKE7` — La directive prend exactement le nombre d'arguments indiqué.
- `NGX_CONF_TAKE12`, `NGX_CONF_TAKE13`, `NGX_CONF_TAKE23`, `NGX_CONF_TAKE123`, `NGX_CONF_TAKE1234` — La directive peut prendre un nombre variable d'arguments, limité aux nombres indiqués. Par exemple, `NGX_CONF_TAKE12` signifie un ou deux arguments.

Indicateurs de type de directive :

- `NGX_CONF_BLOCK` — La directive est un bloc : elle peut contenir d'autres directives entre ses accolades, voire mettre en œuvre son propre analyseur pour leur contenu.
- `NGX_CONF_FLAG` — La directive prend une valeur booléenne, `on` ou `off`.

Le contexte d'une directive définit où elle peut apparaître dans la configuration :

- `NGX_MAIN_CONF` — Dans le contexte de premier niveau.
- `NGX_HTTP_MAIN_CONF` — Dans le bloc `http`.
- `NGX_HTTP_SRV_CONF` — Dans un bloc `server` du bloc `http`.
- `NGX_HTTP_LOC_CONF` — Dans un bloc `location` du bloc `http`.
- `NGX_HTTP_UPS_CONF` — Dans un bloc `upstream` du bloc `http`.
- `NGX_HTTP_SIF_CONF` — Dans un bloc `if` d'un bloc `server` du bloc `http`.
- `NGX_HTTP_LIF_CONF` — Dans un bloc `if` d'un bloc `location` du bloc `http`.
- `NGX_HTTP_LMT_CONF` — Dans un bloc `limit_except` du bloc `http`.
- `NGX_STREAM_MAIN_CONF` — Dans le bloc `stream`.
- `NGX_STREAM_SRV_CONF` — Dans un bloc `server` du bloc `stream`.
- `NGX_STREAM_UPS_CONF` — Dans un bloc `upstream` du bloc `stream`.
- `NGX_MAIL_MAIN_CONF` — Dans le bloc `mail`.
- `NGX_MAIL_SRV_CONF` — Dans un bloc `server` du bloc `mail`.
- `NGX_EVENT_CONF` — Dans le bloc `event`.
- `NGX_DIRECT_CONF` — Utilisé par les modules qui ne créent pas de hiérarchie de contextes et n'ont qu'une configuration globale. Celle-ci est passée au gestionnaire dans l'argument `conf`.

L'analyseur de configuration utilise ces indicateurs pour signaler une erreur en cas de directive mal placée et appelle les gestionnaires de directives avec le bon pointeur de configuration, afin que les mêmes directives à des emplacements différents stockent leurs valeurs à des endroits distincts.

Le champ `set` définit un gestionnaire qui traite la directive et stocke les valeurs analysées dans la configuration correspondante. Plusieurs fonctions effectuent les conversions courantes :

- `ngx_conf_set_flag_slot` — Convertit les chaînes littérales `on` et `off` en valeur `ngx_flag_t` valant respectivement 1 ou 0.
- `ngx_conf_set_str_slot` — Stocke une chaîne comme valeur de type `ngx_str_t`.
- `ngx_conf_set_str_array_slot` — Ajoute une valeur à un tableau `ngx_array_t` de chaînes `ngx_str_t`. Le tableau est créé s'il n'existe pas.
- `ngx_conf_set_keyval_slot` — Ajoute une paire clé-valeur à un tableau `ngx_array_t` de paires `ngx_keyval_t`. La première chaîne devient la clé, la seconde la valeur. Le tableau est créé s'il n'existe pas.
- `ngx_conf_set_num_slot` — Convertit l'argument d'une directive en valeur `ngx_int_t`.
- `ngx_conf_set_size_slot` — Convertit une [[10-guides/01-introduction/syntax|taille]] en valeur `size_t` exprimée en octets.
- `ngx_conf_set_off_slot` — Convertit un [[10-guides/01-introduction/syntax|décalage]] en valeur `off_t` exprimée en octets.
- `ngx_conf_set_msec_slot` — Convertit une [[10-guides/01-introduction/syntax|durée]] en valeur `ngx_msec_t` exprimée en millisecondes.
- `ngx_conf_set_sec_slot` — Convertit une [[10-guides/01-introduction/syntax|durée]] en valeur `time_t` exprimée en secondes.
- `ngx_conf_set_bufs_slot` — Convertit les deux arguments fournis en objet `ngx_bufs_t` contenant le nombre et la [[10-guides/01-introduction/syntax|taille]] des tampons.
- `ngx_conf_set_enum_slot` — Convertit l'argument fourni en valeur `ngx_uint_t`. Le tableau terminé par un élément nul de `ngx_conf_enum_t` passé dans le champ `post` définit les chaînes acceptées et les valeurs entières correspondantes.
- `ngx_conf_set_bitmask_slot` — Convertit les arguments fournis en valeur `ngx_uint_t`. Les masques de chaque argument sont combinés par OU pour former le résultat. Le tableau terminé par un élément nul de `ngx_conf_bitmask_t` passé dans le champ `post` définit les chaînes acceptées et les masques correspondants.
- `set_path_slot` — Convertit les arguments fournis en valeur `ngx_path_t` et effectue toutes les initialisations nécessaires. Pour plus de détails, voir la documentation de la directive [[12-directives/proxy-temp-path|proxy_temp_path]].
- `set_access_slot` — Convertit les arguments fournis en masque de permissions de fichier. Pour plus de détails, voir la documentation de la directive [[12-directives/proxy-store-access|proxy_store_access]].

Le champ `conf` définit quelle structure de configuration est passée au gestionnaire de la directive. Les modules du cœur n'ont que la configuration globale et positionnent l'indicateur `NGX_DIRECT_CONF` pour y accéder. Les modules comme HTTP, Stream ou Mail créent des hiérarchies de configurations. Par exemple, une configuration de module est créée pour les portées `server`, `location` et `if`.

- `NGX_HTTP_MAIN_CONF_OFFSET` — Configuration du bloc `http`.
- `NGX_HTTP_SRV_CONF_OFFSET` — Configuration d'un bloc `server` du bloc `http`.
- `NGX_HTTP_LOC_CONF_OFFSET` — Configuration d'un bloc `location` du bloc `http`.
- `NGX_STREAM_MAIN_CONF_OFFSET` — Configuration du bloc `stream`.
- `NGX_STREAM_SRV_CONF_OFFSET` — Configuration d'un bloc `server` du bloc `stream`.
- `NGX_MAIL_MAIN_CONF_OFFSET` — Configuration du bloc `mail`.
- `NGX_MAIL_SRV_CONF_OFFSET` — Configuration d'un bloc `server` du bloc `mail`.

`offset` définit le décalage, dans la structure de configuration du module, du champ qui contient les valeurs de cette directive. On utilise généralement la macro `offsetof()`.

Le champ `post` a deux usages : définir un gestionnaire appelé après le gestionnaire principal, ou transmettre des données supplémentaires au gestionnaire principal. Dans le premier cas, la structure `ngx_conf_post_t` doit être initialisée avec un pointeur vers le gestionnaire, par exemple :

```c
static char *ngx_do_foo(ngx_conf_t *cf, void *post, void *data);
static ngx_conf_post_t  ngx_foo_post = { ngx_do_foo };
```

L'argument `post` est l'objet `ngx_conf_post_t` lui-même, et `data` un pointeur vers la valeur convertie à partir des arguments par le gestionnaire principal, avec le type approprié.

## HTTP

### Connexion

Chaque connexion client HTTP passe par les étapes suivantes :

- `ngx_event_accept()` accepte une connexion TCP client. Ce gestionnaire est appelé en réponse à une notification de lecture sur une socket d'écoute. Un nouvel objet `ngx_connection_t` est créé à cette étape pour enrober la socket client nouvellement acceptée. Chaque écouteur nginx fournit un gestionnaire auquel transmettre le nouvel objet connexion. Pour les connexions HTTP, c'est `ngx_http_init_connection(c)`.
- `ngx_http_init_connection()` effectue l'initialisation précoce de la connexion HTTP. Un objet `ngx_http_connection_t` est créé pour la connexion et sa référence est stockée dans le champ `data` de celle-ci ; il sera remplacé plus tard par un objet requête HTTP. L'analyseur du protocole PROXY et la poignée de main SSL sont aussi lancés à cette étape.
- Le gestionnaire d'événement de lecture `ngx_http_wait_request_handler()` est appelé quand des données sont disponibles sur la socket client. Un objet requête HTTP `ngx_http_request_t` est alors créé et placé dans le champ `data` de la connexion.
- Le gestionnaire d'événement de lecture `ngx_http_process_request_line()` lit la ligne de requête du client. Il est installé par `ngx_http_wait_request_handler()`. Les données sont lues dans le `buffer` de la connexion, dont la taille initiale est fixée par la directive [[12-directives/client-header-buffer-size|client_header_buffer_size]]. L'en-tête client complet est censé tenir dans ce tampon. Si la taille initiale ne suffit pas, un tampon plus grand est alloué, de capacité fixée par la directive `large_client_header_buffers`.
- Le gestionnaire d'événement de lecture `ngx_http_process_request_headers()` est installé après `ngx_http_process_request_line()` pour lire l'en-tête de la requête client.
- `ngx_http_core_run_phases()` est appelée quand l'en-tête de la requête a été entièrement lu et analysé. Elle exécute les phases de la requête de `NGX_HTTP_POST_READ_PHASE` à `NGX_HTTP_CONTENT_PHASE`. La dernière phase doit générer une réponse et la transmettre le long de la chaîne de filtres. La réponse n'est pas forcément envoyée au client à cette phase : elle peut rester en tampon et être envoyée lors de la finalisation.
- `ngx_http_finalize_request()` est généralement appelée quand la requête a produit toute sa sortie ou une erreur. Dans ce dernier cas, une page d'erreur adaptée est recherchée et utilisée comme réponse. Si la réponse n'est pas encore entièrement envoyée au client, un écrivain HTTP `ngx_http_writer()` est activé pour finir d'envoyer les données en attente.
- `ngx_http_finalize_connection()` est appelée quand la réponse complète a été envoyée au client et que la requête peut être détruite. Si le maintien de connexion (keepalive) est activé, `ngx_http_set_keepalive()` est appelée : elle détruit la requête courante et attend la requête suivante sur la connexion. Sinon, `ngx_http_close_request()` détruit la requête et la connexion.

### Requête

Pour chaque requête HTTP client, un objet `ngx_http_request_t` est créé. Quelques-uns de ses champs :

- `connection` — Pointeur vers l'objet connexion client `ngx_connection_t`. Plusieurs requêtes peuvent référencer le même objet connexion en même temps : une requête principale et ses sous-requêtes. Après la suppression d'une requête, une nouvelle peut être créée sur la même connexion.

  Notez que pour les connexions HTTP, le champ `data` de `ngx_connection_t` pointe vers la requête. Une telle requête est dite active, par opposition aux autres requêtes liées à la connexion. La requête active traite les événements de la connexion client et a le droit d'envoyer sa réponse au client. Normalement, chaque requête devient active à un moment donné pour pouvoir envoyer sa sortie.
- `ctx` — Tableau des contextes des modules HTTP. Chaque module de type `NGX_HTTP_MODULE` peut stocker n'importe quelle valeur (normalement un pointeur vers une structure) dans la requête. La valeur est stockée dans le tableau `ctx` à la position `ctx_index` du module. Les macros suivantes permettent de lire et définir facilement les contextes de requête :

  - `ngx_http_get_module_ctx(r, module)` — Renvoie le contexte de `module`
  - `ngx_http_set_ctx(r, c, module)` — Définit `c` comme contexte de `module`
- `main_conf`, `srv_conf`, `loc_conf` — Tableaux des configurations de la requête courante. Les configurations sont stockées aux positions `ctx_index` des modules.
- `read_event_handler`, `write_event_handler` - Gestionnaires d'événements de lecture et d'écriture de la requête. Normalement, les deux gestionnaires d'une connexion HTTP pointent vers `ngx_http_request_handler()`, qui appelle les gestionnaires `read_event_handler` et `write_event_handler` de la requête actuellement active.
- `cache` — Objet cache de la requête, pour mettre en cache la réponse amont.
- `upstream` — Objet amont de la requête, pour le relais.
- `pool` — Pool de la requête. L'objet requête lui-même est alloué dans ce pool, détruit à la suppression de la requête. Pour les allocations qui doivent rester disponibles pendant toute la durée de vie de la connexion client, utilisez plutôt le pool de `ngx_connection_t`.
- `header_in` — Tampon dans lequel l'en-tête de la requête HTTP client est lu.
- `headers_in`, `headers_out` — Objets en-têtes HTTP d'entrée et de sortie. Tous deux contiennent le champ `headers` de type `ngx_list_t`, qui conserve la liste brute des en-têtes. Certains en-têtes sont en outre disponibles en lecture et écriture sous forme de champs distincts, par exemple `content_length_n`, `status`, etc.
- `request_body` — Objet corps de la requête client.
- `start_sec`, `start_msec` — Instant de création de la requête, utilisé pour suivre sa durée.
- `method`, `method_name` — Représentations numérique et textuelle de la méthode de la requête HTTP client. Les valeurs numériques sont définies dans `src/http/ngx_http_request.h` par les macros `NGX_HTTP_GET`, `NGX_HTTP_HEAD`, `NGX_HTTP_POST`, etc.
- `http_protocol` — Version du protocole HTTP du client sous sa forme textuelle d'origine (« HTTP/1.0 », « HTTP/1.1 », etc.).
- `http_version` — Version du protocole HTTP du client sous forme numérique (`NGX_HTTP_VERSION_10`, `NGX_HTTP_VERSION_11`, etc.).
- `http_major`, `http_minor` — Version du protocole HTTP du client sous forme numérique, séparée en parties majeure et mineure.
- `request_line`, `unparsed_uri` — Ligne de requête et URI de la requête client d'origine.
- `uri`, `args`, `exten` — URI, arguments et extension de fichier de la requête courante. L'URI peut différer de l'URI d'origine envoyée par le client à cause de la normalisation. Ces valeurs peuvent changer au cours du traitement, au gré des redirections internes.
- `main` — Pointeur vers l'objet requête principale. Cet objet est créé pour traiter une requête HTTP client, par opposition aux sous-requêtes, créées pour effectuer une sous-tâche précise au sein de la requête principale.
- `parent` — Pointeur vers la requête parente d'une sous-requête.
- `postponed` — Liste des tampons de sortie et des sous-requêtes, dans l'ordre de leur envoi et de leur création. Le filtre postpone l'utilise pour produire une sortie cohérente quand certaines parties sont créées par des sous-requêtes.
- `post_subrequest` — Pointeur vers un gestionnaire, avec son contexte, appelé à la finalisation d'une sous-requête. Inutilisé pour les requêtes principales.
- `posted_requests` — Liste des requêtes à démarrer ou reprendre, ce qui se fait en appelant le `write_event_handler` de la requête. Normalement, ce gestionnaire contient la fonction principale de la requête, qui exécute d'abord les phases puis produit la sortie.

  Une requête est généralement postée par l'appel `ngx_http_post_request(r, NULL)`. Elle est toujours postée dans la liste `posted_requests` de la requête principale. La fonction `ngx_http_run_posted_requests(c)` exécute toutes les requêtes postées dans la requête principale de la requête active de la connexion passée. Tous les gestionnaires d'événements appellent `ngx_http_run_posted_requests`, ce qui peut entraîner de nouvelles requêtes postées. Normalement, elle est appelée après le gestionnaire de lecture ou d'écriture d'une requête.
- `phase_handler` — Indice de la phase courante de la requête.
- `ncaptures`, `captures`, `captures_data` — Captures produites par la dernière correspondance d'expression régulière de la requête. Une correspondance peut avoir lieu à plusieurs endroits du traitement : recherche map, recherche de serveur par SNI ou par Host HTTP, rewrite, proxy\_redirect, etc. Les captures produites sont stockées dans ces champs. `ncaptures` contient le nombre de captures, `captures` leurs limites et `captures_data` la chaîne testée, d'où les captures sont extraites. Après chaque nouvelle correspondance, les captures de la requête sont réinitialisées avec les nouvelles valeurs.
- `count` — Compteur de références de la requête. Le champ n'a de sens que pour la requête principale. On l'incrémente simplement par `r->main->count++`. Pour le décrémenter, appelez `ngx_http_finalize_request(r, rc)`. La création d'une sous-requête et le lancement de la lecture du corps de la requête incrémentent tous deux le compteur.
- `subrequests` — Niveau d'imbrication courant des sous-requêtes. Chaque sous-requête hérite du niveau de son parent, diminué de un. Une erreur est générée si la valeur atteint zéro. La valeur de la requête principale est définie par la constante `NGX_HTTP_MAX_SUBREQUESTS`.
- `uri_changes` — Nombre de changements d'URI restants pour la requête. Le nombre total de changements d'URI est limité par la constante `NGX_HTTP_MAX_URI_CHANGES`. À chaque changement, la valeur est décrémentée ; une erreur est générée quand elle atteint zéro. Les réécritures et les redirections internes vers des locations normales ou nommées comptent comme des changements d'URI.
- `blocked` — Compteur des blocages détenus sur la requête. Tant qu'il est non nul, la requête ne peut pas être terminée. Il est actuellement incrémenté par les opérations AIO en attente (AIO POSIX et opérations de threads) et par un verrou de cache actif.
- `buffered` — Masque de bits indiquant quels modules ont mis en tampon la sortie produite par la requête. Plusieurs filtres peuvent mettre la sortie en tampon ; par exemple, sub\_filter peut le faire à cause d'une correspondance partielle de chaîne, le filtre de copie par manque de tampons de sortie libres, etc. Tant que cette valeur est non nulle, la requête n'est pas finalisée, dans l'attente du vidage.
- `header_only` — Indique que la sortie ne nécessite pas de corps. Utilisé par exemple pour les requêtes HTTP HEAD.
- `keepalive` — Indique si le maintien de la connexion client est pris en charge. La valeur est déduite de la version HTTP et de l'en-tête `Connection`.
- `header_sent` — Indique que l'en-tête de sortie a déjà été envoyé par la requête.
- `internal` — Indique que la requête courante est interne. Pour devenir interne, une requête doit passer par une redirection interne ou être une sous-requête. Les requêtes internes ont accès aux locations internes.
- `allow_ranges` — Indique qu'une réponse partielle peut être envoyée au client, selon l'en-tête HTTP Range.
- `subrequest_ranges` — Indique qu'une réponse partielle peut être envoyée pendant le traitement d'une sous-requête.
- `single_range` — Indique qu'une seule plage continue de données peut être envoyée au client. Généralement positionné lors de l'envoi d'un flux de données, par exemple depuis un serveur mandaté, quand la réponse complète n'est pas disponible dans un seul tampon.
- `main_filter_need_in_memory`, `filter_need_in_memory` — Demandent que la sortie soit produite dans des tampons mémoire plutôt que dans des fichiers. C'est un signal pour que le filtre de copie lise les données des tampons fichier même si sendfile est activé. La différence entre les deux tient à la position des modules de filtre qui les positionnent. Les filtres appelés avant le filtre postpone positionnent `filter_need_in_memory`, pour que seule la sortie de la requête courante arrive en mémoire. Les filtres appelés plus tard positionnent `main_filter_need_in_memory`, pour que la requête principale et toutes les sous-requêtes lisent les fichiers en mémoire lors de l'envoi.
- `filter_need_temporary` — Demande que la sortie de la requête soit produite dans des tampons temporaires, et non dans des tampons mémoire en lecture seule ou des tampons fichier. Utilisé par les filtres qui peuvent modifier la sortie directement dans les tampons où elle est envoyée.

### Configuration

Chaque module HTTP peut avoir trois types de configuration :

- Configuration principale — S'applique à tout le bloc `http`. Sert de paramètres globaux du module.
- Configuration de serveur — S'applique à un bloc `server`. Sert de paramètres du module propres au serveur.
- Configuration de location — S'applique à un bloc `location`, `if` ou `limit_except`. Sert de paramètres du module propres à la location.

Les structures de configuration sont créées pendant la phase de configuration de nginx par des fonctions qui les allouent, les initialisent et les fusionnent. L'exemple suivant montre comment créer une configuration de location simple pour un module, avec un seul paramètre, `foo`, de type entier non signé.

```c
typedef struct {
    ngx_uint_t  foo;
} ngx_http_foo_loc_conf_t;


static ngx_http_module_t  ngx_http_foo_module_ctx = {
    NULL,                                  /* preconfiguration */
    NULL,                                  /* postconfiguration */

    NULL,                                  /* create main configuration */
    NULL,                                  /* init main configuration */

    NULL,                                  /* create server configuration */
    NULL,                                  /* merge server configuration */

    ngx_http_foo_create_loc_conf,          /* create location configuration */
    ngx_http_foo_merge_loc_conf            /* merge location configuration */
};


static void *
ngx_http_foo_create_loc_conf(ngx_conf_t *cf)
{
    ngx_http_foo_loc_conf_t  *conf;

    conf = ngx_pcalloc(cf->pool, sizeof(ngx_http_foo_loc_conf_t));
    if (conf == NULL) {
        return NULL;
    }

    conf->foo = NGX_CONF_UNSET_UINT;

    return conf;
}


static char *
ngx_http_foo_merge_loc_conf(ngx_conf_t *cf, void *parent, void *child)
{
    ngx_http_foo_loc_conf_t *prev = parent;
    ngx_http_foo_loc_conf_t *conf = child;

    ngx_conf_merge_uint_value(conf->foo, prev->foo, 1);
}
```

Comme on le voit, la fonction `ngx_http_foo_create_loc_conf()` crée une nouvelle structure de configuration, et `ngx_http_foo_merge_loc_conf()` fusionne une configuration avec celle d'un niveau supérieur. En fait, les configurations de serveur et de location n'existent pas qu'à leur niveau : elles sont aussi créées pour tous les niveaux supérieurs. Une configuration de serveur est ainsi créée aussi au niveau principal, et des configurations de location aux niveaux principal, serveur et location. Cela permet d'indiquer des paramètres propres au serveur et à la location à n'importe quel niveau du fichier de configuration. Les configurations sont finalement fusionnées vers le bas. Plusieurs macros comme `NGX_CONF_UNSET` et `NGX_CONF_UNSET_UINT` permettent d'indiquer un paramètre absent, ignoré lors de la fusion. Les macros de fusion standard comme `ngx_conf_merge_value()` et `ngx_conf_merge_uint_value()` permettent de fusionner un paramètre et de fixer sa valeur par défaut si aucune configuration n'en fournit explicitement. Pour la liste complète des macros par type, voir `src/core/ngx_conf_file.h`.

Les macros suivantes permettent d'accéder à la configuration des modules HTTP pendant la configuration. Elles prennent toutes une référence `ngx_conf_t` en premier argument.

- `ngx_http_conf_get_module_main_conf(cf, module)`
- `ngx_http_conf_get_module_srv_conf(cf, module)`
- `ngx_http_conf_get_module_loc_conf(cf, module)`

L'exemple suivant récupère un pointeur vers la configuration de location du module standard [[11-modules/02-http/ngx_http_core_module|ngx_http_core_module]] et remplace le gestionnaire de contenu de la location, conservé dans le champ `handler` de la structure.

```c
static ngx_int_t ngx_http_foo_handler(ngx_http_request_t *r);


static ngx_command_t  ngx_http_foo_commands[] = {

    { ngx_string("foo"),
      NGX_HTTP_LOC_CONF|NGX_CONF_NOARGS,
      ngx_http_foo,
      0,
      0,
      NULL },

      ngx_null_command
};


static char *
ngx_http_foo(ngx_conf_t *cf, ngx_command_t *cmd, void *conf)
{
    ngx_http_core_loc_conf_t  *clcf;

    clcf = ngx_http_conf_get_module_loc_conf(cf, ngx_http_core_module);
    clcf->handler = ngx_http_bar_handler;

    return NGX_CONF_OK;
}
```

Les macros suivantes permettent d'accéder à la configuration des modules HTTP à l'exécution.

- `ngx_http_get_module_main_conf(r, module)`
- `ngx_http_get_module_srv_conf(r, module)`
- `ngx_http_get_module_loc_conf(r, module)`

Ces macros reçoivent une référence à une requête HTTP `ngx_http_request_t`. La configuration principale d'une requête ne change jamais. La configuration de serveur peut changer par rapport à celle par défaut une fois le serveur virtuel de la requête choisi. La configuration de location retenue peut changer plusieurs fois suite à une réécriture ou une redirection interne. L'exemple suivant montre comment accéder à la configuration HTTP d'un module à l'exécution.

```c
static ngx_int_t
ngx_http_foo_handler(ngx_http_request_t *r)
{
    ngx_http_foo_loc_conf_t  *flcf;

    flcf = ngx_http_get_module_loc_conf(r, ngx_http_foo_module);

    ...
}
```

### Phases

Chaque requête HTTP passe par une suite de phases, chacune effectuant un type de traitement distinct. Des gestionnaires propres aux modules peuvent être enregistrés dans la plupart des phases, et de nombreux modules standard le font pour être appelés à une étape précise du traitement. Les phases sont traitées successivement et leurs gestionnaires appelés quand la requête atteint la phase. Voici la liste des phases HTTP de nginx.

- `NGX_HTTP_POST_READ_PHASE` — Première phase. Le module [[11-modules/02-http/ngx_http_realip_module|ngx_http_realip_module]] y enregistre son gestionnaire pour pouvoir substituer les adresses client avant l'appel de tout autre module.
- `NGX_HTTP_SERVER_REWRITE_PHASE` — Phase où sont traitées les directives de réécriture définies dans un bloc `server` (hors d'un bloc `location`). Le module [[11-modules/02-http/ngx_http_rewrite_module|ngx_http_rewrite_module]] y installe son gestionnaire.
- `NGX_HTTP_FIND_CONFIG_PHASE` — Phase spéciale où une location est choisie selon l'URI de la requête. Avant cette phase, la location par défaut du serveur virtuel concerné est affectée à la requête, et tout module demandant une configuration de location reçoit celle de la location par défaut. Cette phase affecte une nouvelle location à la requête. Aucun gestionnaire supplémentaire ne peut y être enregistré.
- `NGX_HTTP_REWRITE_PHASE` — Comme `NGX_HTTP_SERVER_REWRITE_PHASE`, mais pour les règles de réécriture de la location choisie à la phase précédente.
- `NGX_HTTP_POST_REWRITE_PHASE` — Phase spéciale où la requête est redirigée vers une nouvelle location si son URI a changé lors d'une réécriture, en repassant par `NGX_HTTP_FIND_CONFIG_PHASE`. Aucun gestionnaire supplémentaire ne peut y être enregistré.
- `NGX_HTTP_PREACCESS_PHASE` — Phase commune à différents types de gestionnaires, sans lien avec le contrôle d'accès. Les modules standard [[11-modules/02-http/ngx_http_limit_conn_module|ngx_http_limit_conn_module]] et [[11-modules/02-http/ngx_http_limit_req_module|ngx_http_limit_req_module]] y enregistrent leurs gestionnaires.
- `NGX_HTTP_ACCESS_PHASE` — Phase où l'on vérifie que le client est autorisé à faire la requête. Des modules standard comme [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]] et [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]] y enregistrent leurs gestionnaires. Par défaut, le client doit passer la vérification de tous les gestionnaires de cette phase pour que la requête continue. La directive [[12-directives/satisfy|satisfy]] permet de continuer si l'un quelconque des gestionnaires autorise le client.
- `NGX_HTTP_POST_ACCESS_PHASE` — Phase spéciale où la directive [[12-directives/satisfy|satisfy any]] est traitée. Si certains gestionnaires de la phase d'accès ont refusé l'accès et qu'aucun ne l'a explicitement autorisé, la requête est finalisée. Aucun gestionnaire supplémentaire ne peut y être enregistré.
- `NGX_HTTP_PRECONTENT_PHASE` — Phase des gestionnaires à appeler avant la génération du contenu. Des modules standard comme [[12-directives/try-files|ngx_http_try_files_module]] et [[11-modules/02-http/ngx_http_mirror_module|ngx_http_mirror_module]] y enregistrent leurs gestionnaires.
- `NGX_HTTP_CONTENT_PHASE` — Phase où la réponse est normalement générée. Plusieurs modules standard y enregistrent leurs gestionnaires, dont [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]] ou `ngx_http_static_module`. Ils sont appelés successivement jusqu'à ce que l'un d'eux produise la sortie. On peut aussi définir des gestionnaires de contenu par location : si la configuration de location de [[11-modules/02-http/ngx_http_core_module|ngx_http_core_module]] a un `handler` défini, il est appelé comme gestionnaire de contenu et ceux de cette phase sont ignorés.
- `NGX_HTTP_LOG_PHASE` — Phase de journalisation de la requête. Actuellement, seul [[11-modules/02-http/ngx_http_log_module|ngx_http_log_module]] y enregistre son gestionnaire, pour le journal d'accès. Les gestionnaires de cette phase sont appelés tout à la fin du traitement, juste avant la libération de la requête.

Voici un exemple de gestionnaire de la phase de pré-accès.

```c
static ngx_http_module_t  ngx_http_foo_module_ctx = {
    NULL,                                  /* preconfiguration */
    ngx_http_foo_init,                     /* postconfiguration */

    NULL,                                  /* create main configuration */
    NULL,                                  /* init main configuration */

    NULL,                                  /* create server configuration */
    NULL,                                  /* merge server configuration */

    NULL,                                  /* create location configuration */
    NULL                                   /* merge location configuration */
};


static ngx_int_t
ngx_http_foo_handler(ngx_http_request_t *r)
{
    ngx_table_elt_t  *ua;

    ua = r->headers_in.user_agent;

    if (ua == NULL) {
        return NGX_DECLINED;
    }

    /* reject requests with "User-Agent: foo" */
    if (ua->value.len == 3 && ngx_strncmp(ua->value.data, "foo", 3) == 0) {
        return NGX_HTTP_FORBIDDEN;
    }

    return NGX_DECLINED;
}


static ngx_int_t
ngx_http_foo_init(ngx_conf_t *cf)
{
    ngx_http_handler_pt        *h;
    ngx_http_core_main_conf_t  *cmcf;

    cmcf = ngx_http_conf_get_module_main_conf(cf, ngx_http_core_module);

    h = ngx_array_push(&cmcf->phases[NGX_HTTP_PREACCESS_PHASE].handlers);
    if (h == NULL) {
        return NGX_ERROR;
    }

    *h = ngx_http_foo_handler;

    return NGX_OK;
}
```

Les gestionnaires de phase doivent renvoyer des codes précis :

- `NGX_OK` — Passer à la phase suivante.
- `NGX_DECLINED` — Passer au gestionnaire suivant de la phase courante. Si c'est le dernier de la phase, passer à la phase suivante.
- `NGX_AGAIN`, `NGX_DONE` — Suspendre le traitement des phases jusqu'à un événement futur, par exemple une opération d'E/S asynchrone ou un simple délai. On suppose que le traitement reprendra plus tard par un appel à `ngx_http_core_run_phases()`.
- Toute autre valeur renvoyée est traitée comme un code de finalisation de la requête, en particulier un code de réponse HTTP. La requête est finalisée avec ce code.

Pour certaines phases, les codes de retour sont traités un peu différemment. À la phase de contenu, tout code autre que `NGX_DECLINED` est considéré comme un code de finalisation, de même que tout code renvoyé par les gestionnaires de contenu de location. À la phase d'accès, en mode [[12-directives/satisfy|satisfy any]], tout code autre que `NGX_OK`, `NGX_DECLINED`, `NGX_AGAIN`, `NGX_DONE` est considéré comme un refus. Si aucun gestionnaire d'accès suivant n'autorise ou ne refuse l'accès avec un autre code, le code de refus devient le code de finalisation.

### Variables

#### Accéder aux variables existantes

Les variables peuvent être référencées par indice (méthode la plus courante) ou par nom (voir plus bas). L'indice est créé à l'étape de configuration, quand une variable est ajoutée à la configuration. Pour obtenir l'indice d'une variable, utilisez `ngx_http_get_variable_index()` :

```c
ngx_str_t  name;  /* ngx_string("foo") */
ngx_int_t  index;

index = ngx_http_get_variable_index(cf, &name);
```

Ici, `cf` est un pointeur vers la configuration de nginx et `name` pointe vers une chaîne contenant le nom de la variable. La fonction renvoie `NGX_ERROR` en cas d'erreur, sinon un indice valide, généralement stocké dans la configuration du module pour un usage ultérieur.

Toutes les variables HTTP sont évaluées dans le contexte d'une requête HTTP donnée ; les résultats lui sont propres et y sont mis en cache. Toutes les fonctions qui évaluent des variables renvoient le type `ngx_http_variable_value_t`, qui représente la valeur de la variable :

```c
typedef ngx_variable_value_t  ngx_http_variable_value_t;

typedef struct {
    unsigned    len:28;

    unsigned    valid:1;
    unsigned    no_cacheable:1;
    unsigned    not_found:1;
    unsigned    escape:1;

    u_char     *data;
} ngx_variable_value_t;
```

où :

- `len` — Longueur de la valeur
- `data` — La valeur elle-même
- `valid` — La valeur est valide
- `not_found` — La variable est introuvable, les champs `data` et `len` sont donc sans objet ; cela arrive par exemple avec des variables comme `$arg_foo` quand l'argument correspondant n'est pas passé dans la requête
- `no_cacheable` — Ne pas mettre le résultat en cache
- `escape` — Utilisé en interne par le module de journalisation pour marquer les valeurs à échapper en sortie.

Les fonctions `ngx_http_get_flushed_variable()` et `ngx_http_get_indexed_variable()` servent à obtenir la valeur d'une variable. Elles ont la même interface : une requête HTTP `r` comme contexte d'évaluation et un `index` qui identifie la variable. Exemple d'usage typique :

```c
ngx_http_variable_value_t  *v;

v = ngx_http_get_flushed_variable(r, index);

if (v == NULL || v->not_found) {
    /* we failed to get value or there is no such variable, handle it */
    return NGX_ERROR;
}

/* some meaningful value is found */
```

La différence est que `ngx_http_get_indexed_variable()` renvoie une valeur en cache, tandis que `ngx_http_get_flushed_variable()` vide le cache des variables non mises en cache.

Certains modules, comme SSI et Perl, doivent traiter des variables dont le nom n'est pas connu à la configuration. On ne peut donc pas y accéder par indice, mais la fonction `ngx_http_get_variable(r, name, key)` est disponible. Elle cherche une variable de nom `name` avec sa clé de hachage `key` dérivée du nom.

#### Créer des variables

Pour créer une variable, utilisez la fonction `ngx_http_add_variable()`. Elle prend en arguments une configuration (où la variable est enregistrée), le nom de la variable et des indicateurs qui contrôlent son comportement :

- `NGX_HTTP_VAR_CHANGEABLE` — Permet de redéfinir la variable : pas de conflit si un autre module définit une variable de même nom. Cela permet à la directive [[12-directives/set-http-rewrite|set]] de remplacer des variables.
- `NGX_HTTP_VAR_NOCACHEABLE` — Désactive la mise en cache, utile pour des variables comme `$time_local`.
- `NGX_HTTP_VAR_NOHASH` — Indique que la variable n'est accessible que par indice, pas par nom. Petite optimisation, à utiliser quand on sait que la variable n'est pas nécessaire dans des modules comme SSI ou Perl.
- `NGX_HTTP_VAR_PREFIX` — Le nom de la variable est un préfixe. Le gestionnaire doit alors mettre en œuvre une logique supplémentaire pour obtenir la valeur d'une variable précise. Par exemple, toutes les variables « `arg_` » sont traitées par le même gestionnaire, qui cherche dans les arguments de la requête et renvoie la valeur de l'argument voulu.

La fonction renvoie NULL en cas d'erreur, sinon un pointeur vers `ngx_http_variable_t` :

```c
struct ngx_http_variable_s {
    ngx_str_t                     name;
    ngx_http_set_variable_pt      set_handler;
    ngx_http_get_variable_pt      get_handler;
    uintptr_t                     data;
    ngx_uint_t                    flags;
    ngx_uint_t                    index;
};
```

Les gestionnaires `get` et `set` sont appelés pour obtenir ou définir la valeur de la variable, `data` est passé aux gestionnaires, et `index` contient l'indice attribué, qui sert à référencer la variable.

Généralement, un module crée un tableau statique terminé par un élément nul de structures `ngx_http_variable_t`, traité à l'étape de préconfiguration pour ajouter les variables à la configuration, par exemple :

```c
static ngx_http_variable_t  ngx_http_foo_vars[] = {

    { ngx_string("foo_v1"), NULL, ngx_http_foo_v1_variable, 0, 0, 0 },

      ngx_http_null_variable
};

static ngx_int_t
ngx_http_foo_add_variables(ngx_conf_t *cf)
{
    ngx_http_variable_t  *var, *v;

    for (v = ngx_http_foo_vars; v->name.len; v++) {
        var = ngx_http_add_variable(cf, &v->name, v->flags);
        if (var == NULL) {
            return NGX_ERROR;
        }

        var->get_handler = v->get_handler;
        var->data = v->data;
    }

    return NGX_OK;
}
```

Dans l'exemple, cette fonction initialise le champ `preconfiguration` du contexte du module HTTP et est appelée avant l'analyse de la configuration HTTP, pour que l'analyseur puisse faire référence à ces variables.

Le gestionnaire `get` évalue une variable dans le contexte d'une requête précise, par exemple :

```c
static ngx_int_t
ngx_http_variable_connection(ngx_http_request_t *r,
    ngx_http_variable_value_t *v, uintptr_t data)
{
    u_char  *p;

    p = ngx_pnalloc(r->pool, NGX_ATOMIC_T_LEN);
    if (p == NULL) {
        return NGX_ERROR;
    }

    v->len = ngx_sprintf(p, "%uA", r->connection->number) - p;
    v->valid = 1;
    v->no_cacheable = 0;
    v->not_found = 0;
    v->data = p;

    return NGX_OK;
}
```

Il renvoie `NGX_ERROR` en cas d'erreur interne (par exemple un échec d'allocation mémoire), sinon `NGX_OK`. Pour connaître l'état de l'évaluation, examinez les indicateurs de `ngx_http_variable_value_t` (voir la description plus haut).

Le gestionnaire `set` permet de définir la propriété référencée par la variable. Par exemple, le gestionnaire set de la variable `$limit_rate` modifie le champ `limit_rate` de la requête :

```c
...
{ ngx_string("limit_rate"), ngx_http_variable_request_set_size,
  ngx_http_variable_request_get_size,
  offsetof(ngx_http_request_t, limit_rate),
  NGX_HTTP_VAR_CHANGEABLE|NGX_HTTP_VAR_NOCACHEABLE, 0 },
...

static void
ngx_http_variable_request_set_size(ngx_http_request_t *r,
    ngx_http_variable_value_t *v, uintptr_t data)
{
    ssize_t    s, *sp;
    ngx_str_t  val;

    val.len = v->len;
    val.data = v->data;

    s = ngx_parse_size(&val);

    if (s == NGX_ERROR) {
        ngx_log_error(NGX_LOG_ERR, r->connection->log, 0,
                      "invalid size \"%V\"", &val);
        return;
    }

    sp = (ssize_t *) ((char *) r + data);

    *sp = s;

    return;
}
```

### Valeurs complexes

Une valeur complexe, malgré son nom, offre un moyen simple d'évaluer des expressions pouvant contenir du texte, des variables et leur combinaison.

La description de la valeur complexe dans `ngx_http_compile_complex_value` est compilée à l'étape de configuration en `ngx_http_complex_value_t`, utilisé à l'exécution pour obtenir le résultat de l'évaluation de l'expression.

```c
ngx_str_t                         *value;
ngx_http_complex_value_t           cv;
ngx_http_compile_complex_value_t   ccv;

value = cf->args->elts; /* directive arguments */

ngx_memzero(&ccv, sizeof(ngx_http_compile_complex_value_t));

ccv.cf = cf;
ccv.value = &value[1];
ccv.complex_value = &cv;
ccv.zero = 1;
ccv.conf_prefix = 1;

if (ngx_http_compile_complex_value(&ccv) != NGX_OK) {
    return NGX_CONF_ERROR;
}
```

Ici, `ccv` contient tous les paramètres nécessaires pour initialiser la valeur complexe `cv` :

- `cf` — Pointeur de configuration
- `value` — Chaîne à analyser (entrée)
- `complex_value` — Valeur compilée (sortie)
- `zero` — Indicateur qui active la terminaison par un octet nul
- `conf_prefix` — Préfixe le résultat par le préfixe de configuration (le répertoire où nginx cherche actuellement sa configuration)
- `root_prefix` — Préfixe le résultat par le préfixe racine (le préfixe d'installation normal de nginx)

L'indicateur `zero` est utile quand les résultats sont passés à des bibliothèques qui exigent des chaînes terminées par un octet nul, et les préfixes sont pratiques pour les noms de fichiers.

Après une compilation réussie, `cv.lengths` indique si l'expression contient des variables. La valeur NULL signifie qu'elle ne contient que du texte statique, qui peut donc être stocké dans une simple chaîne plutôt que sous forme de valeur complexe.

`ngx_http_set_complex_value_slot()` est une fonction pratique qui initialise entièrement une valeur complexe dans la déclaration de la directive elle-même.

À l'exécution, une valeur complexe peut être calculée avec la fonction `ngx_http_complex_value()` :

```c
ngx_str_t  res;

if (ngx_http_complex_value(r, &cv, &res) != NGX_OK) {
    return NGX_ERROR;
}
```

À partir de la requête `r` et de la valeur compilée `cv`, la fonction évalue l'expression et écrit le résultat dans `res`.

### Redirection des requêtes

Une requête HTTP est toujours liée à une location via le champ `loc_conf` de la structure `ngx_http_request_t`. On peut donc à tout moment obtenir la configuration de location de n'importe quel module à partir de la requête en appelant `ngx_http_get_module_loc_conf(r, module)`. La location peut changer plusieurs fois pendant la vie de la requête. Au départ, la location par défaut du serveur par défaut lui est affectée. Si la requête bascule vers un autre serveur (choisi par l'en-tête HTTP `Host` ou l'extension SSL SNI), elle bascule aussi vers la location par défaut de ce serveur. Le changement suivant a lieu à la phase `NGX_HTTP_FIND_CONFIG_PHASE`, où une location est choisie selon l'URI parmi toutes les locations non nommées du serveur. Le module [[11-modules/02-http/ngx_http_rewrite_module|ngx_http_rewrite_module]] peut modifier l'URI à la phase `NGX_HTTP_REWRITE_PHASE` suite à la directive [[12-directives/rewrite|rewrite]] et renvoyer la requête à la phase `NGX_HTTP_FIND_CONFIG_PHASE` pour choisir une nouvelle location selon la nouvelle URI.

On peut aussi rediriger une requête vers une nouvelle location à tout moment en appelant `ngx_http_internal_redirect(r, uri, args)` ou `ngx_http_named_location(r, name)`.

La fonction `ngx_http_internal_redirect(r, uri, args)` modifie l'URI de la requête et la renvoie à la phase `NGX_HTTP_SERVER_REWRITE_PHASE`. La requête continue avec la location par défaut du serveur ; plus tard, à `NGX_HTTP_FIND_CONFIG_PHASE`, une nouvelle location est choisie selon la nouvelle URI.

L'exemple suivant effectue une redirection interne avec de nouveaux arguments de requête.

```c
ngx_int_t
ngx_http_foo_redirect(ngx_http_request_t *r)
{
    ngx_str_t  uri, args;

    ngx_str_set(&uri, "/foo");
    ngx_str_set(&args, "bar=1");

    return ngx_http_internal_redirect(r, &uri, &args);
}
```

La fonction `ngx_http_named_location(r, name)` redirige une requête vers une location nommée, dont le nom est passé en argument. La location est recherchée parmi toutes les locations nommées du serveur courant, puis la requête passe à la phase `NGX_HTTP_REWRITE_PHASE`.

L'exemple suivant redirige vers une location nommée @foo.

```c
ngx_int_t
ngx_http_foo_named_redirect(ngx_http_request_t *r)
{
    ngx_str_t  name;

    ngx_str_set(&name, "foo");

    return ngx_http_named_location(r, &name);
}
```

Les deux fonctions `ngx_http_internal_redirect(r, uri, args)` et `ngx_http_named_location(r, name)` peuvent être appelées alors que des modules ont déjà stocké des contextes dans le champ `ctx` de la requête. Ces contextes risquent de devenir incohérents avec la nouvelle configuration de location. Pour l'éviter, les deux fonctions de redirection effacent tous les contextes de la requête.

Appeler `ngx_http_internal_redirect(r, uri, args)` ou `ngx_http_named_location(r, name)` incrémente le `count` de la requête. Pour un décompte de références cohérent, appelez `ngx_http_finalize_request(r, NGX_DONE)` après la redirection : cela termine le chemin de code courant et décrémente le compteur.

Les requêtes redirigées et réécrites deviennent internes et peuvent accéder aux locations [[12-directives/internal|internal]]. Les requêtes internes ont l'indicateur `internal` positionné.

### Sous-requêtes

Les sous-requêtes servent surtout à insérer la sortie d'une requête dans une autre, éventuellement mêlée à d'autres données. Une sous-requête ressemble à une requête normale mais partage certaines données avec son parent, en particulier tous les champs liés aux entrées du client, puisqu'une sous-requête ne reçoit aucune autre entrée de celui-ci. Le champ `parent` d'une sous-requête contient un lien vers sa requête parente ; il vaut NULL pour la requête principale. Le champ `main` contient un lien vers la requête principale d'un groupe de requêtes.

Une sous-requête démarre à la phase `NGX_HTTP_SERVER_REWRITE_PHASE`. Elle traverse les mêmes phases suivantes qu'une requête normale et reçoit une location selon sa propre URI.

L'en-tête de sortie d'une sous-requête est toujours ignoré. Le filtre `ngx_http_postpone_filter` place le corps de sortie de la sous-requête au bon endroit par rapport aux autres données produites par la requête parente.

Les sous-requêtes sont liées à la notion de requête active. Une requête `r` est active si `c->data == r`, où `c` est l'objet connexion client. À tout instant, seule la requête active d'un groupe peut envoyer ses tampons au client. Une requête inactive peut toujours envoyer sa sortie dans la chaîne de filtres, mais celle-ci ne dépasse pas `ngx_http_postpone_filter` et y reste en tampon jusqu'à ce que la requête devienne active. Quelques règles d'activation :

- Au départ, la requête principale est active.
- La première sous-requête d'une requête active devient active dès sa création.
- `ngx_http_postpone_filter` active la requête suivante de la liste des sous-requêtes de la requête active, une fois envoyées toutes les données qui la précèdent.
- Quand une requête est finalisée, son parent est activé.

Créez une sous-requête en appelant la fonction `ngx_http_subrequest(r, uri, args, psr, ps, flags)`, où `r` est la requête parente, `uri` et `args` l'URI et les arguments de la sous-requête, `psr` le paramètre de sortie qui reçoit la référence de la nouvelle sous-requête, `ps` un objet de rappel pour notifier la requête parente de la finalisation de la sous-requête, et `flags` un masque d'indicateurs. Indicateurs disponibles :

- `NGX_HTTP_SUBREQUEST_IN_MEMORY` - La sortie n'est pas envoyée au client mais stockée en mémoire. N'affecte que les sous-requêtes traitées par l'un des modules de relais. Après finalisation, la sortie est disponible dans `r->out`, de type `ngx_buf_t`.
- `NGX_HTTP_SUBREQUEST_WAITED` - L'indicateur `done` de la sous-requête est positionné même si elle n'est pas active lors de sa finalisation. Utilisé par le filtre SSI.
- `NGX_HTTP_SUBREQUEST_CLONE` - La sous-requête est créée comme un clone de son parent. Elle démarre dans la même location et reprend à la même phase que la requête parente.

L'exemple suivant crée une sous-requête avec l'URI `/foo`.

```c
ngx_int_t            rc;
ngx_str_t            uri;
ngx_http_request_t  *sr;

...

ngx_str_set(&uri, "/foo");

rc = ngx_http_subrequest(r, &uri, NULL, &sr, NULL, 0);
if (rc == NGX_ERROR) {
    /* error */
}
```

Cet exemple clone la requête courante et définit une fonction de rappel de finalisation pour la sous-requête.

```c
ngx_int_t
ngx_http_foo_clone(ngx_http_request_t *r)
{
    ngx_http_request_t          *sr;
    ngx_http_post_subrequest_t  *ps;

    ps = ngx_palloc(r->pool, sizeof(ngx_http_post_subrequest_t));
    if (ps == NULL) {
        return NGX_ERROR;
    }

    ps->handler = ngx_http_foo_subrequest_done;
    ps->data = "foo";

    return ngx_http_subrequest(r, &r->uri, &r->args, &sr, ps,
                               NGX_HTTP_SUBREQUEST_CLONE);
}


ngx_int_t
ngx_http_foo_subrequest_done(ngx_http_request_t *r, void *data, ngx_int_t rc)
{
    char  *msg = (char *) data;

    ngx_log_error(NGX_LOG_INFO, r->connection->log, 0,
                  "done subrequest r:%p msg:%s rc:%i", r, msg, rc);

    return rc;
}
```

Les sous-requêtes sont normalement créées dans un filtre de corps ; leur sortie est alors traitée comme celle de n'importe quelle requête explicite. La sortie d'une sous-requête est donc envoyée au client après tous les tampons explicites passés avant sa création et avant tous ceux passés après. Cet ordre est préservé même pour de grandes hiérarchies de sous-requêtes. L'exemple suivant insère la sortie d'une sous-requête après tous les tampons de données de la requête, mais avant le tampon final portant l'indicateur `last_buf`.

```c
ngx_int_t
ngx_http_foo_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
    ngx_int_t                   rc;
    ngx_buf_t                  *b;
    ngx_uint_t                  last;
    ngx_chain_t                *cl, out;
    ngx_http_request_t         *sr;
    ngx_http_foo_filter_ctx_t  *ctx;

    ctx = ngx_http_get_module_ctx(r, ngx_http_foo_filter_module);
    if (ctx == NULL) {
        return ngx_http_next_body_filter(r, in);
    }

    last = 0;

    for (cl = in; cl; cl = cl->next) {
        if (cl->buf->last_buf) {
            cl->buf->last_buf = 0;
            cl->buf->last_in_chain = 1;
            cl->buf->sync = 1;
            last = 1;
        }
    }

    /* Output explicit output buffers */

    rc = ngx_http_next_body_filter(r, in);

    if (rc == NGX_ERROR || !last) {
        return rc;
    }

    /*
     * Create the subrequest.  The output of the subrequest
     * will automatically be sent after all preceding buffers,
     * but before the last_buf buffer passed later in this function.
     */

    if (ngx_http_subrequest(r, ctx->uri, NULL, &sr, NULL, 0) != NGX_OK) {
        return NGX_ERROR;
    }

    ngx_http_set_ctx(r, NULL, ngx_http_foo_filter_module);

    /* Output the final buffer with the last_buf flag */

    b = ngx_calloc_buf(r->pool);
    if (b == NULL) {
        return NGX_ERROR;
    }

    b->last_buf = 1;

    out.buf = b;
    out.next = NULL;

    return ngx_http_output_filter(r, &out);
}
```

Une sous-requête peut aussi être créée à d'autres fins que la production de données. Par exemple, le module [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]] crée une sous-requête à la phase `NGX_HTTP_ACCESS_PHASE`. Pour désactiver la sortie à ce stade, l'indicateur `header_only` est positionné sur la sous-requête, ce qui empêche l'envoi de son corps au client. Notez que l'en-tête d'une sous-requête n'est jamais envoyé au client. Le résultat de la sous-requête peut être analysé dans le gestionnaire de rappel.

### Finalisation des requêtes

Une requête HTTP est finalisée en appelant la fonction `ngx_http_finalize_request(r, rc)`. Elle l'est généralement par le gestionnaire de contenu, une fois tous les tampons de sortie envoyés dans la chaîne de filtres. À ce stade, toute la sortie n'a pas forcément été envoyée au client : une partie peut rester en tampon quelque part dans la chaîne. Dans ce cas, `ngx_http_finalize_request(r, rc)` installe automatiquement un gestionnaire spécial `ngx_http_writer(r)` pour finir l'envoi. Une requête est aussi finalisée en cas d'erreur ou s'il faut renvoyer au client un code de réponse HTTP standard.

La fonction `ngx_http_finalize_request(r, rc)` attend les valeurs `rc` suivantes :

- `NGX_DONE` - Finalisation rapide. Décrémente le `count` de la requête et la détruit s'il atteint zéro. La connexion client peut servir à d'autres requêtes après la destruction de la requête courante.
- `NGX_ERROR`, `NGX_HTTP_REQUEST_TIME_OUT` (`408`), `NGX_HTTP_CLIENT_CLOSED_REQUEST` (`499`) - Finalisation sur erreur. Termine la requête au plus vite et ferme la connexion client.
- `NGX_HTTP_CREATED` (`201`), `NGX_HTTP_NO_CONTENT` (`204`), codes supérieurs ou égaux à `NGX_HTTP_SPECIAL_RESPONSE` (`300`) - Finalisation avec réponse spéciale. nginx envoie alors au client une page de réponse par défaut pour le code, ou effectue une redirection interne vers une location [[12-directives/error-page|error_page]] si elle est configurée pour ce code.
- Les autres codes sont considérés comme des codes de finalisation réussie et peuvent activer l'écrivain de la requête pour finir d'envoyer le corps de la réponse. Une fois le corps entièrement envoyé, le `count` de la requête est décrémenté. S'il atteint zéro, la requête est détruite, mais la connexion client peut encore servir à d'autres requêtes. Si `count` est positif, des activités inachevées subsistent dans la requête et seront finalisées plus tard.

### Corps de la requête

Pour traiter le corps d'une requête client, nginx fournit les fonctions `ngx_http_read_client_request_body(r, post_handler)` et `ngx_http_discard_request_body(r)`. La première lit le corps et le rend disponible via le champ `request_body` de la requête. La seconde demande à nginx de rejeter (lire et ignorer) le corps. L'une de ces fonctions doit être appelée pour chaque requête, normalement par le gestionnaire de contenu.

Il est interdit de lire ou de rejeter le corps de la requête client depuis une sous-requête : cela doit toujours se faire dans la requête principale. Une sous-requête hérite de l'objet `request_body` de son parent, qu'elle peut utiliser si la requête principale a déjà lu le corps.

La fonction `ngx_http_read_client_request_body(r, post_handler)` lance la lecture du corps de la requête. Quand le corps est entièrement lu, la fonction de rappel `post_handler` est appelée pour poursuivre le traitement. Si le corps est absent ou déjà lu, elle est appelée immédiatement. En mode sans tampon, elle peut être appelée avant la lecture complète du corps. La fonction alloue le champ `request_body` de type `ngx_http_request_body_t`, dont le champ `bufs` conserve le résultat sous forme de chaîne de tampons. Le corps peut être stocké dans des tampons mémoire ou fichier, si la capacité fixée par la directive [[12-directives/client-body-buffer-size|client_body_buffer_size]] ne suffit pas pour le garder entièrement en mémoire.

L'exemple suivant lit le corps d'une requête client et renvoie sa taille.

```c
ngx_int_t
ngx_http_foo_content_handler(ngx_http_request_t *r)
{
    ngx_int_t  rc;

    rc = ngx_http_read_client_request_body(r, ngx_http_foo_init);

    if (rc >= NGX_HTTP_SPECIAL_RESPONSE) {
        /* error */
        return rc;
    }

    return NGX_DONE;
}


void
ngx_http_foo_init(ngx_http_request_t *r)
{
    off_t         len;
    ngx_buf_t    *b;
    ngx_int_t     rc;
    ngx_chain_t  *in, out;

    if (r->request_body == NULL) {
        ngx_http_finalize_request(r, NGX_HTTP_INTERNAL_SERVER_ERROR);
        return;
    }

    len = 0;

    for (in = r->request_body->bufs; in; in = in->next) {
        len += ngx_buf_size(in->buf);
    }

    b = ngx_create_temp_buf(r->pool, NGX_OFF_T_LEN);
    if (b == NULL) {
        ngx_http_finalize_request(r, NGX_HTTP_INTERNAL_SERVER_ERROR);
        return;
    }

    b->last = ngx_sprintf(b->pos, "%O", len);
    b->last_buf = (r == r->main) ? 1 : 0;
    b->last_in_chain = 1;

    r->headers_out.status = NGX_HTTP_OK;
    r->headers_out.content_length_n = b->last - b->pos;

    rc = ngx_http_send_header(r);

    if (rc == NGX_ERROR || rc > NGX_OK || r->header_only) {
        ngx_http_finalize_request(r, rc);
        return;
    }

    out.buf = b;
    out.next = NULL;

    rc = ngx_http_output_filter(r, &out);

    ngx_http_finalize_request(r, rc);
}
```

Les champs suivants de la requête déterminent comment le corps est lu :

- `request_body_in_single_buf` - Lire le corps dans un seul tampon mémoire.
- `request_body_in_file_only` - Toujours lire le corps dans un fichier, même s'il tient dans le tampon mémoire.
- `request_body_in_persistent_file` - Ne pas supprimer le fichier juste après sa création. Un fichier avec cet indicateur peut être déplacé dans un autre répertoire.
- `request_body_in_clean_file` - Supprimer le fichier à la finalisation de la requête. Utile quand un fichier devait être déplacé dans un autre répertoire mais ne l'a pas été pour une raison quelconque.
- `request_body_file_group_access` - Autoriser l'accès au fichier pour le groupe en remplaçant le masque d'accès par défaut 0600 par 0660.
- `request_body_file_log_level` - Niveau de gravité auquel journaliser les erreurs de fichier.
- `request_body_no_buffering` - Lire le corps de la requête sans mise en tampon.

L'indicateur `request_body_no_buffering` active le mode de lecture sans tampon. Dans ce mode, après l'appel à `ngx_http_read_client_request_body()`, la chaîne `bufs` peut ne contenir qu'une partie du corps. L'indicateur `reading_body` signale que la lecture est encore en cours. Pour lire la partie suivante, appelez la fonction `ngx_http_read_unbuffered_request_body(r)`. La valeur de retour `NGX_AGAIN` indique qu'il faut plus de données ou d'espace tampon. Si `bufs` vaut NULL après cet appel, aucune donnée de corps n'est disponible pour l'instant. La fonction de rappel `read_event_handler` de la requête sera appelée quand d'autres données arriveront.

### Filtres du corps de la requête

Une fois une partie du corps lue, elle est passée à la chaîne des filtres du corps de la requête en appelant le premier gestionnaire, stocké dans la variable `ngx_http_top_request_body_filter`. Chaque gestionnaire est censé appeler le suivant jusqu'au gestionnaire final `ngx_http_request_body_save_filter(r, cl)`, qui collecte les tampons dans `r->request_body->bufs` et les écrit dans un fichier si nécessaire. Le dernier tampon du corps a l'indicateur `last_buf` non nul.

Si un filtre prévoit de retarder des tampons de données, il doit positionner l'indicateur `r->request_body->filter_need_buffering` à `1` lors de son premier appel.

Voici un exemple de filtre simple qui retarde le corps de la requête d'une seconde.

```c
#include <ngx_config.h>
#include <ngx_core.h>
#include <ngx_http.h>


#define NGX_HTTP_DELAY_BODY  1000


typedef struct {
    ngx_event_t   event;
    ngx_chain_t  *out;
} ngx_http_delay_body_ctx_t;


static ngx_int_t ngx_http_delay_body_filter(ngx_http_request_t *r,
    ngx_chain_t *in);
static void ngx_http_delay_body_cleanup(void *data);
static void ngx_http_delay_body_event_handler(ngx_event_t *ev);
static ngx_int_t ngx_http_delay_body_init(ngx_conf_t *cf);


static ngx_http_module_t  ngx_http_delay_body_module_ctx = {
    NULL,                          /* preconfiguration */
    ngx_http_delay_body_init,      /* postconfiguration */

    NULL,                          /* create main configuration */
    NULL,                          /* init main configuration */

    NULL,                          /* create server configuration */
    NULL,                          /* merge server configuration */

    NULL,                          /* create location configuration */
    NULL                           /* merge location configuration */
};


ngx_module_t  ngx_http_delay_body_filter_module = {
    NGX_MODULE_V1,
    &ngx_http_delay_body_module_ctx, /* module context */
    NULL,                          /* module directives */
    NGX_HTTP_MODULE,               /* module type */
    NULL,                          /* init master */
    NULL,                          /* init module */
    NULL,                          /* init process */
    NULL,                          /* init thread */
    NULL,                          /* exit thread */
    NULL,                          /* exit process */
    NULL,                          /* exit master */
    NGX_MODULE_V1_PADDING
};


static ngx_http_request_body_filter_pt   ngx_http_next_request_body_filter;


static ngx_int_t
ngx_http_delay_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
    ngx_int_t                   rc;
    ngx_chain_t                *cl, *ln;
    ngx_http_cleanup_t         *cln;
    ngx_http_delay_body_ctx_t  *ctx;

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                   "delay request body filter");

    ctx = ngx_http_get_module_ctx(r, ngx_http_delay_body_filter_module);

    if (ctx == NULL) {
        ctx = ngx_pcalloc(r->pool, sizeof(ngx_http_delay_body_ctx_t));
        if (ctx == NULL) {
            return NGX_HTTP_INTERNAL_SERVER_ERROR;
        }

        ngx_http_set_ctx(r, ctx, ngx_http_delay_body_filter_module);

        r->request_body->filter_need_buffering = 1;
    }

    if (ngx_chain_add_copy(r->pool, &ctx->out, in) != NGX_OK) {
        return NGX_HTTP_INTERNAL_SERVER_ERROR;
    }

    if (!ctx->event.timedout) {
        if (!ctx->event.timer_set) {

            /* cleanup to remove the timer in case of abnormal termination */

            cln = ngx_http_cleanup_add(r, 0);
            if (cln == NULL) {
                return NGX_HTTP_INTERNAL_SERVER_ERROR;
            }

            cln->handler = ngx_http_delay_body_cleanup;
            cln->data = ctx;

            /* add timer */

            ctx->event.handler = ngx_http_delay_body_event_handler;
            ctx->event.data = r;
            ctx->event.log = r->connection->log;

            ngx_add_timer(&ctx->event, NGX_HTTP_DELAY_BODY);
        }

        return ngx_http_next_request_body_filter(r, NULL);
    }

    rc = ngx_http_next_request_body_filter(r, ctx->out);

    for (cl = ctx->out; cl; /* void */) {
        ln = cl;
        cl = cl->next;
        ngx_free_chain(r->pool, ln);
    }

    ctx->out = NULL;

    return rc;
}


static void
ngx_http_delay_body_cleanup(void *data)
{
    ngx_http_delay_body_ctx_t *ctx = data;

    if (ctx->event.timer_set) {
        ngx_del_timer(&ctx->event);
    }
}


static void
ngx_http_delay_body_event_handler(ngx_event_t *ev)
{
    ngx_connection_t    *c;
    ngx_http_request_t  *r;

    r = ev->data;
    c = r->connection;

    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, c->log, 0,
                   "delay request body event");

    ngx_post_event(c->read, &ngx_posted_events);
}


static ngx_int_t
ngx_http_delay_body_init(ngx_conf_t *cf)
{
    ngx_http_next_request_body_filter = ngx_http_top_request_body_filter;
    ngx_http_top_request_body_filter = ngx_http_delay_body_filter;

    return NGX_OK;
}
```

### Réponse

Dans nginx, une réponse HTTP est produite en envoyant l'en-tête de réponse suivi d'un éventuel corps. L'en-tête et le corps passent par une chaîne de filtres avant d'être écrits sur la socket client. Un module peut installer son gestionnaire dans la chaîne des filtres d'en-tête ou de corps et traiter la sortie du gestionnaire précédent.

#### En-tête de réponse

La fonction `ngx_http_send_header(r)` envoie l'en-tête de sortie. Ne l'appelez pas avant que `r->headers_out` contienne toutes les données nécessaires à l'en-tête de réponse HTTP. Le champ `status` de `r->headers_out` doit toujours être défini. Si l'état de la réponse indique qu'un corps suit l'en-tête, `content_length_n` peut aussi être défini. Sa valeur par défaut est `-1`, ce qui signifie que la taille du corps est inconnue ; l'encodage de transfert par blocs (chunked) est alors utilisé. Pour envoyer un en-tête arbitraire, ajoutez-le à la liste `headers`.

```c
static ngx_int_t
ngx_http_foo_content_handler(ngx_http_request_t *r)
{
    ngx_int_t         rc;
    ngx_table_elt_t  *h;

    /* send header */

    r->headers_out.status = NGX_HTTP_OK;
    r->headers_out.content_length_n = 3;

    /* X-Foo: foo */

    h = ngx_list_push(&r->headers_out.headers);
    if (h == NULL) {
        return NGX_ERROR;
    }

    h->hash = 1;
    ngx_str_set(&h->key, "X-Foo");
    ngx_str_set(&h->value, "foo");

    rc = ngx_http_send_header(r);

    if (rc == NGX_ERROR || rc > NGX_OK || r->header_only) {
        return rc;
    }

    /* send body */

    ...
}
```

#### Filtres d'en-tête

La fonction `ngx_http_send_header(r)` déclenche la chaîne des filtres d'en-tête en appelant le premier gestionnaire, stocké dans la variable `ngx_http_top_header_filter`. Chaque gestionnaire est censé appeler le suivant jusqu'au gestionnaire final `ngx_http_header_filter(r)`, qui construit la réponse HTTP à partir de `r->headers_out` et la passe à `ngx_http_writer_filter` pour l'envoi.

Pour ajouter un gestionnaire à la chaîne des filtres d'en-tête, stockez son adresse dans la variable globale `ngx_http_top_header_filter` pendant la configuration. L'adresse du gestionnaire précédent est normalement conservée dans une variable statique du module et appelée par le nouveau gestionnaire avant de rendre la main.

L'exemple de module de filtre d'en-tête suivant ajoute l'en-tête HTTP « `X-Foo: foo` » à chaque réponse d'état `200`.

```c
#include <ngx_config.h>
#include <ngx_core.h>
#include <ngx_http.h>


static ngx_int_t ngx_http_foo_header_filter(ngx_http_request_t *r);
static ngx_int_t ngx_http_foo_header_filter_init(ngx_conf_t *cf);


static ngx_http_module_t  ngx_http_foo_header_filter_module_ctx = {
    NULL,                                   /* preconfiguration */
    ngx_http_foo_header_filter_init,        /* postconfiguration */

    NULL,                                   /* create main configuration */
    NULL,                                   /* init main configuration */

    NULL,                                   /* create server configuration */
    NULL,                                   /* merge server configuration */

    NULL,                                   /* create location configuration */
    NULL                                    /* merge location configuration */
};


ngx_module_t  ngx_http_foo_header_filter_module = {
    NGX_MODULE_V1,
    &ngx_http_foo_header_filter_module_ctx, /* module context */
    NULL,                                   /* module directives */
    NGX_HTTP_MODULE,                        /* module type */
    NULL,                                   /* init master */
    NULL,                                   /* init module */
    NULL,                                   /* init process */
    NULL,                                   /* init thread */
    NULL,                                   /* exit thread */
    NULL,                                   /* exit process */
    NULL,                                   /* exit master */
    NGX_MODULE_V1_PADDING
};


static ngx_http_output_header_filter_pt  ngx_http_next_header_filter;


static ngx_int_t
ngx_http_foo_header_filter(ngx_http_request_t *r)
{
    ngx_table_elt_t  *h;

    /*
     * The filter handler adds "X-Foo: foo" header
     * to every HTTP 200 response
     */

    if (r->headers_out.status != NGX_HTTP_OK) {
        return ngx_http_next_header_filter(r);
    }

    h = ngx_list_push(&r->headers_out.headers);
    if (h == NULL) {
        return NGX_ERROR;
    }

    h->hash = 1;
    ngx_str_set(&h->key, "X-Foo");
    ngx_str_set(&h->value, "foo");

    return ngx_http_next_header_filter(r);
}


static ngx_int_t
ngx_http_foo_header_filter_init(ngx_conf_t *cf)
{
    ngx_http_next_header_filter = ngx_http_top_header_filter;
    ngx_http_top_header_filter = ngx_http_foo_header_filter;

    return NGX_OK;
}
```

### Corps de la réponse

Pour envoyer le corps de la réponse, appelez la fonction `ngx_http_output_filter(r, cl)`. Elle peut être appelée plusieurs fois ; chaque appel envoie une partie du corps sous forme de chaîne de tampons. Positionnez l'indicateur `last_buf` sur le dernier tampon du corps.

L'exemple suivant produit une réponse HTTP complète avec « foo » comme corps. Pour que l'exemple fonctionne aussi bien en sous-requête qu'en requête principale, l'indicateur `last_in_chain` est positionné sur le dernier tampon de la sortie. L'indicateur `last_buf` n'est positionné que pour la requête principale, car le dernier tampon d'une sous-requête ne termine pas toute la sortie.

```c
static ngx_int_t
ngx_http_bar_content_handler(ngx_http_request_t *r)
{
    ngx_int_t     rc;
    ngx_buf_t    *b;
    ngx_chain_t   out;

    /* send header */

    r->headers_out.status = NGX_HTTP_OK;
    r->headers_out.content_length_n = 3;

    rc = ngx_http_send_header(r);

    if (rc == NGX_ERROR || rc > NGX_OK || r->header_only) {
        return rc;
    }

    /* send body */

    b = ngx_calloc_buf(r->pool);
    if (b == NULL) {
        return NGX_ERROR;
    }

    b->last_buf = (r == r->main) ? 1 : 0;
    b->last_in_chain = 1;

    b->memory = 1;

    b->pos = (u_char *) "foo";
    b->last = b->pos + 3;

    out.buf = b;
    out.next = NULL;

    return ngx_http_output_filter(r, &out);
}
```

### Filtres du corps de la réponse

La fonction `ngx_http_output_filter(r, cl)` déclenche la chaîne des filtres de corps en appelant le premier gestionnaire, stocké dans la variable `ngx_http_top_body_filter`. Chaque gestionnaire est censé appeler le suivant jusqu'au gestionnaire final `ngx_http_write_filter(r, cl)`.

Un gestionnaire de filtre de corps reçoit une chaîne de tampons. Il doit les traiter et passer au gestionnaire suivant une chaîne, éventuellement nouvelle. Notez que les maillons `ngx_chain_t` de la chaîne entrante appartiennent à l'appelant et ne doivent être ni réutilisés ni modifiés. Juste après le retour du gestionnaire, l'appelant peut utiliser ses maillons de sortie pour suivre les tampons envoyés. Pour conserver la chaîne de tampons ou substituer certains tampons avant de passer au filtre suivant, un gestionnaire doit allouer ses propres maillons.

Voici un exemple de filtre de corps simple qui compte le nombre d'octets du corps. Le résultat est disponible dans la variable `$counter`, utilisable dans le journal d'accès.

```c
#include <ngx_config.h>
#include <ngx_core.h>
#include <ngx_http.h>


typedef struct {
    off_t  count;
} ngx_http_counter_filter_ctx_t;


static ngx_int_t ngx_http_counter_body_filter(ngx_http_request_t *r,
    ngx_chain_t *in);
static ngx_int_t ngx_http_counter_variable(ngx_http_request_t *r,
    ngx_http_variable_value_t *v, uintptr_t data);
static ngx_int_t ngx_http_counter_add_variables(ngx_conf_t *cf);
static ngx_int_t ngx_http_counter_filter_init(ngx_conf_t *cf);


static ngx_http_module_t  ngx_http_counter_filter_module_ctx = {
    ngx_http_counter_add_variables,        /* preconfiguration */
    ngx_http_counter_filter_init,          /* postconfiguration */

    NULL,                                  /* create main configuration */
    NULL,                                  /* init main configuration */

    NULL,                                  /* create server configuration */
    NULL,                                  /* merge server configuration */

    NULL,                                  /* create location configuration */
    NULL                                   /* merge location configuration */
};


ngx_module_t  ngx_http_counter_filter_module = {
    NGX_MODULE_V1,
    &ngx_http_counter_filter_module_ctx,   /* module context */
    NULL,                                  /* module directives */
    NGX_HTTP_MODULE,                       /* module type */
    NULL,                                  /* init master */
    NULL,                                  /* init module */
    NULL,                                  /* init process */
    NULL,                                  /* init thread */
    NULL,                                  /* exit thread */
    NULL,                                  /* exit process */
    NULL,                                  /* exit master */
    NGX_MODULE_V1_PADDING
};


static ngx_http_output_body_filter_pt  ngx_http_next_body_filter;

static ngx_str_t  ngx_http_counter_name = ngx_string("counter");


static ngx_int_t
ngx_http_counter_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
    ngx_chain_t                    *cl;
    ngx_http_counter_filter_ctx_t  *ctx;

    ctx = ngx_http_get_module_ctx(r, ngx_http_counter_filter_module);
    if (ctx == NULL) {
        ctx = ngx_pcalloc(r->pool, sizeof(ngx_http_counter_filter_ctx_t));
        if (ctx == NULL) {
            return NGX_ERROR;
        }

        ngx_http_set_ctx(r, ctx, ngx_http_counter_filter_module);
    }

    for (cl = in; cl; cl = cl->next) {
        ctx->count += ngx_buf_size(cl->buf);
    }

    return ngx_http_next_body_filter(r, in);
}


static ngx_int_t
ngx_http_counter_variable(ngx_http_request_t *r, ngx_http_variable_value_t *v,
    uintptr_t data)
{
    u_char                         *p;
    ngx_http_counter_filter_ctx_t  *ctx;

    ctx = ngx_http_get_module_ctx(r, ngx_http_counter_filter_module);
    if (ctx == NULL) {
        v->not_found = 1;
        return NGX_OK;
    }

    p = ngx_pnalloc(r->pool, NGX_OFF_T_LEN);
    if (p == NULL) {
        return NGX_ERROR;
    }

    v->data = p;
    v->len = ngx_sprintf(p, "%O", ctx->count) - p;
    v->valid = 1;
    v->no_cacheable = 0;
    v->not_found = 0;

    return NGX_OK;
}


static ngx_int_t
ngx_http_counter_add_variables(ngx_conf_t *cf)
{
    ngx_http_variable_t  *var;

    var = ngx_http_add_variable(cf, &ngx_http_counter_name, 0);
    if (var == NULL) {
        return NGX_ERROR;
    }

    var->get_handler = ngx_http_counter_variable;

    return NGX_OK;
}


static ngx_int_t
ngx_http_counter_filter_init(ngx_conf_t *cf)
{
    ngx_http_next_body_filter = ngx_http_top_body_filter;
    ngx_http_top_body_filter = ngx_http_counter_body_filter;

    return NGX_OK;
}
```

### Écrire des modules de filtre

Quand vous écrivez un filtre de corps ou d'en-tête, faites particulièrement attention à sa position dans l'ordre des filtres. Les modules standard de nginx enregistrent plusieurs filtres d'en-tête et de corps, et il est important d'enregistrer un nouveau module de filtre au bon endroit par rapport à eux. Normalement, les modules enregistrent leurs filtres dans leurs gestionnaires de postconfiguration. L'ordre d'appel des filtres pendant le traitement est évidemment l'inverse de leur ordre d'enregistrement.

Pour les modules de filtre tiers, nginx fournit un emplacement spécial `HTTP_AUX_FILTER_MODULES`. Pour y enregistrer un module de filtre, fixez la variable `ngx_module_type` à `HTTP_AUX_FILTER` dans la configuration du module.

L'exemple suivant montre le fichier config d'un module de filtre composé d'un seul fichier source, `ngx_http_foo_filter_module.c`.

```c
ngx_module_type=HTTP_AUX_FILTER
ngx_module_name=ngx_http_foo_filter_module
ngx_module_srcs="$ngx_addon_dir/ngx_http_foo_filter_module.c"

. auto/module
```

### Réutilisation des tampons

Quand on émet ou modifie un flux de tampons, il est souvent souhaitable de réutiliser les tampons alloués. Une approche standard et largement adoptée dans le code de nginx consiste à garder deux chaînes de tampons : `free` et `busy`. La chaîne `free` contient tous les tampons libres réutilisables. La chaîne `busy` contient tous les tampons envoyés par le module courant qui sont encore utilisés par un autre gestionnaire de filtre. Un tampon est utilisé si sa taille est supérieure à zéro. Normalement, quand un filtre consomme un tampon, son `pos` (ou `file_pos` pour un tampon fichier) avance vers `last` (`file_last` pour un tampon fichier). Une fois entièrement consommé, le tampon peut être réutilisé. Pour ajouter les tampons nouvellement libérés à la chaîne `free`, il suffit de parcourir la chaîne `busy` et de déplacer vers `free` les tampons de taille nulle en tête. Cette opération est si courante qu'il existe une fonction dédiée, `ngx_chain_update_chains(free, busy, out, tag)`. Elle ajoute la chaîne de sortie `out` à `busy` et déplace les tampons libres du début de `busy` vers `free`. Seuls les tampons portant le `tag` indiqué sont réutilisés, ce qui permet à un module de ne réutiliser que les tampons qu'il a lui-même alloués.

L'exemple suivant est un filtre de corps qui insère la chaîne « foo » avant chaque tampon entrant. Les nouveaux tampons alloués par le module sont réutilisés si possible. Notez que pour que l'exemple fonctionne correctement, il faut aussi installer un filtre d'en-tête et remettre `content_length_n` à `-1`, mais ce code n'est pas fourni ici.

```c
typedef struct {
    ngx_chain_t  *free;
    ngx_chain_t  *busy;
}  ngx_http_foo_filter_ctx_t;


ngx_int_t
ngx_http_foo_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
{
    ngx_int_t                   rc;
    ngx_buf_t                  *b;
    ngx_chain_t                *cl, *tl, *out, **ll;
    ngx_http_foo_filter_ctx_t  *ctx;

    ctx = ngx_http_get_module_ctx(r, ngx_http_foo_filter_module);
    if (ctx == NULL) {
        ctx = ngx_pcalloc(r->pool, sizeof(ngx_http_foo_filter_ctx_t));
        if (ctx == NULL) {
            return NGX_ERROR;
        }

        ngx_http_set_ctx(r, ctx, ngx_http_foo_filter_module);
    }

    /* create a new chain "out" from "in" with all the changes */

    ll = &out;

    for (cl = in; cl; cl = cl->next) {

        /* append "foo" in a reused buffer if possible */

        tl = ngx_chain_get_free_buf(r->pool, &ctx->free);
        if (tl == NULL) {
            return NGX_ERROR;
        }

        b = tl->buf;
        b->tag = (ngx_buf_tag_t) &ngx_http_foo_filter_module;
        b->memory = 1;
        b->pos = (u_char *) "foo";
        b->last = b->pos + 3;

        *ll = tl;
        ll = &tl->next;

        /* append the next incoming buffer */

        tl = ngx_alloc_chain_link(r->pool);
        if (tl == NULL) {
            return NGX_ERROR;
        }

        tl->buf = cl->buf;
        *ll = tl;
        ll = &tl->next;
    }

    *ll = NULL;

    /* send the new chain */

    rc = ngx_http_next_body_filter(r, out);

    /* update "busy" and "free" chains for reuse */

    ngx_chain_update_chains(r->pool, &ctx->free, &ctx->busy, &out,
                            (ngx_buf_tag_t) &ngx_http_foo_filter_module);

    return rc;
}
```

### Répartition de charge

Le module [[11-modules/02-http/ngx_http_upstream_module|ngx_http_upstream_module]] fournit les fonctions de base nécessaires pour transmettre des requêtes à des serveurs distants. Les modules qui mettent en œuvre des protocoles précis, comme HTTP ou FastCGI, les utilisent. Le module fournit aussi une interface pour créer des modules de répartition de charge personnalisés et met en œuvre une méthode round-robin par défaut.

Les modules [[12-directives/least-conn-http-upstream|least_conn]] et [[12-directives/hash-http-upstream|hash]] mettent en œuvre d'autres méthodes de répartition, mais sont en fait des extensions du module round-robin amont et partagent beaucoup de code avec lui, comme la représentation d'un groupe de serveurs. Le module [[12-directives/keepalive|keepalive]] est un module indépendant qui étend les fonctions amont.

Le module [[11-modules/02-http/ngx_http_upstream_module|ngx_http_upstream_module]] peut être configuré explicitement en plaçant le bloc [[12-directives/upstream-http-upstream|upstream]] correspondant dans le fichier de configuration, ou implicitement avec des directives comme [[12-directives/proxy-pass-http-proxy|proxy_pass]] qui acceptent une URL évaluée à un moment donné en une liste de serveurs. Les autres méthodes de répartition ne sont disponibles qu'avec une configuration amont explicite. La configuration du module amont a son propre contexte de directives, `NGX_HTTP_UPS_CONF`. La structure est définie ainsi :

```c
struct ngx_http_upstream_srv_conf_s {
    ngx_http_upstream_peer_t         peer;
    void                           **srv_conf;

    ngx_array_t                     *servers;  /* ngx_http_upstream_server_t */

    ngx_uint_t                       flags;
    ngx_str_t                        host;
    u_char                          *file_name;
    ngx_uint_t                       line;
    in_port_t                        port;
    ngx_uint_t                       no_port;  /* unsigned no_port:1 */

#if (NGX_HTTP_UPSTREAM_ZONE)
    ngx_shm_zone_t                  *shm_zone;
#endif
};
```

- `srv_conf` — Contexte de configuration des modules amont.
- `servers` — Tableau de `ngx_http_upstream_server_t`, résultat de l'analyse d'un ensemble de directives [[12-directives/server-http-upstream|server]] du bloc `upstream`.
- `flags` — Indicateurs qui marquent surtout les fonctions prises en charge par la méthode de répartition. Ces fonctions se configurent comme paramètres de la directive [[12-directives/server-http-upstream|server]] :

  - `NGX_HTTP_UPSTREAM_CREATE` — Distingue les groupes amont définis explicitement de ceux créés automatiquement par la directive [[12-directives/proxy-pass-http-proxy|proxy_pass]] et ses « semblables » (FastCGI, SCGI, etc.)
  - `NGX_HTTP_UPSTREAM_WEIGHT` — Le paramètre « `weight` » est pris en charge
  - `NGX_HTTP_UPSTREAM_MAX_FAILS` — Le paramètre « `max_fails` » est pris en charge
  - `NGX_HTTP_UPSTREAM_FAIL_TIMEOUT` — Le paramètre « `fail_timeout` » est pris en charge
  - `NGX_HTTP_UPSTREAM_DOWN` — Le paramètre « `down` » est pris en charge
  - `NGX_HTTP_UPSTREAM_BACKUP` — Le paramètre « `backup` » est pris en charge
  - `NGX_HTTP_UPSTREAM_MAX_CONNS` — Le paramètre « `max_conns` » est pris en charge
- `host` — Nom du groupe amont.
- `file_name, line` — Nom du fichier de configuration et ligne où se trouve le bloc `upstream`.
- `port` et `no_port` — Inutilisés pour les groupes amont définis explicitement.
- `shm_zone` — Zone de mémoire partagée utilisée par ce groupe amont, le cas échéant.
- `peer` — Objet contenant les méthodes génériques d'initialisation de la configuration amont :

  ```c
  typedef struct {
      ngx_http_upstream_init_pt        init_upstream;
      ngx_http_upstream_init_peer_pt   init;
      void                            *data;
  } ngx_http_upstream_peer_t;
  ```

  Un module qui met en œuvre un algorithme de répartition de charge doit définir ces méthodes et initialiser les `data` privées. Si `init_upstream` n'a pas été initialisée lors de l'analyse de la configuration, `ngx_http_upstream_module` la fixe à l'algorithme par défaut `ngx_http_upstream_init_round_robin`.

  - `init_upstream(cf, us)` — Méthode appelée pendant la configuration, chargée d'initialiser un groupe de serveurs et, en cas de succès, la méthode `init()`. Un module de répartition typique utilise la liste des serveurs du bloc `upstream` pour créer une structure de données efficace qu'il utilise, et enregistre sa propre configuration dans le champ `data`.
  - `init(r, us)` — Initialise une structure `ngx_http_upstream_peer_t.peer` par requête, utilisée pour la répartition de charge (à ne pas confondre avec `ngx_http_upstream_srv_conf_t.peer` décrite plus haut, qui est par groupe amont). Elle est passée comme argument `data` à toutes les fonctions de rappel qui gèrent le choix du serveur.

Quand nginx doit transmettre une requête à un autre hôte, il utilise la méthode de répartition configurée pour obtenir l'adresse à laquelle se connecter. La méthode est obtenue depuis l'objet `ngx_http_upstream_t.peer` de type `ngx_peer_connection_t` :

```c
struct ngx_peer_connection_s {
    ...

    struct sockaddr                 *sockaddr;
    socklen_t                        socklen;
    ngx_str_t                       *name;

    ngx_uint_t                       tries;

    ngx_event_get_peer_pt            get;
    ngx_event_free_peer_pt           free;
    ngx_event_notify_peer_pt         notify;
    void                            *data;

#if (NGX_SSL || NGX_COMPAT)
    ngx_event_set_peer_session_pt    set_session;
    ngx_event_save_peer_session_pt   save_session;
#endif

    ...
};
```

La structure a les champs suivants :

- `sockaddr`, `socklen`, `name` — Adresse du serveur amont auquel se connecter ; c'est le paramètre de sortie d'une méthode de répartition.
- `data` — Données par requête d'une méthode de répartition ; conserve l'état de l'algorithme de sélection et comprend généralement le lien vers la configuration amont. Passé en argument à toutes les méthodes qui gèrent le choix du serveur (voir ci-dessous).
- `tries` — [[12-directives/proxy-next-upstream-tries-http-proxy|Nombre]] autorisé de tentatives de connexion à un serveur amont.
- `get`, `free`, `notify`, `set_session` et `save_session` - Méthodes du module de répartition, décrites ci-dessous.

Toutes les méthodes acceptent au moins deux arguments : un objet connexion pair `pc` et les `data` créées par `ngx_http_upstream_srv_conf_t.peer.init()`. Notez qu'elles peuvent différer de `pc.data` en raison du « chaînage » des modules de répartition.

- `get(pc, data)` — Méthode appelée quand le module amont est prêt à transmettre une requête à un serveur amont et a besoin de son adresse. Elle doit remplir les champs `sockaddr`, `socklen` et `name` de la structure `ngx_peer_connection_t`. Elle renvoie l'une des valeurs suivantes :

  - `NGX_OK` — Un serveur a été choisi.
  - `NGX_ERROR` — Une erreur interne s'est produite.
  - `NGX_BUSY` — Aucun serveur n'est disponible pour l'instant. Cela peut avoir de nombreuses causes : groupe de serveurs dynamique vide, tous les serveurs du groupe en échec, ou tous déjà au nombre maximal de connexions.
  - `NGX_DONE` — La connexion sous-jacente a été réutilisée, il n'est pas nécessaire d'en créer une nouvelle vers le serveur amont. Cette valeur est fixée par le module `keepalive`.
- `free(pc, data, state)` — Méthode appelée quand un module amont a fini de travailler avec un serveur donné. L'argument `state` est l'état d'achèvement de la connexion amont, un masque de bits pouvant valoir :

  - `NGX_PEER_FAILED` — La tentative a [[11-modules/02-http/ngx_http_upstream_module|échoué]]
  - `NGX_PEER_NEXT` — Cas particulier où le serveur amont renvoie les codes `403` ou `404`, qui ne sont pas considérés comme un [[11-modules/02-http/ngx_http_upstream_module|échec]].
  - `NGX_PEER_KEEPALIVE` — Actuellement inutilisé

  Cette méthode décrémente aussi le compteur `tries`.
- `notify(pc, data, type)` — Actuellement inutilisée dans la version libre.
- `set_session(pc, data)` et `save_session(pc, data)` — Méthodes propres à SSL qui permettent de mettre en cache les sessions vers les serveurs amont. L'implémentation est fournie par la méthode round-robin.

## Exemples

Le dépôt [nginx-dev-examples](https://github.com/nginx/nginx-dev-examples) fournit des exemples de modules nginx.

## Style de code

### Règles générales

- la largeur maximale du texte est de 80 caractères
- l'indentation est de 4 espaces
- pas de tabulations, pas d'espaces en fin de ligne
- les éléments d'une liste sur une même ligne sont séparés par des espaces
- les littéraux hexadécimaux sont en minuscules
- les noms de fichiers, de fonctions et de types ainsi que les variables globales ont le préfixe `ngx_` ou un préfixe plus précis comme `ngx_http_` et `ngx_mail_`

```c
size_t
ngx_utf8_length(u_char *p, size_t n)
{
    u_char  c, *last;
    size_t  len;

    last = p + n;

    for (len = 0; p < last; len++) {

        c = *p;

        if (c < 0x80) {
            p++;
            continue;
        }

        if (ngx_utf8_decode(&p, last - p) > 0x10ffff) {
            /* invalid UTF-8 */
            return n;
        }
    }

    return len;
}
```

### Fichiers

Un fichier source typique peut contenir les sections suivantes, séparées par deux lignes vides :

- mentions de copyright
- inclusions
- définitions du préprocesseur
- définitions de types
- prototypes de fonctions
- définitions de variables
- définitions de fonctions

Les mentions de copyright ressemblent à ceci :

```
/*
 * Copyright (C) Author Name
 * Copyright (C) Organization, Inc.
 */
```

Si le fichier est modifié de façon importante, la liste des auteurs doit être mise à jour, le nouvel auteur étant ajouté en tête.

Les fichiers `ngx_config.h` et `ngx_core.h` sont toujours inclus en premier, suivis de `ngx_http.h`, `ngx_stream.h` ou `ngx_mail.h`. Viennent ensuite les éventuels fichiers d'en-tête externes :

```c
#include <ngx_config.h>
#include <ngx_core.h>
#include <ngx_http.h>

#include <libxml/parser.h>
#include <libxml/tree.h>
#include <libxslt/xslt.h>

#if (NGX_HAVE_EXSLT)
#include <libexslt/exslt.h>
#endif
```

Les fichiers d'en-tête doivent inclure la « protection d'en-tête » :

```
#ifndef _NGX_PROCESS_CYCLE_H_INCLUDED_
#define _NGX_PROCESS_CYCLE_H_INCLUDED_
...
#endif /* _NGX_PROCESS_CYCLE_H_INCLUDED_ */
```

### Commentaires

- les commentaires « `//` » ne sont pas utilisés
- le texte est écrit en anglais, de préférence en orthographe américaine
- les commentaires sur plusieurs lignes sont formatés ainsi :

  ```
  /*
   * The red-black tree code is based on the algorithm described in
   * the "Introduction to Algorithms" by Cormen, Leiserson and Rivest.
   */
  ```

  ```
  /* find the server configuration for the address:port */
  ```

### Préprocesseur

Les noms de macros commencent par le préfixe `ngx_` ou `NGX_` (ou plus précis). Les noms des macros de constantes sont en majuscules. Les macros paramétrées et les macros d'initialisation sont en minuscules. Le nom et la valeur de la macro sont séparés par au moins deux espaces :

```c
#define NGX_CONF_BUFFER  4096

#define ngx_buf_in_memory(b)  (b->temporary || b->memory || b->mmap)

#define ngx_buf_size(b)                                                      \
    (ngx_buf_in_memory(b) ? (off_t) (b->last - b->pos):                      \
                            (b->file_last - b->file_pos))

#define ngx_null_string  { 0, NULL }
```

Les conditions sont entre parenthèses, la négation à l'extérieur :

```
#if (NGX_HAVE_KQUEUE)
...
#elif ((NGX_HAVE_DEVPOLL && !(NGX_TEST_BUILD_DEVPOLL)) \
       || (NGX_HAVE_EVENTPORT && !(NGX_TEST_BUILD_EVENTPORT)))
...
#elif (NGX_HAVE_EPOLL && !(NGX_TEST_BUILD_EPOLL))
...
#elif (NGX_HAVE_POLL)
...
#else /* select */
...
#endif /* NGX_HAVE_KQUEUE */
```

### Types

Les noms de types se terminent par le suffixe « `_t` ». Un nom de type défini est séparé par au moins deux espaces :

```c
typedef ngx_uint_t  ngx_rbtree_key_t;
```

Les types structure sont définis avec `typedef`. Dans les structures, les types et noms des membres sont alignés :

```c
typedef struct {
    size_t      len;
    u_char     *data;
} ngx_str_t;
```

Gardez le même alignement pour toutes les structures du fichier. Une structure qui pointe vers elle-même a un nom terminé par « `_s` ». Les définitions de structures adjacentes sont séparées par deux lignes vides :

```c
typedef struct ngx_list_part_s  ngx_list_part_t;

struct ngx_list_part_s {
    void             *elts;
    ngx_uint_t        nelts;
    ngx_list_part_t  *next;
};


typedef struct {
    ngx_list_part_t  *last;
    ngx_list_part_t   part;
    size_t            size;
    ngx_uint_t        nalloc;
    ngx_pool_t       *pool;
} ngx_list_t;
```

Chaque membre de structure est déclaré sur sa propre ligne :

```c
typedef struct {
    ngx_uint_t        hash;
    ngx_str_t         key;
    ngx_str_t         value;
    u_char           *lowcase_key;
} ngx_table_elt_t;
```

Les pointeurs de fonction dans les structures ont des types définis terminés par « `_pt` » :

```c
typedef ssize_t (*ngx_recv_pt)(ngx_connection_t *c, u_char *buf, size_t size);
typedef ssize_t (*ngx_recv_chain_pt)(ngx_connection_t *c, ngx_chain_t *in,
    off_t limit);
typedef ssize_t (*ngx_send_pt)(ngx_connection_t *c, u_char *buf, size_t size);
typedef ngx_chain_t *(*ngx_send_chain_pt)(ngx_connection_t *c, ngx_chain_t *in,
    off_t limit);

typedef struct {
    ngx_recv_pt        recv;
    ngx_recv_chain_pt  recv_chain;
    ngx_recv_pt        udp_recv;
    ngx_send_pt        send;
    ngx_send_pt        udp_send;
    ngx_send_chain_pt  udp_send_chain;
    ngx_send_chain_pt  send_chain;
    ngx_uint_t         flags;
} ngx_os_io_t;
```

Les énumérations ont des types terminés par « `_e` » :

```c
typedef enum {
    ngx_http_fastcgi_st_version = 0,
    ngx_http_fastcgi_st_type,
    ...
    ngx_http_fastcgi_st_padding
} ngx_http_fastcgi_state_e;
```

### Variables

Les variables sont déclarées triées par longueur du type de base, puis par ordre alphabétique. Les noms de types et de variables sont alignés. Les « colonnes » type et nom sont séparées par deux espaces. Les grands tableaux sont placés à la fin du bloc de déclarations :

```c
u_char                      |  | *rv, *p;
ngx_conf_t                  |  | *cf;
ngx_uint_t                  |  |  i, j, k;
unsigned int                |  |  len;
struct sockaddr             |  | *sa;
const unsigned char         |  | *data;
ngx_peer_connection_t       |  | *pc;
ngx_http_core_srv_conf_t    |  |**cscfp;
ngx_http_upstream_srv_conf_t|  | *us, *uscf;
u_char                      |  |  text[NGX_SOCKADDR_STRLEN];
```

Les variables statiques et globales peuvent être initialisées à la déclaration :

```c
static ngx_str_t  ngx_http_memcached_key = ngx_string("memcached_key");
```

```c
static ngx_uint_t  mday[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
```

```c
static uint32_t  ngx_crc32_table16[] = {
    0x00000000, 0x1db71064, 0x3b6e20c8, 0x26d930ac,
    ...
    0x9b64c2b0, 0x86d3d2d4, 0xa00ae278, 0xbdbdf21c
};
```

Voici quelques combinaisons type/nom couramment utilisées :

```c
u_char                        *rv;
ngx_int_t                      rc;
ngx_conf_t                    *cf;
ngx_connection_t              *c;
ngx_http_request_t            *r;
ngx_peer_connection_t         *pc;
ngx_http_upstream_srv_conf_t  *us, *uscf;
```

### Fonctions

Toutes les fonctions (même statiques) doivent avoir un prototype. Les prototypes incluent les noms des arguments. Les prototypes longs sont coupés avec une seule indentation sur les lignes de continuation :

```c
static char *ngx_http_block(ngx_conf_t *cf, ngx_command_t *cmd, void *conf);
static ngx_int_t ngx_http_init_phases(ngx_conf_t *cf,
    ngx_http_core_main_conf_t *cmcf);

static char *ngx_http_merge_servers(ngx_conf_t *cf,
    ngx_http_core_main_conf_t *cmcf, ngx_http_module_t *module,
    ngx_uint_t ctx_index);
```

Dans une définition, le nom de la fonction commence sur une nouvelle ligne. Les accolades ouvrante et fermante du corps sont sur des lignes séparées. Le corps est indenté. Deux lignes vides séparent les fonctions :

```c
static ngx_int_t
ngx_http_find_virtual_server(ngx_http_request_t *r, u_char *host, size_t len)
{
    ...
}


static ngx_int_t
ngx_http_add_addresses(ngx_conf_t *cf, ngx_http_core_srv_conf_t *cscf,
    ngx_http_conf_port_t *port, ngx_http_listen_opt_t *lsopt)
{
    ...
}
```

Il n'y a pas d'espace entre le nom de la fonction et la parenthèse ouvrante. Les appels longs sont coupés de sorte que les lignes de continuation commencent à la position du premier argument. Si c'est impossible, formatez la première ligne de continuation pour qu'elle se termine à la position 79 :

```c
ngx_log_debug2(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
               "http header: \"%V: %V\"",
               &h->key, &h->value);

hc->busy = ngx_palloc(r->connection->pool,
                  cscf->large_client_header_buffers.num * sizeof(ngx_buf_t *));
```

Utilisez la macro `ngx_inline` au lieu de `inline` :

```c
static ngx_inline void ngx_cpuid(uint32_t i, uint32_t *buf);
```

### Expressions

Les opérateurs binaires, sauf « `.` » et « `−>` », sont séparés de leurs opérandes par un espace. Les opérateurs unaires et les indices ne sont pas séparés de leurs opérandes :

```c
width = width * 10 + (*fmt++ - '0');
```

```c
ch = (u_char) ((decoded << 4) + (ch - '0'));
```

```c
r->exten.data = &r->uri.data[i + 1];
```

Les conversions de type sont séparées par un espace de l'expression convertie. Un astérisque dans une conversion est séparé du nom de type par un espace :

```c
len = ngx_sock_ntop((struct sockaddr *) sin6, p, len, 1);
```

Si une expression ne tient pas sur une ligne, elle est coupée, de préférence sur un opérateur binaire. La ligne de continuation est alignée sur le début de l'expression :

```c
if (status == NGX_HTTP_MOVED_PERMANENTLY
    || status == NGX_HTTP_MOVED_TEMPORARILY
    || status == NGX_HTTP_SEE_OTHER
    || status == NGX_HTTP_TEMPORARY_REDIRECT
    || status == NGX_HTTP_PERMANENT_REDIRECT)
{
    ...
}
```

```c
p->temp_file->warn = "an upstream response is buffered "
                     "to a temporary file";
```

En dernier recours, on peut couper une expression de sorte que la ligne de continuation se termine à la position 79 :

```c
hinit->hash = ngx_pcalloc(hinit->pool, sizeof(ngx_hash_wildcard_t)
                                     + size * sizeof(ngx_hash_elt_t *));
```

Ces règles s'appliquent aussi aux sous-expressions, chacune ayant son propre niveau d'indentation :

```c
if (((u->conf->cache_use_stale & NGX_HTTP_UPSTREAM_FT_UPDATING)
     || c->stale_updating) && !r->background
    && u->conf->cache_background_update)
{
    ...
}
```

Il est parfois pratique de couper une expression après une conversion de type. La ligne de continuation est alors indentée :

```c
node = (ngx_rbtree_node_t *)
           ((u_char *) lr - offsetof(ngx_rbtree_node_t, color));
```

Les pointeurs sont comparés explicitement à `NULL` (pas à `0`) :

```c
if (ptr != NULL) {
    ...
}
```

### Conditions et boucles

Le mot-clé « `if` » est séparé de la condition par un espace. L'accolade ouvrante est sur la même ligne, ou sur une ligne dédiée si la condition occupe plusieurs lignes. L'accolade fermante est sur une ligne dédiée, éventuellement suivie de « `else if` / `else` ». Une ligne vide précède généralement la partie « `else if` / `else` » :

```c
if (node->left == sentinel) {
    temp = node->right;
    subst = node;

} else if (node->right == sentinel) {
    temp = node->left;
    subst = node;

} else {
    subst = ngx_rbtree_min(node->right, sentinel);

    if (subst->left != sentinel) {
        temp = subst->left;

    } else {
        temp = subst->right;
    }
}
```

Des règles de formatage similaires s'appliquent aux boucles « `do` » et « `while` » :

```c
while (p < last && *p == ' ') {
    p++;
}
```

```c
do {
    ctx->node = rn;
    ctx = ctx->next;
} while (ctx);
```

Le mot-clé « `switch` » est séparé de la condition par un espace. L'accolade ouvrante est sur la même ligne, l'accolade fermante sur une ligne dédiée. Les mots-clés « `case` » sont alignés sur « `switch` » :

```c
switch (ch) {
case '!':
    looked = 2;
    state = ssi_comment0_state;
    break;

case '<':
    copy_end = p;
    break;

default:
    copy_end = p;
    looked = 0;
    state = ssi_start_state;
    break;
}
```

La plupart des boucles « `for` » sont formatées ainsi :

```c
for (i = 0; i < ccf->env.nelts; i++) {
    ...
}
```

```c
for (q = ngx_queue_head(locations);
     q != ngx_queue_sentinel(locations);
     q = ngx_queue_next(q))
{
    ...
}
```

Si une partie de l'instruction « `for` » est omise, on l'indique par le commentaire « `/* void */` » :

```c
for (i = 0; /* void */ ; i++) {
    ...
}
```

Une boucle au corps vide est aussi signalée par le commentaire « `/* void */` », qui peut être placé sur la même ligne :

```c
for (cl = *busy; cl->next; cl = cl->next) { /* void */ }
```

Une boucle infinie ressemble à ceci :

```c
for ( ;; ) {
    ...
}
```

### Étiquettes

Les étiquettes sont entourées de lignes vides et indentées au niveau précédent :

```c
    if (i == 0) {
        u->err = "host not found";
        goto failed;
    }

    u->addrs = ngx_pcalloc(pool, i * sizeof(ngx_addr_t));
    if (u->addrs == NULL) {
        goto failed;
    }

    u->naddrs = i;

    ...

    return NGX_OK;

failed:

    freeaddrinfo(res);
    return NGX_ERROR;
```

## Déboguer les problèmes de mémoire

Pour déboguer des problèmes de mémoire comme les dépassements de tampon ou les utilisations après libération, vous pouvez utiliser [AddressSanitizer](https://en.wikipedia.org/wiki/AddressSanitizer) (ASan), pris en charge par certains compilateurs modernes. Pour activer ASan avec `gcc` et `clang`, utilisez l'option de compilation et d'édition de liens `-fsanitize=address`. Lors de la compilation de nginx, ajoutez cette option aux paramètres `--with-cc-opt` et `--with-ld-opt` du script `configure`.

Comme la plupart des allocations de nginx se font dans son pool interne, activer ASan ne suffit pas toujours. Le pool interne alloue un gros bloc de mémoire au système et y découpe les allocations plus petites. Ce mécanisme peut être désactivé en fixant la macro `NGX_DEBUG_PALLOC` à `1` : les allocations sont alors passées directement à l'allocateur système, qui contrôle entièrement les limites des tampons.

La ligne de configuration suivante résume ces informations. Elle est recommandée pour développer des modules tiers et tester nginx sur différentes plates-formes.

```
auto/configure --with-cc-opt='-fsanitize=address -DNGX_DEBUG_PALLOC=1'
               --with-ld-opt=-fsanitize=address
```

## Pièges courants

### Écrire un module C

Le piège le plus courant est de vouloir écrire un module C complet alors qu'on pourrait l'éviter. Dans la plupart des cas, une configuration adaptée suffit. Si écrire un module est inévitable, faites-le aussi petit et simple que possible. Par exemple, un module peut se contenter d'exporter quelques variables.

Avant de commencer un module, posez-vous les questions suivantes :

- La fonction voulue peut-elle être mise en œuvre avec les modules déjà disponibles ?
- Le problème peut-il être résolu avec les langages de script intégrés, comme [[11-modules/02-http/ngx_http_perl_module|Perl]] ou [[10-guides/04-njs/00-index|njs]] ?

### Chaînes C

Le type de chaîne le plus utilisé dans nginx, ngx\_str\_t, n'est pas une chaîne C terminée par un octet nul. On ne peut pas passer ses données aux fonctions de la bibliothèque C standard comme `strlen` ou `strstr`. Il faut utiliser les équivalents nginx, qui acceptent soit un `ngx_str_t`, soit un pointeur vers les données et une longueur. Il existe toutefois un cas où `ngx_str_t` contient un pointeur vers une chaîne terminée par un octet nul : les chaînes issues de l'analyse du fichier de configuration.

### Variables globales

Évitez les variables globales dans vos modules : une variable globale est très probablement une erreur. Toute donnée globale doit être liée à un cycle de configuration et allouée dans le pool mémoire correspondant. Cela permet à nginx de recharger proprement sa configuration. Utiliser des variables globales casserait probablement cette fonction, car il deviendrait impossible d'avoir deux configurations en même temps puis de s'en débarrasser. Des variables globales sont parfois nécessaires ; il faut alors veiller particulièrement à bien gérer la reconfiguration. Vérifiez aussi si les bibliothèques utilisées par votre code ont un état global implicite susceptible d'être cassé au rechargement.

### Gestion manuelle de la mémoire

Au lieu de l'approche malloc/free, source d'erreurs, apprenez à utiliser les pools de nginx. Un pool est créé et lié à un objet : configuration, cycle, connexion ou requête HTTP. Quand l'objet est détruit, le pool associé l'est aussi. On peut donc allouer depuis le pool de l'objet ce dont on a besoin sans se soucier de libérer la mémoire, même en cas d'erreur.

### Threads

Il est recommandé d'éviter les threads dans nginx, car ils casseront forcément quelque chose : la plupart des fonctions de nginx ne sont pas thread-safe. Un thread ne doit exécuter que des appels système et des fonctions de bibliothèque thread-safe. Pour exécuter du code sans lien avec le traitement des requêtes client, la bonne méthode est de programmer un minuteur dans le gestionnaire de module `init_process` et d'effectuer les actions voulues dans le gestionnaire du minuteur. En interne, nginx utilise des threads pour accélérer les opérations d'E/S, mais c'est un cas particulier avec beaucoup de limites.

### Bibliothèques bloquantes

Une erreur courante est d'utiliser des bibliothèques bloquantes en interne. La plupart des bibliothèques sont synchrones et bloquantes par nature : elles effectuent une opération à la fois et perdent du temps à attendre la réponse de l'autre partie. Quand une requête est traitée avec une telle bibliothèque, tout le processus de travail est bloqué, ce qui ruine les performances. N'utilisez que des bibliothèques qui offrent une interface asynchrone et ne bloquent pas tout le processus.

### Requêtes HTTP vers des services externes

Les modules doivent souvent faire un appel HTTP vers un service externe. Une erreur courante est d'utiliser une bibliothèque externe, comme libcurl, pour cela. Il est totalement inutile d'embarquer une énorme quantité de code externe (probablement bloquant !) pour une tâche que nginx sait accomplir lui-même.

Il existe deux scénarios de base nécessitant une requête externe :

- dans le contexte du traitement d'une requête client (par exemple dans un gestionnaire de contenu)
- dans le contexte d'un processus de travail (par exemple un gestionnaire de minuteur)

Dans le premier cas, le mieux est d'utiliser l'API des sous-requêtes. Au lieu d'accéder directement au service externe, déclarez une location dans la configuration de nginx et dirigez-y votre sous-requête. Cette location n'est pas limitée au [[12-directives/proxy-pass-http-proxy|relais]] des requêtes : elle peut contenir d'autres directives nginx. La directive [[12-directives/auth-request|auth_request]], mise en œuvre dans le [module ngx\_http\_auth\_request](https://github.com/nginx/nginx/blob/master/src/http/modules/ngx_http_auth_request_module.c), illustre cette approche.

Dans le second cas, on peut utiliser les fonctions de client HTTP de base disponibles dans nginx. Par exemple, le [module OCSP](https://github.com/nginx/nginx/blob/master/src/event/ngx_event_openssl_stapling.c) met en œuvre un client HTTP simple.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
