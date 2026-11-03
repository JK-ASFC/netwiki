---
title: "mod_dbd"
description: "Module Apache mod_dbd — Gestion des connexions à une base de données SQL. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dbd]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Gestion des connexions à une base de données SQL |
| **Statut** | Extension |
| **Identificateur** | `dbd_module` |
| **Fichier source** | `mod_dbd.c` |
| **Compatibilité** | Versions 2.1 and supérieures |

## Sommaire

Le module [[12-modules/mod_dbd|mod_dbd]] gère les connexions à une base de données SQL via APR. Il permet aux modules qui requièrent des fonctions liées aux bases de données SQL de se connecter à une base de données à la demande, et s'efforce de conférer aux bases de données une efficacité et une évolutivité optimales pour les MPMs threadés ou non threadés. Pour plus de détails, voir le site web [APR](http://apr.apache.org/).

## Regroupement des connexions

Ce module gère de manière optimisée en fonction de la plate-forme les connexions aux bases de données. Sur les plates-formes non threadées, il maintient une connexion persistente à la manière d'un LAMP classique (Linux, Apache, Mysql, Perl/PHP/Python). Sur les plates-formes threadées, il maintient un *groupe de connexions* à la fois plus évolutif et plus efficace, comme décrit dans [cet article d'ApacheTutor](http://www.apachetutor.org/dev/reslist). Notez que [[12-modules/mod_dbd|mod_dbd]] remplace les modules présentés dans cet article.

## Connexion

Pour vous connecter à votre base de données, vous devez spécifier un pilote et des paramètres de connexion qui diffèrent selon le moteur de base de données. Par exemple, pour vous connecter à mysql, spécifiez ce qui suit :

```apache
DBDriver mysql
DBDParams host=localhost,dbname=pony,user=shetland,pass=appaloosa
```

Vous pourrez alors utiliser cette connexion dans de nombreux autres modules comme [[12-modules/mod_rewrite|mod_rewrite]], [[12-modules/mod_authn_dbd|mod_authn_dbd]] et [[12-modules/mod_lua|mod_lua]]. Vous trouverez des exemples d'utilisation dans la documentation de ces modules.

Voir la syntaxe de la directive `DBDParams` pour les informations à fournir dans la chaîne de connexion en fonction des différents pilotes de base de données supportés.

## API DBD d'Apache

[[12-modules/mod_dbd|mod_dbd]] exporte cinq fonctions que d'autres modules pourront utiliser. L'API se présente comme suit :

```c
typedef struct {
    apr_dbd_t *handle;
    apr_dbd_driver_t *driver;
    apr_hash_t *prepared;
} ap_dbd_t;

/* Fonctions exportées pour accéder à la base de données */

/* ouvre une connexion qui DOIT avoir été explicitement fermée.
 * Renvoie NULL en cas d'erreur
 */
AP_DECLARE(ap_dbd_t*) ap_dbd_open(apr_pool_t*, server_rec*);

/* ferme une connexion ouverte avec ap_dbd_open */
AP_DECLARE(void) ap_dbd_close(server_rec*, ap_dbd_t*);

/* acquiert une connexion qui aura la durée de vie de la requête et qui
 * NE DOIT PAS avoir été explicitement fermée. Renvoie NULL en cas
 * d'erreur. C'est la fonction recommandée pour la plupart des
 * applications.
 */
AP_DECLARE(ap_dbd_t*) ap_dbd_acquire(request_rec*);

/* acquiert une connexion qui aura la durée de vie d'une connexion et
 * qui NE DOIT PAS avoir été explicitement fermée. Renvoie NULL en cas
 * d'erreur.
 */
AP_DECLARE(ap_dbd_t*) ap_dbd_cacquire(conn_rec*);

/* Prépare une requête qu'un module client pourra utiliser */
AP_DECLARE(void) ap_dbd_prepare(server_rec*, const char*, const char*);

/* Exporte aussi ces fonctions à titre optionnel mour les modules qui
 * péfèreraient les utiliser */
APR_DECLARE_OPTIONAL_FN(ap_dbd_t*, ap_dbd_open, (apr_pool_t*, server_rec*));
APR_DECLARE_OPTIONAL_FN(void, ap_dbd_close, (server_rec*, ap_dbd_t*));
APR_DECLARE_OPTIONAL_FN(ap_dbd_t*, ap_dbd_acquire, (request_rec*));
APR_DECLARE_OPTIONAL_FN(ap_dbd_t*, ap_dbd_cacquire, (conn_rec*));
APR_DECLARE_OPTIONAL_FN(void, ap_dbd_prepare, (server_rec*, const char*, const char*));
```

## Requêtes SQL préparées

[[12-modules/mod_dbd|mod_dbd]] supporte les requêtes SQL préparées à destination des modules qui pourraient les utiliser. Chaque requête préparée doit posséder un nom (étiquette), et est stockée dans un condensé (hash) : les condensés sont du type `apr_dbd_prepared_t` et s'utilisent dans toute requête SQL ou commande select préparée par apr\_dbd.

Il est du ressort des modules utilisateurs de dbd d'utiliser les requêtes préparées et de préciser quelles requêtes doivent être spécifiées dans httpd.conf, ou de fournir leurs propres directives et d'utiliser `ap_dbd_prepare`.

> [!WARNING]
> **Avertissement**
>
> Lorsqu'on utilise des requêtes préparées avec des bases de données MySQL, il est préférable de définir `reconnect` à 0 dans la chaîne de connexion, afin d'éviter des erreurs provoquées par un client MySQL qui se reconnecterait sans réinitialiser correctement les requêtes préparées. Si `reconnect` est défini à 1, toute connexion défectueuse sera sensée être réparée, mais comme mod\_dbd n'en est pas informé, les requêtes préparées seront invalidées.

## AVERTISSEMENT DE SECURITE

Toute application web impliquant une base de données doit se protéger elle-même contre les attaques de type injection SQL. Dans la plupart des cas Apache DBD est sûr, car les applications utilisent des requêtes préparées, et les entrées non sures ne seront utilisées qu'à titre de données. Bien entendu, si vous l'utilisez via un module tiers, vous devez être au fait des précautions à prendre.

Cependant, le pilote *FreeTDS* est **non sûr** de par sa nature-même. Comme la bibliothèque sous-jacente ne supporte pas les requêtes préparées, le pilote en effectue une émulation, et les entrées non sûres sont fusionnées avec la requête SQL.

Il peut être sécurisé en *décontaminant* toutes les entrées : un processus inspiré de la recherche de contaminations (**taint mode**) de Perl. Chaque entrée est comparée à une expression rationnelle, et seules les entrées qui correspondent sont utilisées, en accord avec le langage Perl :

```
$untrusted =~ /([a-z]+)/; $trusted = $1;
```

Pour utiliser ceci, les expressions rationnelles de décontamination doivent être incluses dans les requêtes préparées. L'expression rationnelle doit se situer immédiatement après le caractère % dans la requête préparée, et doit être entourée d'accolades {}. Par exemple, si votre application attend une entrée alphanumérique, vous pouvez utiliser :

```
"SELECT foo FROM bar WHERE input = %s"
```

avec d'autres pilotes, et ne risquer au pire qu'une requête échouée. Mais avec FreeTDS, vous devez utiliser :

```
"SELECT foo FROM bar WHERE input = %{([A-Za-z0-9]+)}s"
```

tout ce qui ne correspond pas à l'expression rationnelle est alors rejeté, et la requête est maintenant sûre.

Alternativement, vous pouvez utiliser le pilote ODBC tiers, qui offre la sécurité des requêtes préparées authentiques.

## Directives

- [[13-directives/dbdriver|DBDriver]]
- [[13-directives/dbdparams|DBDParams]]
- [[13-directives/dbdpersist|DBDPersist]]
- [[13-directives/dbdpreparesql|DBDPrepareSQL]]
- [[13-directives/dbdmin|DBDMin]]
- [[13-directives/dbdkeep|DBDKeep]]
- [[13-directives/dbdmax|DBDMax]]
- [[13-directives/dbdexptime|DBDExptime]]
- [[13-directives/dbdinitsql|DBDInitSQL]]

## Voir aussi

- [[11-guides/06-divers/formats-de-mots-de-passe|Formats des mots de passe]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
