---
title: "upstream_conf"
description: "Directive nginx upstream_conf (ngx_http_upstream_conf_module) — Active l'interface HTTP de configuration des groupes amont dans le bloc location englobant, dont l'accès doit être limité. Les commandes de configuration permettent de : - consulter la configuration…"
tags: [nginx, directive, ngx_http_upstream_conf_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `upstream_conf;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_conf_module\|ngx_http_upstream_conf_module]] |

## Utilisation

Active l'interface HTTP de configuration des groupes amont dans le bloc location englobant, dont l'accès doit être [[12-directives/satisfy|limité]].

Les commandes de configuration permettent de :

- consulter la configuration du groupe ;
- consulter, modifier ou supprimer un serveur ;
- ajouter un serveur.

> [!NOTE]
> Comme les adresses d'un groupe ne sont pas forcément uniques, les serveurs sont désignés par leur identifiant. Les identifiants sont attribués automatiquement et affichés lors de l'ajout d'un serveur ou de la consultation de la configuration du groupe.

Une commande de configuration se compose de paramètres transmis comme arguments de requête, par exemple :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend
```

Les paramètres suivants sont pris en charge :

- **`stream=`**

  Choisit un groupe de serveurs amont [[11-modules/03-stream/ngx_stream_upstream_module|stream]]. Sans ce paramètre, c'est un groupe [[11-modules/02-http/ngx_http_upstream_module|http]] qui est choisi.

- **`upstream=`*name***

  Choisit le groupe à traiter. Ce paramètre est obligatoire.

- **`id=`*number***

  Choisit un serveur à consulter, modifier ou supprimer.

- **`remove=`**

  Supprime un serveur du groupe.

- **`add=`**

  Ajoute un serveur au groupe.

- **`backup=`**

  Nécessaire pour ajouter un serveur de secours.

  > [!NOTE]
  > Avant la version 1.7.2, `backup=` était aussi nécessaire pour consulter, modifier ou supprimer des serveurs de secours existants.

- **`server=`*address***

  Identique au paramètre « `address` » du serveur amont [[12-directives/server-http-upstream|http]] ou [[12-directives/server-stream-upstream|stream]].

  Lors de l'ajout d'un serveur, on peut l'indiquer par un nom de domaine. Les changements des adresses IP correspondantes sont alors surveillés et appliqués automatiquement à la configuration du groupe amont sans redémarrer nginx (1.7.2). Cela nécessite la directive « `resolver` » dans le bloc [[12-directives/resolver-http-core|http]] ou [[12-directives/resolver-stream-core|stream]]. Voir aussi le paramètre « `resolve` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`service=`*name***

  Identique au paramètre « `service` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]] (1.9.13).

- **`weight=`*number***

  Identique au paramètre « `weight` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`max_conns=`*number***

  Identique au paramètre « `max_conns` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`max_fails=`*number***

  Identique au paramètre « `max_fails` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`fail_timeout=`*time***

  Identique au paramètre « `fail_timeout` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`slow_start=`*time***

  Identique au paramètre « `slow_start` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`down=`**

  Identique au paramètre « `down` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`drain=`**

  Met le serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] en mode « vidage » (*draining*, 1.7.5). Dans ce mode, seules les requêtes [[12-directives/sticky|liées]] au serveur lui sont transmises.

- **`up=`**

  L'inverse du paramètre « `down` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]] ou [[11-modules/03-stream/ngx_stream_upstream_module|stream]].

- **`route=`*string***

  Identique au paramètre « `route` » du serveur amont [[11-modules/02-http/ngx_http_upstream_module|http]].

Les trois premiers paramètres choisissent un objet : soit tout le groupe de serveurs amont http ou stream, soit un serveur précis. Sans autre paramètre, la configuration du groupe ou du serveur choisi est affichée.

Par exemple, pour consulter la configuration de tout le groupe, envoyez :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend
```

Pour consulter la configuration d'un serveur précis, indiquez aussi son identifiant :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend&id=42
```

Pour ajouter un serveur, indiquez son adresse dans le paramètre « `server=` ». Sans autre paramètre, le serveur est ajouté avec les autres paramètres à leur valeur par défaut (voir la directive « `server` » [[12-directives/server-http-upstream|http]] ou [[12-directives/server-stream-upstream|stream]]).

Par exemple, pour ajouter un nouveau serveur principal, envoyez :

```nginx
http://127.0.0.1/upstream_conf?add=&upstream=backend&server=127.0.0.1:8080
```

Pour ajouter un nouveau serveur de secours, envoyez :

```nginx
http://127.0.0.1/upstream_conf?add=&upstream=backend&backup=&server=127.0.0.1:8080
```

Pour ajouter un nouveau serveur principal avec des paramètres différents des valeurs par défaut et le marquer « `down` », envoyez :

```nginx
http://127.0.0.1/upstream_conf?add=&upstream=backend&server=127.0.0.1:8080&weight=2&down=
```

Pour supprimer un serveur, indiquez son identifiant :

```nginx
http://127.0.0.1/upstream_conf?remove=&upstream=backend&id=42
```

Pour marquer un serveur existant « `down` », envoyez :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend&id=42&down=
```

Pour modifier l'adresse d'un serveur existant, envoyez :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend&id=42&server=192.0.2.3:8123
```

Pour modifier les autres paramètres d'un serveur existant, envoyez :

```nginx
http://127.0.0.1/upstream_conf?upstream=backend&id=42&max_fails=3&weight=4
```

Les exemples ci-dessus concernent un groupe de serveurs amont [[11-modules/02-http/ngx_http_upstream_module|http]]. Pour un groupe [[11-modules/03-stream/ngx_stream_upstream_module|stream]], les exemples équivalents nécessitent le paramètre « `stream=` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
