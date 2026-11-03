---
title: "disable_symlinks"
description: "Directive nginx disable_symlinks (ngx_http_core_module) — Détermine le traitement des liens symboliques à l'ouverture des fichiers : - off Les liens symboliques du chemin sont autorisés et ne sont pas vérifiés. C'est le comportement par défaut. - on Si…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `disable_symlinks off;` ou `disable_symlinks on \| if_not_owner [from=part];` |
| **Valeur par défaut** | `disable_symlinks off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.15 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Détermine le traitement des liens symboliques à l'ouverture des fichiers :

- **`off`**

  Les liens symboliques du chemin sont autorisés et ne sont pas vérifiés. C'est le comportement par défaut.

- **`on`**

  Si l'une des composantes du chemin est un lien symbolique, l'accès au fichier est refusé.

- **`if_not_owner`**

  L'accès au fichier est refusé si l'une des composantes du chemin est un lien symbolique et que le lien et l'objet visé n'ont pas le même propriétaire.

- **`from`=*part***

  Lors de la vérification des liens symboliques (paramètres `on` et `if_not_owner`), toutes les composantes du chemin sont normalement vérifiées. On peut éviter de vérifier la partie initiale du chemin en ajoutant le paramètre `from`=*part* : les liens symboliques ne sont alors vérifiés qu'à partir de la composante qui suit cette partie initiale. Si la valeur n'est pas une partie initiale du chemin vérifié, tout le chemin est vérifié comme si ce paramètre était absent. Si la valeur correspond au nom de fichier complet, les liens symboliques ne sont pas vérifiés. La valeur du paramètre peut contenir des variables.

Exemple :

```nginx
disable_symlinks on from=$document_root;
```

Cette directive n'est disponible que sur les systèmes qui disposent des interfaces `openat` et `fstatat`, notamment les versions récentes de FreeBSD, Linux et Solaris.

Les paramètres `on` et `if_not_owner` ajoutent un surcoût de traitement.

> [!NOTE]
> Sur les systèmes qui ne permettent pas d'ouvrir des répertoires uniquement pour la recherche, l'utilisation de ces paramètres exige que les processus de travail aient le droit de lecture sur tous les répertoires vérifiés.

> [!NOTE]
> Les modules [[11-modules/02-http/ngx_http_autoindex_module|ngx_http_autoindex_module]], [[11-modules/02-http/ngx_http_random_index_module|ngx_http_random_index_module]] et [[11-modules/02-http/ngx_http_dav_module|ngx_http_dav_module]] ignorent actuellement cette directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
